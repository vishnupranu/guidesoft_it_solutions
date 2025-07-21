import React, { useState } from 'react'
import { useEffect } from 'react'
import { getCourses, getCategories, enrollInCourse } from '../lib/database'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(null)

  const defaultCategories = [
    { id: 'all', name: 'All Categories' },
  ]

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ]

  useEffect(() => {
    loadData()
  }, [searchTerm, selectedCategory, selectedLevel])

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await getCategories()
      if (!error) {
        setCategories([...defaultCategories, ...data.map(cat => ({ id: cat.id, name: cat.name }))])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchTerm,
        category: selectedCategory !== 'all' ? selectedCategory : null,
        level: selectedLevel !== 'all' ? selectedLevel : null
      }
      
      const { data, error } = await getCourses(filters)
      if (!error) {
        setCourses(data || [])
      }
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId)
      const { error } = await enrollInCourse(courseId)
      
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Successfully enrolled in course!')
        loadData() // Refresh the data
      }
    } catch (error) {
      toast.error('Failed to enroll in course')
    } finally {
      setEnrolling(null)
    }
  }

  const filteredCourses = courses.filter(course => {
    return true // Filtering is now done in the database query
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover and enroll in courses to advance your skills
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Create Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail_url || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <PlayIcon className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">by {course.instructor?.full_name || 'Unknown'}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{course.course_reviews?.[0]?.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    <span>{course.enrollments?.[0]?.count || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{course.duration_hours}h</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${course.price || 0}</span>
                <button 
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolling === course.id}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BookOpenIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default Courses
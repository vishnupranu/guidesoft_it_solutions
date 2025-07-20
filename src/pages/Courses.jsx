import React, { useState } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'mobile-development', name: 'Mobile Development' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
  ]

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ]

  const courses = [
    {
      id: 1,
      title: 'Complete React Development Course',
      instructor: 'John Smith',
      category: 'web-development',
      level: 'intermediate',
      rating: 4.8,
      students: 1234,
      duration: '40 hours',
      price: '$99',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Master React from basics to advanced concepts with hands-on projects.',
      enrolled: false
    },
    {
      id: 2,
      title: 'Python for Data Science',
      instructor: 'Sarah Johnson',
      category: 'data-science',
      level: 'beginner',
      rating: 4.9,
      students: 2156,
      duration: '35 hours',
      price: '$89',
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn Python programming and data analysis from scratch.',
      enrolled: true
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Chen',
      category: 'design',
      level: 'beginner',
      rating: 4.7,
      students: 987,
      duration: '25 hours',
      price: '$79',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Create beautiful and user-friendly interfaces.',
      enrolled: false
    },
    {
      id: 4,
      title: 'Advanced JavaScript Concepts',
      instructor: 'Emily Davis',
      category: 'web-development',
      level: 'advanced',
      rating: 4.6,
      students: 756,
      duration: '30 hours',
      price: '$109',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Deep dive into advanced JavaScript patterns and concepts.',
      enrolled: true
    },
    {
      id: 5,
      title: 'Mobile App Development with React Native',
      instructor: 'David Wilson',
      category: 'mobile-development',
      level: 'intermediate',
      rating: 4.5,
      students: 543,
      duration: '45 hours',
      price: '$119',
      image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Build cross-platform mobile apps with React Native.',
      enrolled: false
    },
    {
      id: 6,
      title: 'Digital Marketing Strategy',
      instructor: 'Lisa Brown',
      category: 'business',
      level: 'beginner',
      rating: 4.4,
      students: 432,
      duration: '20 hours',
      price: '$69',
      image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Learn effective digital marketing strategies and tactics.',
      enrolled: false
    }
  ]

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={course.image}
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
              {course.enrolled && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full">
                    Enrolled
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <PlayIcon className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  course.enrolled
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {course.enrolled ? 'Continue' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
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
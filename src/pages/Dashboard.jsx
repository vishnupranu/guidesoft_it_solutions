import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getDashboardStats } from '../lib/database'
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const userRole = user?.user_metadata?.role || 'student'
  const userName = user?.user_metadata?.full_name || user?.email

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data, error } = await getDashboardStats()
        if (!error) {
          setStats(data)
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const getStatsForRole = () => {
    switch (userRole) {
      case 'admin':
        return [
          { name: 'Total Users', value: stats.totalUsers || '0', icon: UserGroupIcon, color: 'bg-blue-500' },
          { name: 'Active Courses', value: stats.activeCourses || '0', icon: BookOpenIcon, color: 'bg-green-500' },
          { name: 'Revenue', value: stats.revenue || '$0', icon: ChartBarIcon, color: 'bg-purple-500' },
          { name: 'Completion Rate', value: stats.completionRate || '0%', icon: TrophyIcon, color: 'bg-yellow-500' },
        ]
      case 'instructor':
        return [
          { name: 'My Courses', value: stats.myCourses || '0', icon: BookOpenIcon, color: 'bg-blue-500' },
          { name: 'Students', value: stats.students || '0', icon: UserGroupIcon, color: 'bg-green-500' },
          { name: 'Assignments', value: stats.assignments || '0', icon: ClockIcon, color: 'bg-purple-500' },
          { name: 'Avg Rating', value: stats.avgRating || '0', icon: TrophyIcon, color: 'bg-yellow-500' },
        ]
      default: // student
        return [
          { name: 'Enrolled Courses', value: stats.enrolledCourses || '0', icon: BookOpenIcon, color: 'bg-blue-500' },
          { name: 'Completed', value: stats.completedCourses || '0', icon: AcademicCapIcon, color: 'bg-green-500' },
          { name: 'In Progress', value: stats.inProgress || '0', icon: ClockIcon, color: 'bg-purple-500' },
          { name: 'Certificates', value: stats.certificates || '0', icon: TrophyIcon, color: 'bg-yellow-500' },
        ]
    }
  }

  const statsData = getStatsForRole()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  const recentActivities = [
    { id: 1, action: 'Completed', item: 'React Fundamentals - Chapter 5', time: '2 hours ago' },
    { id: 2, action: 'Started', item: 'Advanced JavaScript Course', time: '1 day ago' },
    { id: 3, action: 'Submitted', item: 'Final Project Assignment', time: '2 days ago' },
    { id: 4, action: 'Joined', item: 'Web Development Bootcamp', time: '1 week ago' },
  ]

  const upcomingDeadlines = [
    { id: 1, title: 'React Project Submission', course: 'React Fundamentals', due: '2024-01-15', priority: 'high' },
    { id: 2, title: 'JavaScript Quiz', course: 'Advanced JavaScript', due: '2024-01-18', priority: 'medium' },
    { id: 3, title: 'CSS Assignment', course: 'Web Design', due: '2024-01-22', priority: 'low' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-blue-100 capitalize">
          {userRole} Dashboard - Continue your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                    <p className="text-xs text-gray-500">{deadline.course}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                      deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {deadline.priority}
                    </span>
                    <span className="text-xs text-gray-500">{deadline.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BookOpenIcon className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Browse Courses</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ClockIcon className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">View Schedule</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ChartBarIcon className="h-8 w-8 text-purple-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Progress Report</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <UserGroupIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Study Groups</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
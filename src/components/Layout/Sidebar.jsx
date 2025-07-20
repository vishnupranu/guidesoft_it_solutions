import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth()
  const userRole = user?.user_metadata?.role || 'student'

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Courses', href: '/courses', icon: BookOpenIcon },
      { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
      { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    ]

    const roleSpecificItems = {
      admin: [
        { name: 'Users', href: '/users', icon: UserGroupIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Settings', href: '/settings', icon: CogIcon },
      ],
      instructor: [
        { name: 'My Courses', href: '/my-courses', icon: AcademicCapIcon },
        { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentListIcon },
        { name: 'Students', href: '/students', icon: UserGroupIcon },
      ],
      student: [
        { name: 'My Learning', href: '/my-learning', icon: AcademicCapIcon },
        { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentListIcon },
        { name: 'Grades', href: '/grades', icon: ChartBarIcon },
      ]
    }

    return [...baseItems, ...(roleSpecificItems[userRole] || [])]
  }

  const navigation = getNavigationItems()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">LMS Platform</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
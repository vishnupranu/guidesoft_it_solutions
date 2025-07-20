import React from 'react';
import { useRoutes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import HomePage from './pages/HomePage';

const ProjectRoutes = () => {
  const { user } = useAuth();

  let element = useRoutes([
    { 
      path: "/", 
      element: user ? <ProtectedRoute><DashboardLayout /></ProtectedRoute> : <HomePage /> 
    },
    { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    {
      path: "/",
      element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "courses", element: <Courses /> },
        { path: "my-learning", element: <Courses /> },
        { path: "my-courses", element: <Courses /> },
        { path: "assignments", element: <div className="p-6"><h1 className="text-2xl font-bold">Assignments</h1><p>Coming soon...</p></div> },
        { path: "students", element: <div className="p-6"><h1 className="text-2xl font-bold">Students</h1><p>Coming soon...</p></div> },
        { path: "users", element: <div className="p-6"><h1 className="text-2xl font-bold">Users</h1><p>Coming soon...</p></div> },
        { path: "analytics", element: <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon...</p></div> },
        { path: "calendar", element: <div className="p-6"><h1 className="text-2xl font-bold">Calendar</h1><p>Coming soon...</p></div> },
        { path: "messages", element: <div className="p-6"><h1 className="text-2xl font-bold">Messages</h1><p>Coming soon...</p></div> },
        { path: "grades", element: <div className="p-6"><h1 className="text-2xl font-bold">Grades</h1><p>Coming soon...</p></div> },
        { path: "settings", element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div> },
      ]
    },
    { path: "*", element: user ? <ProtectedRoute><DashboardLayout /></ProtectedRoute> : <HomePage /> },
  ]);

  return element;
};

export default ProjectRoutes;
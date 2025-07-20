import React from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from './pages/HomePage';

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "*", element: <HomePage /> }, // Fallback route
  ]);

  return element;
};

export default ProjectRoutes;
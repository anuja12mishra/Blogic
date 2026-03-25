import React from 'react';
import { Link } from 'react-router-dom';
import { RouteIndex } from '@/helpers/RouteName';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link to={RouteIndex} className="text-blue-600 underline text-lg">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;

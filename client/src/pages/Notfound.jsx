import React from 'react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <a href="/" className="text-blue-600 underline">Go to Home</a>
    </div>
  );
}

export default NotFound;

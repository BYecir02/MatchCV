import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">MatchCV</h1>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-white mt-2">{subtitle}</p>
        </div>
        
        <div className="bg-white/30 backdrop-blur-md rounded-lg shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
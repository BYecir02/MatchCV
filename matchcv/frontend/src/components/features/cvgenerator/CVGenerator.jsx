import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const CVGenerator = ({ user, initialData, onNavigateBack }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentification requise</h3>
          <p className="text-gray-600">Vous devez être connecté pour utiliser le générateur de CV</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Générateur de CV</h1>
          <p className="text-gray-600">Page en cours de développement...</p>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator; 
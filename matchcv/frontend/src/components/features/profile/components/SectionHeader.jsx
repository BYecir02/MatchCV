import React from 'react';
import { Plus } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title, onAdd, addButtonText = "Ajouter" }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
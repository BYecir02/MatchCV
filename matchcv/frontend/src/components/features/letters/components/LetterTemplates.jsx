import React from 'react';
import { Sparkles } from 'lucide-react'; // Remplacer Magic par Sparkles

const LetterTemplates = ({ templates, onApplyTemplate, className = '' }) => {
  if (!templates || templates.length === 0) {
    return null;
  }

  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Sparkles className="h-4 w-4 mr-1 text-purple-600" />
        Templates rapides
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onApplyTemplate(template)}
            className="text-left p-3 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="button"
          >
            <div className="font-medium text-purple-800">{template.name}</div>
            <div className="text-purple-600 text-xs mt-1">
              {template.content.substring(0, 50)}...
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LetterTemplates;
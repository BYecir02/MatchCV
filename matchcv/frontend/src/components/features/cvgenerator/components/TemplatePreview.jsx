import React from 'react';
import { Check, Star } from 'lucide-react';

const ModernTemplatePreview = () => (
  <div className="w-full h-48 bg-white border rounded-lg overflow-hidden relative">
    {/* Header moderne avec couleur */}
    <div className="bg-blue-600 h-12 flex items-center px-3">
      <div className="w-8 h-8 bg-white rounded-full mr-2"></div>
      <div className="space-y-1">
        <div className="w-16 h-2 bg-white rounded"></div>
        <div className="w-12 h-1 bg-blue-200 rounded"></div>
      </div>
    </div>
    
    {/* Contenu */}
    <div className="p-3 space-y-2">
      <div className="w-20 h-2 bg-gray-300 rounded"></div>
      <div className="w-full h-1 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
      
      <div className="space-y-1 mt-3">
        <div className="w-16 h-1.5 bg-blue-300 rounded"></div>
        <div className="w-full h-1 bg-gray-200 rounded"></div>
        <div className="w-5/6 h-1 bg-gray-200 rounded"></div>
      </div>
      
      <div className="flex gap-1 mt-2">
        <div className="w-8 h-3 bg-blue-100 rounded-full"></div>
        <div className="w-10 h-3 bg-blue-100 rounded-full"></div>
        <div className="w-6 h-3 bg-blue-100 rounded-full"></div>
      </div>
    </div>
  </div>
);

const ClassicTemplatePreview = () => (
  <div className="w-full h-48 bg-white border rounded-lg overflow-hidden relative">
    {/* Header classique centré */}
    <div className="p-3 text-center border-b">
      <div className="w-6 h-6 bg-gray-300 rounded-full mx-auto mb-1"></div>
      <div className="w-20 h-2 bg-gray-400 rounded mx-auto mb-1"></div>
      <div className="w-16 h-1 bg-gray-300 rounded mx-auto"></div>
    </div>
    
    {/* Contenu en colonnes */}
    <div className="p-3 space-y-2">
      <div className="w-18 h-1.5 bg-gray-400 rounded"></div>
      <div className="w-full h-1 bg-gray-200 rounded"></div>
      <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="space-y-1">
          <div className="w-12 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-full h-1 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-1">
          <div className="w-10 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-8 h-2 bg-gray-200 rounded"></div>
          <div className="w-6 h-2 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const CreativeTemplatePreview = () => (
  <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-pink-50 border rounded-lg overflow-hidden relative">
    {/* Sidebar colorée */}
    <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
    
    {/* Contenu principal */}
    <div className="pl-14 p-3 space-y-2">
      <div className="w-20 h-2.5 bg-purple-600 rounded"></div>
      <div className="w-16 h-1 bg-purple-400 rounded"></div>
      
      <div className="space-y-1 mt-3">
        <div className="w-18 h-1.5 bg-gray-400 rounded"></div>
        <div className="w-full h-1 bg-gray-300 rounded"></div>
        <div className="w-4/5 h-1 bg-gray-300 rounded"></div>
      </div>
      
      <div className="space-y-1">
        <div className="w-16 h-1.5 bg-gray-400 rounded"></div>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
          <div className="w-3 h-3 bg-purple-300 rounded-full"></div>
        </div>
      </div>
    </div>
    
    {/* Éléments décoratifs */}
    <div className="absolute top-2 right-2 w-4 h-4 bg-pink-300 rounded-full opacity-60"></div>
    <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-300 rounded-full opacity-40"></div>
  </div>
);

const TechTemplatePreview = () => (
  <div className="w-full h-48 bg-gray-900 border rounded-lg overflow-hidden relative">
    {/* Header tech avec accent vert */}
    <div className="bg-gray-800 h-10 flex items-center px-3 border-b border-green-500">
      <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
      <div className="space-y-1">
        <div className="w-16 h-1.5 bg-white rounded"></div>
        <div className="w-12 h-1 bg-green-400 rounded"></div>
      </div>
    </div>
    
    {/* Code-like content */}
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="w-20 h-1.5 bg-gray-300 rounded"></div>
      </div>
      
      <div className="space-y-1 ml-4">
        <div className="w-full h-1 bg-gray-400 rounded"></div>
        <div className="w-3/4 h-1 bg-gray-400 rounded"></div>
        <div className="w-5/6 h-1 bg-gray-400 rounded"></div>
      </div>
      
      <div className="flex gap-1 mt-2">
        <div className="w-8 h-2 bg-green-800 rounded text-xs"></div>
        <div className="w-10 h-2 bg-blue-800 rounded text-xs"></div>
        <div className="w-6 h-2 bg-yellow-800 rounded text-xs"></div>
      </div>
    </div>
    
    {/* Terminal-like bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-6 bg-black flex items-center px-2">
      <div className="w-1 h-3 bg-green-500 animate-pulse"></div>
    </div>
  </div>
);

const MinimalTemplatePreview = () => (
  <div className="w-full h-48 bg-white border rounded-lg overflow-hidden relative">
    {/* Header minimaliste */}
    <div className="p-4 border-b border-gray-100">
      <div className="w-24 h-3 bg-gray-800 rounded mb-1"></div>
      <div className="w-20 h-1.5 bg-gray-400 rounded"></div>
    </div>
    
    {/* Contenu épuré */}
    <div className="p-4 space-y-3">
      <div className="space-y-1">
        <div className="w-16 h-1.5 bg-gray-600 rounded"></div>
        <div className="w-full h-0.5 bg-gray-200 rounded"></div>
        <div className="w-4/5 h-0.5 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-1">
        <div className="w-20 h-1.5 bg-gray-600 rounded"></div>
        <div className="w-full h-0.5 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-0.5 bg-gray-200 rounded"></div>
      </div>
      
      <div className="flex gap-2 mt-3">
        <div className="w-12 h-4 border border-gray-300 rounded flex items-center justify-center">
          <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
        </div>
        <div className="w-12 h-4 border border-gray-300 rounded flex items-center justify-center">
          <div className="w-8 h-0.5 bg-gray-400 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const TemplatePreview = ({ templateId, isSelected, onClick, template }) => {
  const renderPreview = () => {
    switch (templateId) {
      case 'modern': return <ModernTemplatePreview />;
      case 'classic': return <ClassicTemplatePreview />;
      case 'creative': return <CreativeTemplatePreview />;
      case 'tech': return <TechTemplatePreview />;
      case 'minimal': return <MinimalTemplatePreview />;
      default: return <ModernTemplatePreview />;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer group transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2 transform scale-105' 
          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 hover:scale-102'
      }`}
    >
      {/* Preview */}
      <div className="relative">
        {renderPreview()}
        
        {/* Overlay pour la sélection */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
        
        {/* Badge ATS Score */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            template.atsScore >= 95 ? 'bg-green-100 text-green-800' :
            template.atsScore >= 90 ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <Star className="h-3 w-3 inline mr-1" />
            ATS {template.atsScore}%
          </span>
        </div>
      </div>
      
      {/* Informations du template */}
      <div className="mt-3 text-center">
        <h3 className={`font-semibold text-sm transition-colors ${
          isSelected ? 'text-blue-600' : 'text-gray-800 group-hover:text-blue-600'
        }`}>
          {template.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{template.description}</p>
        
        {/* Tags */}
        {template.tags && (
          <div className="flex justify-center gap-1 mt-2">
            {template.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
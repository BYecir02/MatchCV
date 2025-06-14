import React from 'react';
import { Layout, Filter, Search } from 'lucide-react';
import TemplatePreview from './TemplatePreview';

const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');

  // Filtrer les templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Catégories disponibles
  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'professional', label: 'Professionnel' },
    { id: 'creative', label: 'Créatif' },
    { id: 'tech', label: 'Tech' },
    { id: 'minimal', label: 'Minimaliste' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Layout className="h-5 w-5 mr-2 text-blue-600" />
          Choisir un template
        </h2>
        <span className="text-sm text-gray-500">
          {filteredTemplates.length} template{filteredTemplates.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="mb-6 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtres par catégorie */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille des templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <TemplatePreview
            key={template.id}
            templateId={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onClick={() => onTemplateSelect(template.id)}
          />
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun template trouvé</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm mt-2"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
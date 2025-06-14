import React from 'react';
import { Languages, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const LanguagesTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddLanguage = () => {
    const newLang = {
      languageName: '',
      proficiencyLevel: 'basic',
      certification: '',
      displayOrder: profileData.languages.length + 1
    };
    addItem('languages', newLang);
  };

  const handleUpdateLanguage = (id, field, value) => {
    updateItem('languages', id, field, value);
  };

  const handleRemoveLanguage = (id) => {
    removeItem('languages', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Languages} 
        title="Langues" 
        onAdd={handleAddLanguage}
        addButtonText="Ajouter une langue"
      />

      <div className="space-y-4">
        {profileData.languages.map((lang) => (
          <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Langue #{lang.id}</h3>
              <button
                onClick={() => handleRemoveLanguage(lang.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Langue"
                value={lang.languageName}
                onChange={(e) => handleUpdateLanguage(lang.id, 'languageName', e.target.value)}
                placeholder="Ex: Anglais, Espagnol..."
              />
              <FormField
                label="Niveau"
                type="select"
                value={lang.proficiencyLevel}
                onChange={(e) => handleUpdateLanguage(lang.id, 'proficiencyLevel', e.target.value)}
                options={[
                  { value: 'basic', label: 'Débutant' },
                  { value: 'conversational', label: 'Conversationnel' },
                  { value: 'fluent', label: 'Courant' },
                  { value: 'native', label: 'Langue maternelle' }
                ]}
              />
              <FormField
                label="Certification"
                value={lang.certification}
                onChange={(e) => handleUpdateLanguage(lang.id, 'certification', e.target.value)}
                placeholder="Ex: TOEIC 850, DELE B2..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguagesTab;
import React, { useState } from 'react';
import { Languages, Trash2, Plus, Globe, Award } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const LanguagesTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingLanguage, setAddingLanguage] = useState(false);

  const handleAddLanguage = async () => {
    setAddingLanguage(true);
    
    const newLanguage = {
      languageName: '',
      proficiencyLevel: 'basic',
      certification: '',
      description: '',
      displayOrder: profileData.languages.length + 1
    };
    
    console.log('🌍 Ajout nouvelle langue:', newLanguage);
    const result = await addItem('languages', newLanguage);
    console.log('✅ Résultat ajout langue:', result);
    
    setAddingLanguage(false);
  };

  const handleUpdateLanguage = (id, field, value) => {
    console.log(`🔄 Mise à jour langue ${id}:`, { [field]: value });
    updateItem('languages', id, field, value);
  };

  const handleRemoveLanguage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette langue ?')) {
      console.log('🗑️ Suppression langue:', id);
      const result = await removeItem('languages', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // Langues populaires avec autocomplétion
  const popularLanguages = [
    'Français',
    'Anglais',
    'Espagnol',
    'Allemand',
    'Italien',
    'Portugais',
    'Arabe',
    'Chinois (Mandarin)',
    'Japonais',
    'Russe',
    'Néerlandais',
    'Suédois',
    'Norvégien',
    'Danois',
    'Coréen',
    'Hindi',
    'Turc',
    'Polonais',
    'Grec',
    'Hébreu'
  ];

  // Niveaux de maîtrise avec descriptions détaillées
  const proficiencyLevels = [
    { 
      value: 'basic', 
      label: 'Débutant (A1-A2)', 
      description: 'Connaissances de base, peut comprendre et utiliser des expressions familières',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      value: 'conversational', 
      label: 'Conversationnel (B1)', 
      description: 'Peut tenir une conversation simple sur des sujets familiers',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      value: 'professional', 
      label: 'Professionnel (B2)', 
      description: 'Peut utiliser la langue dans un contexte professionnel',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      value: 'fluent', 
      label: 'Courant (C1-C2)', 
      description: 'Maîtrise avancée, peut s\'exprimer spontanément et couramment',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      value: 'native', 
      label: 'Langue maternelle', 
      description: 'Langue natale ou niveau équivalent',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  // Certifications populaires
  const popularCertifications = [
    // Anglais
    'TOEIC', 'TOEFL', 'IELTS', 'Cambridge (FCE, CAE, CPE)', 'TOEFL iBT',
    // Français
    'DELF', 'DALF', 'TCF', 'TEF',
    // Espagnol
    'DELE', 'SIELE',
    // Allemand
    'Goethe-Zertifikat', 'TestDaF', 'DSH',
    // Italien
    'CILS', 'CELI',
    // Autres
    'HSK (Chinois)', 'JLPT (Japonais)', 'TORFL (Russe)'
  ];

  // Fonction pour obtenir les informations du niveau
  const getLevelInfo = (level) => {
    return proficiencyLevels.find(l => l.value === level) || proficiencyLevels[0];
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Languages} 
        title="Langues et communication" 
        onAdd={handleAddLanguage}
        addButtonText={addingLanguage ? "Ajout..." : "Ajouter une langue"}
      />

      <div className="space-y-4">
        {profileData.languages.map((lang) => {
          // Vérifier si c'est une langue vide (nouvelle)
          const isEmpty = !lang.languageName;
          const levelInfo = getLevelInfo(lang.proficiencyLevel);
          
          return (
            <div 
              key={lang.id} 
              className={`border rounded-lg p-4 ${
                isEmpty ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">
                    {lang.languageName || '🌍 Nouvelle langue'}
                    {lang.languageName && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${levelInfo.bgColor} ${levelInfo.color} ${levelInfo.borderColor} border`}>
                        {levelInfo.label}
                      </span>
                    )}
                  </h3>
                  
                  {/* Badge certification */}
                  {lang.certification && (
                    <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      <Award className="h-3 w-3 mr-1" />
                      {lang.certification}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleRemoveLanguage(lang.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Supprimer cette langue"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {isEmpty && (
                <div className="mb-4 p-3 bg-indigo-100 border border-indigo-200 rounded text-sm text-indigo-800">
                  🗣️ <strong>Nouvelle langue ajoutée !</strong> Complétez les champs ci-dessous. 
                  La sauvegarde se fait automatiquement.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ligne 1 : Nom de la langue */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Langue
                  </label>
                  <div className="relative">
                    <input
                      list={`languages-${lang.id}`}
                      value={lang.languageName || ''}
                      onChange={(e) => handleUpdateLanguage(lang.id, 'languageName', e.target.value)}
                      placeholder="Sélectionnez ou tapez..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !lang.languageName ? 'border-indigo-300' : 'border-gray-300'
                      }`}
                    />
                    <datalist id={`languages-${lang.id}`}>
                      {popularLanguages.map(language => (
                        <option key={language} value={language} />
                      ))}
                    </datalist>
                    <Globe className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Ligne 1 : Niveau de maîtrise */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Niveau de maîtrise
                  </label>
                  <select
                    value={lang.proficiencyLevel || 'basic'}
                    onChange={(e) => handleUpdateLanguage(lang.id, 'proficiencyLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ligne 2 : Certification */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Certification (optionnel)
                  </label>
                  <div className="relative">
                    <input
                      list={`certifications-${lang.id}`}
                      value={lang.certification || ''}
                      onChange={(e) => handleUpdateLanguage(lang.id, 'certification', e.target.value)}
                      placeholder="ex: TOEIC 850, DELF B2..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <datalist id={`certifications-${lang.id}`}>
                      {popularCertifications.map(cert => (
                        <option key={cert} value={cert} />
                      ))}
                    </datalist>
                    <Award className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Description du niveau */}
              <div className="mt-4">
                <div className={`p-3 rounded-lg ${levelInfo.bgColor} ${levelInfo.borderColor} border`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${levelInfo.color.replace('text-', 'bg-')} mr-2`}></div>
                    <span className={`text-sm font-medium ${levelInfo.color}`}>
                      {levelInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {levelInfo.description}
                  </p>
                </div>
              </div>

              {/* Description personnalisée */}
              <div className="mt-4">
                <FormField
                  label="Description (optionnel)"
                  type="textarea"
                  value={lang.description || ''}
                  onChange={(e) => handleUpdateLanguage(lang.id, 'description', e.target.value)}
                  rows={2}
                  placeholder="Précisez votre expérience avec cette langue, contexte d'utilisation..."
                />
              </div>

              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-400">
                ID: {lang.id} | Ordre: {lang.displayOrder || 0} 
                {isEmpty && ' | 🆕 Nouvelle'}
              </div>
            </div>
          );
        })}
        
        {profileData.languages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Languages className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune langue ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une langue" pour commencer</p>
          </div>
        )}
      </div>

      {/* Résumé des langues */}
      {profileData.languages.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Résumé linguistique</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileData.languages.length}</div>
              <div className="text-blue-700">Langues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profileData.languages.filter(l => ['fluent', 'native', 'professional'].includes(l.proficiencyLevel)).length}
              </div>
              <div className="text-green-700">Niveau avancé</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {profileData.languages.filter(l => l.certification).length}
              </div>
              <div className="text-yellow-700">Avec certification</div>
            </div>
          </div>
          
          {/* Répartition par niveau */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Répartition par niveau :</h4>
            <div className="flex flex-wrap gap-2">
              {proficiencyLevels.map(level => {
                const count = profileData.languages.filter(l => l.proficiencyLevel === level.value).length;
                if (count === 0) return null;
                
                return (
                  <div 
                    key={level.value}
                    className={`px-3 py-1 rounded-full text-xs ${level.bgColor} ${level.color} ${level.borderColor} border`}
                  >
                    {level.label}: {count}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des langues
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.languages, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default LanguagesTab;
import React, { useState } from 'react';
import { Code, Trash2, Plus, Star } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const SkillsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingSkill, setAddingSkill] = useState(false);

  const handleAddSkill = async () => {
    setAddingSkill(true);
    
    const newSkill = {
      skillName: '',
      category: 'Technique',
      proficiencyLevel: 'intermediate',
      yearsExperience: 1,
      isPrimary: false,
      displayOrder: profileData.skills.length + 1
    };
    
    console.log('💻 Ajout nouvelle compétence:', newSkill);
    const result = await addItem('skills', newSkill);
    console.log('✅ Résultat ajout compétence:', result);
    
    setAddingSkill(false);
  };

  const handleUpdateSkill = (id, field, value) => {
    console.log(`🔄 Mise à jour compétence ${id}:`, { [field]: value });
    updateItem('skills', id, field, value);
  };

  const handleRemoveSkill = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      console.log('🗑️ Suppression compétence:', id);
      const result = await removeItem('skills', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // Options prédéfinies
  const skillCategories = [
    'Technique',
    'Programmation',
    'Framework/Librairie',
    'Base de données',
    'DevOps/Cloud',
    'Design/UX',
    'Gestion de projet',
    'Marketing',
    'Communication',
    'Langues',
    'Soft Skills',
    'Autre'
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Débutant', stars: 1, color: 'text-red-500' },
    { value: 'intermediate', label: 'Intermédiaire', stars: 2, color: 'text-yellow-500' },
    { value: 'advanced', label: 'Avancé', stars: 3, color: 'text-blue-500' },
    { value: 'expert', label: 'Expert', stars: 4, color: 'text-green-500' },
    { value: 'master', label: 'Maître', stars: 5, color: 'text-purple-500' }
  ];

  // Regrouper les compétences par catégorie
  const groupedSkills = profileData.skills.reduce((acc, skill) => {
    const category = skill.category || 'Autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  // Composant pour afficher le niveau avec des étoiles
  const ProficiencyDisplay = ({ level }) => {
    const levelInfo = proficiencyLevels.find(l => l.value === level) || proficiencyLevels[1];
    return (
      <div className={`flex items-center space-x-1 ${levelInfo.color}`}>
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < levelInfo.stars ? 'fill-current' : ''}`} 
          />
        ))}
        <span className="text-xs font-medium ml-1">{levelInfo.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Code} 
        title="Compétences et savoir-faire" 
        onAdd={handleAddSkill}
        addButtonText={addingSkill ? "Ajout..." : "Ajouter une compétence"}
      />

      {/* Vue par catégories */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Code className="h-5 w-5 mr-2 text-blue-600" />
              {category} 
              <span className="ml-2 text-sm text-gray-500">({skills.length})</span>
            </h3>
            
            <div className="space-y-3">
              {skills.map((skill) => {
                const isEmpty = !skill.skillName;
                
                return (
                  <div 
                    key={skill.id} 
                    className={`border rounded-lg p-4 bg-white ${
                      isEmpty ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                          {skill.skillName || '💻 Nouvelle compétence'}
                        </h4>
                        {skill.isPrimary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Compétence clé
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                        title="Supprimer cette compétence"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {isEmpty && (
                      <div className="mb-4 p-3 bg-purple-100 border border-purple-200 rounded text-sm text-purple-800">
                        💡 <strong>Nouvelle compétence ajoutée !</strong> Complétez les champs ci-dessous. 
                        La sauvegarde se fait automatiquement.
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Nom de la compétence */}
                      <FormField
                        label="Nom de la compétence"
                        value={skill.skillName || ''}
                        onChange={(e) => handleUpdateSkill(skill.id, 'skillName', e.target.value)}
                        placeholder="ex: JavaScript, React, Management..."
                        className={!skill.skillName ? 'border-purple-300' : ''}
                      />
                      
                      {/* Catégorie */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Catégorie
                        </label>
                        <select
                          value={skill.category || 'Technique'}
                          onChange={(e) => handleUpdateSkill(skill.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {skillCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Niveau de maîtrise */}
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Niveau de maîtrise
                        </label>
                        <select
                          value={skill.proficiencyLevel || 'intermediate'}
                          onChange={(e) => handleUpdateSkill(skill.id, 'proficiencyLevel', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {proficiencyLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label} ({level.stars}★)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Années d'expérience */}
                      <FormField
                        label="Années d'expérience"
                        type="number"
                        min="0"
                        max="50"
                        value={skill.yearsExperience || 0}
                        onChange={(e) => handleUpdateSkill(skill.id, 'yearsExperience', parseInt(e.target.value) || 0)}
                      />

                      {/* Compétence principale */}
                      <div className="flex items-center pt-6">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={skill.isPrimary || false}
                            onChange={(e) => handleUpdateSkill(skill.id, 'isPrimary', e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700">Compétence clé</span>
                        </label>
                      </div>

                      {/* Affichage du niveau */}
                      <div className="pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Niveau
                        </label>
                        <ProficiencyDisplay level={skill.proficiencyLevel} />
                      </div>
                    </div>

                    {/* Debug info */}
                    <div className="mt-2 text-xs text-gray-400">
                      ID: {skill.id} | Ordre: {skill.displayOrder || 0} 
                      {isEmpty && ' | 🆕 Nouvelle'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {profileData.skills.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune compétence ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une compétence" pour commencer</p>
          </div>
        )}
      </div>

      {/* Statistiques des compétences */}
      {profileData.skills.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Résumé de vos compétences</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileData.skills.length}</div>
              <div className="text-blue-700">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profileData.skills.filter(s => s.isPrimary).length}
              </div>
              <div className="text-green-700">Compétences clés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(groupedSkills).length}
              </div>
              <div className="text-purple-700">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(profileData.skills.reduce((acc, s) => acc + (s.yearsExperience || 0), 0) / profileData.skills.length) || 0}
              </div>
              <div className="text-orange-700">Années moy.</div>
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des compétences
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.skills, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default SkillsTab;
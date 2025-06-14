import React from 'react';
import { Award, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const SkillsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddSkill = () => {
    const newSkill = {
      skillName: '',
      category: 'Technique',
      proficiencyLevel: 'intermediate',
      yearsExperience: 1,
      isPrimary: false,
      displayOrder: profileData.skills.length + 1
    };
    addItem('skills', newSkill);
  };

  const handleUpdateSkill = (id, field, value) => {
    updateItem('skills', id, field, value);
  };

  const handleRemoveSkill = (id) => {
    removeItem('skills', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Award} 
        title="Compétences" 
        onAdd={handleAddSkill}
        addButtonText="Ajouter une compétence"
      />

      <div className="space-y-4">
        {profileData.skills.map((skill) => (
          <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Compétence #{skill.id}</h3>
              <button
                onClick={() => handleRemoveSkill(skill.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Nom de la compétence"
                value={skill.skillName}
                onChange={(e) => handleUpdateSkill(skill.id, 'skillName', e.target.value)}
              />
              <FormField
                label="Catégorie"
                type="select"
                value={skill.category}
                onChange={(e) => handleUpdateSkill(skill.id, 'category', e.target.value)}
                options={[
                  { value: 'Technique', label: 'Technique' },
                  { value: 'Soft Skills', label: 'Soft Skills' },
                  { value: 'Langages', label: 'Langages' },
                  { value: 'Outils', label: 'Outils' }
                ]}
              />
              <FormField
                label="Niveau"
                type="select"
                value={skill.proficiencyLevel}
                onChange={(e) => handleUpdateSkill(skill.id, 'proficiencyLevel', e.target.value)}
                options={[
                  { value: 'beginner', label: 'Débutant' },
                  { value: 'intermediate', label: 'Intermédiaire' },
                  { value: 'advanced', label: 'Avancé' },
                  { value: 'expert', label: 'Expert' }
                ]}
              />
              <FormField
                label="Années d'expérience"
                type="number"
                value={skill.yearsExperience}
                onChange={(e) => handleUpdateSkill(skill.id, 'yearsExperience', parseInt(e.target.value))}
              />
            </div>
            
            <div className="mt-4 flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={skill.isPrimary}
                  onChange={(e) => handleUpdateSkill(skill.id, 'isPrimary', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Compétence principale</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
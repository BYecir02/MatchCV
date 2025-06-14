import React from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const ExperienceTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddExperience = () => {
    const newExp = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      description: '',
      achievements: [],
      technologiesUsed: [],
      displayOrder: profileData.experience.length + 1
    };
    addItem('experience', newExp);
  };

  const handleUpdateExperience = (id, field, value) => {
    updateItem('experience', id, field, value);
  };

  const handleRemoveExperience = (id) => {
    removeItem('experience', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Briefcase} 
        title="Expérience professionnelle" 
        onAdd={handleAddExperience}
        addButtonText="Ajouter une expérience"
      />

      <div className="space-y-4">
        {profileData.experience.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Expérience #{exp.id}</h3>
              <button
                onClick={() => handleRemoveExperience(exp.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Entreprise"
                value={exp.company}
                onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
              />
              <FormField
                label="Poste"
                value={exp.position}
                onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
              />
              <FormField
                label="Lieu"
                value={exp.location}
                onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
              />
              <FormField
                label="Date de début"
                type="month"
                value={exp.startDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
              />
              <FormField
                label="Date de fin"
                type="month"
                value={exp.isCurrent ? '' : exp.endDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.isCurrent}
              />
              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent}
                    onChange={(e) => handleUpdateExperience(exp.id, 'isCurrent', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Poste actuel</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4">
              <FormField
                label="Description"
                type="textarea"
                value={exp.description}
                onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                rows={3}
                placeholder="Décrivez vos missions et réalisations..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;
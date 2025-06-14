import React from 'react';
import { GraduationCap, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const EducationTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddEducation = () => {
    const newEdu = {
      institutionName: '',
      degreeType: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      honors: [],
      displayOrder: profileData.education.length + 1
    };
    addItem('education', newEdu);
  };

  const handleUpdateEducation = (id, field, value) => {
    updateItem('education', id, field, value);
  };

  const handleRemoveEducation = (id) => {
    removeItem('education', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={GraduationCap} 
        title="Formation" 
        onAdd={handleAddEducation}
        addButtonText="Ajouter une formation"
      />

      <div className="space-y-4">
        {profileData.education.map((edu) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Formation #{edu.id}</h3>
              <button
                onClick={() => handleRemoveEducation(edu.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="École/Université"
                value={edu.institutionName}
                onChange={(e) => handleUpdateEducation(edu.id, 'institutionName', e.target.value)}
              />
              <FormField
                label="Diplôme"
                value={edu.degreeType}
                onChange={(e) => handleUpdateEducation(edu.id, 'degreeType', e.target.value)}
              />
              <FormField
                label="Domaine d'étude"
                value={edu.fieldOfStudy}
                onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
              />
              <FormField
                label="Lieu"
                value={edu.location}
                onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
              />
              <FormField
                label="Note/Mention"
                value={edu.grade}
                onChange={(e) => handleUpdateEducation(edu.id, 'grade', e.target.value)}
              />
              <FormField
                label="Date de début"
                type="month"
                value={edu.startDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
              />
              <FormField
                label="Date de fin"
                type="month"
                value={edu.endDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
            
            <div className="mt-4">
              <FormField
                label="Description"
                type="textarea"
                value={edu.description}
                onChange={(e) => handleUpdateEducation(edu.id, 'description', e.target.value)}
                rows={2}
                placeholder="Spécialisations, projets, etc..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationTab;
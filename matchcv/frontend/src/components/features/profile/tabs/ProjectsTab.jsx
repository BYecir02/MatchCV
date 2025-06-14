import React from 'react';
import { Rocket, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const ProjectsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddProject = () => {
    const newProject = {
      projectName: '',
      description: '',
      projectUrl: '',
      repositoryUrl: '',
      technologiesUsed: [],
      startDate: '',
      endDate: '',
      isOngoing: false,
      screenshots: [],
      displayOrder: profileData.projects.length + 1
    };
    addItem('projects', newProject);
  };

  const handleUpdateProject = (id, field, value) => {
    updateItem('projects', id, field, value);
  };

  const handleRemoveProject = (id) => {
    removeItem('projects', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Rocket} 
        title="Projets" 
        onAdd={handleAddProject}
        addButtonText="Ajouter un projet"
      />

      <div className="space-y-4">
        {profileData.projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Projet #{project.id}</h3>
              <button
                onClick={() => handleRemoveProject(project.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nom du projet"
                value={project.projectName}
                onChange={(e) => handleUpdateProject(project.id, 'projectName', e.target.value)}
              />
              <FormField
                label="URL du projet"
                type="url"
                value={project.projectUrl}
                onChange={(e) => handleUpdateProject(project.id, 'projectUrl', e.target.value)}
                placeholder="https://..."
              />
              <FormField
                label="Repository GitHub"
                type="url"
                value={project.repositoryUrl}
                onChange={(e) => handleUpdateProject(project.id, 'repositoryUrl', e.target.value)}
                placeholder="https://github.com/..."
              />
              <FormField
                label="Date de début"
                type="month"
                value={project.startDate}
                onChange={(e) => handleUpdateProject(project.id, 'startDate', e.target.value)}
              />
              <FormField
                label="Date de fin"
                type="month"
                value={project.isOngoing ? '' : project.endDate}
                onChange={(e) => handleUpdateProject(project.id, 'endDate', e.target.value)}
                disabled={project.isOngoing}
              />
              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={project.isOngoing}
                    onChange={(e) => handleUpdateProject(project.id, 'isOngoing', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Projet en cours</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4">
              <FormField
                label="Description"
                type="textarea"
                value={project.description}
                onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                rows={3}
                placeholder="Décrivez votre projet..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
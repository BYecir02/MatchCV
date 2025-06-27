import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, Award, Globe, FolderOpen, Heart, Save, X } from 'lucide-react';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const CVEditor = ({ template, cvData, setCvData, onBack }) => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [editPanelOpen, setEditPanelOpen] = useState(false);

  const handleInputChange = (section, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = (section) => {
    const newItem = getEmptyItem(section);
    setCvData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeItem = (section, index) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const getEmptyItem = (section) => {
    switch (section) {
      case 'experience':
        return {
          company: '',
          position: '',
          start: '',
          end: '',
          description: ''
        };
      case 'education':
        return {
          school: '',
          degree: '',
          year: ''
        };
      case 'skills':
        return '';
      default:
        return {};
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setEditPanelOpen(true);
  };

  const closeEditPanel = () => {
    setEditPanelOpen(false);
    setSelectedSection(null);
  };

  const renderTemplate = () => {
    switch (template.id) {
      case 'modern':
        return <ModernTemplate data={cvData} onSectionClick={handleSectionClick} />;
      case 'classic':
        return <ClassicTemplate data={cvData} onSectionClick={handleSectionClick} />;
      case 'creative':
        return <CreativeTemplate data={cvData} onSectionClick={handleSectionClick} />;
      case 'minimal':
        return <MinimalTemplate data={cvData} onSectionClick={handleSectionClick} />;
      default:
        return <div className="text-gray-500 text-center">Template non disponible</div>;
    }
  };

  const renderEditPanel = () => {
    if (!selectedSection || !editPanelOpen) return null;

    switch (selectedSection) {
      case 'personal':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations personnelles
              </h3>
              <button
                onClick={closeEditPanel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.firstName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.lastName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre professionnel</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.title || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={cvData.personalInfo.email || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={cvData.personalInfo.phone || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    value={cvData.personalInfo.address || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé professionnel</label>
                <textarea
                  value={cvData.summary || ''}
                  onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre profil professionnel..."
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Expérience professionnelle
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addItem('experience')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  + Ajouter
                </button>
                <button
                  onClick={closeEditPanel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {cvData.experience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Expérience {index + 1}</h4>
                    <button
                      onClick={() => removeItem('experience', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                      <input
                        type="text"
                        value={exp.position || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                      <input
                        type="text"
                        value={exp.start || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'start', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                      <input
                        type="text"
                        value={exp.end || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'end', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="2024"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Formation
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addItem('education')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  + Ajouter
                </button>
                <button
                  onClick={closeEditPanel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Formation {index + 1}</h4>
                    <button
                      onClick={() => removeItem('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Établissement</label>
                      <input
                        type="text"
                        value={edu.school || ''}
                        onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                      <input
                        type="text"
                        value={edu.year || ''}
                        onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="2020"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Compétences
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addItem('skills')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  + Ajouter
                </button>
                <button
                  onClick={closeEditPanel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange('skills', index, '', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Compétence"
                  />
                  <button
                    onClick={() => removeItem('skills', index)}
                    className="text-red-600 hover:text-red-800 px-2 py-2 rounded"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Section en développement</h3>
              <button
                onClick={closeEditPanel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-500">Cette section sera bientôt disponible</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Édition du CV</h1>
          <p className="text-white/80">Template : {template.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack} 
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Retour aux templates
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center transition-colors">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </button>
        </div>
      </div>
      
      {editPanelOpen ? (
        // Layout avec panneau d'édition
        <div className="flex gap-10">
          <div className="w-2/3 p-8 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="flex justify-center">
              <div className="relative">
                <div style={{ 
                  width: 794, 
                  maxWidth: '100%',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top center'
                }}>
                  {renderTemplate()}
                </div>
              </div>
            </div>
          </div>
          <div className="w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto rounded-r-lg">
            {renderEditPanel()}
          </div>
        </div>
      ) : (
        // Layout centré sans panneau d'édition
        <div className="flex justify-center">
          <div className="p-8 bg-white rounded-lg shadow-sm overflow-auto">
            <div className="flex justify-center">
              <div className="relative">
                <div style={{ 
                  width: 794, 
                  maxWidth: '100%',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top center'
                }}>
                  {renderTemplate()}
                </div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                  💡 Cliquez sur une section pour la modifier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVEditor; 
import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  Globe,
  ChevronDown,
  ChevronUp,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';

const CVEditor = ({ cvData, onUpdateCV, onSave, className = '' }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [editingItem, setEditingItem] = useState(null);

  const sections = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'summary', label: 'Résumé professionnel', icon: Edit3 },
    { id: 'experience', label: 'Expérience', icon: Briefcase },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'skills', label: 'Compétences', icon: Award },
    { id: 'languages', label: 'Langues', icon: Languages },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projets', icon: Globe }
  ];

  const handleInputChange = (section, field, value) => {
    onUpdateCV({
      ...cvData,
      [section]: {
        ...cvData[section],
        [field]: value
      }
    });
  };

  const handleArrayItemChange = (section, index, field, value) => {
    const updatedArray = [...cvData[section]];
    updatedArray[index] = {
      ...updatedArray[index],
      [field]: value
    };
    onUpdateCV({
      ...cvData,
      [section]: updatedArray
    });
  };

  const addArrayItem = (section, newItem) => {
    onUpdateCV({
      ...cvData,
      [section]: [...(cvData[section] || []), { ...newItem, id: Date.now() }]
    });
  };

  const removeArrayItem = (section, index) => {
    const updatedArray = cvData[section].filter((_, i) => i !== index);
    onUpdateCV({
      ...cvData,
      [section]: updatedArray
    });
  };

  const moveArrayItem = (section, fromIndex, toIndex) => {
    const updatedArray = [...cvData[section]];
    const [movedItem] = updatedArray.splice(fromIndex, 1);
    updatedArray.splice(toIndex, 0, movedItem);
    onUpdateCV({
      ...cvData,
      [section]: updatedArray
    });
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            value={cvData.personalInfo?.firstName || ''}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={cvData.personalInfo?.lastName || ''}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titre professionnel</label>
        <input
          type="text"
          value={cvData.personalInfo?.title || ''}
          onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
          placeholder="Ex: Développeur Full-Stack"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={cvData.personalInfo?.email || ''}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={cvData.personalInfo?.phone || ''}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
        <input
          type="text"
          value={cvData.personalInfo?.location || ''}
          onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
          placeholder="Ex: Paris, France"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            value={cvData.personalInfo?.linkedin || ''}
            onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/profil"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <input
            type="url"
            value={cvData.personalInfo?.github || ''}
            onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)}
            placeholder="https://github.com/profil"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Site web / Portfolio</label>
        <input
          type="url"
          value={cvData.personalInfo?.website || ''}
          onChange={(e) => handleInputChange('personalInfo', 'website', e.target.value)}
          placeholder="https://monsite.com"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Résumé professionnel
      </label>
      <textarea
        value={cvData.summary || ''}
        onChange={(e) => onUpdateCV({ ...cvData, summary: e.target.value })}
        placeholder="Décrivez votre profil professionnel en quelques phrases..."
        rows="6"
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="text-xs text-gray-500 mt-1">
        {cvData.summary?.length || 0} caractères (recommandé: 200-300)
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-800">Expériences professionnelles</h4>
        <button
          onClick={() => addArrayItem('experience', {
            company: '',
            position: '',
            period: '',
            location: '',
            description: '',
            achievements: []
          })}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      {cvData.experience?.map((exp, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h5 className="font-medium text-gray-800">Expérience {index + 1}</h5>
            <div className="flex space-x-2">
              {index > 0 && (
                <button
                  onClick={() => moveArrayItem('experience', index, index - 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
              )}
              {index < cvData.experience.length - 1 && (
                <button
                  onClick={() => moveArrayItem('experience', index, index + 1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => removeArrayItem('experience', index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleArrayItemChange('experience', index, 'position', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => handleArrayItemChange('experience', index, 'period', e.target.value)}
                  placeholder="Ex: 2022 - Présent"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleArrayItemChange('experience', index, 'location', e.target.value)}
                  placeholder="Ex: Paris, France"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Réalisations (une par ligne)
              </label>
              <textarea
                value={exp.achievements?.join('\n') || ''}
                onChange={(e) => handleArrayItemChange('experience', index, 'achievements', 
                  e.target.value.split('\n').filter(item => item.trim())
                )}
                rows="3"
                placeholder="• Amélioration des performances de 40%&#10;• Migration vers TypeScript&#10;• Formation de l'équipe"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      {(!cvData.experience || cvData.experience.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Aucune expérience ajoutée</p>
          <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-800">Formation</h4>
        <button
          onClick={() => addArrayItem('education', {
            school: '',
            degree: '',
            field: '',
            period: '',
            location: '',
            grade: ''
          })}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      {cvData.education?.map((edu, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <h5 className="font-medium text-gray-800">Formation {index + 1}</h5>
            <button
              onClick={() => removeArrayItem('education', index)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)}
                placeholder="Ex: Master en Informatique"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">École/Université</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => handleArrayItemChange('education', index, 'school', e.target.value)}
                placeholder="Ex: Université de Paris"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => handleArrayItemChange('education', index, 'period', e.target.value)}
                  placeholder="Ex: 2019 - 2021"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleArrayItemChange('education', index, 'location', e.target.value)}
                  placeholder="Ex: Paris, France"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mention (optionnel)</label>
              <input
                type="text"
                value={edu.grade}
                onChange={(e) => handleArrayItemChange('education', index, 'grade', e.target.value)}
                placeholder="Ex: Mention Bien"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      {(!cvData.education || cvData.education.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Aucune formation ajoutée</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-800">Compétences</h4>
        <button
          onClick={() => addArrayItem('skills', {
            name: '',
            level: 'Intermédiaire',
            category: 'Technique',
            highlighted: false
          })}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cvData.skills?.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <button
                  onClick={() => handleArrayItemChange('skills', index, 'highlighted', !skill.highlighted)}
                  className={`p-1 mr-2 rounded ${skill.highlighted ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {skill.highlighted ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <span className="text-sm font-medium">Compétence {index + 1}</span>
              </div>
              <button
                onClick={() => removeArrayItem('skills', index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleArrayItemChange('skills', index, 'name', e.target.value)}
                placeholder="Nom de la compétence"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={skill.level}
                onChange={(e) => handleArrayItemChange('skills', index, 'level', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {(!cvData.skills || cvData.skills.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Aucune compétence ajoutée</p>
        </div>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-800">Langues</h4>
        <button
          onClick={() => addArrayItem('languages', {
            name: '',
            level: 'Intermédiaire'
          })}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter
        </button>
      </div>

      <div className="space-y-3">
        {cvData.languages?.map((lang, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => handleArrayItemChange('languages', index, 'name', e.target.value)}
              placeholder="Langue"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={lang.level}
              onChange={(e) => handleArrayItemChange('languages', index, 'level', e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Débutant">Débutant</option>
              <option value="Intermédiaire">Intermédiaire</option>
              <option value="Avancé">Avancé</option>
              <option value="Courant">Courant</option>
              <option value="Natif">Natif</option>
            </select>

            <button
              onClick={() => removeArrayItem('languages', index)}
              className="p-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {(!cvData.languages || cvData.languages.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <Languages className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Aucune langue ajoutée</p>
        </div>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'personal': return renderPersonalInfo();
      case 'summary': return renderSummary();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'languages': return renderLanguages();
      default: return <div>Section non implémentée</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="flex border-b border-gray-200">
        {/* Sidebar des sections */}
        <div className="w-64 bg-gray-50 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {sections.find(s => s.id === activeSection)?.label}
            </h3>
            <button
              onClick={onSave}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEditor;
import React, { useState } from 'react';
import { Rocket, Trash2, Plus, ExternalLink, Github, Calendar, Code, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const ProjectsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingProject, setAddingProject] = useState(false);

  const handleAddProject = async () => {
    setAddingProject(true);
    
    const newProject = {
      projectName: '',
      description: '',
      projectUrl: '',
      repositoryUrl: '',
      technologiesUsed: [], // ⭐ Tableau vide par défaut
      startDate: '',
      endDate: '',
      isOngoing: false,
      screenshots: [],
      displayOrder: profileData.projects.length + 1
    };
    
    console.log('🚀 Ajout nouveau projet:', newProject);
    const result = await addItem('projects', newProject);
    console.log('✅ Résultat ajout projet:', result);
    
    setAddingProject(false);
  };

  const handleUpdateProject = (id, field, value) => {
    console.log(`🔄 Mise à jour projet ${id}:`, { [field]: value });
    updateItem('projects', id, field, value);
  };

  const handleRemoveProject = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      console.log('🗑️ Suppression projet:', id);
      const result = await removeItem('projects', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // ⭐ TECHNOLOGIES ÉLARGIES - Tous domaines confondus
  const technologiesByCategory = {
    // Développement Web/Mobile
    'Développement Web': [
      'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 
      'Node.js', 'Express.js', 'Next.js', 'Nuxt.js', 'Svelte', 'Bootstrap', 'Tailwind CSS'
    ],
    'Backend/Serveur': [
      'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'PHP', 'Laravel', 
      'Ruby', 'Rails', '.NET', 'C#', 'Go', 'Rust'
    ],
    'Mobile': [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin', 
      'Android Studio', 'Xcode'
    ],
    'Bases de données': [
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 
      'Firebase', 'Supabase', 'Elasticsearch'
    ],
    'DevOps/Cloud': [
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Heroku', 
      'Vercel', 'Netlify', 'Jenkins', 'GitLab CI', 'GitHub Actions'
    ],
    
    // Design & Créatif
    'Design/UX': [
      'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 
      'After Effects', 'Canva', 'Principle', 'Framer'
    ],
    'Multimédia': [
      'Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'Blender', 'Cinema 4D', 
      'Maya', 'Unity', 'Unreal Engine', 'OBS Studio'
    ],
    
    // Marketing & Communication
    'Marketing Digital': [
      'Google Analytics', 'Google Ads', 'Facebook Ads', 'LinkedIn Ads', 
      'Mailchimp', 'HubSpot', 'Salesforce', 'SEMrush', 'Hootsuite'
    ],
    'CMS/E-commerce': [
      'WordPress', 'Drupal', 'Joomla', 'Shopify', 'WooCommerce', 'Magento', 
      'PrestaShop', 'Squarespace', 'Webflow'
    ],
    
    // Business & Gestion
    'Gestion de projet': [
      'Jira', 'Trello', 'Asana', 'Monday.com', 'Notion', 'Slack', 'Microsoft Teams', 
      'Confluence', 'GitLab', 'GitHub'
    ],
    'Analytics/BI': [
      'Tableau', 'Power BI', 'Google Data Studio', 'Excel', 'Google Sheets', 
      'R', 'Python', 'SQL', 'Looker'
    ],
    
    // Spécialisées
    'IA/Machine Learning': [
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI', 'Hugging Face', 
      'Jupyter', 'Pandas', 'NumPy'
    ],
    'Autres outils': [
      'Git', 'Postman', 'Insomnia', 'VSCode', 'IntelliJ', 'Vim', 
      'Linux', 'Windows', 'macOS'
    ]
  };

  // Ajouter une technologie à un projet
  const addTechnologyToProject = (projectId, technology) => {
    const project = profileData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const currentTechs = Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [];
    
    // Vérifier si la technologie n'est pas déjà ajoutée
    if (!currentTechs.includes(technology)) {
      const newTechs = [...currentTechs, technology];
      handleUpdateProject(projectId, 'technologiesUsed', newTechs);
    }
  };

  // Supprimer une technologie d'un projet
  const removeTechnologyFromProject = (projectId, technology) => {
    const project = profileData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const currentTechs = Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [];
    const newTechs = currentTechs.filter(tech => tech !== technology);
    handleUpdateProject(projectId, 'technologiesUsed', newTechs);
  };

  // Composant sélecteur de technologies
  const TechnologySelector = ({ project }) => {
    const [showSelector, setShowSelector] = useState(false);
    const [customTech, setCustomTech] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Développement Web');

    const currentTechs = Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [];

    const handleAddCustomTech = () => {
      if (customTech.trim() && !currentTechs.includes(customTech.trim())) {
        addTechnologyToProject(project.id, customTech.trim());
        setCustomTech('');
      }
    };

    return (
      <div className="space-y-3">
        {/* Technologies actuelles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technologies utilisées ({currentTechs.length})
          </label>
          
          {currentTechs.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {currentTechs.map(tech => (
                <div 
                  key={tech}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => removeTechnologyFromProject(project.id, tech)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-3">Aucune technologie ajoutée</p>
          )}
        </div>

        {/* Bouton pour afficher le sélecteur */}
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showSelector ? 'Masquer les technologies' : 'Ajouter des technologies'}
        </button>

        {/* Sélecteur de technologies */}
        {showSelector && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {/* Sélection de catégorie */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.keys(technologiesByCategory).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Technologies de la catégorie sélectionnée */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Cliquez pour ajouter une technologie :
              </p>
              <div className="flex flex-wrap gap-2">
                {technologiesByCategory[selectedCategory].map(tech => {
                  const isSelected = currentTechs.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => {
                        if (isSelected) {
                          removeTechnologyFromProject(project.id, tech);
                        } else {
                          addTechnologyToProject(project.id, tech);
                        }
                      }}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        isSelected 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {isSelected && '✓ '}{tech}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Champ technologie personnalisée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autre technologie (non listée)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  placeholder="Tapez le nom de la technologie..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTech()}
                />
                <button
                  onClick={handleAddCustomTech}
                  disabled={!customTech.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Ajouter
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Exemple : Figma, Photoshop, Excel, AutoCAD, etc.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Rocket} 
        title="Projets et réalisations" 
        onAdd={handleAddProject}
        addButtonText={addingProject ? "Ajout..." : "Ajouter un projet"}
      />

      <div className="space-y-4">
        {profileData.projects.map((project) => {
          // Vérifier si c'est un projet vide (nouveau)
          const isEmpty = !project.projectName && !project.description;
          const currentTechs = Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [];
          
          return (
            <div 
              key={project.id} 
              className={`border rounded-lg p-4 ${
                isEmpty ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">
                    {project.projectName || '🚀 Nouveau projet'}
                  </h3>
                  
                  {/* Badges de statut */}
                  <div className="flex space-x-2">
                    {project.isOngoing && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        En cours
                      </span>
                    )}
                    {currentTechs.length > 0 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {currentTechs.length} techno{currentTechs.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full hover:bg-green-200 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Démo
                      </a>
                    )}
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-gray-200 flex items-center"
                      >
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveProject(project.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Supprimer ce projet"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {isEmpty && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded text-sm text-green-800">
                  🎯 <strong>Nouveau projet ajouté !</strong> Complétez les champs ci-dessous. 
                  La sauvegarde se fait automatiquement.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ligne 1 : Nom et URLs */}
                <FormField
                  label="Nom du projet"
                  value={project.projectName || ''}
                  onChange={(e) => handleUpdateProject(project.id, 'projectName', e.target.value)}
                  placeholder="Mon super projet"
                  className={!project.projectName ? 'border-green-300' : ''}
                />
                
                <FormField
                  label="URL de démonstration"
                  type="url"
                  value={project.projectUrl || ''}
                  onChange={(e) => handleUpdateProject(project.id, 'projectUrl', e.target.value)}
                  placeholder="https://mon-projet.com"
                />

                {/* Ligne 2 : Repository et Dates */}
                <FormField
                  label="Repository (GitHub, GitLab...)"
                  type="url"
                  value={project.repositoryUrl || ''}
                  onChange={(e) => handleUpdateProject(project.id, 'repositoryUrl', e.target.value)}
                  placeholder="https://github.com/username/projet"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    label="Date de début"
                    type="month"
                    value={project.startDate || ''}
                    onChange={(e) => handleUpdateProject(project.id, 'startDate', e.target.value)}
                  />
                  
                  <FormField
                    label="Date de fin"
                    type="month"
                    value={project.endDate || ''}
                    onChange={(e) => handleUpdateProject(project.id, 'endDate', e.target.value)}
                    disabled={project.isOngoing}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-4">
                <FormField
                  label="Description du projet"
                  type="textarea"
                  value={project.description || ''}
                  onChange={(e) => handleUpdateProject(project.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Décrivez votre projet, ses objectifs, défis relevés, résultats obtenus..."
                  className={!project.description ? 'border-green-300' : ''}
                />
              </div>

              {/* ⭐ NOUVEAU : Sélecteur de technologies amélioré */}
              <div className="mt-4">
                <TechnologySelector project={project} />
              </div>

              {/* Option "Projet en cours" */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={project.isOngoing || false}
                    onChange={(e) => {
                      handleUpdateProject(project.id, 'isOngoing', e.target.checked);
                      if (e.target.checked) {
                        handleUpdateProject(project.id, 'endDate', '');
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Ce projet est en cours de développement</span>
                </label>
              </div>

              {/* Informations de durée */}
              {project.startDate && (project.endDate || project.isOngoing) && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {project.isOngoing ? 
                        `Démarré en ${new Date(project.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} - En cours` :
                        `Du ${new Date(project.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })} au ${new Date(project.endDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-400">
                ID: {project.id} | Ordre: {project.displayOrder || 0} 
                {isEmpty && ' | 🆕 Nouveau'}
              </div>
            </div>
          );
        })}
        
        {profileData.projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Rocket className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun projet ajouté</p>
            <p className="text-sm">Cliquez sur "Ajouter un projet" pour commencer</p>
          </div>
        )}
      </div>

      {/* Résumé des projets */}
      {profileData.projects.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Résumé de vos projets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileData.projects.length}</div>
              <div className="text-blue-700">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profileData.projects.filter(p => p.isOngoing).length}
              </div>
              <div className="text-green-700">En cours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {profileData.projects.filter(p => p.projectUrl).length}
              </div>
              <div className="text-purple-700">Avec démo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {profileData.projects.filter(p => p.repositoryUrl).length}
              </div>
              <div className="text-orange-700">Open source</div>
            </div>
          </div>
          
          {/* Technologies les plus utilisées */}
          {profileData.projects.some(p => Array.isArray(p.technologiesUsed) && p.technologiesUsed.length > 0) && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies les plus utilisées :</h4>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const techCount = {};
                  profileData.projects.forEach(project => {
                    if (Array.isArray(project.technologiesUsed)) {
                      project.technologiesUsed.forEach(tech => {
                        techCount[tech] = (techCount[tech] || 0) + 1;
                      });
                    }
                  });
                  
                  return Object.entries(techCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 12)
                    .map(([tech, count]) => (
                      <div 
                        key={tech}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                      >
                        {tech} ({count})
                      </div>
                    ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des projets
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.projects, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ProjectsTab;
import React, { useState, useEffect } from 'react';
import { 
  File, 
  Download, 
  Eye, 
  Edit3, 
  Save, 
  RefreshCw,
  ArrowLeft,
  Share2,
  FileText,
  Settings,
  Zap
} from 'lucide-react';

// Import des composants
import TemplateSelector from './components/TemplateSelector';
import CVPreview from './components/CVPreview';
import CVEditor from './components/CVEditor';

// Import des hooks
import { useCVData } from './hooks/useCVData';
import { useCVGeneration } from './hooks/useCVGeneration';

// Import des templates
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import TechTemplate from './templates/TechTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const CVGenerator = ({ user, initialData, onNavigateBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [success, setSuccess] = useState('');

  // Hooks personnalisés
  const {
    cvData,
    loading,
    error,
    loadUserProfile,
    generateOptimizedCV,
    updateCVSection,
    addCVItem,
    updateCVItem,
    removeCVItem,
    setError
  } = useCVData(user, initialData);

  const {
    isGenerating,
    generationError,
    generationSuccess,
    generatePDF,
    saveCV,
    shareCV,
    exportCV,
    calculateATSScore,
    setGenerationError,
    setGenerationSuccess
  } = useCVGeneration();

  // Templates disponibles avec plus de détails
  const templates = [
    { 
      id: 'modern', 
      name: 'Moderne', 
      description: 'Design épuré avec header coloré',
      category: 'professional',
      atsScore: 95,
      tags: ['ATS-Friendly', 'Professionnel', 'Moderne'],
      component: ModernTemplate
    },
    { 
      id: 'classic', 
      name: 'Classique', 
      description: 'Format traditionnel centré',
      category: 'professional',
      atsScore: 98,
      tags: ['Traditionnel', 'Conservateur', 'Universel'],
      component: ClassicTemplate
    },
    { 
      id: 'creative', 
      name: 'Créatif', 
      description: 'Design artistique avec couleurs',
      category: 'creative',
      atsScore: 85,
      tags: ['Créatif', 'Artistique', 'Original'],
      component: CreativeTemplate
    },
    { 
      id: 'tech', 
      name: 'Tech', 
      description: 'Style développeur dark mode',
      category: 'tech',
      atsScore: 92,
      tags: ['Tech', 'Développeur', 'Moderne'],
      component: TechTemplate
    },
    { 
      id: 'minimal', 
      name: 'Minimaliste', 
      description: 'Ultra épuré et simple',
      category: 'minimal',
      atsScore: 94,
      tags: ['Minimal', 'Épuré', 'Simple'],
      component: MinimalTemplate
    }
  ];

  // Initialiser les données
  useEffect(() => {
    if (initialData) {
      generateOptimizedCV(initialData);
    } else {
      loadUserProfile();
    }
  }, [initialData, generateOptimizedCV, loadUserProfile]);

  // Handlers
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    setSuccess(`Template "${template?.name}" sélectionné !`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDownloadCV = async () => {
    if (!cvData) return;
    
    const result = await generatePDF(cvData, selectedTemplate);
    if (result.success) {
      setSuccess('CV téléchargé avec succès !');
    }
  };

  const handleSaveCV = async () => {
    if (!cvData) return;
    
    const result = await saveCV(cvData, selectedTemplate);
    if (result.success) {
      setSuccess('CV sauvegardé avec succès !');
    }
  };

  const handleShareCV = async () => {
    if (!cvData) return;
    
    const result = await shareCV(cvData, selectedTemplate);
    if (result.success) {
      setSuccess('Lien de partage copié !');
    }
  };

  const handleExportCV = async (format) => {
    if (!cvData) return;
    
    const result = await exportCV(cvData, selectedTemplate, format);
    if (result.success) {
      setSuccess(`CV exporté en ${format.toUpperCase()} !`);
    }
  };

  // Calculer le score ATS
  const atsScore = cvData ? calculateATSScore(cvData, selectedTemplate) : null;

  // Obtenir le template sélectionné
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const TemplateComponent = selectedTemplateData?.component;

  // Onglets de navigation
  const tabs = [
    { id: 'template', label: 'Template', icon: FileText },
    { id: 'editor', label: 'Éditeur', icon: Edit3 },
    { id: 'preview', label: 'Aperçu', icon: Eye },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  if (loading && !cvData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Génération de votre CV optimisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Générateur de CV</h1>
            <p className="text-gray-600 mt-1">
              {cvData?.optimizedFor ? 
                `CV optimisé pour ${cvData.optimizedFor.position} chez ${cvData.optimizedFor.company}` :
                'Créez votre CV professionnel avec IA'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Score ATS */}
          {atsScore && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              atsScore.score >= 80 ? 'bg-green-100 text-green-800' :
              atsScore.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <Zap className="h-4 w-4 inline mr-1" />
              ATS {atsScore.score}%
            </div>
          )}
          
          {/* Actions */}
          <button
            onClick={handleShareCV}
            disabled={isGenerating || !cvData}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </button>
          
          <button
            onClick={handleSaveCV}
            disabled={isGenerating || !cvData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </button>
          
          <div className="relative group">
            <button
              onClick={() => handleDownloadCV()}
              disabled={isGenerating || !cvData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Génération...' : 'Télécharger'}
            </button>
            
            {/* Menu dropdown pour différents formats */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                <button
                  onClick={() => handleExportCV('pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Télécharger PDF
                </button>
                <button
                  onClick={() => handleExportCV('docx')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Télécharger Word
                </button>
                <button
                  onClick={() => handleExportCV('html')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Télécharger HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {(error || generationError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error || generationError}</p>
        </div>
      )}

      {(success || generationSuccess) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{success || generationSuccess}</p>
        </div>
      )}

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau gauche - Template Selector / Editor */}
        <div className="lg:col-span-1">
          {activeTab === 'template' && (
            <TemplateSelector
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          )}
          
          {activeTab === 'editor' && cvData && (
            <CVEditor
              cvData={cvData}
              onUpdateSection={updateCVSection}
              onAddItem={addCVItem}
              onUpdateItem={updateCVItem}
              onRemoveItem={removeCVItem}
            />
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Paramètres du CV</h3>
              
              {/* Score ATS détaillé */}
              {atsScore && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Score ATS</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span>Score global</span>
                      <span className="font-bold">{atsScore.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${atsScore.score}%` }}
                      ></div>
                    </div>
                    
                    {atsScore.recommendations.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Recommandations:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {atsScore.recommendations.slice(0, 3).map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Template Info */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Template sélectionné</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium">{selectedTemplateData?.name}</h5>
                      <p className="text-sm text-gray-600">{selectedTemplateData?.description}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ATS {selectedTemplateData?.atsScore}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTemplateData?.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panneau droit - Aperçu */}
        <div className="lg:col-span-2">
          {activeTab === 'preview' && cvData && TemplateComponent ? (
            <CVPreview>
              <TemplateComponent cvData={cvData} />
            </CVPreview>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <File className="h-5 w-5 mr-2 text-blue-600" />
                {activeTab === 'template' ? 'Aperçu du Template' : 
                 activeTab === 'editor' ? 'Éditeur de CV' : 
                 activeTab === 'settings' ? 'Paramètres' : 'Aperçu du CV'}
              </h2>
              
              {cvData && TemplateComponent ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="transform scale-75 origin-top-left">
                    <TemplateComponent cvData={cvData} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {activeTab === 'template' ? 'Sélectionnez un template pour voir l\'aperçu' :
                     'Aucune donnée de CV disponible'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVGenerator;
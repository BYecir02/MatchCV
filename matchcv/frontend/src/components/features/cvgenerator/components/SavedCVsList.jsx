import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Edit3, 
  Trash2, 
  Eye, 
  Share2, 
  Calendar,
  TrendingUp,
  Users,
  Copy
} from 'lucide-react';
import CVService from '../../../../services/api/cv';

const SavedCVsList = ({ onSelectCV, onEditCV, onDeleteCV }) => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCV, setSelectedCV] = useState(null);

  // Charger les CVs sauvegardés
  const loadSavedCVs = async () => {
    try {
      setLoading(true);
      const response = await CVService.getMyCVs();
      
      if (response.success) {
        setCvs(response.cvs || []);
      } else {
        setError(response.message || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur chargement CVs:', error);
      setError('Erreur lors du chargement des CVs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedCVs();
  }, []);

  // Supprimer un CV
  const handleDeleteCV = async (cvId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      return;
    }

    try {
      const response = await CVService.deleteCV(cvId);
      
      if (response.success) {
        setCvs(cvs.filter(cv => cv._id !== cvId));
        if (onDeleteCV) onDeleteCV(cvId);
      } else {
        setError(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression CV:', error);
      setError('Erreur lors de la suppression');
    }
  };

  // Partager un CV
  const handleShareCV = async (cvId) => {
    try {
      const response = await CVService.shareCV(cvId);
      
      if (response.success) {
        // Copier le lien dans le presse-papiers
        await navigator.clipboard.writeText(response.shareUrl);
        alert('Lien de partage copié !');
      } else {
        setError(response.message || 'Erreur lors du partage');
      }
    } catch (error) {
      console.error('Erreur partage CV:', error);
      setError('Erreur lors du partage');
    }
  };

  // Exporter un CV en PDF
  const handleExportPDF = async (cvId) => {
    try {
      const response = await CVService.exportCVToPDF(cvId);
      
      if (response.success) {
        // Télécharger le fichier
        const a = document.createElement('a');
        a.href = response.downloadUrl;
        a.download = response.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setError(response.message || 'Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      setError('Erreur lors de l\'export PDF');
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Obtenir le nom du template
  const getTemplateName = (templateId) => {
    const templates = {
      'modern': 'Moderne',
      'classic': 'Classique',
      'creative': 'Créatif',
      'tech': 'Tech',
      'minimal': 'Minimaliste',
      'ultra-modern': 'Ultra Moderne'
    };
    return templates[templateId] || templateId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos CVs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={loadSavedCVs}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun CV sauvegardé</h3>
        <p className="text-gray-500 mb-4">
          Créez votre premier CV pour le voir apparaître ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mes CVs ({cvs.length})
        </h3>
        <button
          onClick={loadSavedCVs}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Actualiser
        </button>
      </div>

      <div className="grid gap-4">
        {cvs.map((cv) => (
          <div 
            key={cv._id} 
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{cv.title}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {getTemplateName(cv.templateId)}
                  </span>
                </div>
                
                {cv.optimizedFor && (
                  <p className="text-sm text-gray-600 mb-2">
                    Optimisé pour : {cv.optimizedFor.position} chez {cv.optimizedFor.company}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(cv.createdAt)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {cv.analytics?.views || 0} vues
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {cv.analytics?.downloads || 0} téléchargements
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3" />
                    {cv.analytics?.shares || 0} partages
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCV && onSelectCV(cv)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Voir le CV"
                >
                  <Eye className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => onEditCV && onEditCV(cv)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Modifier le CV"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleExportPDF(cv._id)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Exporter en PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleShareCV(cv._id)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Partager le CV"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDeleteCV(cv._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer le CV"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCVsList; 
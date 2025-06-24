import React from 'react';
import { Eye, Download, Share2, Save, FileText } from 'lucide-react';

const CVPreview = ({ 
  cvData, 
  selectedTemplate, 
  TemplateComponent, 
  onDownload, 
  onSave, 
  onShare, 
  onExport,
  isGenerating = false,
  generationError = '',
  generationSuccess = ''
}) => {
  if (!cvData || !TemplateComponent) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune donnée à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Aperçu du CV</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {selectedTemplate}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onDownload}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            Télécharger PDF
          </button>
          
          <button
            onClick={onSave}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            Sauvegarder
          </button>
          
          <button
            onClick={onShare}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </button>
          
          <div className="relative">
            <button
              onClick={() => onExport('docx')}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileText className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Messages de statut */}
      {generationError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{generationError}</p>
        </div>
      )}
      
      {generationSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{generationSuccess}</p>
        </div>
      )}

      {/* Aperçu du CV */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Aperçu - Template {selectedTemplate}</h4>
            <div className="text-xs text-gray-500">
              Format A4 - Impression optimisée
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-100 min-h-[800px] flex justify-center">
          <div className="w-full max-w-[210mm] bg-white shadow-xl">
            <TemplateComponent cvData={cvData} className="print:shadow-none" />
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-700">Génération en cours...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreview;

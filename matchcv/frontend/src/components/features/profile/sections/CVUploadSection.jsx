import React from 'react';
import { Upload, File, X, Loader2 } from 'lucide-react';

const CVUploadSection = ({ 
  cvFile, 
  cvLoading, 
  error, 
  success, 
  onFileUpload, 
  onRemoveFile 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Upload className="h-6 w-6 mr-2 text-blue-600" />
        Importer mon CV
      </h2>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Importez votre CV pour remplir automatiquement votre profil
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            L'IA analysera votre CV et extraira vos informations professionnelles
          </p>
          <p className="text-xs text-gray-400 mb-4">
            PDF, DOC, DOCX - Max 5MB
          </p>
          
          {!cvFile ? (
            <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <File className="h-5 w-5 mr-2" />
              Choisir un fichier CV
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              {cvLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" />
                  <span className="text-blue-600 font-medium">Analyse du CV en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <File className="h-5 w-5 mr-2" />
                    <span className="font-medium">{cvFile.name}</span>
                  </div>
                  <button
                    onClick={onRemoveFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}
    </div>
  );
};

export default CVUploadSection;
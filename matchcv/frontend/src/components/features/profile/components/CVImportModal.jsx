import React, { useState } from 'react';
import { Upload, FileText, Zap, AlertTriangle, CheckCircle, X, File, FileUp } from 'lucide-react';
import ProfileService from '../../../../services/api/profile'; // ⭐ IMPORTER ProfileService

const CVImportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [uploadMode, setUploadMode] = useState('text'); // 'text' ou 'file'
  const [cvText, setCvText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (uploadMode === 'file' && !selectedFile) {
      setError('Veuillez sélectionner un fichier CV');
      return;
    }

    if (uploadMode === 'text' && !cvText.trim()) {
      setError('Veuillez coller le contenu de votre CV');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    try {
      console.log('🚀 Import CV démarré...', { mode: uploadMode });
      
      let data;
      
      if (uploadMode === 'file') {
        // Upload de fichier
        const formData = new FormData();
        formData.append('cv', selectedFile);
        formData.append('replaceExisting', replaceExisting);
        
        data = await ProfileService.uploadCV(formData);
      } else {
        // Import de texte
        data = await ProfileService.importCV(cvText.trim(), replaceExisting);
      }

      if (data.success) {
        setAnalysisResult(data);
        console.log('✅ Import réussi:', data.importStats);
        
        // Notifier le parent du succès
        if (onImportSuccess) {
          onImportSuccess(data.profileData);
        }
      } else {
        throw new Error(data.message || 'Erreur lors de l\'import');
      }

    } catch (error) {
      console.error('❌ Erreur import CV:', error);
      setError(error.message || 'Erreur lors de l\'analyse du CV');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        setError('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX.');
        return;
      }
      
      if (file.size > maxSize) {
        setError('Le fichier est trop volumineux. Taille maximum: 5MB.');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleClose = () => {
    setCvText('');
    setSelectedFile(null);
    setReplaceExisting(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Importer votre CV
              </h2>
              <p className="text-sm text-gray-500">
                L'IA analysera votre CV et remplira automatiquement votre profil
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!analysisResult ? (
            <>
              {/* Toggle Mode */}
              <div className="flex space-x-4 mb-4">
                <button 
                  onClick={() => setUploadMode('text')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    uploadMode === 'text' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Coller le texte</span>
                </button>
                <button 
                  onClick={() => setUploadMode('file')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    uploadMode === 'file' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileUp className="h-4 w-4" />
                  <span>Uploader un fichier</span>
                </button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      Comment ça fonctionne :
                    </p>
                    <ul className="text-blue-800 space-y-1">
                      {uploadMode === 'text' ? (
                        <>
                          <li>• Copiez le contenu de votre CV (texte uniquement)</li>
                          <li>• Collez-le dans la zone ci-dessous</li>
                        </>
                      ) : (
                        <>
                          <li>• Sélectionnez votre fichier CV (PDF, DOC, DOCX)</li>
                          <li>• Taille maximum: 5MB</li>
                        </>
                      )}
                      <li>• Notre IA Groq analysera et extraira automatiquement vos informations</li>
                      <li>• Vous pourrez ensuite modifier les données importées</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Zone de saisie selon le mode */}
              {uploadMode === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu de votre CV
                  </label>
                  <textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    placeholder="Collez ici le contenu textuel de votre CV...

Exemple:
Jean Dupont
Développeur Full Stack
Email: jean@example.com
Téléphone: 06 12 34 56 78

EXPÉRIENCE PROFESSIONNELLE
Développeur Senior - TechCorp (2020-2024)
- Développement d'applications web React/Node.js
- Management d'équipe de 3 développeurs
- ..."
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={isAnalyzing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {cvText.length} caractères - Minimum 100 caractères recommandé
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier CV
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="text-center">
                      <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Glissez-déposez votre fichier ici ou cliquez pour sélectionner
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX - Max 5MB
                        </p>
                      </div>
                      
                      {selectedFile ? (
                        <div className="mt-4 flex items-center justify-center space-x-4">
                          <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                            <File className="h-5 w-5 mr-2" />
                            <span className="font-medium">{selectedFile.name}</span>
                          </div>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <label className="mt-4 cursor-pointer inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <FileUp className="h-5 w-5 mr-2" />
                          Choisir un fichier
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="replaceExisting"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                    disabled={isAnalyzing}
                  />
                  <label htmlFor="replaceExisting" className="ml-2 text-sm text-gray-700">
                    Remplacer les données existantes
                  </label>
                </div>
                
                {replaceExisting && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        <strong>Attention :</strong> Cette option supprimera toutes vos données 
                        existantes et les remplacera par celles du CV importé.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </>
          ) : (
            /* Résultats d'analyse */
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium text-green-900">
                    CV analysé avec succès !
                  </h3>
                </div>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.importStats.created}
                  </div>
                  <div className="text-sm text-blue-800">Créés</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.importStats.updated}
                  </div>
                  <div className="text-sm text-green-800">Mis à jour</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {analysisResult.importStats.skipped}
                  </div>
                  <div className="text-sm text-gray-800">Ignorés</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {analysisResult.importStats.errors}
                  </div>
                  <div className="text-sm text-red-800">Erreurs</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🎉 <strong>Félicitations !</strong> Votre profil a été mis à jour automatiquement. 
                  Vous pouvez maintenant fermer cette fenêtre et modifier les informations si nécessaire.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          {!analysisResult ? (
            <>
              <button
                onClick={handleClose}
                disabled={isAnalyzing}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                disabled={isAnalyzing || 
                  (uploadMode === 'text' && cvText.trim().length < 50) ||
                  (uploadMode === 'file' && !selectedFile)
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    {uploadMode === 'file' ? <FileUp className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    <span>Analyser le CV</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVImportModal;
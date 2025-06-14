import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Send, 
  Loader2, 
  Download,
  Eye,
  RefreshCw,
  Upload,
  File,
  X,
  User,
  Edit3,
  Save,
  Undo,
  Copy,
  Check,
  Brain,
  Lightbulb,
  MessageSquare,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette
} from 'lucide-react';
import { generateCoverLetter, extractCVData, downloadPDF } from '../../../services/api';

const CoverLetterGenerator = ({ initialData }) => {
  const [formData, setFormData] = useState({
    jobDescription: '',
    aiInstructions: '',
    companyName: '',
    position: ''
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [editableLetter, setEditableLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInstructionsHelp, setShowInstructionsHelp] = useState(false);
  
  // États pour l'éditeur riche
  const [isRichEditor, setIsRichEditor] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [textAlign, setTextAlign] = useState('left');
  const [fontSize, setFontSize] = useState('14');
  const [textColor, setTextColor] = useState('#374151');
  
  const editorRef = useRef(null);

  // Instructions prédéfinies pour aider l'utilisateur
  const instructionExamples = [
    "Mets l'accent sur mes compétences techniques en React et Node.js",
    "Adopte un ton professionnel mais chaleureux",
    "Évite les formules trop classiques, sois créatif",
    "Insiste sur ma capacité d'adaptation et mon travail d'équipe",
    "Mentionne ma passion pour l'innovation technologique",
    "Reste concis, maximum 300 mots",
    "Termine par une phrase qui marque l'esprit",
    "Utilise un vocabulaire technique approprié"
  ];

  // Traiter les données initiales du JobAnalyzer
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        jobDescription: initialData.jobDescription || '',
        companyName: initialData.companyName || '',
        position: initialData.position || ''
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleLetterEdit = (e) => {
    setEditableLetter(e.target.value);
    setHasUnsavedChanges(e.target.value !== generatedLetter);
  };

  const handleRichEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditableLetter(content);
      setHasUnsavedChanges(content !== generatedLetter);
    }
  };

  // Fonctions de formatage de texte
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleRichEditorChange();
  };

  const handleBold = () => execCommand('bold');
  const handleItalic = () => execCommand('italic');
  const handleUnderline = () => execCommand('underline');

  const handleTextAlign = (alignment) => {
    setTextAlign(alignment);
    execCommand(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
  };

  const handleFontSize = (size) => {
    setFontSize(size);
    execCommand('fontSize', '3');
    // Appliquer la taille personnalisée
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const span = document.createElement('span');
          span.style.fontSize = `${size}px`;
          try {
            range.surroundContents(span);
          } catch (e) {
            span.appendChild(range.extractContents());
            range.insertNode(span);
          }
        }
      }
    }
  };

  const handleTextColor = (color) => {
    setTextColor(color);
    execCommand('foreColor', color);
  };

  const getSelectedText = () => {
    const selection = window.getSelection();
    return selection.toString();
  };

  const addInstructionExample = (instruction) => {
    const currentInstructions = formData.aiInstructions;
    const newInstructions = currentInstructions 
      ? `${currentInstructions}\n• ${instruction}`
      : `• ${instruction}`;
    
    setFormData(prev => ({
      ...prev,
      aiInstructions: newInstructions
    }));
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Seuls les fichiers PDF et Word sont acceptés');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier ne doit pas dépasser 5MB');
      return;
    }

    setCvFile(file);
    setCvLoading(true);
    setError('');

    try {
      const cvData = await extractCVData(file);
      setExtractedProfile(cvData.profile);
      
      const autoInstructions = `Voici mes informations de profil extraites de mon CV :
${cvData.profile.substring(0, 300)}...

Instructions pour la lettre :
• Utilise ces informations pour personnaliser la lettre
• Mets en avant mes compétences les plus pertinentes pour le poste
• Adopte un ton professionnel et confiant`;

      setFormData(prev => ({
        ...prev,
        aiInstructions: autoInstructions
      }));
      
      setSuccess('CV analysé avec succès ! Instructions générées automatiquement.');
    } catch (err) {
      setError('Erreur lors de l\'extraction des données du CV');
      setCvFile(null);
    } finally {
      setCvLoading(false);
    }
  };

  const removeCVFile = () => {
    setCvFile(null);
    setExtractedProfile('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!formData.jobDescription.trim() || !formData.aiInstructions.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await generateCoverLetter(
        formData.jobDescription, 
        formData.aiInstructions,
        {
          companyName: formData.companyName,
          position: formData.position
        }
      );
      setGeneratedLetter(response.letter);
      setEditableLetter(response.letter);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setSuccess('Lettre de motivation générée selon vos instructions !');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = () => {
    setGeneratedLetter(editableLetter);
    setHasUnsavedChanges(false);
    setSuccess('Modifications sauvegardées !');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleCancelEdit = () => {
    setEditableLetter(generatedLetter);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setIsRichEditor(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      const textToCopy = isRichEditor 
        ? editorRef.current?.innerText || editableLetter
        : editableLetter;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Erreur lors de la copie');
    }
  };

  const handleDownloadPDF = async () => {
    if (!editableLetter) return;
    
    try {
      const textToDownload = isRichEditor 
        ? editorRef.current?.innerText || editableLetter
        : editableLetter;
      await downloadPDF(textToDownload, `lettre-motivation-${formData.companyName || 'entreprise'}.txt`);
      setSuccess('Téléchargement en cours...');
    } catch (error) {
      setError('Erreur lors du téléchargement');
    }
  };

  const handleReset = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment réinitialiser ?')) {
        return;
      }
    }
    
    setFormData({
      jobDescription: '',
      aiInstructions: '',
      companyName: '',
      position: ''
    });
    setGeneratedLetter('');
    setEditableLetter('');
    setCvFile(null);
    setExtractedProfile('');
    setError('');
    setSuccess('');
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setIsRichEditor(false);
  };

  const handleRegenerateWithUpdatedInstructions = async () => {
    if (!formData.jobDescription.trim() || !formData.aiInstructions.trim()) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await generateCoverLetter(
        formData.jobDescription, 
        formData.aiInstructions,
        {
          companyName: formData.companyName,
          position: formData.position
        }
      );
      setGeneratedLetter(response.letter);
      setEditableLetter(response.letter);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setSuccess('Lettre régénérée avec vos nouvelles instructions !');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditorMode = () => {
    if (isRichEditor) {
      // Passer en mode texte simple
      const textContent = editorRef.current?.innerText || editableLetter;
      setEditableLetter(textContent);
      setIsRichEditor(false);
    } else {
      // Passer en mode éditeur riche
      setIsRichEditor(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Générateur de lettres</h1>
          <p className="text-gray-600 mt-1">Créez des lettres de motivation personnalisées avec l'IA</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Réinitialiser
        </button>
      </div>

      {/* Messages de statut */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Informations requises
          </h2>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Google, Microsoft..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poste visé
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Développeur Full-Stack"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Collez ici la description complète du poste..."
                required
              />
            </div>
            
            {/* Section CV Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Importez votre CV (optionnel)
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  PDF, DOC, DOCX - Max 5MB - Génère automatiquement des instructions
                </p>
                
                {!cvFile ? (
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                    <File className="h-4 w-4 mr-2" />
                    Choisir un fichier
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    {cvLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">Analyse du CV...</span>
                      </div>
                    ) : (
                      <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-md">
                        <File className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{cvFile.name}</span>
                        <button
                          type="button"
                          onClick={removeCVFile}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Instructions pour l'IA */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Brain className="h-4 w-4 mr-1 text-purple-600" />
                  Instructions pour l'IA *
                </label>
                <button
                  type="button"
                  onClick={() => setShowInstructionsHelp(!showInstructionsHelp)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {showInstructionsHelp ? 'Masquer' : 'Aide'}
                </button>
              </div>

              {/* Aide pour les instructions */}
              {showInstructionsHelp && (
                <div className="mb-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <h4 className="text-sm font-medium text-purple-800 mb-2">Exemples d'instructions :</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {instructionExamples.map((instruction, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addInstructionExample(instruction)}
                        className="text-left text-xs text-purple-700 hover:text-purple-900 hover:bg-purple-100 p-1 rounded transition-colors"
                      >
                        + {instruction}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                name="aiInstructions"
                value={formData.aiInstructions}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="8"
                placeholder="Donnez des instructions spécifiques à l'IA pour personnaliser votre lettre :

Exemples :
• Mets l'accent sur mes 3 ans d'expérience en React
• Adopte un ton dynamique et moderne
• Insiste sur ma capacité d'adaptation
• Évite les formules trop classiques
• Termine par une phrase marquante
• Reste concis, maximum 250 mots"
                required
              />
              
              {extractedProfile && (
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  Instructions générées automatiquement depuis votre CV
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || cvLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Génération...' : 'Générer la lettre'}
              </button>

              {generatedLetter && (
                <button
                  type="button"
                  onClick={handleRegenerateWithUpdatedInstructions}
                  disabled={loading || cvLoading}
                  className="bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Aperçu et éditeur */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              {isEditing ? (
                <Edit3 className="h-6 w-6 mr-2 text-orange-600" />
              ) : (
                <Eye className="h-6 w-6 mr-2 text-green-600" />
              )}
              {isEditing ? 'Édition de la lettre' : 'Aperçu de la lettre'}
              {hasUnsavedChanges && (
                <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </h2>
            
            {generatedLetter && (
              <div className="flex items-center space-x-2">
                {/* Bouton copier */}
                <button 
                  onClick={handleCopyToClipboard}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? 'Copié !' : 'Copier'}
                </button>

                {/* Bouton mode éditeur */}
                {isEditing && (
                  <button 
                    onClick={toggleEditorMode}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
                      isRichEditor 
                        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Type className="h-4 w-4 mr-1" />
                    {isRichEditor ? 'Simple' : 'Riche'}
                  </button>
                )}

                {/* Bouton éditer/visualiser */}
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
                    isEditing 
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? (
                    <Eye className="h-4 w-4 mr-1" />
                  ) : (
                    <Edit3 className="h-4 w-4 mr-1" />
                  )}
                  {isEditing ? 'Aperçu' : 'Éditer'}
                </button>

                {/* Bouton télécharger */}
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </button>
              </div>
            )}
          </div>

          {/* Barre d'outils de formatage */}
          {isEditing && isRichEditor && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex flex-wrap items-center gap-2">
                {/* Formatage de texte */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button
                    onClick={handleBold}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Gras"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleItalic}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Italique"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleUnderline}
                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                    title="Souligné"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                </div>

                {/* Alignement */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button
                    onClick={() => handleTextAlign('left')}
                    className={`p-2 hover:bg-gray-200 rounded transition-colors ${textAlign === 'left' ? 'bg-blue-100' : ''}`}
                    title="Aligner à gauche"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleTextAlign('center')}
                    className={`p-2 hover:bg-gray-200 rounded transition-colors ${textAlign === 'center' ? 'bg-blue-100' : ''}`}
                    title="Centrer"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleTextAlign('right')}
                    className={`p-2 hover:bg-gray-200 rounded transition-colors ${textAlign === 'right' ? 'bg-blue-100' : ''}`}
                    title="Aligner à droite"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Taille de police */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <select
                    value={fontSize}
                    onChange={(e) => handleFontSize(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    title="Taille de police"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                    <option value="24">24px</option>
                  </select>
                </div>

                {/* Couleur de texte */}
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => handleTextColor(e.target.value)}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                    title="Couleur du texte"
                  />
                  <Palette className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          )}

          {/* Actions d'édition */}
          {isEditing && hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-orange-700 text-sm">Vous avez des modifications non sauvegardées</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                  >
                    <Undo className="h-3 w-3 mr-1" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {generatedLetter ? (
            <div className="border border-gray-200 rounded-md bg-gray-50">
              {isEditing ? (
                isRichEditor ? (
                  // Éditeur riche
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleRichEditorChange}
                    className="w-full p-4 bg-white border-0 rounded-md focus:ring-2 focus:ring-orange-500 min-h-[400px] text-sm leading-relaxed outline-none"
                    style={{ fontSize: `${fontSize}px`, color: textColor, textAlign }}
                    dangerouslySetInnerHTML={{ __html: editableLetter }}
                  />
                ) : (
                  // Éditeur simple
                  <textarea
                    value={editableLetter}
                    onChange={handleLetterEdit}
                    className="w-full p-4 bg-white border-0 rounded-md focus:ring-2 focus:ring-orange-500 font-mono text-sm leading-relaxed resize-none"
                    rows="20"
                    placeholder="Modifiez votre lettre de motivation..."
                  />
                )
              ) : (
                // Mode aperçu
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: editableLetter.replace(/\n/g, '<br>') 
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">La lettre générée selon vos instructions apparaîtra ici</p>
              <p className="text-gray-400 text-sm mt-2">Vous pourrez ensuite l'éditer avec des outils de formatage</p>
            </div>
          )}

          {/* Statistiques de la lettre */}
          {editableLetter && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between text-sm text-blue-700">
                <span>Mots: {(isRichEditor ? editorRef.current?.innerText || editableLetter : editableLetter).split(/\s+/).length}</span>
                <span>Caractères: {(isRichEditor ? editorRef.current?.innerText || editableLetter : editableLetter).length}</span>
                <span>Mode: {isRichEditor ? 'Éditeur riche' : isEditing ? 'Texte simple' : 'Aperçu'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
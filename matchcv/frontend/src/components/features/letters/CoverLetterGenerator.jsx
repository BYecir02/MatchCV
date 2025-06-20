import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Send, Loader2, Download, Eye, Edit3, RefreshCw,
  Copy, Check, Maximize2, Minimize2, Save, Undo, Printer,
  MessageSquare, Settings,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link, Type, Palette, RotateCcw
} from 'lucide-react';

// Services API existants
import JobsService from '../../../services/api/jobs.js';

const CoverLetterGenerator = ({ initialData }) => {
  // States principaux
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
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructionsHelp, setShowInstructionsHelp] = useState(false);

  // States pour la toolbar
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  
  // Ref pour l'éditeur
  const editorRef = useRef(null);

  // Templates HTML simples
  const templates = [
    {
      name: "Professionnel",
      content: `<p>Madame, Monsieur,</p>
<p>Je me permets de vous adresser ma candidature pour le poste de <strong>[POSTE]</strong> au sein de <strong>[ENTREPRISE]</strong>.</p>
<p>Fort(e) de mes expériences, je suis convaincu(e) que mon profil correspond aux exigences de ce poste.</p>
<p>Je serais ravi(e) de vous rencontrer pour discuter de ma candidature.</p>
<p>Cordialement,<br><strong>[VOTRE NOM]</strong></p>`
    },
    {
      name: "Moderne",
      content: `<p>Bonjour,</p>
<p>Votre annonce pour le poste de <strong>[POSTE]</strong> chez <em>[ENTREPRISE]</em> a retenu mon attention.</p>
<p>Mon profil correspond parfaitement à vos attentes car :</p>
<ul>
<li><strong>[COMPÉTENCE 1]</strong></li>
<li><strong>[COMPÉTENCE 2]</strong></li>
<li><strong>[COMPÉTENCE 3]</strong></li>
</ul>
<p>J'aimerais échanger avec vous sur cette opportunité.</p>
<p>Bien à vous,<br><strong>[VOTRE NOM]</strong></p>`
    },
    {
      name: "Concis",
      content: `<p><strong>Objet :</strong> Candidature - [POSTE]</p>
<p>Madame, Monsieur,</p>
<p>Passionné(e) par [DOMAINE], je candidate pour le poste de <strong>[POSTE]</strong> chez <strong>[ENTREPRISE]</strong>.</p>
<p><strong>Mes atouts :</strong></p>
<ul>
<li>Expérience en [DOMAINE]</li>
<li>Compétences techniques solides</li>
<li>Motivation et adaptabilité</li>
</ul>
<p>Je reste à votre disposition pour un entretien.</p>
<p>Cordialement,<br><strong>[VOTRE NOM]</strong></p>`
    }
  ];

  // Instructions d'aide
  const instructionExamples = [
    {
      category: "Style",
      instructions: [
        "Adopte un ton professionnel mais chaleureux",
        "Utilise un style moderne et dynamique",
        "Reste concis, maximum 250 mots"
      ]
    },
    {
      category: "Compétences",
      instructions: [
        "Mets l'accent sur mes compétences techniques",
        "Insiste sur mon expérience en gestion d'équipe",
        "Valorise ma capacité d'adaptation"
      ]
    },
    {
      category: "Structure",
      instructions: [
        "Structure avec des paragraphes courts",
        "Utilise des listes à puces pour la lisibilité",
        "Termine par un call-to-action fort"
      ]
    }
  ];

  // Traiter les données initiales
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

  // Handlers principaux
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleLetterEdit = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditableLetter(content);
      setHasUnsavedChanges(content !== generatedLetter);
    }
  };

  // ✨ NOUVELLE FONCTION pour appliquer des styles UNIQUEMENT sur la sélection
  const applyStyleToSelection = (command, value = null) => {
    const selection = window.getSelection();
    
    if (!selection.rangeCount || selection.isCollapsed) {
      alert('Veuillez sélectionner du texte avant d\'appliquer un style');
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText.trim()) {
      alert('Veuillez sélectionner du texte avant d\'appliquer un style');
      return;
    }

    // Créer un span avec le style approprié
    let wrapper;
    
    switch (command) {
      case 'bold':
        wrapper = document.createElement('strong');
        break;
      case 'italic':
        wrapper = document.createElement('em');
        break;
      case 'underline':
        wrapper = document.createElement('u');
        break;
      case 'color':
        wrapper = document.createElement('span');
        wrapper.style.color = value;
        break;
      case 'fontSize':
        wrapper = document.createElement('span');
        wrapper.style.fontSize = value + 'px';
        break;
      case 'alignLeft':
        wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.textAlign = 'left';
        break;
      case 'alignCenter':
        wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.textAlign = 'center';
        wrapper.style.width = '100%';
        break;
      case 'alignRight':
        wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.textAlign = 'right';
        wrapper.style.width = '100%';
        break;
      default:
        return;
    }

    try {
      // Entourer la sélection avec l'élément de style
      range.surroundContents(wrapper);
      
      // Nettoyer la sélection
      selection.removeAllRanges();
      
      // Déclencher la mise à jour
      handleLetterEdit();
      
      // Remettre le focus sur l'éditeur
      editorRef.current?.focus();
      
    } catch (error) {
      // Si surroundContents échoue (sélection complexe), utiliser une approche alternative
      const fragment = range.extractContents();
      wrapper.appendChild(fragment);
      range.insertNode(wrapper);
      
      selection.removeAllRanges();
      handleLetterEdit();
      editorRef.current?.focus();
    }
  };

  // Handlers pour la toolbar améliorés
  const execCommand = (command, value = null) => {
    // Pour les commandes qui doivent s'appliquer sur sélection uniquement
    if (['bold', 'italic', 'underline'].includes(command)) {
      applyStyleToSelection(command, value);
    } else {
      // Pour les autres commandes (listes, liens, etc.)
      document.execCommand(command, false, value);
      handleLetterEdit();
      editorRef.current?.focus();
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    applyStyleToSelection('fontSize', size);
  };

  const handleAlignChange = (align) => {
    applyStyleToSelection('align' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  const handleColorChange = (color) => {
    setTextColor(color);
    applyStyleToSelection('color', color);
  };

  const insertLink = () => {
    const selection = window.getSelection();
    
    if (!selection.rangeCount || selection.isCollapsed) {
      alert('Veuillez sélectionner du texte avant d\'insérer un lien');
      return;
    }

    const url = prompt('Entrez l\'URL du lien :');
    if (url) {
      document.execCommand('createLink', false, url);
      handleLetterEdit();
      editorRef.current?.focus();
    }
  };

  // Fonction pour supprimer le formatage de la sélection
  const removeFormatting = () => {
    const selection = window.getSelection();
    
    if (!selection.rangeCount || selection.isCollapsed) {
      alert('Veuillez sélectionner du texte avant de supprimer le formatage');
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText.trim()) {
      alert('Veuillez sélectionner du texte avant de supprimer le formatage');
      return;
    }

    // Remplacer le contenu sélectionné par du texte brut
    const textNode = document.createTextNode(selectedText);
    range.deleteContents();
    range.insertNode(textNode);
    
    selection.removeAllRanges();
    handleLetterEdit();
    editorRef.current?.focus();
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.jobDescription.trim() || !formData.aiInstructions.trim()) {
    setError('Veuillez remplir tous les champs obligatoires');
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await JobsService.generateCoverLetter({
      jobDescription: formData.jobDescription,
      aiInstructions: formData.aiInstructions,
      companyName: formData.companyName,
      position: formData.position
    });

    // Convertir le texte brut en HTML avec paragraphes
    const htmlContent = response.letter
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');

    setGeneratedLetter(htmlContent);
    setEditableLetter(htmlContent);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setSuccess('Lettre de motivation générée avec succès !');

    // 🔥 Sauvegarde dans CoverLetter
    await JobsService.saveCoverLetterV2({
      jobTitle: formData.position,
      companyName: formData.companyName,
      jobDescription: formData.jobDescription,
      letterContent: htmlContent,
      aiInstructions: formData.aiInstructions
    });

  } catch (err) {
    setError(err.message || 'Erreur lors de la génération');
  } finally {
    setLoading(false);
  }
};

  const applyTemplate = (template) => {
    let content = template.content;
    content = content.replace(/\[ENTREPRISE\]/g, formData.companyName || '[ENTREPRISE]');
    content = content.replace(/\[POSTE\]/g, formData.position || '[POSTE]');
    
    setEditableLetter(content);
    setGeneratedLetter(content);
    setIsEditing(true);
    setHasUnsavedChanges(false);
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

  const handleSaveChanges = () => {
    setGeneratedLetter(editableLetter);
    setHasUnsavedChanges(false);
    setSuccess('Modifications sauvegardées !');
  };

  const handleCancelEdit = () => {
    setEditableLetter(generatedLetter);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = generatedLetter;
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      // Copier le texte sans HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editableLetter;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Erreur lors de la copie');
    }
  };

  const handleReset = () => {
    if (hasUnsavedChanges && !window.confirm('Modifications non sauvegardées. Continuer ?')) {
      return;
    }
    
    setFormData({
      jobDescription: '',
      aiInstructions: '',
      companyName: '',
      position: ''
    });
    setGeneratedLetter('');
    setEditableLetter('');
    setError('');
    setSuccess('');
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setIsFullscreen(false);
  };

  // Calcul des statistiques
  const getTextFromHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const textContent = getTextFromHtml(editableLetter);
  const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = textContent.length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6 overflow-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Générateur de lettres</h1>
          <p className="text-gray-600 mt-1">Créez des lettres de motivation personnalisées avec l'IA</p>
        </div>
        <div className="flex items-center space-x-2">
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Minimize2 className="h-5 w-5 mr-2" />
              Réduire
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Messages */}
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

      <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Formulaire */}
        {(!isFullscreen || !isEditing) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Informations requises
            </h2>
            
            {/* Templates */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Templates rapides</h3>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => applyTemplate(template)}
                    className="text-left p-3 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors text-sm"
                    type="button"
                  >
                    <div className="font-medium text-purple-800">{template.name}</div>
                    <div className="text-purple-600 text-xs mt-1">
                      Template formaté prêt à l'emploi
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              {/* Instructions avec aide */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center">
                    <Settings className="h-4 w-4 mr-1 text-purple-600" />
                    Instructions pour l'IA *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInstructionsHelp(!showInstructionsHelp)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {showInstructionsHelp ? 'Masquer' : 'Aide'}
                  </button>
                </div>

                {showInstructionsHelp && (
                  <div className="mb-3 p-4 bg-purple-50 border border-purple-200 rounded-md">
                    <h4 className="text-sm font-medium text-purple-800 mb-3">
                      Exemples d'instructions par catégorie :
                    </h4>
                    <div className="space-y-3">
                      {instructionExamples.map((category, catIndex) => (
                        <div key={catIndex}>
                          <h5 className="text-xs font-semibold text-purple-700 mb-1">
                            {category.category}
                          </h5>
                          <div className="grid grid-cols-1 gap-1">
                            {category.instructions.map((instruction, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addInstructionExample(instruction)}
                                className="text-left text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-100 p-1 rounded transition-colors"
                              >
                                + {instruction}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <textarea
                  name="aiInstructions"
                  value={formData.aiInstructions}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows="6"
                  placeholder="Instructions spécifiques à l'IA pour personnaliser votre lettre..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {loading ? 'Génération...' : 'Générer la lettre'}
              </button>
            </form>
          </div>
        )}

        {/* Éditeur WYSIWYG amélioré */}
        <div className={`bg-white rounded-lg shadow-md p-6 ${isFullscreen ? 'min-h-screen' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              {isEditing ? (
                <Edit3 className="h-6 w-6 mr-2 text-orange-600" />
              ) : (
                <Eye className="h-6 w-6 mr-2 text-green-600" />
              )}
              {isEditing ? 'Édition WYSIWYG' : 'Aperçu'}
              {hasUnsavedChanges && (
                <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full" title="Modifications non sauvegardées"></span>
              )}
            </h2>
            
            {generatedLetter && (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>

                <button 
                  onClick={handleCopyToClipboard}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>

                <button 
                  onClick={() => window.print()}
                  className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
                >
                  <Printer className="h-4 w-4" />
                </button>

                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
                    isEditing 
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {isEditing ? <Eye className="h-4 w-4 mr-1" /> : <Edit3 className="h-4 w-4 mr-1" />}
                  {isEditing ? 'Aperçu' : 'Éditer'}
                </button>

                <button 
                  onClick={() => {/* TODO: Implement download */}}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </button>
              </div>
            )}
          </div>

          {/* TOOLBAR améliorée - Styles sur sélection uniquement */}
          {isEditing && generatedLetter && (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="mb-2 text-xs text-gray-600 italic">
                💡 Sélectionnez du texte avant d'appliquer les styles
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Formatage de texte */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button 
                    onClick={() => execCommand('bold')} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Gras - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => execCommand('italic')} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Italique - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => execCommand('underline')} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Souligné - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <Underline className="h-4 w-4" />
                  </button>
                </div>

                {/* Alignement */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button
                    onClick={() => handleAlignChange('left')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none"
                    title="Aligner à gauche - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAlignChange('center')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none"
                    title="Centrer - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAlignChange('right')}
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none"
                    title="Aligner à droite - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <AlignRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Listes */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button 
                    onClick={() => execCommand('insertUnorderedList')} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Liste à puces"
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => execCommand('insertOrderedList')} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Liste numérotée"
                    type="button"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </button>
                </div>

                {/* Autres outils */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button 
                    onClick={insertLink} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Insérer un lien - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <Link className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={removeFormatting} 
                    className="p-2 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:bg-gray-200" 
                    title="Supprimer le formatage - Sélectionnez du texte d'abord"
                    type="button"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                {/* Taille et couleur */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Type className="h-4 w-4 text-gray-500" />
                    <select
                      value={fontSize}
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="Taille de police - Sélectionnez du texte d'abord"
                    >
                      <option value="12">12px</option>
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
                      title="Couleur du texte - Sélectionnez du texte d'abord"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions d'édition */}
          {isEditing && hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                  <p className="text-orange-700 text-sm">Modifications non sauvegardées</p>
                </div>
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
            <div className="border border-gray-200 rounded-md">
              {isEditing ? (
                <div 
                  ref={editorRef}
                  contentEditable={true}
                  onInput={handleLetterEdit}
                  className="w-full p-6 bg-white border-0 rounded-md focus:ring-2 focus:ring-orange-500 outline-none min-h-[400px]"
                  style={{ 
                    fontSize: `16px`,
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ __html: editableLetter }}
                />
              ) : (
                <div className="p-6 bg-gray-50 rounded-md">
                  <div 
                    className="leading-relaxed text-gray-700"
                    style={{ 
                      fontSize: `16px`,
                      lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ __html: editableLetter }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">La lettre apparaîtra ici après génération</p>
              <p className="text-gray-400 text-sm mt-2">
                Utilisez les templates pour commencer rapidement
              </p>
            </div>
          )}

          {/* Statistiques */}
          {editableLetter && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-md text-center">
                <div className="text-lg font-bold text-blue-700">{wordCount}</div>
                <div className="text-xs text-blue-600">Mots</div>
              </div>
              <div className="p-3 bg-green-50 rounded-md text-center">
                <div className="text-lg font-bold text-green-700">{charCount}</div>
                <div className="text-xs text-green-600">Caractères</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-md text-center">
                <div className="text-lg font-bold text-purple-700">{readingTime}</div>
                <div className="text-xs text-purple-600">Min. lecture</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
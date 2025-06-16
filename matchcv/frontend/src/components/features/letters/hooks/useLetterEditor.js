import { useState, useRef, useEffect } from 'react';
import { calculateTextStats, convertTextToHTML, convertHTMLToText } from '../utils/textUtils';

export const useLetterEditor = (initialLetter = '') => {
  const [editableLetter, setEditableLetter] = useState(initialLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRichEditor, setIsRichEditor] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [fontSize, setFontSize] = useState('14');
  const [textColor, setTextColor] = useState('#374151');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [originalLetter, setOriginalLetter] = useState(initialLetter);
  
  const editorRef = useRef(null);

  // Calcul des statistiques
  useEffect(() => {
    const text = isRichEditor 
      ? editorRef.current?.innerText || convertHTMLToText(editableLetter)
      : editableLetter;
    
    const stats = calculateTextStats(text);
    setWordCount(stats.wordCount);
    setCharCount(stats.charCount);
    setReadingTime(stats.readingTime);
  }, [editableLetter, isRichEditor]);

  // Gestion des modifications
  const handleLetterEdit = (value) => {
    setEditableLetter(value);
    setHasUnsavedChanges(value !== originalLetter);
  };

  const handleRichEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setEditableLetter(content);
      setHasUnsavedChanges(content !== originalLetter);
    }
  };

  // Basculer entre les modes d'édition
  const toggleEditorMode = () => {
    if (isRichEditor) {
      // Passage du mode riche au mode simple
      const textContent = convertHTMLToText(editableLetter);
      setEditableLetter(textContent);
      setIsRichEditor(false);
    } else {
      // Passage du mode simple au mode riche
      const htmlContent = convertTextToHTML(editableLetter);
      setEditableLetter(htmlContent);
      setIsRichEditor(true);
      
      // Attendre que le DOM soit mis à jour
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
          editorRef.current.style.fontSize = `${fontSize}px`;
          editorRef.current.style.color = textColor;
          editorRef.current.style.textAlign = textAlign;
        }
      }, 0);
    }
  };

  // Sauvegarder les modifications
  const saveChanges = () => {
    const contentToSave = isRichEditor 
      ? convertHTMLToText(editableLetter)
      : editableLetter;
    
    setOriginalLetter(contentToSave);
    setEditableLetter(contentToSave);
    setHasUnsavedChanges(false);
    return contentToSave;
  };

  // Annuler les modifications
  const cancelChanges = () => {
    setEditableLetter(originalLetter);
    setHasUnsavedChanges(false);
    setIsRichEditor(false);
  };

  // Réinitialiser l'éditeur
  const resetEditor = () => {
    setEditableLetter('');
    setOriginalLetter('');
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setIsRichEditor(false);
  };

  // Définir une nouvelle lettre
  const setLetter = (letter) => {
    setEditableLetter(letter);
    setOriginalLetter(letter);
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setIsRichEditor(false);
  };

  return {
    // États
    editableLetter,
    isEditing,
    hasUnsavedChanges,
    isRichEditor,
    textAlign,
    fontSize,
    textColor,
    wordCount,
    charCount,
    readingTime,
    editorRef,
    
    // Setters
    setEditableLetter,
    setIsEditing,
    setTextAlign,
    setFontSize,
    setTextColor,
    
    // Actions
    handleLetterEdit,
    handleRichEditorChange,
    toggleEditorMode,
    saveChanges,
    cancelChanges,
    resetEditor,
    setLetter
  };
};
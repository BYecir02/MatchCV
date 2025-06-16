import { useCallback } from 'react';

export const useLetterFormatting = (editorRef) => {
  // Exécuter une commande d'édition
  const execCommand = useCallback((command, value = null) => {
    if (document.execCommand) {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    }
  }, [editorRef]);

  // Formatage de texte
  const formatBold = useCallback(() => execCommand('bold'), [execCommand]);
  const formatItalic = useCallback(() => execCommand('italic'), [execCommand]);
  const formatUnderline = useCallback(() => execCommand('underline'), [execCommand]);

  // Listes
  const insertList = useCallback((ordered = false) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList');
  }, [execCommand]);

  // Alignement
  const alignText = useCallback((alignment) => {
    const alignmentMap = {
      left: 'justifyLeft',
      center: 'justifyCenter',
      right: 'justifyRight',
      justify: 'justifyFull'
    };
    
    if (alignmentMap[alignment]) {
      execCommand(alignmentMap[alignment]);
    }
  }, [execCommand]);

  // Liens
  const insertLink = useCallback(() => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Supprimer le formatage
  const removeFormat = useCallback(() => {
    execCommand('removeFormat');
  }, [execCommand]);

  // Appliquer des styles personnalisés
  const applyStyle = useCallback((property, value) => {
    if (editorRef.current) {
      editorRef.current.style[property] = value;
    }
  }, [editorRef]);

  // Changer la taille de police
  const changeFontSize = useCallback((size) => {
    applyStyle('fontSize', `${size}px`);
  }, [applyStyle]);

  // Changer la couleur du texte
  const changeTextColor = useCallback((color) => {
    applyStyle('color', color);
  }, [applyStyle]);

  // Changer l'alignement
  const changeAlignment = useCallback((alignment) => {
    applyStyle('textAlign', alignment);
    alignText(alignment);
  }, [applyStyle, alignText]);

  return {
    // Formatage de base
    formatBold,
    formatItalic,
    formatUnderline,
    
    // Listes
    insertList,
    
    // Alignement
    alignText,
    changeAlignment,
    
    // Liens
    insertLink,
    
    // Nettoyage
    removeFormat,
    
    // Styles personnalisés
    changeFontSize,
    changeTextColor,
    applyStyle
  };
};
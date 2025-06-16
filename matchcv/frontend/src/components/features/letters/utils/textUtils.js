/**
 * Convertit le texte simple en HTML formaté
 */
export const convertTextToHTML = (text) => {
  if (!text) return '';
  
  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  let htmlContent = escapeHtml(text);
  
  // Remplacer les doubles retours à la ligne par des paragraphes
  htmlContent = htmlContent.split('\n\n').map(paragraph => {
    if (paragraph.trim()) {
      return `<p style="margin-bottom: 16px; line-height: 1.6;">${paragraph.replace(/\n/g, '<br>')}</p>`;
    }
    return '';
  }).join('');

  // Si pas de paragraphes détectés, utiliser les simples retours à la ligne
  if (!htmlContent.includes('<p>')) {
    htmlContent = escapeHtml(text).replace(/\n/g, '<br>');
    htmlContent = `<div style="line-height: 1.6;">${htmlContent}</div>`;
  }

  return htmlContent;
};

/**
 * Convertit le HTML en texte simple propre
 */
export const convertHTMLToText = (html) => {
  if (!html) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  let text = tempDiv.innerText || tempDiv.textContent || '';
  
  // Normaliser les espaces et retours à la ligne
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.replace(/^\s+|\s+$/g, '');
  
  return text;
};

/**
 * Calcule les statistiques du texte
 */
export const calculateTextStats = (text) => {
  if (!text) return { wordCount: 0, charCount: 0, readingTime: 0 };
  
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const charCount = text.length;
  const readingTime = Math.ceil(wordCount / 200); // 200 mots par minute
  
  return { wordCount, charCount, readingTime };
};

/**
 * Recherche et remplace du texte
 */
export const findAndReplace = (text, findText, replaceText) => {
  if (!findText) return text;
  
  const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return text.replace(regex, replaceText || '');
};
/**
 * Applique un template à une lettre
 */
export const applyTemplate = (template, formData) => {
  let content = template.content;
  
  // Remplacer les placeholders
  const replacements = {
    '[ENTREPRISE]': formData.companyName || '[ENTREPRISE]',
    '[POSTE]': formData.position || '[POSTE]',
    '[VOTRE NOM]': '[VOTRE NOM]',
    '[DOMAINE]': '[DOMAINE]',
    '[VOTRE PROFIL]': '[VOTRE PROFIL]'
  };
  
  Object.entries(replacements).forEach(([placeholder, value]) => {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return content;
};

/**
 * Valide les données du formulaire
 */
export const validateFormData = (formData) => {
  const errors = [];
  
  if (!formData.jobDescription?.trim()) {
    errors.push('La description du poste est obligatoire');
  }
  
  if (!formData.aiInstructions?.trim()) {
    errors.push('Les instructions pour l\'IA sont obligatoires');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Génère le nom du fichier pour le téléchargement
 */
export const generateFileName = (companyName, position) => {
  const company = companyName ? companyName.replace(/[^a-zA-Z0-9]/g, '-') : 'entreprise';
  const pos = position ? position.replace(/[^a-zA-Z0-9]/g, '-') : 'poste';
  const date = new Date().toISOString().split('T')[0];
  
  return `lettre-motivation-${company}-${pos}-${date}`;
};
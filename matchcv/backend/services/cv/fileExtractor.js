const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const fileExtractor = {
  /**
   * Extrait le texte d'un fichier PDF ou DOCX
   * @param {string} filePath - Chemin vers le fichier
   * @param {string} fileType - Extension du fichier (.pdf, .docx)
   * @returns {Promise<string>} - Texte extrait
   */
  async extractTextFromFile(filePath, fileType) {
    try {
      console.log(`🔍 Extraction texte depuis: ${path.basename(filePath)} (${fileType})`);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Fichier introuvable');
      }

      const fileBuffer = fs.readFileSync(filePath);
      
      if (fileType === '.pdf') {
        console.log('📄 Traitement PDF...');
        const data = await pdfParse(fileBuffer);
        console.log(`✅ PDF traité: ${data.text.length} caractères extraits`);
        return data.text;
        
      } else if (fileType === '.docx') {
        console.log('📝 Traitement DOCX...');
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        console.log(`✅ DOCX traité: ${result.value.length} caractères extraits`);
        return result.value;
        
      } else if (fileType === '.doc') {
        console.log('📝 Traitement DOC...');
        // Pour les fichiers .doc, on utilise aussi mammoth
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        console.log(`✅ DOC traité: ${result.value.length} caractères extraits`);
        return result.value;
        
      } else {
        throw new Error(`Format de fichier non supporté: ${fileType}`);
      }
      
    } catch (error) {
      console.error('❌ Erreur extraction texte:', error);
      
      if (error.message.includes('Invalid PDF')) {
        throw new Error('Le fichier PDF semble corrompu ou protégé par mot de passe');
      } else if (error.message.includes('Invalid DOCX')) {
        throw new Error('Le fichier DOCX semble corrompu ou dans un format non supporté');
      } else {
        throw new Error(`Erreur lors de l'extraction du texte: ${error.message}`);
      }
    }
  },

  /**
   * Nettoie le texte extrait
   * @param {string} text - Texte brut extrait
   * @returns {string} - Texte nettoyé
   */
  cleanExtractedText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Supprimer les caractères de contrôle
    let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normaliser les espaces multiples
    cleaned = cleaned.replace(/\s+/g, ' ');
    
    // Supprimer les lignes vides multiples
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Nettoyer les espaces en début/fin
    cleaned = cleaned.trim();
    
    console.log(`🧹 Texte nettoyé: ${cleaned.length} caractères`);
    return cleaned;
  },

  /**
   * Valide le contenu extrait
   * @param {string} text - Texte à valider
   * @returns {boolean} - True si valide
   */
  validateExtractedContent(text) {
    if (!text || text.length < 50) {
      throw new Error('Le contenu extrait est trop court. Vérifiez que le fichier contient bien du texte.');
    }
    
    // Vérifier qu'il y a du contenu lisible (pas seulement des espaces/caractères spéciaux)
    const readableContent = text.replace(/[^\w\s]/g, '').trim();
    if (readableContent.length < 30) {
      throw new Error('Le fichier ne semble pas contenir de texte lisible.');
    }
    
    return true;
  }
};

module.exports = fileExtractor; 
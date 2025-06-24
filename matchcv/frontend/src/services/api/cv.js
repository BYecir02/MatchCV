import BaseApiService from './base.js';

class CVService extends BaseApiService {
  // Sauvegarder un CV
  async saveCV(cvData) {
    console.log('🔍 CVService.saveCV appelé avec:', cvData);
    console.log('🔑 Token présent:', !!localStorage.getItem('authToken'));
    
    try {
      const result = await this.request('/cv/save', {
        method: 'POST',
        body: JSON.stringify(cvData),
      });
      
      console.log('✅ CVService.saveCV résultat:', result);
      return result;
    } catch (error) {
      console.error('❌ CVService.saveCV erreur:', error);
      throw error;
    }
  }

  // Récupérer mes CVs
  async getMyCVs() {
    return this.request('/cv/my-cvs');
  }

  // Récupérer un CV spécifique
  async getCV(cvId) {
    return this.request(`/cv/${cvId}`);
  }

  // Supprimer un CV
  async deleteCV(cvId) {
    return this.request(`/cv/${cvId}`, {
      method: 'DELETE',
    });
  }

  // Mettre à jour un CV
  async updateCV(cvId, cvData) {
    return this.request(`/cv/${cvId}`, {
      method: 'PUT',
      body: JSON.stringify(cvData),
    });
  }

  // Extraction de données CV
  async extractCVData(file) {
    const formData = new FormData();
    formData.append('cv', file);
    
    return this.request('/cv/extract', {
      method: 'POST',
      body: formData,
      headers: {}, // Retirer Content-Type pour FormData
    });
  }

  // Exporter un CV en PDF - VERSION SIMPLIFIÉE avec this.request()
  async exportCVToPDF(cvId, options = {}) {
    try {
      // Utiliser this.request() pour la cohérence
      const response = await this.request(`/cv/${cvId}/export/pdf`, {
        method: 'POST',
        body: JSON.stringify(options),
      });

      // Si l'API retourne une URL de téléchargement
      if (response.downloadUrl) {
        const a = document.createElement('a');
        a.href = response.downloadUrl;
        a.download = `CV_${options.filename || 'export'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      return { success: true, data: response };
    } catch (error) {
      console.error('Erreur export PDF:', error);
      throw new Error('Erreur lors de l\'export PDF: ' + error.message);
    }
  }

  // Partager un CV
  async shareCV(cvId, shareOptions = {}) {
    return this.request(`/cv/${cvId}/share`, {
      method: 'POST',
      body: JSON.stringify(shareOptions),
    });
  }

  // Upload de fichier générique
  async uploadFile(file, type = 'cv') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Retirer Content-Type pour FormData
    });
  }
}

export default new CVService();
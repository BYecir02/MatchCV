import BaseApiService from './base.js';

class JobsService extends BaseApiService {
  // ✅ CORRIGÉ : Bonne URL + bon format de données
  async analyzeJob(data) {
    console.log('📤 JobsService.analyzeJob called with:', data);
    return this.request('/jobs/analyze', {  // ← URL corrigée
      method: 'POST',
      body: JSON.stringify(data),  // ← Données complètes
    });
  }

  // Récupérer l'historique des analyses
  async getJobAnalyses() {
    return this.request('/jobs/my-analyses');  // ← URL corrigée
  }

  // Générer une lettre de motivation
  async generateCoverLetter(data) {
    return this.request('/jobs/generate-cover-letter', {  // ← URL corrigée
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sauvegarder une lettre de motivation
  async saveCoverLetter(letterData) {
    return this.request('/jobs/cover-letters/save', {  // ← URL corrigée
      method: 'POST',
      body: JSON.stringify(letterData),
    });
  }

  // Récupérer mes lettres
  async getMyCoverLetters() {
    return this.request('/jobs/my-cover-letters');  // ← URL corrigée
  }
}

export default new JobsService();
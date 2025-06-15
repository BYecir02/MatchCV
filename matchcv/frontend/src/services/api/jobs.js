import BaseApiService from './base.js';

class JobsService extends BaseApiService {
  // Analyser une annonce d'emploi
  async analyzeJob(jobText) {
    return this.request('/analyze-job', {
      method: 'POST',
      body: JSON.stringify({ jobText }),
    });
  }

  // Récupérer l'historique des analyses
  async getJobAnalyses() {
    return this.request('/job-analyses');
  }

  // Générer une lettre de motivation
  async generateCoverLetter(data) {
    return this.request('/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sauvegarder une lettre de motivation
  async saveCoverLetter(letterData) {
    return this.request('/cover-letters/save', {
      method: 'POST',
      body: JSON.stringify(letterData),
    });
  }

  // Récupérer mes lettres
  async getMyCoverLetters() {
    return this.request('/cover-letters/my-letters');
  }
}

export default new JobsService();
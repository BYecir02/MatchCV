import BaseApiService from './base.js';

class JobsService extends BaseApiService {
  // Analyser une annonce
  async analyzeJob(data) {
    console.log('📤 JobsService.analyzeJob called with:', data);
    return this.request('/jobs/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Récupérer l'historique des analyses
  async getJobAnalyses() {
    return this.request('/jobs/my-analyses');
  }

  // Générer une lettre de motivation
  async generateCoverLetter(data) {
    return this.request('/jobs/generate-cover-letter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Sauvegarder une lettre de motivation (ancienne logique)
  async saveCoverLetter(letterData) {
    return this.request('/jobs/cover-letters/save', {
      method: 'POST',
      body: JSON.stringify(letterData),
    });
  }

  // Sauvegarder une lettre de motivation (nouvelle logique CoverLetter)
  async saveCoverLetterV2(data) {
    return this.request('/jobs/coverletters/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Récupérer mes lettres
  async getMyCoverLetters() {
    return this.request('/jobs/my-cover-letters');
  }

  // Compter mes lettres (nouvelle logique CoverLetter)
  async getLettersCount() {
    const res = await this.request('/jobs/cover-letters/count');
    return res.total || 0;
  }
}

export default new JobsService();
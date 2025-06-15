import BaseApiService from './base.js';

class ProfileService extends BaseApiService {
  // Récupérer le profil complet
  async getProfile() {
    return this.request('/profile');
  }

  // Mettre à jour les informations personnelles
  async updatePersonalInfo(personalInfo) {
    return this.request('/profile/personal-info', {
      method: 'PUT',
      body: JSON.stringify(personalInfo),
    });
  }

  // ========== EXPERIENCES ==========
  async addExperience(experienceData) {
    return this.request('/profile/experience', {
      method: 'POST',
      body: JSON.stringify(experienceData),
    });
  }

  async updateExperience(id, experienceData) {
    return this.request(`/profile/experience/${id}`, {
      method: 'PUT',
      body: JSON.stringify(experienceData),
    });
  }

  async deleteExperience(id) {
    return this.request(`/profile/experience/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== SECTIONS GÉNÉRALES ==========
  async addProfileSection(section, data) {
    return this.request(`/profile/${section}/add`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfileSection(section, id, data) {
    return this.request(`/profile/${section}/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProfileSection(section, id) {
    return this.request(`/profile/${section}/delete/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload d'avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.request('/user/avatar', {
      method: 'POST',
      body: formData,
      headers: {}, // Retirer Content-Type pour FormData
    });
  }
}

export default new ProfileService();
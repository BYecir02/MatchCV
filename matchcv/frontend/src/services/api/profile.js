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

    // ========== EDUCATION - MÉTHODES SPÉCIFIQUES ==========
  async addEducation(educationData) {
    console.log('📡 API Call - addEducation:', educationData);
    return this.request('/profile/education/add', {
      method: 'POST',
      body: JSON.stringify(educationData),
    });
  }

  async updateEducation(id, educationData) {
    console.log('📡 API Call - updateEducation:', { id, educationData });
    return this.request(`/profile/education/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(educationData),
    });
  }

  async deleteEducation(id) {
    console.log('📡 API Call - deleteEducation:', id);
    return this.request(`/profile/education/delete/${id}`, {
      method: 'DELETE',
    });
  }

    // ========== SKILLS - MÉTHODES SPÉCIFIQUES ==========
  async addSkill(skillData) {
    console.log('📡 API Call - addSkill:', skillData);
    return this.request('/profile/skills/add', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateSkill(id, skillData) {
    console.log('📡 API Call - updateSkill:', { id, skillData });
    return this.request(`/profile/skills/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
  }

  async deleteSkill(id) {
    console.log('📡 API Call - deleteSkill:', id);
    return this.request(`/profile/skills/delete/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ProfileService();
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

    // ========== CERTIFICATIONS - MÉTHODES SPÉCIFIQUES ==========
  async addCertification(certificationData) {
    console.log('📡 API Call - addCertification:', certificationData);
    return this.request('/profile/certifications/add', {
      method: 'POST',
      body: JSON.stringify(certificationData),
    });
  }

  async updateCertification(id, certificationData) {
    console.log('📡 API Call - updateCertification:', { id, certificationData });
    return this.request(`/profile/certifications/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(certificationData),
    });
  }

  async deleteCertification(id) {
    console.log('📡 API Call - deleteCertification:', id);
    return this.request(`/profile/certifications/delete/${id}`, {
      method: 'DELETE',
    });
  }

    // ========== LANGUAGES - MÉTHODES SPÉCIFIQUES ==========
  async addLanguage(languageData) {
    console.log('📡 API Call - addLanguage:', languageData);
    return this.request('/profile/languages/add', {
      method: 'POST',
      body: JSON.stringify(languageData),
    });
  }

  async updateLanguage(id, languageData) {
    console.log('📡 API Call - updateLanguage:', { id, languageData });
    return this.request(`/profile/languages/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(languageData),
    });
  }

  async deleteLanguage(id) {
    console.log('📡 API Call - deleteLanguage:', id);
    return this.request(`/profile/languages/delete/${id}`, {
      method: 'DELETE',
    });
  }

    // ========== PROJECTS - MÉTHODES SPÉCIFIQUES ==========
  async addProject(projectData) {
    console.log('📡 API Call - addProject:', projectData);
    return this.request('/profile/projects/add', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(id, projectData) {
    console.log('📡 API Call - updateProject:', { id, projectData });
    return this.request(`/profile/projects/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id) {
    console.log('📡 API Call - deleteProject:', id);
    return this.request(`/profile/projects/delete/${id}`, {
      method: 'DELETE',
    });
  }

    // ========== INTERESTS - MÉTHODES SPÉCIFIQUES ==========
  async addInterest(interestData) {
    console.log('📡 API Call - addInterest:', interestData);
    return this.request('/profile/interests/add', {
      method: 'POST',
      body: JSON.stringify(interestData),
    });
  }

  async updateInterest(id, interestData) {
    console.log('📡 API Call - updateInterest:', { id, interestData });
    return this.request(`/profile/interests/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(interestData),
    });
  }

  async deleteInterest(id) {
    console.log('📡 API Call - deleteInterest:', id);
    return this.request(`/profile/interests/delete/${id}`, {
      method: 'DELETE',
    });
  }

}

export default new ProfileService();
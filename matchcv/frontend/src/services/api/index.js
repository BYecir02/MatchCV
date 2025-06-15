import AuthService from './auth.js';
import ProfileService from './profile.js';
import CVService from './cv.js';
import JobsService from './jobs.js';

// Export des services
export {
  AuthService,
  ProfileService,
  CVService,
  JobsService
};

// Export par défaut pour compatibilité - VERSION CORRIGÉE
const ApiService = {
  // ========== AUTH - TOUTES LES MÉTHODES ==========
  login: AuthService.login.bind(AuthService),
  register: AuthService.register.bind(AuthService),
  logout: AuthService.logout.bind(AuthService),
  checkAuth: AuthService.checkAuth.bind(AuthService),
  isAuthenticated: AuthService.isAuthenticated.bind(AuthService),
  getCurrentUser: AuthService.getCurrentUser.bind(AuthService),
  getAuthToken: AuthService.getAuthToken.bind(AuthService),
  
  // ========== PROFILE ==========
  getProfile: ProfileService.getProfile.bind(ProfileService),
  updatePersonalInfo: ProfileService.updatePersonalInfo.bind(ProfileService),
  addExperience: ProfileService.addExperience.bind(ProfileService),
  updateExperience: ProfileService.updateExperience.bind(ProfileService),
  deleteExperience: ProfileService.deleteExperience.bind(ProfileService),
  addProfileSection: ProfileService.addProfileSection.bind(ProfileService),
  updateProfileSection: ProfileService.updateProfileSection.bind(ProfileService),
  deleteProfileSection: ProfileService.deleteProfileSection.bind(ProfileService),
  uploadAvatar: ProfileService.uploadAvatar.bind(ProfileService),
  
  // ========== CV ==========
  saveCV: CVService.saveCV.bind(CVService),
  getMyCVs: CVService.getMyCVs.bind(CVService),
  getCV: CVService.getCV.bind(CVService),
  deleteCV: CVService.deleteCV.bind(CVService),
  updateCV: CVService.updateCV.bind(CVService),
  extractCVData: CVService.extractCVData.bind(CVService),
  exportCVToPDF: CVService.exportCVToPDF.bind(CVService),
  shareCV: CVService.shareCV.bind(CVService),
  uploadFile: CVService.uploadFile.bind(CVService),
  
  // ========== JOBS ==========
  analyzeJob: JobsService.analyzeJob.bind(JobsService),
  getJobAnalyses: JobsService.getJobAnalyses.bind(JobsService),
  generateCoverLetter: JobsService.generateCoverLetter.bind(JobsService),
  saveCoverLetter: JobsService.saveCoverLetter.bind(JobsService),
  getMyCoverLetters: JobsService.getMyCoverLetters.bind(JobsService),

  // ⭐ AJOUTER : Education
  addEducation: ProfileService.addEducation.bind(ProfileService),
  updateEducation: ProfileService.updateEducation.bind(ProfileService),
  deleteEducation: ProfileService.deleteEducation.bind(ProfileService),
  

  // Sections générales
  addProfileSection: ProfileService.addProfileSection.bind(ProfileService),
  updateProfileSection: ProfileService.updateProfileSection.bind(ProfileService),
  deleteProfileSection: ProfileService.deleteProfileSection.bind(ProfileService),
  

  // Skills
  addSkill: ProfileService.addSkill.bind(ProfileService),
  updateSkill: ProfileService.updateSkill.bind(ProfileService),
  deleteSkill: ProfileService.deleteSkill.bind(ProfileService),
  
  // Certifications
  addCertification: ProfileService.addCertification.bind(ProfileService),
  updateCertification: ProfileService.updateCertification.bind(ProfileService),
  deleteCertification: ProfileService.deleteCertification.bind(ProfileService),
  
  // Languages 
  addLanguage: ProfileService.addLanguage.bind(ProfileService),
  updateLanguage: ProfileService.updateLanguage.bind(ProfileService),
  deleteLanguage: ProfileService.deleteLanguage.bind(ProfileService),
  
  addProject: ProfileService.addProject.bind(ProfileService),
  updateProject: ProfileService.updateProject.bind(ProfileService),
  deleteProject: ProfileService.deleteProject.bind(ProfileService),
  
  // Interests
    addInterest: ProfileService.addInterest.bind(ProfileService),
  updateInterest: ProfileService.updateInterest.bind(ProfileService),
  deleteInterest: ProfileService.deleteInterest.bind(ProfileService),
  

};

export default ApiService;
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

// Export par défaut pour compatibilité
const ApiService = {
  // Auth
  ...AuthService,
  
  // Profile
  getProfile: ProfileService.getProfile.bind(ProfileService),
  updatePersonalInfo: ProfileService.updatePersonalInfo.bind(ProfileService),
  addExperience: ProfileService.addExperience.bind(ProfileService),
  updateExperience: ProfileService.updateExperience.bind(ProfileService),
  deleteExperience: ProfileService.deleteExperience.bind(ProfileService),
  addProfileSection: ProfileService.addProfileSection.bind(ProfileService),
  updateProfileSection: ProfileService.updateProfileSection.bind(ProfileService),
  deleteProfileSection: ProfileService.deleteProfileSection.bind(ProfileService),
  
  // CV
  saveCV: CVService.saveCV.bind(CVService),
  getMyCVs: CVService.getMyCVs.bind(CVService),
  getCV: CVService.getCV.bind(CVService),
  deleteCV: CVService.deleteCV.bind(CVService),
  updateCV: CVService.updateCV.bind(CVService),
  
  // Jobs
  analyzeJob: JobsService.analyzeJob.bind(JobsService),
  generateCoverLetter: JobsService.generateCoverLetter.bind(JobsService),
};

export default ApiService;
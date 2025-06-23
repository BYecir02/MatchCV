// Point d'entrée simplifié - Export depuis la structure modulaire
export { default } from './api/index.js';
export { AuthService, ProfileService, CVService, JobsService } from './api/index.js';

// Fonctions utilitaires legacy pour compatibilité
export const extractCVData = async (file) => { // ⭐ DÉJÀ async - OK
  try {
    const { CVService } = await import('./api/index.js');
    return await CVService.extractCVData(file);
  } catch (error) {
    console.warn('API indisponible, utilisation de données simulées');
    
    // Simulation basique...
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      profile: 'Développeur Full-Stack avec expérience en React et Node.js',
      personalInfo: { 
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France'
      },
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: [{
        company: 'TechCorp',
        position: 'Développeur Full-Stack',
        period: '2022-2024',
        description: 'Développement d\'applications web'
      }]
    };
  }
};

export const login = async (credentials) => { // ⭐ AJOUTÉ async
  try {
    const { AuthService } = await import('./api/index.js');
    return await AuthService.login(credentials);
  } catch (error) {
    console.error('Erreur connexion:', error);
    throw error;
  }
};

export const register = async (userData) => { // ⭐ AJOUTÉ async
  try {
    const { AuthService } = await import('./api/index.js');
    return await AuthService.register(userData);
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
  }
};

export const checkAuth = async () => { // ⭐ NOUVELLE FONCTION
  try {
    const { AuthService } = await import('./api/index.js');
    return await AuthService.checkAuth();
  } catch (error) {
    console.error('Erreur vérification auth:', error);
    throw error;
  }
};

export const logout = async () => { // ⭐ AJOUTÉ async
  try {
    const { AuthService } = await import('./api/index.js');
    return AuthService.logout();
  } catch (error) {
    // Fallback : déconnexion manuelle
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

export const generateCoverLetter = async (jobDescription, userProfile, aiInstructions) => { // ⭐ AJOUTÉ async
  try {
    const { JobsService } = await import('./api/index.js');
    return await JobsService.generateCoverLetter({
      jobDescription,
      userProfile,
      aiInstructions
    });
  } catch (error) {
    console.error('Erreur génération lettre:', error);
    throw error;
  }
};

export const analyzeJobDescription = async (jobText) => { // ⭐ AJOUTÉ async
  try {
    const { JobsService } = await import('./api/index.js');
    return await JobsService.analyzeJob(jobText);
  } catch (error) {
    console.error('Erreur analyse job:', error);
    throw error;
  }
};

// Fonction utilitaire pour télécharger un PDF
export const downloadPDF = async (content, filename = 'document.pdf') => { // ⭐ DÉJÀ async - OK
  try {
    // Simulation de génération PDF
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Créer un blob et déclencher le téléchargement
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    throw new Error('Erreur lors du téléchargement du PDF');
  }
};

// ========== FONCTIONS SYNCHRONES (sans await) ==========

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => { // ⭐ PAS async - OK
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Récupérer l'utilisateur actuel
export const getCurrentUser = () => { // ⭐ PAS async - OK
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Récupérer le token d'authentification
export const getAuthToken = () => { // ⭐ PAS async - OK
  return localStorage.getItem('authToken');
};

// Configuration de l'intercepteur pour les erreurs d'authentification
export const setupAuthInterceptor = (onAuthError) => { // ⭐ PAS async - OK
  // Cette fonction peut être appelée depuis App.js pour gérer les erreurs d'auth
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('Token invalide') || 
        event.reason?.message?.includes('Token d\'accès requis')) {
      // Déconnexion synchrone
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      if (onAuthError) onAuthError();
    }
  });
};
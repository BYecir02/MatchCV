import BaseApiService from './base.js';

class AuthService extends BaseApiService {
  // Inscription
  async register(userData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Sauvegarder le token et les données utilisateur
    if (result.success && result.token) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  }

  // Connexion
  async login(credentials) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Sauvegarder le token et les données utilisateur
    if (result.success && result.token) {
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
    }
    
    return result;
  }

  // Vérifier le statut de connexion
  async checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Aucun token d\'authentification');
    }
    
    return this.request('/auth/verify');
  }

  // Déconnexion
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Récupérer le token d'authentification
  getAuthToken() {
    return localStorage.getItem('authToken');
  }
}

export default new AuthService();
import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          // Vérifier que le token est toujours valide avec le serveur
          try {
            const response = await ApiService.checkAuth();
            if (response.success) {
              // Token valide, mettre à jour l'état
              setUser(JSON.parse(storedUser));
              setToken(storedToken);
            } else {
              // Token invalide, nettoyer le localStorage
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
              setUser(null);
              setToken(null);
            }
          } catch (error) {
            console.log('Token invalide ou expiré, déconnexion automatique');
            // Token invalide, nettoyer le localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        // En cas d'erreur, nettoyer pour être sûr
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Connexion
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.login(credentials);
      
      if (response.success) {
        const { user: userData, token: userToken } = response;
        
        // Sauvegarder en localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', userToken);
        
        // Mettre à jour l'état
        setUser(userData);
        setToken(userToken);
        
        return { success: true };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.register(userData);
      
      if (response.success) {
        const { user: newUser, token: userToken } = response;
        
        // Sauvegarder en localStorage
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('authToken', userToken);
        
        // Mettre à jour l'état
        setUser(newUser);
        setToken(userToken);
        
        return { success: true };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
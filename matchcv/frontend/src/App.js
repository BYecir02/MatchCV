import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import './App.css';

// Composant principal qui utilise le contexte d'authentification
const AppContent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  // Mettre à jour la vue en fonction de l'état d'authentification
  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated, user]);

  const handleLogin = (userData) => {
    console.log('Connexion réussie:', userData);
    setCurrentView('dashboard');
  };

  const handleRegister = (userData) => {
    console.log('Inscription réussie:', userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  // Si l'utilisateur est authentifié, afficher le dashboard
  if (isAuthenticated && user) {
    return (
      <Dashboard 
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Sinon, afficher les formulaires d'authentification
  return (
    <>
      {currentView === 'login' && (
        <Login 
          onSwitchToRegister={() => setCurrentView('register')}
          onLogin={handleLogin}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onSwitchToLogin={() => setCurrentView('login')}
          onRegister={handleRegister}
        />
      )}
    </>
  );
};

// Composant App principal avec AuthProvider
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
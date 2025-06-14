import React, { useState } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    console.log('Connexion:', userData);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleRegister = (userData) => {
    console.log('Inscription:', userData);
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  return (
    <div className="App">
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
      
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
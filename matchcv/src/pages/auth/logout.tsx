import React, { useEffect } from 'react';
import { logout } from '../../services/authService'; // Assurez-vous que le chemin est correct

const Logout = () => {
  useEffect(() => {
    logout();
  }, []);

  return <p>Déconnexion en cours...</p>;
};

export default Logout;
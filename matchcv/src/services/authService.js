import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}register/`, { username, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login/`, { email, password });
  return response.data;
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirection vers la page de connexion
  };
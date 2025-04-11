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

export const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const accessToken = localStorage.getItem('access_token');
  if (refreshToken && accessToken) {
    try {
      await axios.post(`${API_URL}logout/`, { refresh: refreshToken }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error.response?.data);
    }
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export const getProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}profile/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const accessToken = localStorage.getItem('access_token');
  const response = await axios.put(`${API_URL}profile/`, profileData, {  // Corrigé de post à put
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const deleteExperience = async (experienceId) => {
  const token = localStorage.getItem('access_token');
  console.log("Token utilisé pour DELETE :", token);
  const response = await axios.delete(`${API_URL}profile/experience/${experienceId}/`, {
      headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addExperience = async (experienceData) => {
  const token = localStorage.getItem('access_token');
  console.log("Token utilisé pour POST :", token);
  const response = await axios.post(`${API_URL}profile/experience/add/`, experienceData, {
      headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateExperience = async (experienceId, experienceData) => {
  const token = localStorage.getItem('access_token');
  console.log("Token utilisé pour PUT :", token);
  const response = await axios.put(`${API_URL}profile/experience/${experienceId}/update/`, experienceData, {
      headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
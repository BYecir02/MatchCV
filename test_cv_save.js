const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api';

// Test de l'API
async function testCVSave() {
  try {
    console.log('🧪 Test de l\'API CV Save...');
    
    // 1. Test de connexion
    console.log('1️⃣ Test de connexion...');
    const testResponse = await axios.get(`${API_URL}/test`);
    console.log('✅ API accessible:', testResponse.data);
    
    // 2. Test d'authentification (sans token)
    console.log('2️⃣ Test sans authentification...');
    try {
      await axios.post(`${API_URL}/cv/save`, {
        templateId: 'test',
        title: 'Test CV',
        cvData: { personalInfo: { firstName: 'Test' } }
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentification requise (normal)');
      } else {
        console.log('❌ Erreur inattendue:', error.response?.data);
      }
    }
    
    // 3. Test avec token invalide
    console.log('3️⃣ Test avec token invalide...');
    try {
      await axios.post(`${API_URL}/cv/save`, {
        templateId: 'test',
        title: 'Test CV',
        cvData: { personalInfo: { firstName: 'Test' } }
      }, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Token invalide rejeté (normal)');
      } else {
        console.log('❌ Erreur inattendue:', error.response?.data);
      }
    }
    
    console.log('🎉 Tests terminés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testCVSave(); 
class BaseApiService {
  constructor() {
    // ⭐ FORCER l'URL complète avec http://
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    // Debug pour vérifier
    console.log('🔗 BaseURL configuré:', this.baseURL);
    console.log('🔍 Variable env:', process.env.REACT_APP_API_URL);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    
    // Vérifier que l'URL est correcte
    if (!url.startsWith('http')) {
      console.error('❌ URL malformée:', url);
      throw new Error(`URL malformée: ${url}`);
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP ${response.status}:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }
}

export default BaseApiService;
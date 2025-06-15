import { useState, useEffect } from 'react';
import { ProfileService } from '../../../../services/api';

export const useProfileData = (initialUser) => {
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: initialUser?.firstName || '',
      lastName: initialUser?.lastName || '',
      email: initialUser?.email || '',
      phone: '',
      location: '',
      title: '',
      currentPosition: '',
      desiredPosition: '',
      industry: '',
      yearsExperience: 0,
      availability: '',
      desiredSalaryMin: '',
      desiredSalaryMax: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
      bio: '',
      city: '',
      country: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Charger le profil au démarrage
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement du profil...');
      const response = await ProfileService.getProfile();
      console.log('✅ Profil reçu:', response);
      
      if (response.success) {
        // Transformer les _id en id pour la compatibilité avec vos composants
        const transformedData = {
          ...response.profileData,
          experience: response.profileData.experience?.map(item => ({ 
            ...item, 
            id: item.id || item._id,
            // Assurer que tous les champs sont présents
            company: item.company || '',
            position: item.position || '',
            startDate: item.startDate || '',
            endDate: item.endDate || '',
            isCurrent: item.isCurrent || false,
            location: item.location || '',
            description: item.description || '',
            achievements: item.achievements || [],
            technologiesUsed: item.technologiesUsed || []
          })) || [],
          education: response.profileData.education?.map(item => ({ ...item, id: item.id || item._id })) || [],
          skills: response.profileData.skills?.map(item => ({ ...item, id: item.id || item._id })) || [],
          certifications: response.profileData.certifications?.map(item => ({ ...item, id: item.id || item._id })) || [],
          languages: response.profileData.languages?.map(item => ({ ...item, id: item.id || item._id })) || [],
          projects: response.profileData.projects?.map(item => ({ ...item, id: item.id || item._id })) || []
        };
        
        console.log('🔄 Données transformées:', transformedData);
        setProfileData(transformedData);
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      setError('Erreur lors du chargement du profil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sauvegarder les informations personnelles
  const savePersonalInfo = async (personalInfo) => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await ProfileService.updatePersonalInfo(personalInfo);
      
      if (response.success) {
        setProfileData(prev => ({
          ...prev,
          personalInfo: response.personalInfo
        }));
        return { success: true };
      }
    } catch (error) {
      console.error('Erreur sauvegarde profil:', error);
      setError('Erreur lors de la sauvegarde: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Ajouter une expérience (méthode spécialisée)
  const addExperience = async (newExperience) => {
    try {
      console.log('➕ Ajout expérience:', newExperience);
      
      // Utiliser la route dédiée pour les expériences
      const response = await ProfileService.addExperience(newExperience);
      console.log('✅ Expérience ajoutée:', response);
      
      if (response.success) {
        const expWithId = { 
          ...response.data, 
          id: response.data.id || response.data._id,
          // Assurer les valeurs par défaut
          company: response.data.company || '',
          position: response.data.position || '',
          startDate: response.data.startDate || '',
          endDate: response.data.endDate || '',
          isCurrent: response.data.isCurrent || false,
          location: response.data.location || '',
          description: response.data.description || '',
          achievements: response.data.achievements || [],
          technologiesUsed: response.data.technologiesUsed || []
        };
        
        setProfileData(prev => ({
          ...prev,
          experience: [...prev.experience, expWithId]
        }));
        
        return { success: true, data: expWithId };
      }
    } catch (error) {
      console.error('❌ Erreur ajout expérience:', error);
      setError(`Erreur lors de l'ajout de l'expérience: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Mettre à jour une expérience (méthode spécialisée)
  const updateExperience = async (id, field, value) => {
    // Mise à jour locale immédiate pour la réactivité
    setProfileData(prev => ({
      ...prev,
      experience: prev.experience.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));

    // Débounce pour éviter trop de requêtes
    clearTimeout(updateExperience.timeout);
    updateExperience.timeout = setTimeout(async () => {
      try {
        console.log(`🔄 Mise à jour expérience ${id}:`, { [field]: value });
        
        const currentExp = profileData.experience.find(item => item.id === id);
        if (!currentExp) return;
        
        const updatedExp = { ...currentExp, [field]: value };
        
        const response = await ProfileService.updateExperience(id, updatedExp);
        console.log('✅ Expérience mise à jour:', response);
        
      } catch (error) {
        console.error('❌ Erreur mise à jour expérience:', error);
        setError(`Erreur mise à jour expérience: ${error.message}`);
        // Recharger les données en cas d'erreur
        loadProfile();
      }
    }, 1500); // Attendre 1.5 seconde après la dernière modification
  };

  // Supprimer une expérience (méthode spécialisée)
  const removeExperience = async (id) => {
    try {
      console.log('🗑️ Suppression expérience:', id);
      
      const response = await ProfileService.deleteExperience(id);
      console.log('✅ Expérience supprimée:', response);
      
      setProfileData(prev => ({
        ...prev,
        experience: prev.experience.filter(item => item.id !== id)
      }));
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression expérience:', error);
      setError(`Erreur lors de la suppression de l'expérience: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  const addSkill = async (newSkill) => {
  try {
    console.log('💻 Ajout compétence:', newSkill);
    
    const response = await ProfileService.addSkill(newSkill);
    console.log('✅ Compétence ajoutée:', response);
    
    if (response.success) {
      const skillWithId = { 
        ...response.data, 
        id: response.data.id || response.data._id 
      };
      
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skillWithId]
      }));
      
      return { success: true };
    }
    
    throw new Error(response.message || 'Erreur lors de l\'ajout de la compétence');
  } catch (error) {
    console.error('❌ Erreur ajout compétence:', error);
    setError(`Erreur lors de l'ajout de la compétence: ${error.message}`);
    return { success: false, error: error.message };
  }
};

  // Méthode générale pour les autres sections
const addItem = async (section, newItem) => {
  // Si c'est une expérience, utiliser la méthode spécialisée
  if (section === 'experience') {
    return await addExperience(newItem);
  }
  
  // ⭐ AJOUTER : Si c'est une formation, utiliser la méthode spécialisée
  if (section === 'education') {
    return await addEducation(newItem);
  }

  if (section === 'skills') {
    return await addSkill(newItem);
  }
  
  try {
    const response = await ProfileService.addProfileSection(section, newItem);
    
    if (response.success) {
      const itemWithId = { ...response.data, id: response.data.id || response.data._id };
      setProfileData(prev => ({
        ...prev,
        [section]: [...prev[section], itemWithId]
      }));
      return { success: true };
    }
    
    throw new Error(response.message || 'Erreur lors de l\'ajout');
  } catch (error) {
    console.error(`❌ Erreur ajout ${section}:`, error);
    setError(`Erreur lors de l'ajout: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// ⭐ AJOUTER : Méthode addEducation similaire à addExperience
const addEducation = async (newEducation) => {
  try {
    console.log('🎓 Ajout formation:', newEducation);
    
    const response = await ProfileService.addEducation(newEducation);
    console.log('✅ Formation ajoutée:', response);
    
    if (response.success) {
      const educationWithId = { 
        ...response.education, 
        id: response.education.id || response.education._id 
      };
      
      setProfileData(prev => ({
        ...prev,
        education: [...prev.education, educationWithId]
      }));
      
      return { success: true };
    }
    
    throw new Error(response.message || 'Erreur lors de l\'ajout de la formation');
  } catch (error) {
    console.error('❌ Erreur ajout formation:', error);
    setError(`Erreur lors de l'ajout de la formation: ${error.message}`);
    return { success: false, error: error.message };
  }
};

  // Méthode générale pour mettre à jour
  const updateItem = (section, id, field, value) => {
    // Si c'est une expérience, utiliser la méthode spécialisée
    if (section === 'experience') {
      return updateExperience(id, field, value);
    }
    
    // Mise à jour locale immédiate pour la réactivité
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));

    // Débounce pour éviter trop de requêtes
    clearTimeout(updateItem.timeout);
    updateItem.timeout = setTimeout(async () => {
      try {
        const item = profileData[section].find(item => item.id === id);
        if (!item) return;
        
        const updatedItem = { ...item, [field]: value };
        
        await ProfileService.updateProfileSection(section, id, updatedItem);
      } catch (error) {
        console.error(`Erreur mise à jour ${section}:`, error);
        setError(`Erreur mise à jour: ${error.message}`);
        // Recharger les données en cas d'erreur
        loadProfile();
      }
    }, 1500);
  };

  // Méthode générale pour supprimer
  const removeItem = async (section, id) => {
    // Si c'est une expérience, utiliser la méthode spécialisée
    if (section === 'experience') {
      return await removeExperience(id);
    }
    
    try {
      await ProfileService.deleteProfileSection(section, id);
      
      setProfileData(prev => ({
        ...prev,
        [section]: prev[section].filter(item => item.id !== id)
      }));
      
      return { success: true };
    } catch (error) {
      console.error(`Erreur suppression ${section}:`, error);
      setError(`Erreur lors de la suppression: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  return {
    profileData,
    loading,
    saving,
    error,
    handleInputChange,
    addItem,
    updateItem,
    removeItem,
    savePersonalInfo,
    loadProfile,
    // Méthodes spécialisées pour les expériences
    addExperience,
    updateExperience,
    removeExperience
  };
};
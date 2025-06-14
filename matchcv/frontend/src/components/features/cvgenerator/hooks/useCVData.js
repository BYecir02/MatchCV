import { useState, useCallback } from 'react';

export const useCVData = (user, initialData) => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger le profil utilisateur de base
  const loadUserProfile = useCallback(() => {
    setCvData({
      personalInfo: {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        location: '',
        title: '',
        linkedin: '',
        github: '',
        portfolio: '',
        website: ''
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: [],
      interests: []
    });
  }, [user]);

  // Générer un CV optimisé basé sur une annonce
  const generateOptimizedCV = useCallback(async (jobData) => {
    setLoading(true);
    setError('');
    
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimizedData = {
        personalInfo: {
          firstName: user?.firstName || 'Jean',
          lastName: user?.lastName || 'Dupont',
          email: user?.email || 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          location: 'Paris, France',
          title: jobData.position || 'Professionnel',
          linkedin: 'https://linkedin.com/in/profil',
          github: 'https://github.com/profil',
          portfolio: 'https://monportfolio.com'
        },
        summary: `Professionnel expérimenté spécialisé en ${jobData.skills?.slice(0, 3).join(', ')}. Passionné par l'innovation et l'excellence technique.`,
        experience: [
          {
            id: 1,
            company: 'Entreprise Précédente',
            position: jobData.position || 'Poste Similaire',
            period: '2022 - Présent',
            location: 'Paris, France',
            description: `Développement et optimisation utilisant ${jobData.skills?.join(', ')}`,
            achievements: [
              'Amélioration des performances de 40%',
              'Implémentation de nouvelles fonctionnalités',
              `Expertise approfondie en ${jobData.skills?.[0] || 'technologie principale'}`
            ]
          }
        ],
        education: [
          {
            id: 1,
            school: 'École Supérieure',
            degree: 'Master/Diplôme',
            field: 'Informatique/Spécialité',
            period: '2019 - 2021',
            location: 'Paris, France',
            grade: 'Mention Bien'
          }
        ],
        skills: jobData.skills?.map((skill, index) => ({ 
          id: index + 1,
          name: skill, 
          level: 'Avancé',
          category: 'Technique',
          highlighted: true
        })) || [],
        languages: [
          { id: 1, name: 'Français', level: 'Natif' },
          { id: 2, name: 'Anglais', level: 'Courant' }
        ],
        certifications: [],
        projects: [],
        interests: [],
        optimizedFor: {
          company: jobData.companyName,
          position: jobData.position,
          keywords: jobData.skills,
          date: new Date().toISOString()
        }
      };

      setCvData(optimizedData);
      
    } catch (err) {
      setError('Erreur lors de la génération du CV optimisé');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Mettre à jour une section du CV
  const updateCVSection = useCallback((section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  }, []);

  // Ajouter un élément à une liste
  const addCVItem = useCallback((section, item) => {
    setCvData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { ...item, id: Date.now() }]
    }));
  }, []);

  // Mettre à jour un élément d'une liste
  const updateCVItem = useCallback((section, itemId, updatedItem) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section]?.map(item => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      ) || []
    }));
  }, []);

  // Supprimer un élément d'une liste
  const removeCVItem = useCallback((section, itemId) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section]?.filter(item => item.id !== itemId) || []
    }));
  }, []);

  // Réorganiser les éléments d'une liste
  const reorderCVItems = useCallback((section, startIndex, endIndex) => {
    setCvData(prev => {
      const items = [...(prev[section] || [])];
      const [reorderedItem] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, reorderedItem);
      
      return {
        ...prev,
        [section]: items
      };
    });
  }, []);

  return {
    cvData,
    loading,
    error,
    loadUserProfile,
    generateOptimizedCV,
    updateCVSection,
    addCVItem,
    updateCVItem,
    removeCVItem,
    reorderCVItems,
    setCvData,
    setError
  };
};
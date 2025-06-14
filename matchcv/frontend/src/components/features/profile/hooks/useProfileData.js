import { useState } from 'react';

export const useProfileData = (initialUser) => {
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: initialUser?.firstName || 'Jean',
      lastName: initialUser?.lastName || 'Dupont',
      email: initialUser?.email || 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      title: 'Développeur Full-Stack',
      currentPosition: 'Développeur Full-Stack',
      desiredPosition: 'Senior Full-Stack Developer',
      industry: 'Technologie',
      yearsExperience: 3,
      availability: 'Disponible immédiatement',
      desiredSalaryMin: '45000',
      desiredSalaryMax: '60000',
      linkedinUrl: 'https://linkedin.com/in/jean-dupont',
      githubUrl: 'https://github.com/jean-dupont',
      portfolioUrl: 'https://jean-dupont.dev',
      bio: 'Développeur passionné avec 3 ans d\'expérience en JavaScript, React et Node.js.'
    },
    experience: [
      {
        id: 1,
        company: 'TechCorp',
        position: 'Développeur Full-Stack',
        startDate: '2022-01',
        endDate: 'Présent',
        isCurrent: true,
        location: 'Paris, France',
        description: 'Développement d\'applications web avec React et Node.js'
      }
    ],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: []
  });

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addItem = (section, newItem) => {
    setProfileData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...newItem, id: Date.now() }]
    }));
  };

  const updateItem = (section, id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (section, id) => {
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  return {
    profileData,
    handleInputChange,
    addItem,
    updateItem,
    removeItem
  };
};
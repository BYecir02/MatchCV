import React, { useState } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react'; // ⭐ AJOUTER Upload
import { extractCVData } from '../../../services/api';

// Hooks
import { useProfileData } from '../../../hooks/useProfileData';

// Sections
import CVUploadSection from './sections/CVUploadSection';
import ProfileTabs from './sections/ProfileTabs';
import CVImportModal from './components/CVImportModal';

// Tabs
import PersonalInfoTab from './tabs/PersonalInfoTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import SkillsTab from './tabs/SkillsTab';
import CertificationsTab from './tabs/CertificationsTab';
import LanguagesTab from './tabs/LanguagesTab';
import ProjectsTab from './tabs/ProjectsTab';
import InterestsTab from './tabs/InterestsTab'; 

const ProfileSettings = ({ user }) => {
  const { 
    profileData, 
    loading, 
    saving, 
    error: profileError, 
    handleInputChange, 
    addItem, 
    updateItem, 
    removeItem, 
    savePersonalInfo,
    loadProfile,
    setProfileData
  } = useProfileData(user);

  const [activeTab, setActiveTab] = useState('personal');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [showCVImportModal, setShowCVImportModal] = useState(false); 

  // ⭐ GARDER SEULEMENT CETTE VERSION - Handler pour succès d'import
  const handleImportSuccess = (newProfileData) => {
    setProfileData(newProfileData);
    setShowCVImportModal(false);
    setSuccess('🎉 CV importé avec succès ! Votre profil a été mis à jour automatiquement.');
    setTimeout(() => setSuccess(''), 5000);
    console.log('✅ Profil mis à jour après import CV');
  };
  
  // Gestion upload CV
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('Le fichier ne doit pas dépasser 5MB.');
      return;
    }

    try {
      setError('');
      setSuccess('');

      // Extraction des données
      const extractedData = await extractCVData(file);
      
      // Mise à jour du profil avec les données extraites
      if (extractedData.personalInfo) {
        Object.keys(extractedData.personalInfo).forEach(key => {
          if (extractedData.personalInfo[key]) {
            handleInputChange('personalInfo', key, extractedData.personalInfo[key]);
          }
        });
      }

      // Ajouter les compétences extraites
      if (extractedData.skills && Array.isArray(extractedData.skills)) {
        for (const skillName of extractedData.skills) {
          await addItem('skills', {
            skillName,
            category: 'Technique',
            proficiencyLevel: 'intermediate',
            yearsExperience: 1,
            isPrimary: false
          });
        }
      }

      // Ajouter les expériences extraites
      if (extractedData.experience && Array.isArray(extractedData.experience)) {
        for (const exp of extractedData.experience) {
          await addItem('experience', {
            company: exp.company || '',
            position: exp.position || '',
            startDate: exp.period ? exp.period.split('-')[0] : '',
            endDate: exp.period ? exp.period.split('-')[1] : '',
            isCurrent: false,
            location: '',
            description: exp.description || '',
            achievements: [],
            technologiesUsed: []
          });
        }
      }

      setSuccess('CV analysé avec succès ! Vos informations ont été mises à jour.');
      
    } catch (error) {
      console.error('Erreur upload CV:', error);
      setError('Erreur lors de l\'analyse du CV. Veuillez réessayer.');
    } finally {
      // Réinitialiser le champ de fichier
      e.target.value = '';
    }
  };

  // Sauvegarde manuelle
  const handleSave = async () => {
    try {
      setSaveMessage('');
      
      if (activeTab === 'personal') {
        const result = await savePersonalInfo(profileData.personalInfo);
        if (result.success) {
          setSaveMessage('Informations personnelles sauvegardées avec succès !');
        } else {
          setSaveMessage('Erreur lors de la sauvegarde');
        }
      } else {
        setSaveMessage('Les modifications sont sauvegardées automatiquement');
      }
      
      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (error) {
      setSaveMessage('Erreur lors de la sauvegarde');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const renderTabContent = () => {
    const commonProps = { 
      profileData, 
      handleInputChange, 
      addItem, 
      updateItem, 
      removeItem 
    };
    
    switch (activeTab) {
      case 'personal': 
        return <PersonalInfoTab {...commonProps} />;
      case 'experience': 
        return <ExperienceTab {...commonProps} />;
      case 'education': 
        return <EducationTab {...commonProps} />;
      case 'skills': 
        return <SkillsTab {...commonProps} />;
      case 'certifications': 
        return <CertificationsTab {...commonProps} />;
      case 'languages': 
        return <LanguagesTab {...commonProps} />;
      case 'projects': 
        return <ProjectsTab {...commonProps} />;
      case 'interests':
        return <InterestsTab {...commonProps} />;
      default: 
        return null;
    }
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-white">Chargement du profil...</span>
      </div>
    );
  }

return (
  <div className="space-y-6">
    {/* Header avec bouton d'import */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Mon profil</h1>
        <p className="text-white mt-1">Gérez vos informations personnelles et professionnelles</p>
      </div>
      
      {/* ⭐ Bouton d'import CV */}
      <button
        onClick={() => setShowCVImportModal(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors shadow-sm"
      >
        <Upload className="h-4 w-4" />
        <span>Importer mon CV</span>
      </button>
    </div>

    {/* Messages d'erreur globaux */}
    {profileError && (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
        <span className="text-red-700">{profileError}</span>
        <button 
          onClick={loadProfile}
          className="ml-auto text-red-600 hover:text-red-800 underline"
        >
          Réessayer
        </button>
      </div>
    )}

    {/* ⭐ Message de succès pour l'import */}
    {success && (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
        <span className="text-green-700">{success}</span>
      </div>
    )}



    <div className="flex flex-col lg:flex-row gap-6">
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1">
        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-sm p-6">
          {renderTabContent()}
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
            {/* Messages de sauvegarde */}
            <div className="flex items-center">
              {saving && (
                <div className="flex items-center text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Sauvegarde...</span>
                </div>
              )}
              
              {saveMessage && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{saveMessage}</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* ⭐ Modal d'import CV */}
    <CVImportModal
      isOpen={showCVImportModal}
      onClose={() => setShowCVImportModal(false)}
      onImportSuccess={handleImportSuccess}
    />
  </div>
);
};

export default ProfileSettings;
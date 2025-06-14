import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { extractCVData } from '../../../services/api';

// Hooks
import { useProfileData } from './hooks/useProfileData';

// Sections
import CVUploadSection from './sections/CVUploadSection';
import ProfileTabs from './sections/ProfileTabs';

// Tabs
import PersonalInfoTab from './tabs/PersonalInfoTab';
import ExperienceTab from './tabs/ExperienceTab';
import EducationTab from './tabs/EducationTab';
import SkillsTab from './tabs/SkillsTab';
import CertificationsTab from './tabs/CertificationsTab';
import LanguagesTab from './tabs/LanguagesTab';
import ProjectsTab from './tabs/ProjectsTab';

const ProfileSettings = ({ user }) => {
  const { profileData, handleInputChange, addItem, updateItem, removeItem } = useProfileData(user);
  const [activeTab, setActiveTab] = useState('personal');
  const [cvFile, setCvFile] = useState(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Logique CV (à garder dans le composant principal)
  const handleCVUpload = async (e) => {
    // ... votre logique existante
  };

  const removeCVFile = () => {
    setCvFile(null);
    setError('');
    setSuccess('');
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
      default: 
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
      </div>

      <CVUploadSection 
        cvFile={cvFile}
        cvLoading={cvLoading}
        error={error}
        success={success}
        onFileUpload={handleCVUpload}
        onRemoveFile={removeCVFile}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderTabContent()}
            
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
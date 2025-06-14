import React from 'react';
import { User, Camera } from 'lucide-react';
import FormField from '../components/FormField';
import SectionHeader from '../components/SectionHeader';

const PersonalInfoTab = ({ profileData, handleInputChange }) => {
  const { personalInfo } = profileData;

  return (
    <div className="space-y-6">
      <SectionHeader icon={User} title="Informations personnelles" />

      {/* Photo de profil */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {personalInfo.firstName[0]}{personalInfo.lastName[0]}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
            <Camera className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {personalInfo.firstName} {personalInfo.lastName}
          </h3>
          <p className="text-gray-600">{personalInfo.title}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Prénom"
          value={personalInfo.firstName}
          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
          required
        />
        <FormField
          label="Nom"
          value={personalInfo.lastName}
          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
          required
        />
        <FormField
          label="Téléphone"
          type="tel"
          value={personalInfo.phone}
          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
        />
        <FormField
          label="Localisation"
          value={personalInfo.location}
          onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
        />
        <FormField
          label="Titre professionnel"
          value={personalInfo.title}
          onChange={(e) => handleInputChange('personalInfo', 'title', e.target.value)}
        />
        <FormField
          label="Disponibilité"
          type="select"
          value={personalInfo.availability}
          onChange={(e) => handleInputChange('personalInfo', 'availability', e.target.value)}
          options={[
            { value: 'Disponible immédiatement', label: 'Disponible immédiatement' },
            { value: 'Disponible dans 1 mois', label: 'Disponible dans 1 mois' },
            { value: 'Disponible dans 2 mois', label: 'Disponible dans 2 mois' },
            { value: 'Disponible dans 3 mois', label: 'Disponible dans 3 mois' }
          ]}
        />
        <FormField
          label="Années d'expérience"
          type="number"
          value={personalInfo.yearsExperience}
          onChange={(e) => handleInputChange('personalInfo', 'yearsExperience', parseInt(e.target.value))}
        />
      </div>

      <FormField
        label="Bio professionnelle"
        type="textarea"
        value={personalInfo.bio}
        onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
        rows={4}
        placeholder="Décrivez votre parcours et vos objectifs professionnels..."
      />
    </div>
  );
};

export default PersonalInfoTab;
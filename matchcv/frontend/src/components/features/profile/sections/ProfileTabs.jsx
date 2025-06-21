import React from 'react';
import { 
  User, 
  Briefcase,
  GraduationCap,
  Award,
  Badge,
  Languages,
  Rocket,
  Heart
} from 'lucide-react';

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'personal', label: 'Informations personnelles', icon: User },
    { id: 'experience', label: 'Expérience', icon: Briefcase },
    { id: 'education', label: 'Formation', icon: GraduationCap },
    { id: 'skills', label: 'Compétences', icon: Award },
    { id: 'certifications', label: 'Certifications', icon: Badge },
    { id: 'languages', label: 'Langues', icon: Languages },
    { id: 'projects', label: 'Projets', icon: Rocket },
    { id: 'interests', label: 'Centres d\'intérêt', icon: Heart }
  ];

  return (
    <div className="lg:w-64 ">
      <nav className="bg-white/10 backdrop-blur-md rounded-lg shadow-sm p-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                  : 'text-white hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
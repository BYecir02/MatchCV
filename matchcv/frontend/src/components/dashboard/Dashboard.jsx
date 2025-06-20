import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Search, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  // ChevronRight,
  File
} from 'lucide-react';

// Import des composants séparés
import DashboardHome from '../features/home/DashboardHome';
import CoverLetterGenerator from '../features/letters/CoverLetterGenerator';
import JobAnalyzer from '../features/analyzer/JobAnalyzer';
import ApplicationTracker from '../features/tracker/ApplicationTracker';
import ProfileSettings from '../features/profile/ProfileSettings';
import AppSettings from '../features/settings/AppSettings';
import CVGenerator from '../features/cvgenerator/CVGenerator'; // Corriger ici

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop
  const [navigationData, setNavigationData] = useState(null); // Nouveau state pour la navigation

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, component: DashboardHome },
    { id: 'analyzer', label: 'Analyse d\'annonces', icon: Search, component: JobAnalyzer },
    { id: 'letters', label: 'Lettres de motivation', icon: FileText, component: CoverLetterGenerator },
    { id: 'cv-generator', label: 'Générateur de CV', icon: File, component: CVGenerator },
    { id: 'tracker', label: 'Suivi candidatures', icon: BarChart3, component: ApplicationTracker },
    { id: 'profile', label: 'Mon profil', icon: User, component: ProfileSettings },
    { id: 'settings', label: 'Paramètres', icon: Settings, component: AppSettings },
  ];

  // Fonction pour naviguer vers le générateur de CV
  const handleNavigateToCV = (jobData) => {
    setNavigationData(jobData);
    setActiveSection('cv-generator');
  };

  // Fonction pour naviguer vers les lettres
  const handleNavigateToLetters = (jobData) => {
    setNavigationData(jobData);
    setActiveSection('letters');
  };

  // Fonction pour revenir à l'analyseur
  const handleNavigateBack = () => {
    setNavigationData(null);
    setActiveSection('analyzer');
  };

  const renderActiveComponent = () => {
    const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || DashboardHome;
    
    const commonProps = {
      user,
      initialData: navigationData,
      onNavigateToLetters: handleNavigateToLetters,
      onNavigateToCV: handleNavigateToCV,
      onNavigateBack: handleNavigateBack
    };

    return <ActiveComponent {...commonProps} />;
  };

  return (
    <div className="flex h-screen bg-blue-950">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full '} 
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-md
        transform transition-all duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 ">
          <div className={`${sidebarCollapsed ? 'lg:invisible' : 'block'}`}>
            <h1 className="text-xl font-bold text-blue-600 mt-3">MatchCV</h1>
          </div>
          
          {/* Bouton fermer mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Bouton collapse desktop 
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 rounded-md hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>
          */}
        </div>
        
        {/* Navigation */}
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                  // Clear navigation data seulement si on ne va pas vers CV ou lettres
                  if (item.id !== 'cv-generator' && item.id !== 'letters') {
                    setNavigationData(null);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-white'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'} truncate`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
        
        {/* Profile section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className={`flex items-center mb-4 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className={`ml-3 ${sidebarCollapsed ? 'lg:hidden' : 'block'} min-w-0`}>
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-900 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors ${
              sidebarCollapsed ? 'lg:justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Déconnexion' : ''}
          >
            <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>
              Déconnexion
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-blue-950">
        {/* Header */}
        <header className="  px-4 py-4">
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-3"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Bouton toggle sidebar desktop */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block mr-3 p-1 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h2 className="text-lg font-medium text-gray-1000 m-2">
                  {menuItems.find(item => item.id === activeSection)?.label}
                </h2>
                {/* Sous-titre contextuel */}
                {navigationData && (activeSection === 'cv-generator' || activeSection === 'letters') && (
                  <p className="text-sm text-gray-500 mt-1">
                    Pour le poste : {navigationData.position} chez {navigationData.companyName}
                  </p>
                )}
              </div>
            </div>
            
            {/* Actions supplémentaires dans le header */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <span className="text-sm text-gray-900">
                  Bonjour, {user?.firstName} 👋
                </span>
              </div>
              
              {/* Bouton de retour si on est dans une navigation contextuelle */}
              {navigationData && (activeSection === 'cv-generator' || activeSection === 'letters') && (
                <button
                  onClick={handleNavigateBack}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Retour à l'analyse
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderActiveComponent()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
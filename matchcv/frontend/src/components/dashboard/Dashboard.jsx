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
  ChevronRight
} from 'lucide-react';

// Import des composants séparés
import DashboardHome from '../features/home/DashboardHome';
import CoverLetterGenerator from '../features/letters/CoverLetterGenerator';
import JobAnalyzer from '../features/analyzer/JobAnalyzer';
import ApplicationTracker from '../features/tracker/ApplicationTracker';
import ProfileSettings from '../features/profile/ProfileSettings';
import AppSettings from '../features/settings/AppSettings';

const Dashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home, component: DashboardHome },
    { id: 'letters', label: 'Lettres de motivation', icon: FileText, component: CoverLetterGenerator },
    { id: 'analyzer', label: 'Analyse d\'annonces', icon: Search, component: JobAnalyzer },
    { id: 'tracker', label: 'Suivi candidatures', icon: BarChart3, component: ApplicationTracker },
    { id: 'profile', label: 'Mon profil', icon: User, component: ProfileSettings },
    { id: 'settings', label: 'Paramètres', icon: Settings, component: AppSettings },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeSection)?.component || DashboardHome;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className={`${sidebarCollapsed ? 'lg:hidden' : 'block'}`}>
            <h1 className="text-xl font-bold text-blue-600">MatchCV</h1>
          </div>
          
          {/* Bouton fermer mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Bouton collapse desktop */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block p-1 rounded-md hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
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
                }}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeSection === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
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
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4">
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
              
              <h2 className="text-lg font-medium text-gray-900">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
            </div>
            
            {/* Actions supplémentaires dans le header */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block">
                <span className="text-sm text-gray-600">
                  Bonjour, {user?.firstName} 👋
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <ActiveComponent user={user} />
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
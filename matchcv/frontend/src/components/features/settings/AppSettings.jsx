import React, { useState } from 'react';
import { 
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

const AppSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      applications: true,
      responses: true,
      reminders: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true
    },
    appearance: {
      theme: 'light',
      language: 'fr',
      fontSize: 'medium'
    },
    account: {
      twoFactorAuth: false,
      emailNotifications: true,
      autoSave: true
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const [activeSection, setActiveSection] = useState('notifications');

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'account', label: 'Compte', icon: Key }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configurez vos préférences et paramètres de l'application</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Menu des sections */}
        <div className="lg:w-64">
          <nav className="bg-white rounded-lg shadow-sm p-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg mb-2 transition-colors ${
                    activeSection === section.id 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenu des paramètres */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            
            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Bell className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Notifications par email</h3>
                        <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-gray-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Notifications push</h3>
                        <p className="text-sm text-gray-600">Recevoir les notifications sur votre appareil mobile</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Nouvelles candidatures</h3>
                      <p className="text-sm text-gray-600">Notification lors d'une nouvelle candidature</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.applications}
                        onChange={(e) => handleSettingChange('notifications', 'applications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Réponses d'entreprises</h3>
                      <p className="text-sm text-gray-600">Notification lors d'une réponse d'entreprise</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.responses}
                        onChange={(e) => handleSettingChange('notifications', 'responses', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Rappels</h3>
                      <p className="text-sm text-gray-600">Rappels pour relancer les candidatures</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.reminders}
                        onChange={(e) => handleSettingChange('notifications', 'reminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Confidentialité */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Confidentialité</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Visibilité du profil</h3>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="private">Privé</option>
                      <option value="public">Public</option>
                      <option value="restricted">Restreint</option>
                    </select>
                    <p className="text-sm text-gray-600 mt-2">Contrôlez qui peut voir votre profil</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Partage de données</h3>
                      <p className="text-sm text-gray-600">Autoriser le partage de données anonymes pour améliorer le service</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataSharing}
                        onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Permettre la collecte de données d'usage pour améliorer l'expérience</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.analytics}
                        onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Apparence */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Palette className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Apparence</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Thème</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Clair', icon: Sun },
                        { value: 'dark', label: 'Sombre', icon: Moon },
                        { value: 'system', label: 'Système', icon: Monitor }
                      ].map(theme => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                              settings.appearance.theme === theme.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-6 w-6 mb-2" />
                            <span className="text-sm font-medium">{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Langue</h3>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Taille de police</h3>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Petite</option>
                      <option value="medium">Moyenne</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Compte */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Key className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">Compte</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Authentification à deux facteurs</h3>
                      <p className="text-sm text-gray-600">Sécurisez votre compte avec la 2FA</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.account.twoFactorAuth}
                        onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Sauvegarde automatique</h3>
                      <p className="text-sm text-gray-600">Sauvegarder automatiquement vos modifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.account.autoSave}
                        onChange={(e) => handleSettingChange('account', 'autoSave', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="font-medium text-red-900 mb-3">Zone de danger</h3>
                    <div className="space-y-3">
                      <button className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 transition-colors">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter mes données
                      </button>
                      <button className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 transition-colors">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de sauvegarde */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Sauvegarder les paramètres
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
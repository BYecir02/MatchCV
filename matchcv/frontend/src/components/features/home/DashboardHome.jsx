import React from 'react';
import { 
  FileText, 
  Send, 
  Eye, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import JobsService from '../../../services/api/jobs'; 

const DashboardHome = () => {
  const [lettersCount, setLettersCount] = React.useState(null);
  const [pendingCount, setPendingCount] = React.useState(null);

  // Charger le nombre de lettres générées au montage
  React.useEffect(() => {
    JobsService.getLettersCount().then(setLettersCount);
    JobsService.getPendingApplicationsCount().then(setPendingCount);
  }, []);

  const stats = [
    {
      title: 'Lettres générées',
      value: lettersCount !== null ? lettersCount : '...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: FileText,
      trend: '+3 cette semaine'
    },
    {
      title: 'Candidatures envoyées',
      value: pendingCount !== null ? pendingCount : '...',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: Send,
      trend: '+2 cette semaine'
    },
    {
      title: 'Réponses reçues',
      value: '3',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: Eye,
      trend: '+1 cette semaine'
    },
    {
      title: 'Taux de réponse',
      value: '37%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: TrendingUp,
      trend: '+5% ce mois'
    }
  ];

  const recentActivity = [
    {
      action: 'Lettre de motivation générée',
      company: 'TechCorp Solutions',
      time: 'Il y a 2 heures',
      status: 'success'
    },
    {
      action: 'Candidature envoyée',
      company: 'Digital Agency',
      time: 'Il y a 1 jour',
      status: 'pending'
    },
    {
      action: 'Réponse positive reçue',
      company: 'StartupXYZ',
      time: 'Il y a 3 jours',
      status: 'success'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="h-4 w-4 mr-2" />
          Dernière mise à jour : Aujourd'hui
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className=" bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-white mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité récente */}
        <div className=" bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-sm text-white">{activity.company}</p>
                </div>
                <p className="text-xs text-white">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className=" bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-md hover:bg-blue-50 rounded-lg transition-colors">
              <span className="flex items-center">
                <FileText className="h-5 w-5 text-blue-800 mr-3" />
                <span className="text-white font-medium">Générer une lettre</span>
              </span>
              <span className="text-blue-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-md hover:bg-green-50 rounded-lg transition-colors">
              <span className="flex items-center">
                <Target className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-white font-medium">Analyser une annonce</span>
              </span>
              <span className="text-green-600">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-md hover:bg-purple-50 rounded-lg transition-colors">
              <span className="flex items-center">
                <Send className="h-5 w-5 text-purple-800 mr-3" />
                <span className="text-white font-medium">Ajouter une candidature</span>
              </span>
              <span className="text-purple-600">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
import React, { useState } from 'react';
import { 
  Plus, 
  Filter,
  Search,
  Calendar,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const ApplicationTracker = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [applications, setApplications] = useState([
    {
      id: 1,
      company: 'TechCorp Solutions',
      position: 'Développeur Full-Stack',
      location: 'Paris, France',
      status: 'in_progress',
      appliedDate: '2025-01-10',
      lastUpdate: '2025-01-12',
      salary: '50-60k€',
      notes: 'Entretien téléphonique prévu jeudi'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      location: 'Lyon, France',
      status: 'accepted',
      appliedDate: '2025-01-05',
      lastUpdate: '2025-01-11',
      salary: '45-55k€',
      notes: 'Réponse positive ! Négociation en cours'
    },
    {
      id: 3,
      company: 'Digital Agency',
      position: 'React Developer',
      location: 'Remote',
      status: 'rejected',
      appliedDate: '2025-01-08',
      lastUpdate: '2025-01-10',
      salary: '40-50k€',
      notes: 'Profil ne correspond pas exactement'
    },
    {
      id: 4,
      company: 'InnovTech',
      position: 'JavaScript Developer',
      location: 'Marseille, France',
      status: 'pending',
      appliedDate: '2025-01-13',
      lastUpdate: '2025-01-13',
      salary: '42-52k€',
      notes: 'Candidature envoyée aujourd\'hui'
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    notes: ''
  });

  const statusConfig = {
    pending: { 
      label: 'En attente', 
      color: 'text-yellow-600', 
      bgColor: 'bg-yellow-100',
      icon: Clock 
    },
    in_progress: { 
      label: 'En cours', 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      icon: AlertCircle 
    },
    accepted: { 
      label: 'Acceptée', 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      icon: CheckCircle 
    },
    rejected: { 
      label: 'Refusée', 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      icon: XCircle 
    }
  };

  const handleAddApplication = (e) => {
    e.preventDefault();
    const application = {
      id: Date.now(),
      ...newApplication,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0]
    };
    
    setApplications([application, ...applications]);
    setNewApplication({ company: '', position: '', location: '', salary: '', notes: '' });
    setShowAddForm(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id 
        ? { ...app, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
        : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    in_progress: applications.filter(app => app.status === 'in_progress').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suivi des candidatures</h1>
          <p className="text-gray-600 mt-1">Gérez et suivez l'évolution de vos candidatures</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle candidature
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">En attente</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
          <div className="text-sm text-gray-600">En cours</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-sm text-gray-600">Acceptées</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Refusées</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par entreprise ou poste..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="in_progress">En cours</option>
              <option value="accepted">Acceptées</option>
              <option value="rejected">Refusées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune candidature trouvée</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((app) => {
              const StatusIcon = statusConfig[app.status].icon;
              return (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{app.position}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {app.company}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {app.location}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {app.appliedDate}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[app.status].bgColor} ${statusConfig[app.status].color}`}>
                            <StatusIcon className="h-4 w-4 mr-1" />
                            {statusConfig[app.status].label}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{app.salary}</div>
                        </div>
                      </div>
                      
                      {app.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{app.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">En attente</option>
                        <option value="in_progress">En cours</option>
                        <option value="accepted">Acceptée</option>
                        <option value="rejected">Refusée</option>
                      </select>
                      
                      <button className="p-2 text-gray-400 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle candidature</h3>
              
              <form onSubmit={handleAddApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    value={newApplication.company}
                    onChange={(e) => setNewApplication({...newApplication, company: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poste *
                  </label>
                  <input
                    type="text"
                    value={newApplication.position}
                    onChange={(e) => setNewApplication({...newApplication, position: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={newApplication.location}
                    onChange={(e) => setNewApplication({...newApplication, location: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire
                  </label>
                  <input
                    type="text"
                    value={newApplication.salary}
                    onChange={(e) => setNewApplication({...newApplication, salary: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 45-55k€"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newApplication.notes}
                    onChange={(e) => setNewApplication({...newApplication, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
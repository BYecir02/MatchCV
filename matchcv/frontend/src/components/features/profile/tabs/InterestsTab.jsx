import React, { useState } from 'react';
import { Heart, Trash2, Plus, Star, Tag } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const InterestsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingInterest, setAddingInterest] = useState(false);

  // ⭐ PROTECTION : Vérifier que profileData.interests existe
  const interests = profileData?.interests || [];

  const handleAddInterest = async () => {
    setAddingInterest(true);
    
    const newInterest = {
      interestName: '',
      category: 'Loisirs',
      description: '',
      level: 'Amateur',
      isActive: true,
      displayOrder: interests.length + 1 // ⭐ CHANGÉ : utiliser interests au lieu de profileData.interests
    };
    
    console.log('🎨 Ajout nouveau centre d\'intérêt:', newInterest);
    const result = await addItem('interests', newInterest);
    console.log('✅ Résultat ajout centre d\'intérêt:', result);
    
    setAddingInterest(false);
  };

  const handleUpdateInterest = (id, field, value) => {
    console.log(`🔄 Mise à jour centre d'intérêt ${id}:`, { [field]: value });
    updateItem('interests', id, field, value);
  };

  const handleRemoveInterest = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce centre d\'intérêt ?')) {
      console.log('🗑️ Suppression centre d\'intérêt:', id);
      const result = await removeItem('interests', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // Catégories avec icônes et suggestions
  const interestCategories = {
    'Sport': {
      icon: '🏃‍♂️',
      suggestions: [
        'Football', 'Basketball', 'Tennis', 'Natation', 'Course à pied', 'Fitness',
        'Yoga', 'Escalade', 'Cyclisme', 'Randonnée', 'Ski', 'Surf', 'Boxe', 'Danse'
      ]
    },
    'Arts': {
      icon: '🎨',
      suggestions: [
        'Peinture', 'Dessin', 'Sculpture', 'Photographie', 'Cinéma', 'Théâtre',
        'Arts plastiques', 'Street art', 'Calligraphie', 'Poterie', 'Bijouterie'
      ]
    },
    'Musique': {
      icon: '🎵',
      suggestions: [
        'Piano', 'Guitare', 'Chant', 'Batterie', 'Violon', 'DJ', 'Composition',
        'Jazz', 'Rock', 'Classique', 'Électro', 'Concerts', 'Festivals'
      ]
    },
    'Lecture': {
      icon: '📚',
      suggestions: [
        'Romans', 'Science-fiction', 'Biographies', 'Histoire', 'Philosophie',
        'Développement personnel', 'Poésie', 'BD/Manga', 'Essais', 'Polar'
      ]
    },
    'Cuisine': {
      icon: '👨‍🍳',
      suggestions: [
        'Cuisine française', 'Cuisine italienne', 'Cuisine asiatique', 'Pâtisserie',
        'Œnologie', 'Cocktails', 'Cuisine végétarienne', 'Barbecue', 'Boulangerie'
      ]
    },
    'Voyage': {
      icon: '✈️',
      suggestions: [
        'Backpacking', 'Road trip', 'Tourisme culturel', 'Écotourisme',
        'Photographie de voyage', 'Langues étrangères', 'Cultures du monde'
      ]
    },
    'Technologie': {
      icon: '💻',
      suggestions: [
        'Intelligence artificielle', 'Blockchain', 'IoT', 'Robotique', 'Drones',
        'Réalité virtuelle', 'Impression 3D', 'Arduino', 'Raspberry Pi', 'Gaming'
      ]
    },
    'Jeux': {
      icon: '🎮',
      suggestions: [
        'Jeux vidéo', 'Jeux de société', 'Échecs', 'Poker', 'Escape game',
        'Jeux de rôle', 'E-sport', 'Streaming', 'Puzzles', 'Quiz'
      ]
    },
    'Nature': {
      icon: '🌿',
      suggestions: [
        'Jardinage', 'Environnement', 'Observation d\'oiseaux', 'Géologie',
        'Astronomie', 'Camping', 'Survie', 'Permaculture', 'Écologie'
      ]
    },
    'Bénévolat': {
      icon: '🤝',
      suggestions: [
        'Aide aux personnes âgées', 'Protection animale', 'Environnement',
        'Éducation', 'Santé', 'Humanitaire', 'Sport associatif', 'Culture'
      ]
    },
    'Culture': {
      icon: '🏛️',
      suggestions: [
        'Musées', 'Architecture', 'Histoire', 'Archéologie', 'Généalogie',
        'Patrimoine', 'Expositions', 'Conférences', 'Débats'
      ]
    },
    'Collection': {
      icon: '💎',
      suggestions: [
        'Timbres', 'Pièces de monnaie', 'Cartes postales', 'Livres anciens',
        'Vinyles', 'Figurines', 'Montres', 'Art', 'Minéraux'
      ]
    },
    'Artisanat': {
      icon: '🔨',
      suggestions: [
        'Menuiserie', 'Couture', 'Tricot', 'Broderie', 'Maroquinerie',
        'Bijouterie', 'Restauration', 'DIY', 'Upcycling', 'Scrapbooking'
      ]
    },
    'Loisirs': {
      icon: '🎯',
      suggestions: [
        'Méditation', 'Bien-être', 'Mode', 'Décoration', 'Automobiles',
        'Motos', 'Bricolage', 'Généalogie', 'Astrologie'
      ]
    },
    'Autre': {
      icon: '⭐',
      suggestions: []
    }
  };

  // Niveaux avec descriptions
  const interestLevels = [
    { value: 'Débutant', label: 'Débutant', color: 'text-gray-500', description: 'Je découvre' },
    { value: 'Amateur', label: 'Amateur', color: 'text-blue-500', description: 'Je pratique régulièrement' },
    { value: 'Passionné', label: 'Passionné', color: 'text-orange-500', description: 'C\'est une passion' },
    { value: 'Expert', label: 'Expert', color: 'text-green-500', description: 'J\'ai une expertise avancée' },
    { value: 'Professionnel', label: 'Professionnel', color: 'text-purple-500', description: 'Niveau professionnel' }
  ];

  // ⭐ PROTECTION : Regrouper les intérêts par catégorie avec gestion des erreurs
  const groupedInterests = interests.reduce((acc, interest) => {
    const category = interest.category || 'Autre';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(interest);
    return acc;
  }, {});

  // Composant suggestions d'intérêts
  const InterestSuggestions = ({ category, onSelect }) => {
    const categoryData = interestCategories[category];
    if (!categoryData || categoryData.suggestions.length === 0) return null;

    return (
      <div className="mt-3">
        <p className="text-sm text-gray-600 mb-2">Suggestions populaires :</p>
        <div className="flex flex-wrap gap-2">
          {categoryData.suggestions.slice(0, 8).map(suggestion => (
            <button
              key={suggestion}
              onClick={() => onSelect(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-800 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ⭐ VÉRIFICATION : Si pas de données, afficher un message de chargement
  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Chargement des centres d'intérêt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Heart} 
        title="Centres d'intérêt et passions" 
        onAdd={handleAddInterest}
        addButtonText={addingInterest ? "Ajout..." : "Ajouter un centre d'intérêt"}
      />

      {/* Vue par catégories */}
      <div className="space-y-6">
        {Object.entries(groupedInterests).map(([category, categoryInterests]) => {
          const categoryData = interestCategories[category] || interestCategories['Autre'];
          
          return (
            <div key={category} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">{categoryData.icon}</span>
                {category} 
                <span className="ml-2 text-sm text-gray-500">({categoryInterests.length})</span>
              </h3>
              
              <div className="space-y-3">
                {categoryInterests.map((interest) => {
                  const isEmpty = !interest.interestName;
                  const levelInfo = interestLevels.find(l => l.value === interest.level) || interestLevels[1];
                  
                  return (
                    <div 
                      key={interest.id} 
                      className={`border rounded-lg p-4 bg-white ${
                        isEmpty ? 'border-pink-300 bg-pink-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">
                            {interest.interestName || '🎨 Nouveau centre d\'intérêt'}
                          </h4>
                          
                          {/* Badge niveau */}
                          {interest.interestName && (
                            <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${levelInfo.color}`}>
                              {levelInfo.label}
                            </span>
                          )}
                          
                          {/* Badge actif/inactif */}
                          {!interest.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              Inactif
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleRemoveInterest(interest.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Supprimer ce centre d'intérêt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {isEmpty && (
                        <div className="mb-4 p-3 bg-pink-100 border border-pink-200 rounded text-sm text-pink-800">
                          💝 <strong>Nouveau centre d'intérêt ajouté !</strong> Complétez les champs ci-dessous. 
                          La sauvegarde se fait automatiquement.
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nom du centre d'intérêt */}
                        <div className="space-y-1">
                          <FormField
                            label="Centre d'intérêt"
                            value={interest.interestName || ''}
                            onChange={(e) => handleUpdateInterest(interest.id, 'interestName', e.target.value)}
                            placeholder="ex: Photographie, Cuisine, Football..."
                            className={!interest.interestName ? 'border-pink-300' : ''}
                          />
                          
                          {/* Suggestions basées sur la catégorie */}
                          {isEmpty && (
                            <InterestSuggestions 
                              category={interest.category}
                              onSelect={(suggestion) => handleUpdateInterest(interest.id, 'interestName', suggestion)}
                            />
                          )}
                        </div>
                        
                        {/* Catégorie */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Catégorie
                          </label>
                          <select
                            value={interest.category || 'Loisirs'}
                            onChange={(e) => handleUpdateInterest(interest.id, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {Object.keys(interestCategories).map(cat => (
                              <option key={cat} value={cat}>
                                {interestCategories[cat].icon} {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Niveau */}
                        <div className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700">
                            Niveau de pratique
                          </label>
                          <select
                            value={interest.level || 'Amateur'}
                            onChange={(e) => handleUpdateInterest(interest.id, 'level', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {interestLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label} - {level.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Statut actif/inactif */}
                        <div className="flex items-center pt-6">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={interest.isActive !== false}
                              onChange={(e) => handleUpdateInterest(interest.id, 'isActive', e.target.checked)}
                              className="mr-2 h-4 w-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Centre d'intérêt actuel</span>
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mt-4">
                        <FormField
                          label="Description (optionnel)"
                          type="textarea"
                          value={interest.description || ''}
                          onChange={(e) => handleUpdateInterest(interest.id, 'description', e.target.value)}
                          rows={2}
                          placeholder="Décrivez votre passion, depuis quand vous la pratiquez, vos réalisations..."
                        />
                      </div>

                      {/* Debug info */}
                      <div className="mt-2 text-xs text-gray-400">
                        ID: {interest.id} | Ordre: {interest.displayOrder || 0} 
                        {isEmpty && ' | 🆕 Nouveau'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {interests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun centre d'intérêt ajouté</p>
            <p className="text-sm">Cliquez sur "Ajouter un centre d'intérêt" pour commencer</p>
          </div>
        )}
      </div>

      {/* Résumé des centres d'intérêt */}
      {interests.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Résumé de vos centres d'intérêt</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{interests.length}</div>
              <div className="text-blue-700">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {interests.filter(i => i.isActive !== false).length}
              </div>
              <div className="text-green-700">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(groupedInterests).length}
              </div>
              <div className="text-purple-700">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {interests.filter(i => ['Expert', 'Professionnel'].includes(i.level)).length}
              </div>
              <div className="text-orange-700">Niveau avancé</div>
            </div>
          </div>
          
          {/* Répartition par catégorie */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Vos domaines d'intérêt :</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(groupedInterests).map(([category, categoryInterests]) => {
                const categoryData = interestCategories[category] || interestCategories['Autre'];
                return (
                  <div 
                    key={category}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full flex items-center"
                  >
                    <span className="mr-1">{categoryData.icon}</span>
                    {category} ({categoryInterests.length})
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des centres d'intérêt
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(interests, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default InterestsTab;
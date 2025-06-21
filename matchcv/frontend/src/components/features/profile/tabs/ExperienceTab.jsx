import React from 'react';
import { Briefcase, Trash2, Loader2, Plus } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const ExperienceTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingExperience, setAddingExperience] = React.useState(false);

  const handleAddExperience = async () => {
    setAddingExperience(true);
    
    const newExp = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      location: '',
      description: '',
      achievements: [],
      technologiesUsed: [],
      displayOrder: profileData.experience.length + 1
    };
    
    console.log('🆕 Ajout nouvelle expérience:', newExp);
    const result = await addItem('experience', newExp);
    console.log('✅ Résultat ajout:', result);
    
    setAddingExperience(false);
  };

  const handleUpdateExperience = (id, field, value) => {
    console.log(`🔄 Mise à jour expérience ${id}:`, { [field]: value });
    updateItem('experience', id, field, value);
  };

  const handleRemoveExperience = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      console.log('🗑️ Suppression expérience:', id);
      const result = await removeItem('experience', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Briefcase} 
        title="Expérience professionnelle" 
        onAdd={handleAddExperience}
        addButtonText={addingExperience ? "Ajout..." : "Ajouter une expérience"}
      />

      <div className="space-y-4">
        {profileData.experience.map((exp) => {
          // Vérifier si c'est une expérience vide (nouvelle)
          const isEmpty = !exp.company && !exp.position && !exp.startDate;
          
          return (
            <div 
              key={exp.id} 
              className={`border rounded-lg p-4 ${
                isEmpty ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">
                  {exp.company || '✏️ Nouvelle expérience'} - {exp.position || 'Poste à définir'}
                </h3>
                <button
                  onClick={() => handleRemoveExperience(exp.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Supprimer cette expérience"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {isEmpty && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded text-sm text-blue-800">
                  📝 <strong>Nouvelle expérience ajoutée !</strong> Complétez les champs ci-dessous. 
                  La sauvegarde se fait automatiquement.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Entreprise"
                  value={exp.company || ''}
                  onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Nom de l'entreprise"
                  className={!exp.company ? 'border-blue-300' : ''}
                />
                <FormField
                  label="Poste"
                  value={exp.position || ''}
                  onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Votre poste"
                  className={!exp.position ? 'border-blue-300' : ''}
                />
                <FormField
                  label="Lieu"
                  value={exp.location || ''}
                  onChange={(e) => handleUpdateExperience(exp.id, 'location', e.target.value)}
                  placeholder="Ville, Pays"
                />
                <FormField
                  label="Date de début"
                  type="month"
                  value={exp.startDate || ''}
                  onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                  className={!exp.startDate ? 'border-blue-300' : ''}
                />
                <FormField
                  label="Date de fin"
                  type="month"
                  value={exp.isCurrent ? '' : (exp.endDate || '')}
                  onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.isCurrent}
                />
                <div className="flex items-center pt-8">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent || false}
                      onChange={(e) => {
                        handleUpdateExperience(exp.id, 'isCurrent', e.target.checked);
                        if (e.target.checked) {
                          handleUpdateExperience(exp.id, 'endDate', '');
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Poste actuel</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <FormField
                  label="Description"
                  type="textarea"
                  value={exp.description || ''}
                  onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Décrivez vos missions, réalisations et technologies utilisées..."
                />
              </div>

              <div className="mt-2 text-xs text-gray-400">
                ID: {exp.id} | Ordre: {exp.displayOrder || 0} 
                {isEmpty && ' | 🆕 Nouvelle'}
              </div>
            </div>
          );
        })}
        
        {profileData.experience.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune expérience ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une expérience" pour commencer</p>
          </div>
        )}
      </div>

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des expériences
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.experience, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default ExperienceTab;
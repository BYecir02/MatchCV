import React, { useState } from 'react';
import { GraduationCap, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const EducationTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingEducation, setAddingEducation] = useState(false);

  const handleAddEducation = async () => {
    setAddingEducation(true);
    
    const newEducation = {
      institutionName: '',
      degreeType: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: '',
      description: '',
      honors: [],
      displayOrder: profileData.education.length + 1
    };
    
    console.log('🎓 Ajout nouvelle formation:', newEducation);
    const result = await addItem('education', newEducation);
    console.log('✅ Résultat ajout formation:', result);
    
    setAddingEducation(false);
  };

  const handleUpdateEducation = (id, field, value) => {
    console.log(`🔄 Mise à jour formation ${id}:`, { [field]: value });
    updateItem('education', id, field, value);
  };

  const handleRemoveEducation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      console.log('🗑️ Suppression formation:', id);
      const result = await removeItem('education', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // Options prédéfinies pour les types de diplômes
  const degreeTypes = [
    'Licence',
    'Master',
    'Doctorat',
    'BTS',
    'DUT',
    'Diplôme d\'ingénieur',
    'MBA',
    'Certificat',
    'Formation professionnelle',
    'Autre'
  ];

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={GraduationCap} 
        title="Formation et éducation" 
        onAdd={handleAddEducation}
        addButtonText={addingEducation ? "Ajout..." : "Ajouter une formation"}
      />

      <div className="space-y-4">
        {profileData.education.map((edu) => {
          // Vérifier si c'est une formation vide (nouvelle)
          const isEmpty = !edu.institutionName && !edu.degreeType && !edu.fieldOfStudy;
          
          return (
            <div 
              key={edu.id} 
              className={`border rounded-lg p-4 ${
                isEmpty ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">
                  {edu.degreeType || '🎓 Nouvelle formation'} 
                  {edu.fieldOfStudy && ` en ${edu.fieldOfStudy}`}
                  {edu.institutionName && ` - ${edu.institutionName}`}
                </h3>
                <button
                  onClick={() => handleRemoveEducation(edu.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Supprimer cette formation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {isEmpty && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded text-sm text-green-800">
                  📚 <strong>Nouvelle formation ajoutée !</strong> Complétez les champs ci-dessous. 
                  La sauvegarde se fait automatiquement.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ligne 1 : Institution et Type de diplôme */}
                <FormField
                  label="École/Université"
                  value={edu.institutionName || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'institutionName', e.target.value)}
                  placeholder="Nom de l'établissement"
                  className={!edu.institutionName ? 'border-green-300' : ''}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Type de diplôme
                  </label>
                  <select
                    value={edu.degreeType || ''}
                    onChange={(e) => handleUpdateEducation(edu.id, 'degreeType', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !edu.degreeType ? 'border-green-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez un type</option>
                    {degreeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Ligne 2 : Domaine d'études et Lieu */}
                <FormField
                  label="Domaine d'études"
                  value={edu.fieldOfStudy || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                  placeholder="ex: Informatique, Marketing, Droit..."
                  className={!edu.fieldOfStudy ? 'border-green-300' : ''}
                />
                
                <FormField
                  label="Lieu"
                  value={edu.location || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                  placeholder="Ville, Pays"
                />

                {/* Ligne 3 : Dates */}
                <FormField
                  label="Date de début"
                  type="month"
                  value={edu.startDate || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                />
                
                <FormField
                  label="Date de fin"
                  type="month"
                  value={edu.endDate || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                />

                {/* Ligne 4 : Note/Mention */}
                <FormField
                  label="Note/Mention"
                  value={edu.grade || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'grade', e.target.value)}
                  placeholder="ex: Mention Bien, 15/20, A..."
                />
              </div>
              
              {/* Description */}
              <div className="mt-4">
                <FormField
                  label="Description"
                  type="textarea"
                  value={edu.description || ''}
                  onChange={(e) => handleUpdateEducation(edu.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Décrivez les matières principales, projets, stages réalisés..."
                />
              </div>

              {/* Distinctions/Honneurs */}
              <div className="mt-4">
                <FormField
                  label="Distinctions/Honneurs (séparés par des virgules)"
                  value={Array.isArray(edu.honors) ? edu.honors.join(', ') : (edu.honors || '')}
                  onChange={(e) => {
                    const honorsArray = e.target.value.split(',').map(h => h.trim()).filter(h => h);
                    handleUpdateEducation(edu.id, 'honors', honorsArray);
                  }}
                  placeholder="ex: Major de promotion, Bourse d'excellence, Prix du meilleur projet..."
                />
              </div>

              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-400">
                ID: {edu.id} | Ordre: {edu.displayOrder || 0} 
                {isEmpty && ' | 🆕 Nouvelle'}
              </div>
            </div>
          );
        })}
        
        {profileData.education.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune formation ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une formation" pour commencer</p>
          </div>
        )}
      </div>

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des formations
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.education, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default EducationTab;
import React, { useState } from 'react';
import { Badge, Trash2, Plus, ExternalLink, Calendar, Award } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const CertificationsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const [addingCertification, setAddingCertification] = useState(false);

  const handleAddCertification = async () => {
    setAddingCertification(true);
    
    const newCertification = {
      certificationName: '',
      issuingOrganization: '',
      credentialId: '',
      issueDate: '',
      expirationDate: '',
      credentialUrl: '',
      neverExpires: false,
      displayOrder: profileData.certifications.length + 1
    };
    
    console.log('🏆 Ajout nouvelle certification:', newCertification);
    const result = await addItem('certifications', newCertification);
    console.log('✅ Résultat ajout certification:', result);
    
    setAddingCertification(false);
  };

  const handleUpdateCertification = (id, field, value) => {
    console.log(`🔄 Mise à jour certification ${id}:`, { [field]: value });
    updateItem('certifications', id, field, value);
  };

  const handleRemoveCertification = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) {
      console.log('🗑️ Suppression certification:', id);
      const result = await removeItem('certifications', id);
      console.log('✅ Résultat suppression:', result);
    }
  };

  // Options prédéfinies pour les organismes populaires
  const popularIssuers = [
    'Microsoft',
    'Google',
    'Amazon (AWS)',
    'Cisco',
    'Adobe',
    'Oracle',
    'IBM',
    'Salesforce',
    'CompTIA',
    'PMI (Project Management Institute)',
    'ITIL',
    'Scrum Alliance',
    'LinkedIn Learning',
    'Coursera',
    'Udemy',
    'Autre'
  ];

  // Fonction pour déterminer si une certification est expirée
  const isExpired = (cert) => {
    if (cert.neverExpires || !cert.expirationDate) return false;
    return new Date(cert.expirationDate) < new Date();
  };

  // Fonction pour déterminer si une certification expire bientôt (dans les 3 mois)
  const expiresSoon = (cert) => {
    if (cert.neverExpires || !cert.expirationDate) return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return new Date(cert.expirationDate) <= threeMonthsFromNow;
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Badge} 
        title="Certifications et qualifications" 
        onAdd={handleAddCertification}
        addButtonText={addingCertification ? "Ajout..." : "Ajouter une certification"}
      />

      <div className="space-y-4">
        {profileData.certifications.map((cert) => {
          // Vérifier si c'est une certification vide (nouvelle)
          const isEmpty = !cert.certificationName && !cert.issuingOrganization;
          const expired = isExpired(cert);
          const expiringSoon = expiresSoon(cert);
          
          return (
            <div 
              key={cert.id} 
              className={`border rounded-lg p-4 ${
                isEmpty ? 'border-yellow-300 bg-yellow-50' : 
                expired ? 'border-red-300 bg-red-50' :
                expiringSoon ? 'border-orange-300 bg-orange-50' :
                'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">
                    {cert.certificationName || '🏆 Nouvelle certification'}
                    {cert.issuingOrganization && ` - ${cert.issuingOrganization}`}
                  </h3>
                  
                  {/* Badges de statut */}
                  <div className="flex space-x-2">
                    {cert.neverExpires && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        N'expire jamais
                      </span>
                    )}
                    {expired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Expirée
                      </span>
                    )}
                    {expiringSoon && !expired && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Expire bientôt
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Vérifier
                      </a>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleRemoveCertification(cert.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Supprimer cette certification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {isEmpty && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-200 rounded text-sm text-yellow-800">
                  🏅 <strong>Nouvelle certification ajoutée !</strong> Complétez les champs ci-dessous. 
                  La sauvegarde se fait automatiquement.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ligne 1 : Nom et Organisme */}
                <FormField
                  label="Nom de la certification"
                  value={cert.certificationName || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'certificationName', e.target.value)}
                  placeholder="ex: AWS Certified Solutions Architect"
                  className={!cert.certificationName ? 'border-yellow-300' : ''}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Organisme émetteur
                  </label>
                  <div className="relative">
                    <input
                      list={`issuers-${cert.id}`}
                      value={cert.issuingOrganization || ''}
                      onChange={(e) => handleUpdateCertification(cert.id, 'issuingOrganization', e.target.value)}
                      placeholder="Sélectionnez ou tapez..."
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        !cert.issuingOrganization ? 'border-yellow-300' : 'border-gray-300'
                      }`}
                    />
                    <datalist id={`issuers-${cert.id}`}>
                      {popularIssuers.map(issuer => (
                        <option key={issuer} value={issuer} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Ligne 2 : ID et URL */}
                <FormField
                  label="ID de certification"
                  value={cert.credentialId || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="Numéro ou code de certification"
                />
                
                <FormField
                  label="URL de vérification"
                  type="url"
                  value={cert.credentialUrl || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'credentialUrl', e.target.value)}
                  placeholder="https://..."
                />

                {/* Ligne 3 : Dates */}
                <FormField
                  label="Date d'obtention"
                  type="date"
                  value={cert.issueDate || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'issueDate', e.target.value)}
                />
                
                <FormField
                  label="Date d'expiration"
                  type="date"
                  value={cert.expirationDate || ''}
                  onChange={(e) => handleUpdateCertification(cert.id, 'expirationDate', e.target.value)}
                  disabled={cert.neverExpires}
                />
              </div>

              {/* Option "N'expire jamais" */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cert.neverExpires || false}
                    onChange={(e) => {
                      handleUpdateCertification(cert.id, 'neverExpires', e.target.checked);
                      if (e.target.checked) {
                        handleUpdateCertification(cert.id, 'expirationDate', '');
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Cette certification n'expire jamais</span>
                </label>
              </div>

              {/* Informations de statut */}
              {cert.issueDate && cert.expirationDate && !cert.neverExpires && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Valide du {new Date(cert.issueDate).toLocaleDateString('fr-FR')} 
                        au {new Date(cert.expirationDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {expired && (
                      <span className="text-red-600 font-medium">⚠️ Expirée</span>
                    )}
                    {expiringSoon && !expired && (
                      <span className="text-orange-600 font-medium">⏰ Expire bientôt</span>
                    )}
                  </div>
                </div>
              )}

              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-400">
                ID: {cert.id} | Ordre: {cert.displayOrder || 0} 
                {isEmpty && ' | 🆕 Nouvelle'}
              </div>
            </div>
          );
        })}
        
        {profileData.certifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Badge className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune certification ajoutée</p>
            <p className="text-sm">Cliquez sur "Ajouter une certification" pour commencer</p>
          </div>
        )}
      </div>

      {/* Résumé des certifications */}
      {profileData.certifications.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">📊 Résumé de vos certifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profileData.certifications.length}</div>
              <div className="text-blue-700">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {profileData.certifications.filter(c => c.neverExpires || (!isExpired(c) && c.expirationDate)).length}
              </div>
              <div className="text-green-700">Valides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {profileData.certifications.filter(c => expiresSoon(c) && !isExpired(c)).length}
              </div>
              <div className="text-orange-700">Expirent bientôt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {profileData.certifications.filter(c => isExpired(c)).length}
              </div>
              <div className="text-red-700">Expirées</div>
            </div>
          </div>
        </div>
      )}

      {/* Debug info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">
          🔍 Debug - Données des certifications
        </summary>
        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto">
          {JSON.stringify(profileData.certifications, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default CertificationsTab;
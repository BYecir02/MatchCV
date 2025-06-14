import React from 'react';
import { Badge, Trash2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import FormField from '../components/FormField';

const CertificationsTab = ({ profileData, addItem, updateItem, removeItem }) => {
  const handleAddCertification = () => {
    const newCert = {
      certificationName: '',
      issuingOrganization: '',
      credentialId: '',
      issueDate: '',
      expirationDate: '',
      credentialUrl: '',
      neverExpires: false,
      displayOrder: profileData.certifications.length + 1
    };
    addItem('certifications', newCert);
  };

  const handleUpdateCertification = (id, field, value) => {
    updateItem('certifications', id, field, value);
  };

  const handleRemoveCertification = (id) => {
    removeItem('certifications', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        icon={Badge} 
        title="Certifications" 
        onAdd={handleAddCertification}
        addButtonText="Ajouter une certification"
      />

      <div className="space-y-4">
        {profileData.certifications.map((cert) => (
          <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Certification #{cert.id}</h3>
              <button
                onClick={() => handleRemoveCertification(cert.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nom de la certification"
                value={cert.certificationName}
                onChange={(e) => handleUpdateCertification(cert.id, 'certificationName', e.target.value)}
              />
              <FormField
                label="Organisme émetteur"
                value={cert.issuingOrganization}
                onChange={(e) => handleUpdateCertification(cert.id, 'issuingOrganization', e.target.value)}
              />
              <FormField
                label="ID de certification"
                value={cert.credentialId}
                onChange={(e) => handleUpdateCertification(cert.id, 'credentialId', e.target.value)}
              />
              <FormField
                label="Date d'obtention"
                type="date"
                value={cert.issueDate}
                onChange={(e) => handleUpdateCertification(cert.id, 'issueDate', e.target.value)}
              />
              <FormField
                label="Date d'expiration"
                type="date"
                value={cert.expirationDate}
                onChange={(e) => handleUpdateCertification(cert.id, 'expirationDate', e.target.value)}
                disabled={cert.neverExpires}
              />
              <FormField
                label="URL de vérification"
                type="url"
                value={cert.credentialUrl}
                onChange={(e) => handleUpdateCertification(cert.id, 'credentialUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={cert.neverExpires}
                  onChange={(e) => handleUpdateCertification(cert.id, 'neverExpires', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Cette certification n'expire jamais</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsTab;
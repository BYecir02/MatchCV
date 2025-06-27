import React, { useState } from 'react';
import TemplateGrid from './components/TemplateGrid';
import Miniature from './components/Miniature';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CVEditor from './components/CVEditor';

const templates = [
  { id: 'modern', name: 'Moderne', component: ModernTemplate },
  { id: 'classic', name: 'Classique', component: ClassicTemplate },
  { id: 'creative', name: 'Créatif', component: CreativeTemplate },
  { id: 'minimal', name: 'Minimaliste', component: MinimalTemplate },
];

const CVGenerator = ({ user, initialData, onNavigateToLetters, onNavigateToCV, onNavigateBack, onNavigateToAnalyzer, onNavigateToTracker }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: 'Sophie',
      lastName: 'Martin',
      title: 'Développeuse Web',
      email: 'sophie.martin@email.com',
      phone: '06 12 34 56 78',
      address: 'Paris, France',
      linkedin: 'linkedin.com/in/sophiemartin'
    },
    summary: "Développeuse web passionnée avec 4 ans d'expérience en React et Node.js. Forte capacité à travailler en équipe et à livrer des projets modernes et performants.",
    experience: [
      {
        company: 'Tech Innov',
        position: 'Développeuse Frontend',
        start: '2022',
        end: '2024',
        description: "Développement d'applications React, intégration UI/UX, collaboration agile."
      },
      {
        company: 'Web Solutions',
        position: 'Développeuse Fullstack',
        start: '2020',
        end: '2022',
        description: "Création d'APIs Node.js, gestion de bases de données MongoDB, déploiement cloud."
      }
    ],
    education: [
      {
        school: 'Université Paris-Saclay',
        degree: 'Master Informatique',
        year: '2020'
      }
    ],
    skills: ['React', 'Node.js', 'JavaScript', 'CSS', 'Git', 'Figma']
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Générateur de CV</h1>
            <p className="text-white/80">Choisissez un template et créez votre CV professionnel</p>
          </div>
          <TemplateGrid>
            {templates.map((tpl) => (
              <div key={tpl.id} onClick={() => handleTemplateSelect(tpl)} style={{ cursor: 'pointer' }}>
                <Miniature template={<tpl.component />} />
              </div>
            ))}
          </TemplateGrid>
        </div>
      ) : (
        <CVEditor 
          template={selectedTemplate}
          cvData={cvData}
          setCvData={setCvData}
          onBack={handleBackToTemplates}
        />
      )}
    </div>
  );
};

export default CVGenerator;

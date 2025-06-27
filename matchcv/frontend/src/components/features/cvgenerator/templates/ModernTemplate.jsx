import React from 'react';

const ModernTemplate = ({ data, onSectionClick }) => {
  // Données d'exemple si aucune data n'est passée
  const cv = data || {
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
  };

  const handleSectionClick = (section) => {
    if (onSectionClick) {
      onSectionClick(section);
    }
  };

  // Dimensions A4 en pixels (à 96 DPI)
  const a4Width = 794; // 210mm
  const a4Height = 1123; // 297mm

  return (
    <div 
      className="bg-white shadow-lg border border-gray-200 text-gray-900 mx-auto"
      style={{
        width: a4Width,
        height: a4Height,
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '10px',
        lineHeight: '1.4'
      }}
    >
      {/* Header coloré */}
      <div 
        className="bg-blue-600 text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={() => handleSectionClick('personal')}
        style={{ minHeight: '120px' }}
      >
        <div>
          <h1 className="text-xl font-bold mb-1">{cv.personalInfo.firstName} {cv.personalInfo.lastName}</h1>
          <div className="text-blue-100 text-sm">{cv.personalInfo.title}</div>
        </div>
        <div className="mt-3 md:mt-0 text-blue-100 text-xs space-y-1">
          <div>{cv.personalInfo.email}</div>
          <div>{cv.personalInfo.phone}</div>
          <div>{cv.personalInfo.address}</div>
          <div>{cv.personalInfo.linkedin}</div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="px-6 py-4">
        {/* Résumé */}
        <div 
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded"
          onClick={() => handleSectionClick('personal')}
        >
          <div className="font-semibold text-blue-700 mb-1 text-xs uppercase tracking-wide">Profil</div>
          <div className="text-xs leading-relaxed">{cv.summary}</div>
        </div>
        
        {/* Expérience */}
        <div 
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded"
          onClick={() => handleSectionClick('experience')}
        >
          <div className="font-semibold text-blue-700 mb-2 text-xs uppercase tracking-wide">Expérience professionnelle</div>
          {cv.experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{exp.position}</span>
                <span className="text-xs text-gray-500">{exp.start} - {exp.end}</span>
              </div>
              <div className="text-blue-800 text-xs font-medium mb-1">{exp.company}</div>
              <div className="text-gray-700 text-xs leading-relaxed">{exp.description}</div>
            </div>
          ))}
        </div>
        
        {/* Formation */}
        <div 
          className="mb-4 cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded"
          onClick={() => handleSectionClick('education')}
        >
          <div className="font-semibold text-blue-700 mb-2 text-xs uppercase tracking-wide">Formation</div>
          {cv.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold text-sm">{edu.degree}</span> - <span className="text-sm">{edu.school}</span> <span className="text-xs text-gray-500">({edu.year})</span>
            </div>
          ))}
        </div>
        
        {/* Compétences */}
        <div 
          className="cursor-pointer hover:bg-gray-50 transition-colors p-2 rounded"
          onClick={() => handleSectionClick('skills')}
        >
          <div className="font-semibold text-blue-700 mb-2 text-xs uppercase tracking-wide">Compétences</div>
          <div className="flex flex-wrap gap-1">
            {cv.skills.map((skill, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate; 
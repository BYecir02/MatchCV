import React from 'react';

const MinimalTemplate = ({ data }) => {
  // Données d'exemple si aucune data n'est passée
  const cv = data || {
    personalInfo: {
      firstName: 'Lucas',
      lastName: 'Moreau',
      title: 'Data Scientist',
      email: 'lucas.moreau@email.com',
      phone: '07 65 43 21 09',
      address: 'Toulouse, France',
      linkedin: 'linkedin.com/in/lucasmoreau',
      github: 'github.com/lucasmoreau'
    },
    summary: "Data Scientist avec 3 ans d'expérience en machine learning et analyse de données. Spécialisé dans les modèles prédictifs et l'optimisation de processus métier.",
    experience: [
      {
        company: 'DataCorp',
        position: 'Data Scientist',
        start: '2022',
        end: '2024',
        description: "Développement de modèles ML, analyse prédictive, optimisation des processus."
      },
      {
        company: 'TechLab',
        position: 'Stagiaire Data',
        start: '2021',
        end: '2022',
        description: "Préparation de données, visualisation, premiers modèles de classification."
      }
    ],
    education: [
      {
        school: 'Université Paul Sabatier',
        degree: 'Master Data Science',
        year: '2021'
      }
    ],
    skills: ['Python', 'R', 'TensorFlow', 'SQL', 'Tableau', 'Git']
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white text-gray-900 text-sm" style={{fontFamily:'Helvetica, Arial, sans-serif'}}>
      {/* Header minimaliste */}
      <div className="px-8 py-8 border-b border-gray-200">
        <h1 className="text-2xl font-light mb-1">{cv.personalInfo.firstName} {cv.personalInfo.lastName}</h1>
        <div className="text-lg text-gray-600 mb-4">{cv.personalInfo.title}</div>
        <div className="space-y-1 text-sm text-gray-500">
          <div>{cv.personalInfo.email}</div>
          <div>{cv.personalInfo.phone}</div>
          <div>{cv.personalInfo.address}</div>
          <div>{cv.personalInfo.linkedin}</div>
        </div>
      </div>
      
      {/* Résumé */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">Profil</h2>
        <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
      </div>
      
      {/* Expérience */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">Expérience</h2>
        {cv.experience.map((exp, i) => (
          <div key={i} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900">{exp.position}</span>
              <span className="text-xs text-gray-500">{exp.start} - {exp.end}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">{exp.company}</div>
            <p className="text-sm text-gray-700">{exp.description}</p>
          </div>
        ))}
      </div>
      
      {/* Formation */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">Formation</h2>
        {cv.education.map((edu, i) => (
          <div key={i} className="mb-2 last:mb-0">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">{edu.degree}</span>
              <span className="text-xs text-gray-500">{edu.year}</span>
            </div>
            <div className="text-sm text-gray-600">{edu.school}</div>
          </div>
        ))}
      </div>
      
      {/* Compétences */}
      <div className="px-8 py-6">
        <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-3">Compétences</h2>
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((skill, i) => (
            <span key={i} className="text-sm text-gray-700 border border-gray-300 px-3 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate; 
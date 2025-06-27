import React from 'react';

const ClassicTemplate = ({ data }) => {
  // Données d'exemple si aucune data n'est passée
  const cv = data || {
    personalInfo: {
      firstName: 'Thomas',
      lastName: 'Dubois',
      title: 'Ingénieur Logiciel Senior',
      email: 'thomas.dubois@email.com',
      phone: '01 23 45 67 89',
      address: 'Lyon, France',
      linkedin: 'linkedin.com/in/thomasdubois'
    },
    summary: "Ingénieur logiciel expérimenté avec 8 ans d'expérience dans le développement d'applications d'entreprise. Spécialisé en Java, Spring Boot et architecture microservices.",
    experience: [
      {
        company: 'Grande Entreprise SA',
        position: 'Ingénieur Logiciel Senior',
        start: '2020',
        end: '2024',
        description: "Développement d'applications critiques, mentorat junior, architecture système."
      },
      {
        company: 'TechCorp',
        position: 'Développeur Backend',
        start: '2016',
        end: '2020',
        description: "Création d'APIs REST, optimisation de performances, maintenance système."
      }
    ],
    education: [
      {
        school: 'École Centrale de Lyon',
        degree: 'Diplôme d\'Ingénieur',
        year: '2016'
      }
    ],
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'Maven']
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 text-gray-900 text-sm" style={{fontFamily:'Times New Roman, serif'}}>
      {/* Header */}
      <div className="border-b-2 border-black px-8 py-6">
        <h1 className="text-3xl font-bold text-center mb-2">{cv.personalInfo.firstName} {cv.personalInfo.lastName}</h1>
        <div className="text-xl text-center text-gray-700 mb-4">{cv.personalInfo.title}</div>
        <div className="flex justify-center space-x-8 text-sm">
          <span>{cv.personalInfo.email}</span>
          <span>{cv.personalInfo.phone}</span>
          <span>{cv.personalInfo.address}</span>
        </div>
      </div>
      
      {/* Résumé */}
      <div className="px-8 py-4">
        <h2 className="text-lg font-bold border-b border-gray-400 mb-2">PROFIL PROFESSIONNEL</h2>
        <p className="text-justify">{cv.summary}</p>
      </div>
      
      {/* Expérience */}
      <div className="px-8 py-4">
        <h2 className="text-lg font-bold border-b border-gray-400 mb-3">EXPÉRIENCE PROFESSIONNELLE</h2>
        {cv.experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">{exp.position}</span>
              <span className="text-sm">{exp.start} - {exp.end}</span>
            </div>
            <div className="font-semibold text-gray-700 mb-1">{exp.company}</div>
            <p className="text-sm">{exp.description}</p>
          </div>
        ))}
      </div>
      
      {/* Formation */}
      <div className="px-8 py-4">
        <h2 className="text-lg font-bold border-b border-gray-400 mb-3">FORMATION</h2>
        {cv.education.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{edu.degree}</span>
              <span className="text-sm">{edu.year}</span>
            </div>
            <div className="text-gray-700">{edu.school}</div>
          </div>
        ))}
      </div>
      
      {/* Compétences */}
      <div className="px-8 py-4">
        <h2 className="text-lg font-bold border-b border-gray-400 mb-3">COMPÉTENCES TECHNIQUES</h2>
        <div className="grid grid-cols-2 gap-2">
          {cv.skills.map((skill, i) => (
            <div key={i} className="text-sm">• {skill}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate; 
import React from 'react';

const CreativeTemplate = ({ data }) => {
  // Données d'exemple si aucune data n'est passée
  const cv = data || {
    personalInfo: {
      firstName: 'Emma',
      lastName: 'Rousseau',
      title: 'Designer UX/UI & Développeuse Frontend',
      email: 'emma.rousseau@email.com',
      phone: '06 98 76 54 32',
      address: 'Bordeaux, France',
      linkedin: 'linkedin.com/in/emmarousseau',
      portfolio: 'emmarousseau.design'
    },
    summary: "Designer UX/UI créative avec 5 ans d'expérience en conception d'interfaces utilisateur et développement frontend. Passionnée par l'expérience utilisateur et les technologies web modernes.",
    experience: [
      {
        company: 'Studio Créatif',
        position: 'Designer UX/UI Senior',
        start: '2021',
        end: '2024',
        description: "Conception d'interfaces utilisateur, prototypage, tests utilisateurs, collaboration avec les développeurs."
      },
      {
        company: 'Agence Digital',
        position: 'Designer & Développeuse',
        start: '2019',
        end: '2021',
        description: "Design de sites web, développement frontend, animations CSS, optimisation mobile."
      }
    ],
    education: [
      {
        school: 'École des Beaux-Arts de Bordeaux',
        degree: 'Master Design Numérique',
        year: '2019'
      }
    ],
    skills: ['Figma', 'Adobe Creative Suite', 'React', 'CSS/SCSS', 'Prototypage', 'Design Thinking']
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl overflow-hidden border border-purple-200 text-gray-900 text-sm" style={{fontFamily:'Poppins, sans-serif'}}>
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 text-white px-8 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{cv.personalInfo.firstName} {cv.personalInfo.lastName}</h1>
          <div className="text-xl text-purple-100 mb-4">{cv.personalInfo.title}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">📧</span>
              <span>{cv.personalInfo.email}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📱</span>
              <span>{cv.personalInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              <span>{cv.personalInfo.address}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">💼</span>
              <span>{cv.personalInfo.portfolio}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Résumé avec icône */}
      <div className="px-8 py-6 bg-white">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">✨</span>
          </div>
          <h2 className="text-lg font-bold text-purple-700">À PROPOS</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
      </div>
      
      {/* Expérience avec timeline */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">🚀</span>
          </div>
          <h2 className="text-lg font-bold text-purple-700">EXPÉRIENCE</h2>
        </div>
        {cv.experience.map((exp, i) => (
          <div key={i} className="mb-4 relative pl-6 border-l-2 border-purple-300">
            <div className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full -ml-1.5"></div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-purple-700">{exp.position}</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{exp.start} - {exp.end}</span>
              </div>
              <div className="text-sm font-semibold text-gray-600 mb-2">{exp.company}</div>
              <p className="text-sm text-gray-700">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Formation */}
      <div className="px-8 py-6 bg-white">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">🎓</span>
          </div>
          <h2 className="text-lg font-bold text-purple-700">FORMATION</h2>
        </div>
        {cv.education.map((edu, i) => (
          <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-purple-700">{edu.degree}</span>
              <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">{edu.year}</span>
            </div>
            <div className="text-sm text-gray-600">{edu.school}</div>
          </div>
        ))}
      </div>
      
      {/* Compétences avec badges colorés */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">🎨</span>
          </div>
          <h2 className="text-lg font-bold text-purple-700">COMPÉTENCES</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {cv.skills.map((skill, i) => (
            <span key={i} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate; 
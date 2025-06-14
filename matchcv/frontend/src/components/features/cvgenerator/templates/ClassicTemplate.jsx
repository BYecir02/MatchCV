import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Award, GraduationCap, Briefcase } from 'lucide-react';

const ClassicTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications } = cvData;

  return (
    <div className={`bg-white max-w-4xl mx-auto ${className}`} style={{ minHeight: '297mm' }}>
      {/* Header centré */}
      <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4">{personalInfo.title}</h2>
        
        {/* Contacts en ligne */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1" />
              <span>{personalInfo.linkedin.replace('https://', '')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Résumé */}
        {summary && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
              Profil Professionnel
            </h3>
            <hr className="border-gray-300 mb-4" />
            <p className="text-gray-700 leading-relaxed text-center italic">{summary}</p>
          </section>
        )}

        {/* Expérience */}
        {experience && experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
              Expérience Professionnelle
            </h3>
            <hr className="border-gray-300 mb-4" />
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{exp.position}</h4>
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{exp.period}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {index < experience.length - 1 && <hr className="mt-4 border-gray-200" />}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formation */}
          {education && education.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
                Formation
              </h3>
              <hr className="border-gray-300 mb-4" />
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                    <p className="text-gray-600 font-medium">{edu.school}</p>
                    <div className="text-sm text-gray-500">
                      <p>{edu.period}</p>
                      {edu.location && <p>{edu.location}</p>}
                      {edu.grade && <p><em>Mention: {edu.grade}</em></p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compétences et Langues */}
          <section>
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
                  Compétences
                </h3>
                <hr className="border-gray-300 mb-4" />
                <div className="grid grid-cols-2 gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="text-center">
                      <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                        skill.highlighted 
                          ? 'bg-gray-800 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages && languages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
                  Langues
                </h3>
                <hr className="border-gray-300 mb-4" />
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-100 pb-1">
                      <span className="font-medium text-gray-800">{lang.name}</span>
                      <span className="text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center uppercase tracking-wide">
                  Certifications
                </h3>
                <hr className="border-gray-300 mb-4" />
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="text-center">
                      <h4 className="font-medium text-gray-800">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClassicTemplate;
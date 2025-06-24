import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Award, GraduationCap, Briefcase } from 'lucide-react';

const MinimalTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications } = cvData;

  return (
    <div className={`bg-white mx-auto print:shadow-none ${className}`} 
         style={{ 
           maxWidth: '210mm', 
           minHeight: '297mm',
           width: '100%',
           '@media print': {
             maxWidth: '210mm',
             width: '210mm'
           }
         }}>
      
      {/* Header minimaliste */}
      <div className="border-b border-gray-300 pb-4 sm:pb-6 mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-600 font-light mb-3 sm:mb-4">{personalInfo.title}</h2>
        
        {/* Contacts */}
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{personalInfo.linkedin.replace('https://', '')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Résumé */}
        {summary && (
          <section className="mb-6 sm:mb-8">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base italic">{summary}</p>
          </section>
        )}

        {/* Expérience */}
        {experience && experience.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide">
              Expérience
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 sm:pl-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600 text-sm sm:text-base">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm text-gray-500">{exp.period}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm sm:text-base mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Formation */}
          {education && education.length > 0 && (
            <section>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide">
                Formation
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4 sm:pl-6">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base">{edu.degree}</h4>
                    <p className="text-gray-600 text-sm sm:text-base">{edu.school}</p>
                    <div className="text-sm text-gray-500">
                      <p>{edu.period}</p>
                      {edu.location && <p>{edu.location}</p>}
                      {edu.grade && <p>Mention: {edu.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compétences et autres */}
          <section>
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                  Compétences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Langues */}
            {languages && languages.length > 0 && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                  Langues
                </h3>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm sm:text-base text-gray-700">{lang.name}</span>
                      <span className="text-sm text-gray-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                  Certifications
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">{cert.name}</h4>
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

export default MinimalTemplate;
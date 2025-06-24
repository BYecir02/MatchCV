import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, Award, GraduationCap, Briefcase, Star } from 'lucide-react';

const ModernTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-white shadow-lg mx-auto print:shadow-none ${className}`} 
         style={{ 
           maxWidth: '210mm', 
           minHeight: '297mm',
           width: '100%',
           '@media print': {
             maxWidth: '210mm',
             width: '210mm'
           }
         }}>
      {/* Header avec couleur */}
      <div className="bg-blue-600 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-lg sm:text-xl text-blue-100 mb-4">{personalInfo.title}</h2>
            
            {/* Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{personalInfo.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{personalInfo.github.replace('https://', '')}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{personalInfo.website.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Photo placeholder */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Résumé */}
        {summary && (
          <section className="mb-6 lg:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 border-b-2 border-blue-600 pb-2">
              Profil Professionnel
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Expérience */}
            {experience && experience.length > 0 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                  Expérience Professionnelle
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-4 sm:pl-6 border-l-2 border-blue-200">
                      <div className="absolute -left-1 sm:-left-2 top-0 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800">{exp.position}</h4>
                          <p className="text-blue-600 font-medium text-sm sm:text-base">{exp.company}</p>
                          {exp.location && <p className="text-xs sm:text-sm text-gray-500">{exp.location}</p>}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-3 text-sm sm:text-base">{exp.description}</p>
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

            {/* Projets */}
            {projects && projects.length > 0 && (
              <section>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                  Projets
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">{project.name}</h4>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-xs sm:text-sm">
                            Voir le projet
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-700 mb-2 text-sm sm:text-base">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8">
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600 flex-shrink-0" />
                  Compétences
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className={`p-2 sm:p-3 rounded-lg ${
                      skill.highlighted ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                      </div>
                      {skill.highlighted && (
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{
                            width: skill.level === 'Expert' ? '90%' : 
                                   skill.level === 'Avancé' ? '75%' : '60%'
                          }}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Formation */}
            {education && education.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600 flex-shrink-0" />
                  Formation
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-3 sm:pl-4">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{edu.degree}</h4>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">{edu.school}</p>
                      <div className="text-xs sm:text-sm text-gray-600">
                        <p>{edu.period}</p>
                        {edu.location && <p>{edu.location}</p>}
                        {edu.grade && <p>Mention: {edu.grade}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Langues */}
            {languages && languages.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Langues</h3>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium text-gray-800 text-sm sm:text-base">{lang.name}</span>
                      <span className="text-gray-600 text-sm">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Certifications</h3>
                <div className="space-y-2 sm:space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800 text-sm sm:text-base">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
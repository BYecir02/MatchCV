import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, Award, GraduationCap, Briefcase, Star } from 'lucide-react';

const ModernTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-white shadow-lg max-w-4xl mx-auto ${className}`} style={{ minHeight: '297mm' }}>
      {/* Header avec couleur */}
      <div className="bg-blue-600 text-white p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-blue-100 mb-4">{personalInfo.title}</h2>
            
            {/* Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center">
                  <Linkedin className="h-4 w-4 mr-2" />
                  <span className="truncate">{personalInfo.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  <span className="truncate">{personalInfo.github.replace('https://', '')}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="truncate">{personalInfo.website.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Photo placeholder */}
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center ml-8">
            <span className="text-4xl font-bold text-white">
              {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Résumé */}
        {summary && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Profil Professionnel
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="md:col-span-2 space-y-8">
            {/* Expérience */}
            {experience && experience.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                  Expérience Professionnelle
                </h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-blue-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{exp.position}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
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
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-blue-600" />
                  Projets
                </h3>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{project.name}</h4>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:underline text-sm">
                            Voir le projet
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-gray-700 mb-2">{project.description}</p>
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
          <div className="space-y-8">
            {/* Compétences */}
            {skills && skills.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  Compétences
                </h3>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      skill.highlighted ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-800">{skill.name}</span>
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
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
                  Formation
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                      <div className="text-sm text-gray-600">
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">Langues</h3>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium text-gray-800">{lang.name}</span>
                      <span className="text-gray-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Certifications</h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800">{cert.name}</h4>
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
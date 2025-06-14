import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, Star, Palette, Code, Award } from 'lucide-react';

const CreativeTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-pink-50 max-w-4xl mx-auto ${className}`} 
         style={{ minHeight: '297mm' }}>
      
      {/* Sidebar créative */}
      <div className="flex">
        <div className="w-1/3 bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
          {/* Photo/Avatar */}
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">
                {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {personalInfo.firstName}
            </h1>
            <h1 className="text-2xl font-bold mb-2">
              {personalInfo.lastName}
            </h1>
            <p className="text-purple-100 text-sm">{personalInfo.title}</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Contact
            </h3>
            <div className="space-y-2 text-sm">
              {personalInfo.email && (
                <p className="flex items-center break-all">
                  <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.email}
                </p>
              )}
              {personalInfo.phone && (
                <p className="flex items-center">
                  <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.phone}
                </p>
              )}
              {personalInfo.location && (
                <p className="flex items-center">
                  <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.location}
                </p>
              )}
              {personalInfo.website && (
                <p className="flex items-center break-all">
                  <Globe className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.website.replace('https://', '')}
                </p>
              )}
              {personalInfo.linkedin && (
                <p className="flex items-center break-all">
                  <Linkedin className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.linkedin.replace('https://', '')}
                </p>
              )}
              {personalInfo.github && (
                <p className="flex items-center break-all">
                  <Github className="h-3 w-3 mr-2 flex-shrink-0" />
                  {personalInfo.github.replace('https://', '')}
                </p>
              )}
            </div>
          </div>

          {/* Compétences créatives */}
          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Compétences
              </h3>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-purple-200">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-300"
                        style={{
                          width: skill.level === 'Expert' ? '95%' : 
                                 skill.level === 'Avancé' ? '80%' : 
                                 skill.level === 'Intermédiaire' ? '65%' : '50%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages && languages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Langues</h3>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-purple-200">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Éléments décoratifs */}
          <div className="absolute bottom-10 left-6">
            <div className="w-6 h-6 bg-pink-400 rounded-full opacity-60"></div>
          </div>
          <div className="absolute bottom-20 left-12">
            <div className="w-3 h-3 bg-purple-300 rounded-full opacity-80"></div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          {/* Résumé créatif */}
          {summary && (
            <section className="mb-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Star className="h-6 w-6 mr-2 text-purple-600" />
                  À Propos
                </h3>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                  <p className="text-gray-700 leading-relaxed italic">{summary}</p>
                </div>
              </div>
            </section>
          )}

          {/* Expérience créative */}
          {experience && experience.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Code className="h-6 w-6 mr-2 text-purple-600" />
                Expérience
              </h3>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-500">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">{exp.position}</h4>
                          <p className="text-purple-600 font-medium text-lg">{exp.company}</p>
                          {exp.location && <p className="text-gray-500 text-sm">{exp.location}</p>}
                        </div>
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
                          <p className="text-purple-700 text-sm font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exp.period}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 mb-3">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <p className="text-gray-700">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Connecteur décoratif */}
                    {index < experience.length - 1 && (
                      <div className="flex justify-center my-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projets créatifs */}
          {projects && projects.length > 0 && (
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Award className="h-6 w-6 mr-2 text-purple-600" />
                Projets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md border-t-4 border-pink-500">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h4>
                    {project.description && (
                      <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs px-2 py-1 rounded-full">
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

          {/* Formation et Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Formation */}
            {education && education.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Formation</h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
                      <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                      <p className="text-purple-600 font-medium">{edu.school}</p>
                      <div className="text-sm text-gray-600">
                        <p>{edu.period}</p>
                        {edu.location && <p>{edu.location}</p>}
                        {edu.grade && <p className="text-purple-700 font-medium">Mention: {edu.grade}</p>}
                      </div>
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
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-pink-400">
                      <h4 className="font-medium text-gray-800">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-pink-600 font-medium">{cert.date}</p>
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

export default CreativeTemplate;
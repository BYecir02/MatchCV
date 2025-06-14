import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Terminal, Code, Database, Server, Cpu, Zap } from 'lucide-react';

const TechTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-gray-900 text-green-400 max-w-4xl mx-auto font-mono ${className}`} 
         style={{ minHeight: '297mm' }}>
      
      {/* Terminal Header */}
      <div className="bg-gray-800 p-4 border-b-2 border-green-500">
        <div className="flex items-center mb-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-4 text-gray-400 text-sm">developer@portfolio:~$</span>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <span className="text-green-500">$</span>
            <span className="ml-2 text-gray-300">cat /dev/developer/profile.json</span>
          </div>
          <div className="text-green-400">
            &#123; "name": "{personalInfo.firstName} {personalInfo.lastName}", "role": "{personalInfo.title}" &#125;
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Info */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Terminal className="h-6 w-6 mr-2 text-green-500" />
            <h1 className="text-3xl font-bold text-white">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
          </div>
          <div className="text-green-400 text-lg mb-4">
            <Code className="inline h-4 w-4 mr-2" />
            {personalInfo.title}
          </div>
          
          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {personalInfo.email && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <Mail className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <Phone className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <MapPin className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <Github className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.github.replace('https://', '')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <Linkedin className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.linkedin.replace('https://', '')}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <span className="text-green-500">➤</span>
                <Globe className="h-4 w-4 mx-2 text-blue-400" />
                <span className="text-gray-300">{personalInfo.website.replace('https://', '')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary */}
            {summary && (
              <section>
                <div className="flex items-center mb-4">
                  <span className="text-green-500 mr-2">/**</span>
                  <h3 className="text-xl font-bold text-white">ABOUT.md</h3>
                  <span className="text-green-500 ml-2">*/</span>
                </div>
                <div className="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                  <p className="text-gray-300 leading-relaxed">
                    <span className="text-yellow-400">// </span>
                    {summary}
                  </p>
                </div>
              </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Server className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-xl font-bold text-white">EXPERIENCE.log</h3>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-400">
                            class {exp.position.replace(/\s+/g, '')} &#123;
                          </h4>
                          <p className="text-yellow-400 ml-4">
                            company: "{exp.company}",
                          </p>
                          {exp.location && (
                            <p className="text-yellow-400 ml-4">
                              location: "{exp.location}",
                            </p>
                          )}
                        </div>
                        <div className="text-green-400 text-sm">
                          <span className="text-gray-500">// </span>
                          {exp.period}
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="ml-4 mb-3">
                          <p className="text-gray-300">
                            <span className="text-purple-400">description:</span> "{exp.description}"
                          </p>
                        </div>
                      )}
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="ml-4 mb-2">
                          <p className="text-purple-400 mb-2">achievements: [</p>
                          {exp.achievements.map((achievement, idx) => (
                            <p key={idx} className="text-gray-300 ml-4">
                              "{achievement}"{idx < exp.achievements.length - 1 ? ',' : ''}
                            </p>
                          ))}
                          <p className="text-purple-400">]</p>
                        </div>
                      )}
                      
                      <div className="text-blue-400">&#125;</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Cpu className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-xl font-bold text-white">PROJECTS/</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded border border-gray-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-2">📁</span>
                        <h4 className="text-blue-400 font-semibold">{project.name}</h4>
                      </div>
                      {project.description && (
                        <p className="text-gray-300 text-sm mb-3">
                          <span className="text-gray-500">// </span>
                          {project.description}
                        </p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="bg-green-900 text-green-300 text-xs px-2 py-1 rounded font-mono">
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
          <div className="space-y-6">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Database className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-lg font-bold text-white">SKILLS.config</h3>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-400 font-mono text-sm">{skill.name}</span>
                          <span className="text-green-400 text-xs">{skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div 
                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                            style={{
                              width: skill.level === 'Expert' ? '90%' : 
                                     skill.level === 'Avancé' ? '75%' : 
                                     skill.level === 'Intermédiaire' ? '60%' : '45%'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Zap className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-lg font-bold text-white">EDUCATION.json</h3>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-blue-400 mb-1">&#123;</div>
                        <div className="ml-4 space-y-1">
                          <p><span className="text-purple-400">"degree":</span> <span className="text-yellow-400">"{edu.degree}"</span>,</p>
                          <p><span className="text-purple-400">"school":</span> <span className="text-yellow-400">"{edu.school}"</span>,</p>
                          <p><span className="text-purple-400">"period":</span> <span className="text-yellow-400">"{edu.period}"</span></p>
                          {edu.grade && (
                            <p><span className="text-purple-400">"grade":</span> <span className="text-yellow-400">"{edu.grade}"</span></p>
                          )}
                        </div>
                        <div className="text-blue-400">&#125;{index < education.length - 1 ? ',' : ''}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Globe className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-lg font-bold text-white">LANGUAGES.yml</h3>
                </div>
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <div className="space-y-2 text-sm">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-blue-400">- {lang.name}:</span>
                        <span className="text-green-400">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <Terminal className="h-5 w-5 mr-2 text-green-500" />
                  <h3 className="text-lg font-bold text-white">CERTS/</h3>
                </div>
                <div className="space-y-2">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded border border-gray-700 text-sm">
                      <div className="text-green-400 font-mono">✓ {cert.name}</div>
                      <div className="text-gray-400 ml-4">{cert.issuer}</div>
                      <div className="text-blue-400 ml-4 text-xs">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-8 bg-black p-4 rounded border border-green-500">
          <div className="flex items-center text-sm">
            <span className="text-green-500">developer@portfolio:~$</span>
            <span className="ml-2 text-gray-300">echo "Thanks for reviewing my profile!"</span>
            <span className="ml-2 text-green-500 animate-pulse">|</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechTemplate;
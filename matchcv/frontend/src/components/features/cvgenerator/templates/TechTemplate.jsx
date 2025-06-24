import React from 'react';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Terminal, Code, Database, Server, Cpu, Zap } from 'lucide-react';

const TechTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-gray-900 text-green-400 mx-auto font-mono ${className}`} 
         style={{ 
           maxWidth: '210mm', 
           minHeight: '297mm',
           width: '100%',
           '@media print': {
             maxWidth: '210mm',
             width: '210mm'
           }
         }}>
      
      {/* Terminal Header */}
      <div className="bg-gray-800 p-3 sm:p-4 border-b-2 border-green-500">
        <div className="flex items-center mb-2">
          <div className="flex space-x-1 sm:space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="ml-2 sm:ml-4 text-gray-400 text-xs sm:text-sm">developer@portfolio:~$</span>
        </div>
        
        <div className="space-y-1 text-xs sm:text-sm">
          <div className="flex items-center">
            <span className="text-green-500">$</span>
            <span className="ml-1 sm:ml-2 text-gray-300">cat /dev/developer/profile.json</span>
          </div>
          <div className="text-green-400">
            &#123; "name": "{personalInfo.firstName} {personalInfo.lastName}", "role": "{personalInfo.title}" &#125;
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {/* Main Info */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mb-3 sm:mb-4">
            <Terminal className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-500 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
          </div>
          <div className="text-green-400 text-base sm:text-lg mb-3 sm:mb-4">
            <Code className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {personalInfo.title}
          </div>
          
          {/* Contact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
            {personalInfo.email && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <Github className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{personalInfo.github.replace('https://', '')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{personalInfo.linkedin.replace('https://', '')}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <span className="text-green-500 mr-1">➤</span>
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 truncate">{personalInfo.website.replace('https://', '')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Summary */}
            {summary && (
              <section>
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="text-green-500 mr-1 sm:mr-2">/**</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">ABOUT.md</h3>
                  <span className="text-green-500 ml-1 sm:ml-2">*/</span>
                </div>
                <div className="bg-gray-800 p-3 sm:p-4 rounded border-l-4 border-green-500">
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    <span className="text-yellow-400">// </span>
                    {summary}
                  </p>
                </div>
              </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Server className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">EXPERIENCE.log</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {experience.map((exp, index) => (
                    <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-blue-400">
                            class {exp.position.replace(/\s+/g, '')} &#123;
                          </h4>
                          <p className="text-yellow-400 ml-2 sm:ml-4 text-sm sm:text-base">
                            company: "{exp.company}",
                          </p>
                          {exp.location && (
                            <p className="text-yellow-400 ml-2 sm:ml-4 text-sm sm:text-base">
                              location: "{exp.location}",
                            </p>
                          )}
                        </div>
                        <div className="text-green-400 text-xs sm:text-sm">
                          <span className="text-gray-500">// </span>
                          {exp.period}
                        </div>
                      </div>
                      
                      {exp.description && (
                        <div className="ml-2 sm:ml-4 mb-3">
                          <p className="text-gray-300 text-sm sm:text-base">
                            <span className="text-purple-400">description:</span> "{exp.description}"
                          </p>
                        </div>
                      )}
                      
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="ml-2 sm:ml-4 mb-2">
                          <p className="text-purple-400 mb-2 text-sm sm:text-base">achievements: [</p>
                          {exp.achievements.map((achievement, idx) => (
                            <p key={idx} className="text-gray-300 ml-2 sm:ml-4 text-sm sm:text-base">
                              "{achievement}"{idx < exp.achievements.length - 1 ? ',' : ''}
                            </p>
                          ))}
                          <p className="text-purple-400 text-sm sm:text-base">]</p>
                        </div>
                      )}
                      
                      <div className="text-blue-400 text-sm sm:text-base">&#125;</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Cpu className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">PROJECTS/</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                      <div className="flex items-center mb-2">
                        <span className="text-green-500 mr-1 sm:mr-2">📁</span>
                        <h4 className="text-blue-400 font-semibold text-sm sm:text-base">{project.name}</h4>
                      </div>
                      {project.description && (
                        <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">
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
          <div className="space-y-6 sm:space-y-8">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">SKILLS.json</h3>
                </div>
                <div className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                  <div className="space-y-2 sm:space-y-3">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-blue-400 text-sm sm:text-base">{skill.name}</span>
                        <span className="text-yellow-400 text-xs sm:text-sm">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <div className="flex items-center mb-3 sm:mb-4">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500 flex-shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">EDUCATION.md</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                      <h4 className="text-blue-400 font-semibold text-sm sm:text-base">{edu.degree}</h4>
                      <p className="text-yellow-400 text-sm sm:text-base">{edu.school}</p>
                      <div className="text-gray-300 text-xs sm:text-sm mt-2">
                        <p>{edu.period}</p>
                        {edu.location && <p>{edu.location}</p>}
                        {edu.grade && <p>Grade: {edu.grade}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">LANGUAGES</h3>
                <div className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                  <div className="space-y-2">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-blue-400 text-sm sm:text-base">{lang.name}</span>
                        <span className="text-yellow-400 text-sm">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">CERTIFICATIONS</h3>
                <div className="space-y-3 sm:space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded border border-gray-700">
                      <h4 className="text-blue-400 font-semibold text-sm sm:text-base">{cert.name}</h4>
                      <p className="text-yellow-400 text-sm">{cert.issuer}</p>
                      <p className="text-gray-400 text-xs">{cert.date}</p>
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

export default TechTemplate;
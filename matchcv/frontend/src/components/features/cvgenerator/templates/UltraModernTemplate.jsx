import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Calendar, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Star,
  Zap,
  Code,
  Palette,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const UltraModernTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 mx-auto print:shadow-none ${className}`} 
         style={{ 
           maxWidth: '210mm', 
           minHeight: '297mm',
           width: '100%',
           '@media print': {
             maxWidth: '210mm',
             width: '210mm'
           }
         }}>
      
      {/* Header futuriste avec effet glassmorphism */}
      <div className="relative overflow-hidden">
        {/* Arrière-plan animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-white/5 opacity-30"></div>
        
        {/* Header principal */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 backdrop-blur-sm bg-white/10 border-b border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              {/* Nom avec effet néon */}
              <div className="mb-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 drop-shadow-lg">
                  {personalInfo.firstName}
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 drop-shadow-lg">
                  {personalInfo.lastName}
                </h1>
              </div>
              
              {/* Titre avec animation */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 font-light tracking-wider">
                  {personalInfo.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mt-2 rounded-full"></div>
              </div>
              
              {/* Contacts avec icônes animées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {personalInfo.email && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.linkedin.replace('https://', '')}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <Github className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.github.replace('https://', '')}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center group">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                      <Globe className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/80 group-hover:text-white transition-colors">{personalInfo.website.replace('https://', '')}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Avatar futuriste */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-spin-slow opacity-75"></div>
                <div className="relative z-10 text-4xl lg:text-5xl font-black text-white">
                  {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>
              {/* Anneaux décoratifs */}
              <div className="absolute -top-2 -right-2 w-8 h-8 border-2 border-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 sm:p-12 lg:p-16">
        {/* Résumé avec effet glassmorphism */}
        {summary && (
          <section className="mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
              <div className="relative p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Profil Professionnel
                  </h3>
                </div>
                <p className="text-white/90 leading-relaxed text-lg">{summary}</p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expérience avec timeline futuriste */}
            {experience && experience.length > 0 && (
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Expérience Professionnelle
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative group">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-purple-400"></div>
                      
                      {/* Timeline dot */}
                      <div className="absolute left-4 top-6 w-4 h-4 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full border-4 border-slate-900 group-hover:scale-150 transition-transform duration-300"></div>
                      
                      <div className="ml-12">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                          <div className="relative p-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-white mb-2">{exp.position}</h4>
                                <p className="text-cyan-400 font-semibold text-lg">{exp.company}</p>
                                {exp.location && <p className="text-white/60 text-sm">{exp.location}</p>}
                              </div>
                              <div className="flex items-center bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-white/20">
                                <Calendar className="h-4 w-4 text-cyan-400 mr-2" />
                                <span className="text-white/90 text-sm font-medium">{exp.period}</span>
                              </div>
                            </div>
                            
                            {exp.description && (
                              <p className="text-white/80 mb-4 leading-relaxed">{exp.description}</p>
                            )}
                            
                            {exp.achievements && exp.achievements.length > 0 && (
                              <div className="space-y-2">
                                {exp.achievements.map((achievement, idx) => (
                                  <div key={idx} className="flex items-start">
                                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                    <p className="text-white/80">{achievement}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projets avec cartes interactives */}
            {projects && projects.length > 0 && (
              <section>
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    Projets
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects.map((project, index) => (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl backdrop-blur-sm border border-white/20 group-hover:border-white/40 transition-all duration-300 group-hover:scale-105"></div>
                      <div className="relative p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-bold text-white">{project.name}</h4>
                          {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" 
                               className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                              Voir →
                            </a>
                          )}
                        </div>
                        
                        {project.description && (
                          <p className="text-white/80 mb-4 text-sm">{project.description}</p>
                        )}
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, idx) => (
                              <span key={idx} className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 text-xs px-3 py-1 rounded-full border border-cyan-400/30">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Compétences avec barres de progression animées */}
            {skills && skills.length > 0 && (
              <section>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                  <div className="relative p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <Palette className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        Compétences
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                              {skill.name}
                            </span>
                            <span className="text-cyan-400 text-sm font-medium">{skill.level}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-400 group-hover:to-pink-400"
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
                </div>
              </section>
            )}

            {/* Formation */}
            {education && education.length > 0 && (
              <section>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                  <div className="relative p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        Formation
                      </h3>
                    </div>
                    
                    <div className="space-y-4">
                      {education.map((edu, index) => (
                        <div key={index} className="group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-xl group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                          <div className="relative p-4">
                            <h4 className="font-semibold text-white mb-1">{edu.degree}</h4>
                            <p className="text-cyan-400 font-medium text-sm mb-2">{edu.school}</p>
                            <div className="text-white/60 text-xs space-y-1">
                              <p>{edu.period}</p>
                              {edu.location && <p>{edu.location}</p>}
                              {edu.grade && <p className="text-cyan-300 font-medium">Mention: {edu.grade}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Langues */}
            {languages && languages.length > 0 && (
              <section>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                  <div className="relative p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        Langues
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {languages.map((lang, index) => (
                        <div key={index} className="flex justify-between items-center group">
                          <span className="font-medium text-white group-hover:text-orange-300 transition-colors">
                            {lang.name}
                          </span>
                          <span className="text-orange-400 text-sm font-medium">{lang.level}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
                  <div className="relative p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                        Certifications
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {certifications.map((cert, index) => (
                        <div key={index} className="group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-xl group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300"></div>
                          <div className="relative p-3">
                            <h4 className="font-medium text-white text-sm">{cert.name}</h4>
                            <p className="text-emerald-400 text-xs">{cert.issuer}</p>
                            <p className="text-emerald-300 text-xs font-medium">{cert.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute top-20 right-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-bounce"></div>
      <div className="absolute top-40 left-10 w-3 h-3 bg-purple-400 rounded-full opacity-80 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-400 rounded-full opacity-40 animate-ping"></div>
    </div>
  );
};

export default UltraModernTemplate; 
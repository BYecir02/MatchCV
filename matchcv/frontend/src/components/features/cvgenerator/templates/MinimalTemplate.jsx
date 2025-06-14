import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

const MinimalTemplate = ({ cvData, className = '' }) => {
  if (!cvData) return null;

  const { personalInfo, summary, experience, education, skills, languages, certifications } = cvData;

  return (
    <div className={`bg-white max-w-4xl mx-auto ${className}`} style={{ minHeight: '297mm' }}>
      <div className="p-12">
        {/* Header Ultra Minimal */}
        <header className="mb-12 pb-8 border-b border-gray-200">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl text-gray-600 mb-6 font-light">{personalInfo.title}</h2>
          
          {/* Contact Info - Une seule ligne */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {personalInfo.email && (
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center">
                <Linkedin className="h-3 w-3 mr-1" />
                {personalInfo.linkedin.replace('https://linkedin.com/in/', '')}
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center">
                <Github className="h-3 w-3 mr-1" />
                {personalInfo.github.replace('https://github.com/', '')}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {personalInfo.website.replace('https://', '')}
              </span>
            )}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-10">
            <p className="text-gray-700 leading-relaxed text-lg font-light">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-10">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-6 font-medium">
              Experience
            </h3>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{exp.period}</p>
                      {exp.location && (
                        <p className="text-sm text-gray-400">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                  )}
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-gray-700 text-sm relative pl-4">
                          <span className="absolute left-0 top-2 w-1 h-1 bg-gray-400 rounded-full"></span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-10">
            {/* Education */}
            {education && education.length > 0 && (
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-medium">
                  Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.school}</p>
                      <div className="text-sm text-gray-500">
                        <p>{edu.period}</p>
                        {edu.location && <p>{edu.location}</p>}
                        {edu.grade && <p className="text-gray-700">{edu.grade}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-medium">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                      <p className="text-gray-500 text-xs">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-10">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-medium">
                  Skills
                </h3>
                <div className="space-y-3">
                  {/* Group skills by category or show all */}
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className={`text-sm px-0 py-1 ${
                        skill.highlighted 
                          ? 'text-gray-900 font-medium border-b border-gray-300' 
                          : 'text-gray-600'
                      }`}>
                        {skill.name}
                        {index < skills.length - 1 && !skill.highlighted && (
                          <span className="text-gray-400 ml-2">•</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-medium">
                  Languages
                </h3>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-900">{lang.name}</span>
                      <span className="text-gray-600 text-sm">{lang.level}</span>
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

export default MinimalTemplate;
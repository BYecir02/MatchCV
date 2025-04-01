import React from 'react';
import './styles.css';

const CvTemplate = () => {
  const cvData = {
    header: {
      name: "BADIROU Mohamed Yecir",
      title: "Développeur Fullstack | Alternance",
      contact: {
        phone: "📞 07 83 84 27 94",
        email: "📧 Badirouyecir@gmail.com",
        address: "📍 Villeneuve d'Ascq 59650",
        linkedin: "🔗 linkedin.com/in/mohamed-yecir"
      }
    },
    about: "Étudiant en ingénierie informatique passionné par le développement fullstack. Recherche une alternance pour appliquer mes compétences en JavaScript (React/Node) et Python dans des projets innovants.",
    experience: [
      {
        role: "Employé commercial",
        company: "Super U",
        period: "Juillet 2024 - Août 2024",
        details: [
          "Gestion des stocks et réapprovisionnement",
          "Service client et mise en rayon"
        ]
      },
      {
        role: "Stage en développement",
        company: "Safar Travels",
        period: "Juillet 2022 - Août 2022",
        details: [
          "Développement d'une interface de réservation",
          "Optimisation des processus métiers"
        ]
      }
    ],
    education: [
      {
        degree: "Cycle Ingénieur Informatique",
        school: "ISEN Lille",
        period: "2023 - Présent"
      },
      {
        degree: "Classe Préparatoire",
        school: "CPMS Cotonou",
        period: "2021 - 2023"
      }
    ],
    skills: {
      "Frontend": ["React", "Vue.js", "HTML/CSS"],
      "Backend": ["Node.js", "Django", "Express"],
      "Mobile": ["Flutter"],
      "Outils": ["Git", "Figma", "VS Code"]
    },
    projects: [
      {
        name: "Application de gestion d'événements",
        tech: "React + Node.js + MySQL",
        details: "Plateforme complète avec authentification et gestion des participants"
      }
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "Courant" }
    ]
  };

  return (
    <div className="cv-a4-container">
      <div className="cv-a4-page">
        {/* Header */}
        <header className="cv-header">
          <h1>{cvData.header.name}</h1>
          <h2>{cvData.header.title}</h2>
          <div className="contact-info">
            {Object.values(cvData.header.contact).map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </header>

        {/* Main Content */}
        <div className="cv-main">
          {/* Left Column */}
          <div className="cv-left">
            <section className="about-section">
              <h3>Profil</h3>
              <p>{cvData.about}</p>
            </section>

            <section className="skills-section">
              <h3>Compétences</h3>
              {Object.entries(cvData.skills).map(([category, skills]) => (
                <div key={category}>
                  <h4>{category}</h4>
                  <ul>
                    {skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className="languages-section">
              <h3>Langues</h3>
              <ul>
                {cvData.languages.map((lang, i) => (
                  <li key={i}>
                    <strong>{lang.name}:</strong> {lang.level}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Column */}
          <div className="cv-right">
            <section className="experience-section">
              <h3>Expérience Professionnelle</h3>
              {cvData.experience.map((exp, i) => (
                <div key={i} className="experience-item">
                  <h4>{exp.role} • {exp.company}</h4>
                  <div className="period">{exp.period}</div>
                  <ul>
                    {exp.details.map((detail, j) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className="education-section">
              <h3>Formation</h3>
              {cvData.education.map((edu, i) => (
                <div key={i} className="education-item">
                  <h4>{edu.degree}</h4>
                  <div className="school">{edu.school}</div>
                  <div className="period">{edu.period}</div>
                </div>
              ))}
            </section>

            <section className="projects-section">
              <h3>Projets</h3>
              {cvData.projects.map((project, i) => (
                <div key={i} className="project-item">
                  <h4>{project.name}</h4>
                  <div className="tech">{project.tech}</div>
                  <p>{project.details}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvTemplate;
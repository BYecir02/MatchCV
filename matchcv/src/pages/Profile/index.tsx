import Sidebar from "../../components/sidebar/index";
import "./styles.css";

const Profile = () => {
  const cvData = {
    // 1. En-tête
    header: {
      name: "BADIROU Mohamed Yecir",
      title: "Développeur Fullstack | Alternance",
      rythme: "Rythme : 3 semaines en entreprise / 1 semaine à l'école",
      contact: {
        phone: "📞 0783842794",
        email: "📧 Badirouyecir@gmail.com",
        location: "📍 Villeneuve d'Ascq 59650",
        permis: "🔍 Permis B"
      }
    },
  
    // 2. À propos (accroche)
    about: "Étudiant en informatique passionné par les langages de programmation, je recherche une alternance pour mettre en pratique mes compétences en programmation et contribuer à des projets innovants. Dynamique, curieux et rigoureux, je suis prêt à m'investir pleinement pour apprendre et progresser au sein d'une équipe.",
  
    // 3. Expériences (en premier après l'accroche)
    experiences: [
      {
        position: "Employé commercial ELDPH (Super U)",
        period: "Juillet 2024 - Août 2024",
        location: "La madeleine France",
        tasks: ["Réapprovisionnement", "Mise en rayon", "Entretien"]
      },
      {
        position: "Employé commercial (KESED Services)",
        period: "Octobre 2021 - Juin 2023",
        location: "Cotonou Bénin",
        tasks: ["Service client", "Gestion des stocks et inventaires", "Entretien"]
      },
      {
        position: "Stage Académique (Safar Travels & Tours)",
        period: "Juillet 2022 - Août 2022",
        location: "Cotonou Bénin",
        tasks: ["Réservations et ventes de billets", "Relations clients et entretiens"]
      }
    ],
  
    // 4. Formation
    education: [
      {
        title: "CYCLE INGENIEUR",
        institution: "Institut Supérieur de l'Electronique et du Numérique (ISEN)",
        period: "Depuis 2023",
        location: "Lille France"
      },
      {
        title: "CYCLE PREPARATOIRE",
        institution: "Cour Préparatoire Sainte Marie - Stella (CPMS)",
        period: "2021 - 2023",
        location: "Cotonou Bénin"
      },
      {
        title: "BACCALAUREAT SCIENTIFIQUE D",
        institution: "Complexe scolaire Le Rocher",
        period: "2021",
        location: "Cotonou Bénin"
      }
    ],
  
    // 5. Compétences (organisées par catégories)
    skills: {
      "Développement Web": [
        "JavaScript (React, Vue, Node)",
        "Python (Django)",
        "HTML/CSS"
      ],
      "Mobile & Design": [
        "Flutter",
        "Figma",
        "Farmer"
      ],
      "Outils & Bases de données": [
        "VS Code",
        "MySQL",
        "SQLite",
        "Git"
      ]
    },
  
    // 6. Projets (avec résultats concrets si possible)
    projects: [
      {
        name: "Application de gestion de sortie",
        period: "Juin 2024",
        description: "Application web complète avec système d'authentification et base de données, permettant l'organisation d'événements pour groupes.",
        technologies: "React, Node.js, Express, MySQL",
        achievements: [
          "Réduction du temps d'organisation des événements de 60%",
          "Gestion centralisée des participants"
        ]
      },
      {
        name: "Desktop Portfolio (en cours)",
        period: "2024",
        description: "Environnement de bureau interactif présentant mes projets de manière innovante.",
        technologies: "React, Figma",
        achievements: [
          "Interface UX primée lors d'un concours étudiant"
        ]
      }
    ],
  
    // 7. Langues & Centres d'intérêt (en fin de document)
    languages: ["🇫🇷 Français - Natif", "🇬🇧 Anglais - Courant"],
    interests: ["🏀 Basketball compétitif", "✈️ Voyages internationaux", "🤖 Robotique DIY"]
  };

  return (
    <div className="dashboard-container full-height">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container">
        <h1 className="title">Mon CV</h1>
        <div className="profile-card">
          {/* 1. En-tête */}
          <div className="cv-header">
            <h1 className="cv-name">{cvData.header.name}</h1>
            <h2 className="cv-title">{cvData.header.title}</h2>
            <p className="cv-rythme">{cvData.header.rythme}</p>
            <div className="cv-contact">
              <span>{cvData.header.contact.location}</span>
              <span>{cvData.header.contact.email}</span>
              <span>{cvData.header.contact.phone}</span>
              <span>{cvData.header.contact.permis}</span>
            </div>
          </div>

          <hr className="cv-divider" />

          {/* 2. À propos */}
          <div className="cv-section">
            <h2 className="section-title">À PROPOS DE MOI</h2>
            <p className="about-text">{cvData.about}</p>
          </div>

          <hr className="cv-divider" />

          {/* 3. Compétences */}
          <div className="cv-section">
            <h2 className="section-title">COMPÉTENCES</h2>
            {Object.entries(cvData.skills).map(([category, skills], index) => (
              <div key={index} className="skills-category">
                <h3 className="skills-category-title">{category}</h3>
                <ul className="skills-list">
                  {skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="skill-item">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="cv-divider" />

          {/* 4. Expériences professionnelles */}
          <div className="cv-section">
            <h2 className="section-title">EXPÉRIENCES PROFESSIONNELLES</h2>
            {cvData.experiences.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3 className="experience-position">{exp.position}</h3>
                <p className="experience-period">
                  {exp.period} | {exp.location}
                </p>
                <ul className="experience-tasks">
                  {exp.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="task-item">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <hr className="cv-divider" />

          {/* 5. Formation */}
          <div className="cv-section">
            <h2 className="section-title">FORMATION</h2>
            {cvData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <h3 className="education-title">{edu.title}</h3>
                <p className="education-institution">{edu.institution}</p>
                <p className="education-period">
                  {edu.period} | {edu.location}
                </p>
              </div>
            ))}
          </div>

          <hr className="cv-divider" />

          {/* 6. Projets */}
          <div className="cv-section">
            <h2 className="section-title">PROJETS</h2>
            {cvData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3 className="project-name">- {project.name}</h3>
                <p className="project-description">{project.description}</p>
                <p className="project-technologies">
                  Technologies : <strong>{project.technologies}</strong>
                </p>
              </div>
            ))}
          </div>

          <hr className="cv-divider" />

          {/* 7. Langues et centres d'intérêt */}
          <div className="cv-section">
            <h2 className="section-title">LANGUES</h2>
            <ul className="languages-list">
              {cvData.languages.map((language, index) => (
                <li key={index} className="language-item">
                  {language}
                </li>
              ))}
            </ul>

            <h3 className="sub-section-title">CENTRES D'INTÉRÊT</h3>
            <div className="interests-container">
              {cvData.interests.map((interest, index) => (
                <span key={index} className="interest-item">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
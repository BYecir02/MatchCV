import Sidebar from "../../components/sidebar/index";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const userProfile = {
    // 1. Identité complète
    identity: {
      fullName: "BADIROU Mohamed Yecir",
      title: "Développeur Fullstack | Alternance",
      profileImage: "https://th.bing.com/th/id/OIP.RUnTNUv-Fk-jpRkd7Vjn6gHaDt?rs=1&pid=ImgDetMain",
      personalDetails: {
        birthDate: "15/03/2000",
        nationality: "Béninoise",
        address: "10 Rue de l'Université, Villeneuve d'Ascq 59650",
        phone: "+33 7 83 84 27 94",
        email: "badirouyecir@gmail.com",
        linkedIn: "linkedin.com/in/mohamed-yecir",
        github: "github.com/mohamed-yecir",
        permis: "Permis B"
      }
    },

    // 2. Situation professionnelle
    professionalStatus: {
      current: "Étudiant en cycle ingénieur - Recherche alternance",
      rythme: "3 semaines entreprise / 1 semaine école",
      availability: "Disponible à partir de Septembre 2024",
      desiredSalary: "Selon convention d'alternance",
      mobility: "Nord de la France (Lille et alentours)"
    },

    // 3. À propos détaillé
    about: {
      summary: "Étudiant en informatique passionné par les langages de programmation, je recherche une alternance pour mettre en pratique mes compétences en programmation et contribuer à des projets innovants.",
      personality: [
        "Dynamique et curieux",
        "Rigoureux dans mon travail",
        "Esprit d'équipe développé",
        "Capacité d'adaptation"
      ],
      motivations: [
        "Apprendre de nouvelles technologies",
        "Travailler sur des projets concrets",
        "Évoluer dans un environnement professionnel"
      ]
    },

    // 4. Parcours académique complet
    education: [
      {
        degree: "Cycle Ingénieur en Informatique",
        institution: "ISEN Lille",
        period: "2023 - 2026 (en cours)",
        details: [
          "Spécialisation en développement web et mobile",
          "Cours avancés en algorithmique et structures de données",
          "Projets pratiques en équipe"
        ]
      },
      {
        degree: "Classe Préparatoire Scientifique",
        institution: "CPMS Cotonou",
        period: "2021 - 2023",
        details: [
          "Formation intensive en mathématiques et physique",
          "Préparation aux concours d'ingénieur"
        ]
      },
      {
        degree: "Baccalauréat Scientifique",
        institution: "Complexe scolaire Le Rocher",
        period: "2021",
        details: [
          "Mention Bien",
          "Option Sciences de l'Ingénieur"
        ]
      }
    ],

    // 5. Expériences professionnelles détaillées
    experiences: [
      {
        position: "Employé commercial",
        company: "Super U - La Madeleine",
        period: "Juillet 2024 - Août 2024",
        location: "France",
        responsibilities: [
          "Gestion des stocks et réapprovisionnement des rayons",
          "Service client et conseil aux acheteurs",
          "Mise en place des promotions et présentoirs"
        ],
        achievements: [
          "Optimisation du temps de réapprovisionnement de 20%",
          "Recommandé par le manager pour mon efficacité"
        ]
      },
      {
        position: "Employé commercial",
        company: "KESED Services",
        period: "Octobre 2021 - Juin 2023",
        location: "Cotonou, Bénin",
        responsibilities: [
          "Gestion des inventaires et commandes",
          "Relation client et gestion des réclamations",
          "Formation des nouveaux employés"
        ],
        achievements: [
          "Mise en place d'un système de gestion des stocks",
          "Augmentation de la satisfaction client de 15%"
        ]
      }
    ],

    // 6. Compétences techniques approfondies
    technicalSkills: {
      languages: [
        { name: "JavaScript", level: 4, projects: 5 },
        { name: "Python", level: 3, projects: 3 },
        { name: "HTML/CSS", level: 4, projects: 6 }
      ],
      frameworks: [
        { name: "React", level: 4 },
        { name: "Node.js", level: 3 },
        { name: "Django", level: 2 }
      ],
      tools: ["Git", "VS Code", "Figma", "MySQL", "Docker"],
      methodologies: ["Agile", "SCRUM", "Test-Driven Development"]
    },

    // 7. Projets personnels et académiques
    projects: [
      {
        name: "Application de gestion d'événements",
        role: "Développeur Fullstack",
        period: "Juin 2024",
        description: "Plateforme complète avec système d'authentification et gestion des participants pour événements universitaires.",
        technologies: ["React", "Node.js", "Express", "MySQL"],
        features: [
          "Inscription en ligne des participants",
          "Gestion des paiements",
          "Tableau de bord administrateur"
        ],
        link: "github.com/mohamed-yecir/event-app"
      },
      {
        name: "Portfolio Desktop",
        role: "Développeur Frontend",
        period: "2024 (en cours)",
        description: "Environnement de bureau interactif présentant mes compétences et projets de manière originale.",
        technologies: ["React", "Framer Motion", "Figma"],
        features: [
          "Interface type bureau avec fenêtres interactives",
          "Animation fluide entre les sections",
          "Design personnalisable"
        ]
      }
    ],

    // 8. Langues et compétences interculturelles
    languages: [
      { language: "Français", level: "Langue maternelle", certification: null },
      { language: "Anglais", level: "Courant (B2)", certification: "TOEIC 785" }
    ],

    // 9. Centres d'intérêt et activités
    interests: [
      {
        category: "Sport",
        activities: [
          "Basketball en club depuis 5 ans",
          "Participation à des tournois universitaires"
        ]
      },
      {
        category: "Technologie",
        activities: [
          "Veille technologique quotidienne",
          "Participation à des hackathons",
          "Robotique DIY"
        ]
      },
      {
        category: "Voyages",
        activities: [
          "Europe: France, Belgique",
          "Afrique: Bénin, Togo"
        ]
      }
    ],

    // 10. Informations supplémentaires
    additionalInfo: {
      references: "Disponibles sur demande",
      publications: [],
      volunteer: [
        "Tutorat en mathématiques pour collégiens (2022)",
        "Organisation d'événements caritatifs"
      ]
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      
      <div className="profile-content">
        {/* Bouton pour modifier le profil */}
        <div className="edit-profile-button-container">
          <button
            className="edit-profile-button"
            onClick={() => navigate("/edit-profile")} // Redirige vers la page d'édition
          >
            Modifier / Compléter mon profil
          </button>
        </div>

        {/* Section Identité */}
        <section className="identity-section">
          <div className="identity-header">
            <img src={userProfile.identity.profileImage} alt="Profile" className="profile-image" />
            <div>
              <h1>{userProfile.identity.fullName}</h1>
              <h2>{userProfile.identity.title}</h2>
            </div>
          </div>
          
          <div className="personal-details">
            <h3>Informations Personnelles</h3>
            <div className="details-grid">
              {Object.entries(userProfile.identity.personalDetails).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Situation Professionnelle */}
        <section className="section">
          <h2>Situation Professionnelle</h2>
          <div className="status-grid">
            {Object.entries(userProfile.professionalStatus).map(([key, value]) => (
              <div key={key} className="status-item">
                <span className="status-label">{key}:</span>
                <span className="status-value">{Array.isArray(value) ? value.join(", ") : value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section À Propos */}
        <section className="section">
          <h2>À Propos de Moi</h2>
          <p className="about-summary">{userProfile.about.summary}</p>
          
          <div className="about-details">
            <div>
              <h3>Personnalité</h3>
              <ul>
                {userProfile.about.personality.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3>Motivations</h3>
              <ul>
                {userProfile.about.motivations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section Formation */}
        <section className="section">
          <h2>Parcours Académique</h2>
          {userProfile.education.map((edu, i) => (
            <div key={i} className="education-item">
              <h3>{edu.degree} - {edu.institution}</h3>
              <p className="period">{edu.period}</p>
              <ul>
                {edu.details.map((detail, j) => (
                  <li key={j}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Section Expériences */}
        <section className="section">
          <h2>Expériences Professionnelles</h2>
          {userProfile.experiences.map((exp, i) => (
            <div key={i} className="experience-item">
              <div className="experience-header">
                <h3>{exp.position} - {exp.company}</h3>
                <p className="location-period">{exp.location} | {exp.period}</p>
              </div>
              
              <h4>Responsabilités:</h4>
              <ul>
                {exp.responsibilities.map((resp, j) => (
                  <li key={j}>{resp}</li>
                ))}
              </ul>
              
              <h4>Réalisations:</h4>
              <ul className="achievements">
                {exp.achievements.map((ach, j) => (
                  <li key={j}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Section Compétences Techniques */}
        <section className="section">
          <h2>Compétences Techniques</h2>
          
          <div className="skills-container">
            <div>
              <h3>Langages de Programmation</h3>
              <div className="skills-grid">
                {userProfile.technicalSkills.languages.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <span>{skill.name}</span>
                    <div className="skill-level">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className={j < skill.level ? "filled" : ""}>•</span>
                      ))}
                    </div>
                    <span className="projects-count">{skill.projects} projets</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3>Frameworks & Bibliothèques</h3>
              <div className="skills-grid">
                {userProfile.technicalSkills.frameworks.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <span>{skill.name}</span>
                    <div className="skill-level">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className={j < skill.level ? "filled" : ""}>•</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="other-skills">
            <div>
              <h3>Outils</h3>
              <div className="tools-list">
                {userProfile.technicalSkills.tools.map((tool, i) => (
                  <span key={i} className="tool-tag">{tool}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h3>Méthodologies</h3>
              <div className="methods-list">
                {userProfile.technicalSkills.methodologies.map((method, i) => (
                  <span key={i} className="method-tag">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Projets */}
        <section className="section">
          <h2>Projets Réalisés</h2>
          {userProfile.projects.map((project, i) => (
            <div key={i} className="project-item">
              <div className="project-header">
                <h3>{project.name}</h3>
                <p className="project-period">{project.period} | {project.role}</p>
              </div>
              
              <p className="project-description">{project.description}</p>
              
              <h4>Technologies utilisées:</h4>
              <div className="technologies-list">
                {project.technologies.map((tech, j) => (
                  <span key={j} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              <h4>Fonctionnalités clés:</h4>
              <ul>
                {project.features.map((feature, j) => (
                  <li key={j}>{feature}</li>
                ))}
              </ul>
              
              {project.link && (
                <a href={`https://${project.link}`} target="_blank" rel="noopener noreferrer" className="project-link">
                  Voir le projet
                </a>
              )}
            </div>
          ))}
        </section>

        {/* Section Langues et Centres d'Intérêt */}
        <section className="section">
          <div className="languages-interests">
            <div>
              <h2>Langues</h2>
              <ul className="languages-list">
                {userProfile.languages.map((lang, i) => (
                  <li key={i}>
                    <strong>{lang.language}:</strong> {lang.level}
                    {lang.certification && ` (${lang.certification})`}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2>Centres d'Intérêt</h2>
              {userProfile.interests.map((interest, i) => (
                <div key={i} className="interest-category">
                  <h3>{interest.category}</h3>
                  <ul>
                    {interest.activities.map((activity, j) => (
                      <li key={j}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Informations Supplémentaires */}
        <section className="section">
          <h2>Informations Complémentaires</h2>
          <div className="additional-info">
            {Object.entries(userProfile.additionalInfo).map(([key, value]) => (
              <div key={key} className="additional-item">
                <h3>{key}:</h3>
                {Array.isArray(value) && value.length > 0 ? (
                  <ul>
                    {value.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{value || "Aucune information"}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
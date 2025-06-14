// Service API pour MatchCV

// Fonction pour extraire les données d'un CV
export const extractCVData = async (file) => {
  try {
    // Simulation d'extraction de CV (à remplacer par un vrai service)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulation de données extraites basées sur le nom du fichier
    const fileName = file.name.toLowerCase();
    
    // Générer un profil simulé plus réaliste
    const profiles = [
      `Développeur Full-Stack avec 3 ans d'expérience dans le développement d'applications web modernes.

Compétences techniques :
• Frontend : React, Vue.js, HTML5, CSS3, JavaScript ES6+, TypeScript
• Backend : Node.js, Express, Python, Django, PHP
• Bases de données : MongoDB, PostgreSQL, MySQL
• Outils : Git, Docker, AWS, Heroku, Jenkins

Expérience professionnelle :
• Développeur Full-Stack chez TechCorp (2022-2024)
  - Développement d'applications web avec React et Node.js
  - Gestion de bases de données MongoDB
  - Collaboration en équipe agile (Scrum)

• Développeur Frontend chez WebAgency (2021-2022)
  - Création d'interfaces utilisateur responsive
  - Intégration API REST
  - Optimisation des performances

Formation :
• Master en Informatique, École d'Ingénieur (2019-2021)
• Licence en Informatique, Université (2016-2019)

Passionné par les nouvelles technologies et l'innovation, je recherche constamment à améliorer mes compétences et à contribuer à des projets stimulants.`,

      `Développeur Frontend spécialisé en React avec 2 ans d'expérience.

Compétences clés :
• React, Redux, Next.js
• HTML5, CSS3, Sass, Tailwind CSS
• JavaScript ES6+, TypeScript
• Git, Webpack, Figma

Expérience :
• Développeur React chez StartupXYZ (2022-2024)
• Stage développeur chez WebStudio (2021)

Formation : BTS Informatique (2019-2021)

Créatif et rigoureux, j'aime créer des interfaces utilisateur modernes et performantes.`,

      `Développeur Backend Node.js avec expertise en API et bases de données.

Compétences techniques :
• Node.js, Express.js, NestJS
• MongoDB, PostgreSQL, Redis
• Docker, Kubernetes, AWS
• Jest, Mocha pour les tests

Projets réalisés :
• API RESTful pour application e-commerce
• Microservices avec Docker
• Système d'authentification JWT

Formation : Master en Génie Logiciel

Passionné par l'architecture logicielle et les bonnes pratiques de développement.`
    ];

    // Sélectionner un profil aléatoire
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)];
    
    return {
      profile: randomProfile,
      
      personalInfo: {
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France'
      },
      
      skills: [
        'JavaScript', 'React', 'Vue.js', 'Node.js', 'Python', 
        'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS'
      ],
      
      experience: [
        {
          company: 'TechCorp',
          position: 'Développeur Full-Stack',
          period: '2022-2024',
          description: 'Développement d\'applications web avec React et Node.js'
        },
        {
          company: 'WebAgency',
          position: 'Développeur Frontend',
          period: '2021-2022',
          description: 'Création d\'interfaces utilisateur responsive'
        }
      ]
    };
  } catch (error) {
    throw new Error('Erreur lors de l\'extraction des données du CV');
  }
};

// Fonction pour générer une lettre de motivation
export const generateCoverLetter = async (jobDescription, userProfile) => {
  try {
    // Simulation d'appel API (à remplacer par un vrai appel)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Générer une lettre plus personnalisée basée sur le profil
    const hasReact = userProfile.toLowerCase().includes('react');
    const hasNode = userProfile.toLowerCase().includes('node');
    const hasPython = userProfile.toLowerCase().includes('python');
    const hasExperience = userProfile.toLowerCase().includes('expérience');
    
    let letterContent = `Madame, Monsieur,

Votre annonce a retenu toute mon attention car elle correspond parfaitement à mon profil et à mes aspirations professionnelles.

`;

    // Personnaliser selon les compétences détectées
    if (hasReact && hasNode) {
      letterContent += `Mon expertise en React et Node.js, ainsi que ma maîtrise du développement full-stack, me permettent de répondre parfaitement aux exigences techniques de ce poste. `;
    } else if (hasReact) {
      letterContent += `Ma spécialisation en React et dans les technologies frontend modernes correspond exactement aux besoins exprimés dans votre offre. `;
    } else if (hasNode) {
      letterContent += `Mon expérience en développement backend avec Node.js et ma connaissance des API REST me permettent d'apporter une réelle valeur ajoutée. `;
    } else if (hasPython) {
      letterContent += `Ma maîtrise de Python et mon expérience en développement backend correspondent aux compétences recherchées. `;
    }

    if (hasExperience) {
      letterContent += `\n\nMon parcours professionnel m'a permis de développer une solide expertise technique ainsi qu'une capacité d'adaptation aux différents environnements de travail. Je suis particulièrement motivé par les défis techniques et l'innovation.`;
    }

    letterContent += `\n\nLes missions décrites dans votre annonce m'enthousiasment particulièrement. Je suis convaincu que mon profil technique, ma rigueur et ma motivation sauront apporter une réelle contribution à votre équipe.

Je serais ravi de pouvoir vous rencontrer pour discuter plus en détail de ma candidature et vous présenter concrètement ce que je peux apporter à votre entreprise.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

Cordialement,
[Votre nom]`;

    return {
      letter: letterContent
    };
  } catch (error) {
    throw new Error('Erreur lors de la génération de la lettre');
  }
};

// Fonction pour analyser une annonce d'emploi
export const analyzeJobDescription = async (jobText) => {
  try {
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experience: '2-4 ans',
      location: 'Paris, France',
      matchScore: 75
    };
  } catch (error) {
    throw new Error('Erreur lors de l\'analyse de l\'annonce');
  }
};

// Authentification (simulation)
export const login = async (credentials) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: 1,
        firstName: credentials.firstName || 'Jean',
        lastName: credentials.lastName || 'Dupont',
        email: credentials.email
      },
      token: 'fake-jwt-token'
    };
  } catch (error) {
    throw new Error('Erreur de connexion');
  }
};

export const register = async (userData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        id: Date.now(),
        ...userData
      },
      token: 'fake-jwt-token'
    };
  } catch (error) {
    throw new Error('Erreur lors de l\'inscription');
  }
};

// Fonction utilitaire pour télécharger un PDF (simulation)
export const downloadPDF = async (content, filename = 'lettre-motivation.pdf') => {
  try {
    // Simulation de génération PDF
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En réalité, vous utiliseriez une bibliothèque comme jsPDF ou un service backend
    console.log('Téléchargement du PDF:', filename);
    console.log('Contenu:', content);
    
    // Simuler le téléchargement
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    throw new Error('Erreur lors du téléchargement du PDF');
  }
};
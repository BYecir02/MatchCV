const dataExtractor = {
  normalizeExtractedData(data) {
    console.log('🔧 Normalisation des valeurs enum...');
    
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills.map(skill => ({
        ...skill,
        category: this.normalizeSkillCategory(skill.category),
        proficiencyLevel: this.normalizeProficiencyLevel(skill.proficiencyLevel)
      }));
    }

    if (data.interests && Array.isArray(data.interests)) {
      data.interests = data.interests.map(interest => ({
        ...interest,
        category: this.normalizeInterestCategory(interest.category),
        level: this.normalizeInterestLevel(interest.level)
      }));
    }

    if (data.languages && Array.isArray(data.languages)) {
      data.languages = data.languages.map(language => ({
        ...language,
        proficiencyLevel: this.normalizeLanguageProficiency(language.proficiencyLevel)
      }));
    }

    console.log('✅ Normalisation terminée');
    return data;
  },

  normalizeSkillCategory(category) {
    const mapping = {
      'Technique': 'Technique',
      'technique': 'Technique',
      'Technical': 'Technique',
      'technical': 'Technique',
      'Programmation': 'Programmation',
      'programmation': 'Programmation',
      'Programming': 'Programmation',
      'programming': 'Programmation',
      'Framework': 'Framework/Librairie',
      'framework': 'Framework/Librairie',
      'Librairie': 'Framework/Librairie',
      'librairie': 'Framework/Librairie',
      'Library': 'Framework/Librairie',
      'library': 'Framework/Librairie',
      'Base de données': 'Base de données',
      'base de données': 'Base de données',
      'Database': 'Base de données',
      'database': 'Base de données',
      'DevOps': 'DevOps/Cloud',
      'devops': 'DevOps/Cloud',
      'Cloud': 'DevOps/Cloud',
      'cloud': 'DevOps/Cloud',
      'Design': 'Design/UX',
      'design': 'Design/UX',
      'UX': 'Design/UX',
      'ux': 'Design/UX',
      'UI/UX': 'Design/UX',
      'Gestion': 'Gestion de projet',
      'gestion': 'Gestion de projet',
      'Project Management': 'Gestion de projet',
      'Marketing': 'Marketing',
      'marketing': 'Marketing',
      'Communication': 'Communication',
      'communication': 'Communication',
      'Soft Skills': 'Soft Skills',
      'soft skills': 'Soft Skills',
      'Personnel': 'Soft Skills',
      'personnel': 'Soft Skills',
      'Personal': 'Soft Skills',
      'personal': 'Soft Skills',
      'Langues': 'Langues',
      'langues': 'Langues',
      'Languages': 'Langues',
      'languages': 'Langues',
      'Langue': 'Langues',
      'langue': 'Langues',
      'Language': 'Langues',
      'language': 'Langues',
      'Autre': 'Autre',
      'autre': 'Autre',
      'Other': 'Autre',
      'other': 'Autre'
    };
    return mapping[category] || 'Technique';
  },

  normalizeProficiencyLevel(level) {
    const mapping = {
      'Débutant': 'beginner',
      'débutant': 'beginner',
      'Beginner': 'beginner',
      'beginner': 'beginner',
      'Intermédiaire': 'intermediate',
      'intermédiaire': 'intermediate',
      'Intermediate': 'intermediate',
      'intermediate': 'intermediate',
      'Avancé': 'advanced',
      'avancé': 'advanced',
      'Advanced': 'advanced',
      'advanced': 'advanced',
      'Expert': 'expert',
      'expert': 'expert',
      'Master': 'master',
      'master': 'master'
    };
    return mapping[level] || 'intermediate';
  },

  normalizeInterestCategory(category) {
    const mapping = {
      'Sport': 'Sport',
      'sport': 'Sport',
      'Sports': 'Sport',
      'sports': 'Sport',
      'Arts': 'Arts',
      'art': 'Arts',
      'Art': 'Arts',
      'arts': 'Arts',
      'Musique': 'Musique',
      'musique': 'Musique',
      'Music': 'Musique',
      'music': 'Musique',
      'Lecture': 'Lecture',
      'lecture': 'Lecture',
      'Reading': 'Lecture',
      'reading': 'Lecture',
      'Cuisine': 'Cuisine',
      'cuisine': 'Cuisine',
      'Cooking': 'Cuisine',
      'cooking': 'Cuisine',
      'Voyage': 'Voyage',
      'voyage': 'Voyage',
      'Travel': 'Voyage',
      'travel': 'Voyage',
      'Technologie': 'Technologie',
      'technologie': 'Technologie',
      'Technology': 'Technologie',
      'technology': 'Technologie',
      'Jeux': 'Jeux',
      'jeux': 'Jeux',
      'Games': 'Jeux',
      'games': 'Jeux',
      'Gaming': 'Jeux',
      'gaming': 'Jeux',
      'Nature': 'Nature',
      'nature': 'Nature',
      'Bénévolat': 'Bénévolat',
      'bénévolat': 'Bénévolat',
      'Volunteer': 'Bénévolat',
      'volunteer': 'Bénévolat',
      'Culture': 'Culture',
      'culture': 'Culture',
      'Cultural': 'Culture',
      'cultural': 'Culture',
      'Loisirs': 'Loisirs',
      'loisirs': 'Loisirs',
      'Hobby': 'Loisirs',
      'hobby': 'Loisirs',
      'Personal': 'Loisirs',
      'personal': 'Loisirs',
      'Collection': 'Collection',
      'collection': 'Collection',
      'Artisanat': 'Artisanat',
      'artisanat': 'Artisanat',
      'Craft': 'Artisanat',
      'craft': 'Artisanat',
      'Autre': 'Autre',
      'autre': 'Autre',
      'Other': 'Autre',
      'other': 'Autre'
    };
    return mapping[category] || 'Loisirs';
  },

  normalizeInterestLevel(level) {
    const mapping = {
      'Débutant': 'Débutant',
      'débutant': 'Débutant',
      'Beginner': 'Débutant',
      'beginner': 'Débutant',
      'Amateur': 'Amateur',
      'amateur': 'Amateur',
      'Hobby': 'Amateur',
      'hobby': 'Amateur',
      'Intermediate': 'Amateur',
      'intermediate': 'Amateur',
      'Passionné': 'Passionné',
      'passionné': 'Passionné',
      'Passionate': 'Passionné',
      'passionate': 'Passionné',
      'Expert': 'Expert',
      'expert': 'Expert',
      'Advanced': 'Expert',
      'advanced': 'Expert',
      'Professionnel': 'Professionnel',
      'professionnel': 'Professionnel',
      'Professional': 'Professionnel',
      'professional': 'Professionnel'
    };
    return mapping[level] || 'Amateur';
  },

  normalizeLanguageProficiency(level) {
    const mapping = {
      'Débutant': 'basic',
      'débutant': 'basic',
      'Beginner': 'basic',
      'beginner': 'basic',
      'basic': 'basic',
      'Basic': 'basic',
      'Intermédiaire': 'conversational',
      'intermédiaire': 'conversational',
      'Intermediate': 'conversational',
      'intermediate': 'conversational',
      'conversational': 'conversational',
      'Conversational': 'conversational',
      'Avancé': 'fluent',
      'avancé': 'fluent',
      'Advanced': 'fluent',
      'advanced': 'fluent',
      'fluent': 'fluent',
      'Fluent': 'fluent',
      'Natif': 'native',
      'natif': 'native',
      'Native': 'native',
      'native': 'native',
      'Langue maternelle': 'native',
      'langue maternelle': 'native',
      'Professionnel': 'professional',
      'professionnel': 'professional',
      'Professional': 'professional',
      'professional': 'professional'
    };
    return mapping[level] || 'conversational';
  },

  extractBasicInfo(cvText) {
    console.log('🔄 Utilisation de l\'extraction basique (fallback)');
    
    const lines = cvText.split('\n').map(line => line.trim()).filter(line => line);
    
    // Extraction du nom
    const nameRegex = /^([A-Z][a-z]+)\s+([A-Z][a-z]+)/;
    let firstName = '';
    let lastName = '';
    
    const fullNameMatch = cvText.match(nameRegex);
    if (fullNameMatch) {
      firstName = fullNameMatch[1];
      lastName = fullNameMatch[2];
    }
    
    // Extraction email
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // Extraction téléphone
    const phoneMatch = cvText.match(/(?:📞|Téléphone|Phone|Tel)[:\s]*([0-9\s\-\+\(\)]{10,})/);
    const phone = phoneMatch ? phoneMatch[1].trim() : '';
    
    // Extraction titre
    const titleMatch = cvText.match(/(?:Développeur|Ingénieur|Consultant|Chef de projet|Analyste)[^,\n]*/i);
    const title = titleMatch ? titleMatch[0].trim() : '';
    
    // Extraction localisation
    const locationMatch = cvText.match(/(?:Mobilité|Localisation|Location)[:\s]*([^,\n]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : '';
    
    // Extraction compétences de base
    const skills = [];
    const skillKeywords = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'HTML', 'CSS',
      'MongoDB', 'MySQL', 'PostgreSQL', 'Docker', 'Git', 'TypeScript', 'Angular', 'Vue',
      'Express', 'Django', 'Laravel', 'AWS', 'Azure', 'Kubernetes', 'Redis', 'GraphQL'
    ];
    
    skillKeywords.forEach(skill => {
      if (cvText.toLowerCase().includes(skill.toLowerCase())) {
        skills.push({
          skillName: skill,
          category: 'Technique',
          proficiencyLevel: 'intermediate',
          yearsExperience: 1,
          isPrimary: false
        });
      }
    });
    
    // Extraction langues de base
    const languages = [];
    const languageMatch = cvText.match(/(?:LANGUES|LANGUAGES)[:\s]*([^]*?)(?=\n[A-Z]|$)/i);
    if (languageMatch) {
      const languageText = languageMatch[1];
      const languageKeywords = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien'];
      
      languageKeywords.forEach(lang => {
        if (languageText.toLowerCase().includes(lang.toLowerCase())) {
          languages.push({
            languageName: lang,
            proficiencyLevel: 'conversational',
            certification: '',
            description: ''
          });
        }
      });
    }
    
    // Extraction expériences de base
    const experience = [];
    const experienceMatch = cvText.match(/(?:EXPÉRIENCES|EXPERIENCE)[:\s]*([^]*?)(?=\n[A-Z]|$)/i);
    if (experienceMatch) {
      const expText = experienceMatch[1];
      const expLines = expText.split('\n').filter(line => line.trim());
      
      expLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && (trimmedLine.includes(' - ') || trimmedLine.includes(' chez ') || trimmedLine.includes('('))) {
          // Pattern 1: "Poste - Entreprise - Période, Lieu"
          let match = trimmedLine.match(/^([^-]+)\s*-\s*([^-]+?)\s*-\s*([^,]+)(?:,\s*(.+))?$/);
          if (match) {
            experience.push({
              company: match[2]?.trim() || '',
              position: match[1]?.trim() || '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              location: match[4]?.trim() || '',
              description: trimmedLine,
              achievements: [],
              technologiesUsed: []
            });
            return;
          }
          
          // Pattern 2: "Poste (Entreprise) - Période, Lieu"
          match = trimmedLine.match(/^([^(]+)\s*\(([^)]+)\)\s*-\s*([^,]+)(?:,\s*(.+))?$/);
          if (match) {
            experience.push({
              company: match[2]?.trim() || '',
              position: match[1]?.trim() || '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              location: match[4]?.trim() || '',
              description: trimmedLine,
              achievements: [],
              technologiesUsed: []
            });
            return;
          }
          
          // Pattern 3: "Entreprise - Poste - Période"
          match = trimmedLine.match(/^([^-]+)\s*-\s*([^-]+?)\s*-\s*(.+)$/);
          if (match) {
            experience.push({
              company: match[1]?.trim() || '',
              position: match[2]?.trim() || '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              location: '',
              description: trimmedLine,
              achievements: [],
              technologiesUsed: []
            });
            return;
          }
          
          // Pattern 4: Ligne simple avec séparateur
          const parts = trimmedLine.split(/\s*[-@]\s*/);
          if (parts.length >= 2) {
            experience.push({
              company: parts[1]?.trim() || '',
              position: parts[0]?.trim() || '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              location: '',
              description: trimmedLine,
              achievements: [],
              technologiesUsed: []
            });
          }
        }
      });
    }
    
    // Extraction éducation de base
    const education = [];
    const educationMatch = cvText.match(/(?:ÉDUCATION|FORMATION|DIPLÔME)[:\s]*([^]*?)(?=\n[A-Z]|$)/i);
    if (educationMatch) {
      const eduText = educationMatch[1];
      const eduLines = eduText.split('\n').filter(line => line.trim());
      
      eduLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && (trimmedLine.includes(' - ') || trimmedLine.includes(' à ') || trimmedLine.includes('('))) {
          // Pattern 1: "Diplôme - Institution - Période, Lieu"
          let match = trimmedLine.match(/^([^-]+)\s*-\s*([^-]+?)\s*-\s*([^,]+)(?:,\s*(.+))?$/);
          if (match) {
            education.push({
              institutionName: match[2]?.trim() || '',
              degreeType: match[1]?.trim() || '',
              fieldOfStudy: '',
              location: match[4]?.trim() || '',
              startDate: '',
              endDate: '',
              grade: '',
              description: trimmedLine,
              honors: []
            });
            return;
          }
          
          // Pattern 2: "Diplôme (Institution) - Période, Lieu"
          match = trimmedLine.match(/^([^(]+)\s*\(([^)]+)\)\s*-\s*([^,]+)(?:,\s*(.+))?$/);
          if (match) {
            education.push({
              institutionName: match[2]?.trim() || '',
              degreeType: match[1]?.trim() || '',
              fieldOfStudy: '',
              location: match[4]?.trim() || '',
              startDate: '',
              endDate: '',
              grade: '',
              description: trimmedLine,
              honors: []
            });
            return;
          }
          
          // Pattern 3: Ligne simple avec séparateur
          const parts = trimmedLine.split(/\s*[-@]\s*/);
          if (parts.length >= 2) {
            education.push({
              institutionName: parts[1]?.trim() || '',
              degreeType: parts[0]?.trim() || '',
              fieldOfStudy: '',
              location: '',
              startDate: '',
              endDate: '',
              grade: '',
              description: trimmedLine,
              honors: []
            });
          }
        }
      });
    }
    
    // Extraction projets de base
    const projects = [];
    const projectMatch = cvText.match(/(?:PROJETS|RÉALISATIONS)[:\s]*([^]*?)(?=\n[A-Z]|$)/i);
    if (projectMatch) {
      const projText = projectMatch[1];
      const projLines = projText.split('\n').filter(line => line.trim());
      
      projLines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && (trimmedLine.includes(' - ') || trimmedLine.includes(' : ') || trimmedLine.includes('('))) {
          // Pattern 1: "Nom du projet - Description"
          let match = trimmedLine.match(/^([^-]+)\s*-\s*(.+)$/);
          if (match) {
            projects.push({
              projectName: match[1]?.trim() || '',
              description: match[2]?.trim() || '',
              projectUrl: '',
              repositoryUrl: '',
              technologiesUsed: [],
              startDate: '',
              endDate: '',
              isOngoing: false,
              screenshots: []
            });
            return;
          }
          
          // Pattern 2: "Nom du projet : Description"
          match = trimmedLine.match(/^([^:]+)\s*:\s*(.+)$/);
          if (match) {
            projects.push({
              projectName: match[1]?.trim() || '',
              description: match[2]?.trim() || '',
              projectUrl: '',
              repositoryUrl: '',
              technologiesUsed: [],
              startDate: '',
              endDate: '',
              isOngoing: false,
              screenshots: []
            });
            return;
          }
          
          // Pattern 3: "Nom du projet (Technologies)"
          match = trimmedLine.match(/^([^(]+)\s*\(([^)]+)\)$/);
          if (match) {
            projects.push({
              projectName: match[1]?.trim() || '',
              description: `Technologies: ${match[2]?.trim() || ''}`,
              projectUrl: '',
              repositoryUrl: '',
              technologiesUsed: [],
              startDate: '',
              endDate: '',
              isOngoing: false,
              screenshots: []
            });
          }
        }
      });
    }
    
    const extractedData = {
      personalInfo: {
        firstName,
        lastName,
        email,
        phone,
        location,
        title,
        summary: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
      },
      experience,
      education,
      skills,
      languages,
      projects,
      certifications: [],
      interests: []
    };

    console.log(`✅ Extraction basique: ${skills.length} compétences, ${languages.length} langues, ${experience.length} expériences, ${education.length} formations, ${projects.length} projets`);
    return extractedData;
  }
};

module.exports = dataExtractor;
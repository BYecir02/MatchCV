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
    
    const nameRegex = /\*\*([^*]+)\*\*/;
    let firstName = '';
    let lastName = '';
    
    const fullNameMatch = cvText.match(nameRegex);
    if (fullNameMatch) {
      const fullName = fullNameMatch[1].trim();
      const nameParts = fullName.split(/\s+/);
      
      if (nameParts.length >= 2) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      } else {
        firstName = fullName;
      }
    }
    
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';
    
    const phoneMatch = cvText.match(/📞\s*([0-9\s\-\+\(\)]{10,})/);
    const phone = phoneMatch ? phoneMatch[1].trim() : '';
    
    const extractedData = {
      personalInfo: {
        firstName,
        lastName,
        email,
        phone,
        location: '',
        title: '',
        summary: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: ''
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      interests: []
    };

    // Extraction de compétences basiques
    const skillsSection = cvText.match(/(?:COMPÉTENCES|SKILLS)([\s\S]*?)(?=(?:\n#{1,3}|\n[A-Z]{2,}|\n---|\Z))/i);
    if (skillsSection) {
      const skillsText = skillsSection[1];
      const skills = skillsText.match(/(?:JavaScript|React|Vue|Node|Python|PHP|Java|HTML|CSS|SQL|MongoDB|MySQL|Docker|AWS|Git|TypeScript|Angular|Figma)/gi) || [];
      
      skills.forEach(skill => {
        extractedData.skills.push({
          skillName: skill,
          category: 'Technique',
          proficiencyLevel: 'intermediate',
          yearsExperience: 1,
          isPrimary: false
        });
      });
    }

    // Langues communes
    if (cvText.match(/français/i)) {
      extractedData.languages.push({
        languageName: 'Français',
        proficiencyLevel: 'native',
        certification: '',
        description: ''
      });
    }

    if (cvText.match(/anglais/i)) {
      extractedData.languages.push({
        languageName: 'Anglais',
        proficiencyLevel: 'conversational',
        certification: '',
        description: ''
      });
    }

    console.log('✅ Données extraites (fallback):', Object.keys(extractedData));
    return extractedData;
  }
};

module.exports = dataExtractor;
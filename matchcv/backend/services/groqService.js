const Groq = require('groq-sdk');

// ⭐ VÉRIFIER : Initialisation du client Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const groqService = {
  
  async analyzeCVAndExtractProfile(cvText) {
    try {
      console.log('🤖 Début analyse CV avec Groq...');
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée dans les variables d\'environnement');
      }

const prompt = `
Tu es un expert en analyse de CV. Analyse le CV suivant et extrait les informations dans un format JSON structuré.

CV À ANALYSER:
${cvText}

INSTRUCTIONS IMPORTANTES:
1. Extrait toutes les informations personnelles, expériences, formations, compétences, etc.
2. Structure les données selon le format demandé
3. Pour les dates, utilise le format YYYY-MM-DD quand possible
4. RESPECTE ABSOLUMENT les valeurs enum suivantes:

VALEURS ENUM OBLIGATOIRES:
- skills.category: UNIQUEMENT "Technique", "Programmation", "Framework/Librairie", "Base de données", "DevOps/Cloud", "Design/UX", "Gestion de projet", "Marketing", "Communication", "Langues", "Soft Skills", "Autre"
- skills.proficiencyLevel: UNIQUEMENT "beginner", "intermediate", "advanced", "expert", "master"
- interests.category: UNIQUEMENT "Sport", "Arts", "Musique", "Lecture", "Cuisine", "Voyage", "Technologie", "Jeux", "Nature", "Bénévolat", "Culture", "Loisirs", "Collection", "Artisanat", "Autre"
- interests.level: UNIQUEMENT "Débutant", "Amateur", "Passionné", "Expert", "Professionnel"
- languages.proficiencyLevel: UNIQUEMENT "beginner", "intermediate", "advanced", "native"

RÉPONSE ATTENDUE - UNIQUEMENT LE JSON (pas de texte explicatif avant ou après):
{
  "personalInfo": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phone": "",
    "location": "",
    "title": "",
    "summary": "",
    "linkedinUrl": "",
    "githubUrl": "",
    "portfolioUrl": ""
  },
  "experience": [{
    "company": "",
    "position": "",
    "startDate": "",
    "endDate": "",
    "isCurrent": false,
    "location": "",
    "description": "",
    "achievements": [],
    "technologiesUsed": []
  }],
  "education": [{
    "institutionName": "",
    "degreeType": "",
    "fieldOfStudy": "",
    "location": "",
    "startDate": "",
    "endDate": "",
    "grade": "",
    "description": "",
    "honors": []
  }],
  "skills": [{
    "skillName": "",
    "category": "Technique",
    "proficiencyLevel": "intermediate",
    "yearsExperience": 1,
    "isPrimary": false
  }],
  "languages": [{
    "languageName": "",
    "proficiencyLevel": "intermediate",
    "certification": "",
    "description": ""
  }],
  "projects": [{
    "projectName": "",
    "description": "",
    "projectUrl": "",
    "repositoryUrl": "",
    "technologiesUsed": [],
    "startDate": "",
    "endDate": "",
    "isOngoing": false,
    "screenshots": []
  }],
  "certifications": [{
    "certificationName": "",
    "issuingOrganization": "",
    "credentialId": "",
    "issueDate": "",
    "expirationDate": "",
    "credentialUrl": "",
    "neverExpires": false
  }],
  "interests": [{
    "interestName": "",
    "category": "Loisirs",
    "description": "",
    "level": "Amateur",
    "isActive": true
  }]
}

IMPORTANT: Retourne UNIQUEMENT le JSON, sans texte d'introduction ou d'explication.
Pour les compétences web, utilise "Technique" ou "Programmation" selon le contexte.`;

      // ⭐ CORRECTION : Utiliser la bonne méthode et structure
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Tu es un expert en analyse de CV. Tu extrais les informations de CV et les structures en JSON valide avec les bonnes valeurs enum. Retourne UNIQUEMENT le JSON, sans texte explicatif."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant", // ⭐ Modèle Groq valide
        temperature: 0.1,
        max_tokens: 4000,
        top_p: 1,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('Réponse vide de Groq');
      }

      console.log('🤖 Réponse brute Groq:', responseText.substring(0, 200) + '...');

      // ⭐ AMÉLIORATION : Nettoyage plus agressif de la réponse
      let cleanedResponse = responseText.trim();
      
      // Supprimer tout texte avant le premier {
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace > 0) {
        cleanedResponse = cleanedResponse.substring(firstBrace);
        console.log('🧹 Texte d\'introduction supprimé');
      }
      
      // Supprimer tout texte après le dernier }
      const lastBrace = cleanedResponse.lastIndexOf('}');
      if (lastBrace > 0 && lastBrace < cleanedResponse.length - 1) {
        cleanedResponse = cleanedResponse.substring(0, lastBrace + 1);
        console.log('🧹 Texte de conclusion supprimé');
      }
      
      // Supprimer les backticks et balises markdown
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/^\s*```[\s\S]*?\n/, '').replace(/\n```\s*$/, '');
      
      try {
        const extractedData = JSON.parse(cleanedResponse);
        
        // ⭐ SÉCURITÉ : Normaliser les valeurs enum après parsing
        const normalizedData = this.normalizeExtractedData(extractedData);
        
        console.log('✅ Données extraites et normalisées avec succès');
        return normalizedData;
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
        
        // Retourner des données par défaut avec informations basiques
        return this.extractBasicInfo(cvText);
      }

    } catch (error) {
      console.error('❌ Erreur Groq:', error);
      
      // Fallback : extraction basique sans IA
      return this.extractBasicInfo(cvText);
    }
  },

  // ⭐ NOUVELLE MÉTHODE : Normaliser les données extraites pour éviter les erreurs enum
  normalizeExtractedData(data) {
    console.log('🔧 Normalisation des valeurs enum...');
    
    // Normaliser les compétences
    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills.map(skill => ({
        ...skill,
        category: this.normalizeSkillCategory(skill.category),
        proficiencyLevel: this.normalizeProficiencyLevel(skill.proficiencyLevel)
      }));
    }

    // Normaliser les centres d'intérêt
    if (data.interests && Array.isArray(data.interests)) {
      data.interests = data.interests.map(interest => ({
        ...interest,
        category: this.normalizeInterestCategory(interest.category),
        level: this.normalizeInterestLevel(interest.level)
      }));
    }

    // Normaliser les langues
    if (data.languages && Array.isArray(data.languages)) {
      data.languages = data.languages.map(language => ({
        ...language,
        proficiencyLevel: this.normalizeLanguageProficiency(language.proficiencyLevel)
      }));
    }

    console.log('✅ Normalisation terminée');
    return data;
  },

  // ⭐ HELPERS : Normalisation des valeurs enum
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
    return mapping[category] || 'Technique'; // ⭐ Défaut selon le modèle
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
      'expert': 'expert'
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
      'Hobby': 'Loisirs',             // ⭐ CORRECTION
      'hobby': 'Loisirs',             // ⭐ CORRECTION
      'Personal': 'Loisirs',          // ⭐ CORRECTION
      'personal': 'Loisirs',          // ⭐ CORRECTION
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
    return mapping[category] || 'Loisirs'; // ⭐ Défaut selon le modèle
  },

  normalizeInterestLevel(level) {
    const mapping = {
      'Débutant': 'Débutant',
      'débutant': 'Débutant',
      'Beginner': 'Débutant',         // ⭐ CORRECTION
      'beginner': 'Débutant',         // ⭐ CORRECTION
      'Amateur': 'Amateur',
      'amateur': 'Amateur',
      'Hobby': 'Amateur',             // ⭐ CORRECTION
      'hobby': 'Amateur',             // ⭐ CORRECTION
      'Intermediate': 'Amateur',      // ⭐ CORRECTION
      'intermediate': 'Amateur',      // ⭐ CORRECTION
      'Passionné': 'Passionné',
      'passionné': 'Passionné',
      'Passionate': 'Passionné',
      'passionate': 'Passionné',
      'Expert': 'Expert',
      'expert': 'Expert',
      'Advanced': 'Expert',           // ⭐ CORRECTION
      'advanced': 'Expert',           // ⭐ CORRECTION
      'Professionnel': 'Professionnel',
      'professionnel': 'Professionnel',
      'Professional': 'Professionnel',
      'professional': 'Professionnel'
    };
    return mapping[level] || 'Amateur'; // ⭐ Défaut selon le modèle
  },

  normalizeLanguageProficiency(level) {
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
      'Natif': 'native',
      'natif': 'native',
      'Native': 'native',
      'native': 'native',
      'Langue maternelle': 'native',
      'langue maternelle': 'native'
    };
    return mapping[level] || 'intermediate';
  },

  // ⭐ MÉTHODE FALLBACK : Extraction basique sans IA (CORRIGÉE)
  extractBasicInfo(cvText) {
    console.log('🔄 Utilisation de l\'extraction basique (fallback)');
    
    const lines = cvText.split('\n').map(line => line.trim()).filter(line => line);
    
    // ⭐ EXTRACTION AMÉLIORÉE DU NOM
    const nameRegex = /\*\*([^*]+)\*\*/; // Nom entre **
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
    
    // Extraction de l'email
    const emailMatch = cvText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : '';
    
    // ⭐ EXTRACTION AMÉLIORÉE DU TÉLÉPHONE
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

    // ⭐ EXTRACTION BASIQUE DES COMPÉTENCES (CORRIGÉE)
  const skillsSection = cvText.match(/(?:COMPÉTENCES|SKILLS)([\s\S]*?)(?=(?:\n#{1,3}|\n[A-Z]{2,}|\n---|\Z))/i);
  if (skillsSection) {
    const skillsText = skillsSection[1];
    const skills = skillsText.match(/(?:JavaScript|React|Vue|Node|Python|PHP|Java|HTML|CSS|SQL|MongoDB|MySQL|Docker|AWS|Git|TypeScript|Angular|Figma)/gi) || [];
    
    skills.forEach(skill => {
      extractedData.skills.push({
        skillName: skill,
        category: 'Technique', // ⭐ CORRECTION : Valeur enum valide
        proficiencyLevel: 'intermediate',
        yearsExperience: 1,
        isPrimary: false
      });
    });
    
    console.log('✅ Compétences extraites:', extractedData.skills.length);
  }

    // ⭐ EXTRACTION BASIQUE DES LANGUES (CORRIGÉE)
    if (cvText.match(/français/i)) {
      extractedData.languages.push({
        languageName: 'Français',
        proficiencyLevel: 'native', // ⭐ CORRECTION : Valeur enum valide
        certification: '',
        description: ''
      });
    }

    if (cvText.match(/anglais/i)) {
      extractedData.languages.push({
        languageName: 'Anglais',
        proficiencyLevel: 'intermediate', // ⭐ CORRECTION : Valeur enum valide
        certification: '',
        description: ''
      });
    }

    console.log('✅ Données extraites (fallback):', Object.keys(extractedData));
    return extractedData;
  }
};

module.exports = groqService;
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
- languages.proficiencyLevel: UNIQUEMENT "basic", "conversational", "fluent", "native", "professional"

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
    "proficiencyLevel": "conversational",
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
        model: "llama-3.1-8b-instant",
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

      let cleanedResponse = responseText.trim();
      
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace > 0) {
        cleanedResponse = cleanedResponse.substring(firstBrace);
        console.log('🧹 Texte d\'introduction supprimé');
      }
      
      const lastBrace = cleanedResponse.lastIndexOf('}');
      if (lastBrace > 0 && lastBrace < cleanedResponse.length - 1) {
        cleanedResponse = cleanedResponse.substring(0, lastBrace + 1);
        console.log('🧹 Texte de conclusion supprimé');
      }
      
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      cleanedResponse = cleanedResponse.replace(/^\s*```[\s\S]*?\n/, '').replace(/\n```\s*$/, '');
      
      try {
        const extractedData = JSON.parse(cleanedResponse);
        const normalizedData = this.normalizeExtractedData(extractedData);
        
        console.log('✅ Données extraites et normalisées avec succès');
        return normalizedData;
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
        return this.extractBasicInfo(cvText);
      }

    } catch (error) {
      console.error('❌ Erreur Groq:', error);
      return this.extractBasicInfo(cvText);
    }
  },

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
  },

  // ⭐ ANALYSER UNE ANNONCE D'EMPLOI AVEC PROFIL UTILISATEUR COMPLET - ULTRA-AMÉLIORÉ
  async analyzeJob(jobText, userProfile = null) {
    try {
      console.log('🔍 Début analyse annonce d\'emploi...');
      console.log('👤 Profil utilisateur fourni:', !!userProfile);
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée');
      }

      // ✅ CONSTRUIRE UNE DESCRIPTION ULTRA-COMPLÈTE DU PROFIL
      let userSkillsList = [];
      let userExperienceText = '';
      let userEducationText = '';
      let userProjectsText = '';
      let userCertificationsText = '';
      let userLanguagesText = '';
      let userInterestsText = '';
      
      if (userProfile) {
        // ✅ COMPÉTENCES DÉTAILLÉES
        if (userProfile.skills && Array.isArray(userProfile.skills)) {
          userSkillsList = userProfile.skills.map(skill => ({
            name: skill.skillName,
            level: skill.proficiencyLevel,
            years: skill.yearsExperience || 0,
            category: skill.category || 'Technique',
            isPrimary: skill.isPrimary || false
          }));
          console.log('🛠️ Compétences utilisateur:', userSkillsList.length);
        }

        // ✅ EXPÉRIENCES ULTRA-DÉTAILLÉES
        if (userProfile.experience && Array.isArray(userProfile.experience)) {
          userExperienceText = userProfile.experience.map((exp, index) => {
            let expText = `${exp.position || 'Poste'} chez ${exp.company || 'Entreprise'}`;
            
            // Période et durée
            if (exp.startDate || exp.endDate) {
              const period = exp.startDate ? 
                `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Actuellement'}` : 
                `Jusqu'à ${exp.endDate}`;
              expText += ` (${period})`;
            }
            if (exp.duration) expText += ` [${exp.duration}]`;
            
            // Localisation
            if (exp.location) expText += ` - ${exp.location}`;
            
            // Description détaillée
            if (exp.description) expText += ` | Mission: ${exp.description}`;
            
            // Réalisations/Achievements
            if (exp.achievements && exp.achievements.length > 0) {
              expText += ` | Réalisations: ${exp.achievements.join(', ')}`;
            }
            
            // Technologies utilisées
            if (exp.technologiesUsed && exp.technologiesUsed.length > 0) {
              expText += ` | Technologies: ${exp.technologiesUsed.join(', ')}`;
            }
            
            // Indicateur si c'est l'emploi actuel
            if (exp.isCurrent) {
              expText += ` | POSTE ACTUEL`;
            }
            
            return `[EXP ${index + 1}] ${expText}`;
          }).join('\n');
          
          console.log('💼 Expériences utilisateur COMPLÈTES:', userProfile.experience.length);
        }

        // ✅ FORMATIONS DÉTAILLÉES
        if (userProfile.education && Array.isArray(userProfile.education)) {
          userEducationText = userProfile.education.map((edu, index) => {
            let eduText = `${edu.degreeType || 'Diplôme'} en ${edu.fieldOfStudy || 'Domaine'} à ${edu.institutionName || 'Établissement'}`;
            
            if (edu.startDate || edu.endDate) {
              const period = edu.startDate ? 
                `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ' - En cours'}` : 
                `Jusqu'à ${edu.endDate}`;
              eduText += ` (${period})`;
            }
            
            if (edu.location) eduText += ` - ${edu.location}`;
            if (edu.grade) eduText += ` | Mention: ${edu.grade}`;
            if (edu.description) eduText += ` | Description: ${edu.description}`;
            if (edu.honors && edu.honors.length > 0) eduText += ` | Distinctions: ${edu.honors.join(', ')}`;
            
            return `[EDU ${index + 1}] ${eduText}`;
          }).join('\n');
          console.log('🎓 Formations utilisateur COMPLÈTES:', userProfile.education.length);
        }

        // ✅ PROJETS ULTRA-DÉTAILLÉS
        if (userProfile.projects && Array.isArray(userProfile.projects)) {
          userProjectsText = userProfile.projects.map((proj, index) => {
            let projText = `${proj.projectName || 'Projet'}`;
            if (proj.description) projText += `: ${proj.description}`;
            
            if (proj.technologiesUsed && proj.technologiesUsed.length > 0) {
              projText += ` | Technologies: ${proj.technologiesUsed.join(', ')}`;
            }
            
            if (proj.projectUrl) projText += ` | URL: ${proj.projectUrl}`;
            if (proj.repositoryUrl) projText += ` | Repository: ${proj.repositoryUrl}`;
            
            if (proj.startDate) projText += ` | Début: ${proj.startDate}`;
            if (proj.endDate) projText += ` | Fin: ${proj.endDate}`;
            if (proj.isOngoing) projText += ` | EN COURS`;
            
            return `[PROJET ${index + 1}] ${projText}`;
          }).join('\n');
          
          console.log('🚀 Projets utilisateur COMPLETS:', userProfile.projects.length);
        }

        // ✅ CERTIFICATIONS DÉTAILLÉES
        if (userProfile.certifications && Array.isArray(userProfile.certifications)) {
          userCertificationsText = userProfile.certifications.map((cert, index) => {
            let certText = `${cert.certificationName || 'Certification'} délivré par ${cert.issuingOrganization || 'Organisme'}`;
            
            if (cert.issueDate) certText += ` | Obtenu: ${cert.issueDate}`;
            if (cert.expirationDate && !cert.neverExpires) certText += ` | Expire: ${cert.expirationDate}`;
            if (cert.neverExpires) certText += ` | Valide à vie`;
            if (cert.credentialId) certText += ` | ID: ${cert.credentialId}`;
            if (cert.credentialUrl) certText += ` | URL: ${cert.credentialUrl}`;
            
            return `[CERT ${index + 1}] ${certText}`;
          }).join('\n');
          console.log('🏆 Certifications utilisateur COMPLÈTES:', userProfile.certifications.length);
        }

        // ✅ LANGUES DÉTAILLÉES
        if (userProfile.languages && Array.isArray(userProfile.languages)) {
          userLanguagesText = userProfile.languages.map((lang, index) => {
            let langText = `${lang.languageName || 'Langue'} (${lang.proficiencyLevel || 'conversational'})`;
            
            if (lang.certification) langText += ` | Certification: ${lang.certification}`;
            if (lang.description) langText += ` | Description: ${lang.description}`;
            
            return langText;
          }).join(', ');
          console.log('🌍 Langues utilisateur COMPLÈTES:', userProfile.languages.length);
        }

        // ✅ CENTRES D'INTÉRÊT DÉTAILLÉS
        if (userProfile.interests && Array.isArray(userProfile.interests)) {
          userInterestsText = userProfile.interests.map((interest, index) => {
            let interestText = `${interest.interestName || 'Intérêt'} (${interest.level || 'Amateur'})`;
            
            if (interest.description) interestText += ` - ${interest.description}`;
            if (interest.category) interestText += ` [${interest.category}]`;
            if (!interest.isActive) interestText += ` (Inactif)`;
            
            return interestText;
          }).join(', ');
          console.log('🎯 Centres d\'intérêt utilisateur COMPLETS:', userProfile.interests.length);
        }
      }

      const prompt = `
Tu es un expert RH qui analyse des annonces d'emploi et compare avec des profils candidats ULTRA-DÉTAILLÉS.

ANNONCE D'EMPLOI À ANALYSER :
${jobText}

${userProfile ? `
PROFIL UTILISATEUR ULTRA-COMPLET ET DÉTAILLÉ :

👤 INFORMATIONS PERSONNELLES :
- Nom: ${userProfile.personalInfo?.firstName} ${userProfile.personalInfo?.lastName}
- Titre actuel: ${userProfile.personalInfo?.title || 'Non spécifié'}
- Localisation: ${userProfile.personalInfo?.location || 'Non spécifiée'}
- Email: ${userProfile.personalInfo?.email || 'Non fourni'}
- Résumé: ${userProfile.personalInfo?.summary || 'Non fourni'}
- LinkedIn: ${userProfile.personalInfo?.linkedinUrl || 'Non fourni'}

🛠️ COMPÉTENCES TECHNIQUES DÉTAILLÉES (${userSkillsList.length}) :
${userSkillsList.map(s => `- ${s.name} (Niveau: ${s.level}, Expérience: ${s.years} ans, Catégorie: ${s.category}${s.isPrimary ? ', ⭐ COMPÉTENCE PRINCIPALE' : ''})`).join('\n')}

💼 EXPÉRIENCES PROFESSIONNELLES ULTRA-DÉTAILLÉES (${userProfile.experience?.length || 0}) :
${userExperienceText || 'Aucune expérience renseignée'}

🎓 FORMATIONS COMPLÈTES (${userProfile.education?.length || 0}) :
${userEducationText || 'Aucune formation renseignée'}

🚀 PROJETS RÉALISÉS DÉTAILLÉS (${userProfile.projects?.length || 0}) :
${userProjectsText || 'Aucun projet renseigné'}

🏆 CERTIFICATIONS DÉTAILLÉES (${userProfile.certifications?.length || 0}) :
${userCertificationsText || 'Aucune certification'}

🌍 LANGUES PARLÉES DÉTAILLÉES (${userProfile.languages?.length || 0}) :
${userLanguagesText || 'Aucune langue renseignée'}

🎯 CENTRES D'INTÉRÊT DÉTAILLÉS (${userProfile.interests?.length || 0}) :
${userInterestsText || 'Aucun centre d\'intérêt renseigné'}

INSTRUCTIONS ULTRA-IMPORTANTES :
- Compare PRÉCISÉMENT chaque compétence de l'annonce avec TOUT le profil utilisateur (compétences, expériences, projets, formations)
- Si une compétence apparaît dans les expériences, projets ou technologies utilisées, marque userHasSkill: true
- Calcule le userProficiencyLevel en croisant niveau déclaré + expérience pratique + projets réalisés
- Tiens compte des descriptions d'expériences et réalisations pour identifier les compétences implicites
- Considère les technologies utilisées dans les projets comme des compétences pratiques
- Score de correspondance basé sur l'ENSEMBLE du profil (pas seulement les compétences déclarées)
- Recommandations hyper-personnalisées basées sur TOUTES les données du profil
` : `
AUCUN PROFIL UTILISATEUR FOURNI
- Marque toutes les compétences avec userHasSkill: false
- userProficiencyLevel: 0 pour toutes les compétences
- Recommandations génériques
`}

RETOURNE UNIQUEMENT ce JSON (sans texte d'explication) :

{
  "title": "Titre du poste extrait de l'annonce",
  "company": "Nom de l'entreprise extrait", 
  "location": "Lieu du poste (ville, région, pays)",
  "contractType": "CDI/CDD/Stage/Freelance/Alternance",
  "experienceRequired": "Niveau d'expérience requis (ex: 2-3 ans, débutant accepté, senior)",
  "salaryRange": "Fourchette salariale si mentionnée (ex: 45-55k€, négociable)",
  "extractedSkills": [
    {
      "skillName": "Nom exact de la compétence",
      "category": "Technique/Programmation/Framework/Base de données/DevOps/Design/Autre",
      "importanceLevel": "essential/desired/nice_to_have",
      "yearsRequired": 2,
      "userHasSkill": ${userProfile ? 'true si l\'utilisateur possède cette compétence selon TOUT SON PROFIL (compétences déclarées, expériences, projets, technologies utilisées)' : 'false'},
      "userProficiencyLevel": ${userProfile ? 'Niveau 1-5 calculé selon profil COMPLET (1=débutant, 5=expert) en croisant compétences déclarées + expérience pratique + projets' : '0'}
    }
  ],
  "strengths": [${userProfile ? '"Points forts basés sur TOUT le profil : compétences, expériences détaillées, projets, formations, certifications qui matchent avec l\'annonce"' : '"Aucun profil pour analyser les forces"'}],
  "weaknesses": [${userProfile ? '"Compétences/expériences manquantes essentielles identifiées en comparant avec le profil COMPLET"' : '"Profil utilisateur nécessaire pour analyser"'}],
  "recommendations": [${userProfile ? '"Conseils hyper-personnalisés basés sur TOUT le profil (formations suggérées selon lacunes, projets à réaliser pour acquérir compétences manquantes, certifications utiles, expériences à valoriser)"' : '"Complétez votre profil pour des recommandations personnalisées"'}],
  "canApply": ${userProfile ? 'true si le profil COMPLET correspond suffisamment (>= 60% des compétences essentielles OU expérience pertinente significative)' : 'true'},
  "analysisSummary": "Résumé de l'analyse en 2-3 phrases incluant le niveau de correspondance${userProfile ? ' avec le profil utilisateur ULTRA-COMPLET (expériences, projets, compétences, formations)' : ''}"
}

IMPORTANT: 
- Retourne UNIQUEMENT le JSON, pas de texte avant ou après
- Sois ULTRA-précis dans la comparaison avec le profil COMPLET (ne rate aucune compétence implicite)
- ${userProfile ? 'Base-toi sur ABSOLUMENT TOUTES les données : compétences + expériences détaillées + projets + technologies + formations + certifications' : 'Marque toutes les correspondances comme false'}
- Une compétence peut être acquise via expérience professionnelle, projets personnels, ou formations même si pas listée explicitement
- Considère les descriptions détaillées d'expériences pour identifier compétences cachées`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Tu es un expert RH ultra-spécialisé dans l'analyse d'annonces d'emploi et la correspondance avec des profils candidats ULTRA-COMPLETS. 
            ${userProfile ? 'COMPARE MÉTICULEUSEMENT avec ABSOLUMENT TOUT le profil fourni (compétences déclarées + expériences détaillées avec missions et réalisations + projets avec technologies + formations + certifications + langues). Identifie les compétences implicites dans les expériences et projets. Sois réaliste mais optimiste dans les correspondances.' : 'Aucun profil fourni, marque toutes les compétences comme non possédées.'}
            Retourne UNIQUEMENT du JSON valide, sans texte d'explication.`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.1,
        max_tokens: 3000,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('Réponse vide de Groq');
      }

      console.log('🤖 Réponse brute:', responseText.substring(0, 200) + '...');

      // ✅ NETTOYER LA RÉPONSE
      let cleanedResponse = responseText.trim();
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Supprimer le texte avant le premier {
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace > 0) {
        cleanedResponse = cleanedResponse.substring(firstBrace);
      }
      
      // Supprimer le texte après le dernier }
      const lastBrace = cleanedResponse.lastIndexOf('}');
      if (lastBrace > 0 && lastBrace < cleanedResponse.length - 1) {
        cleanedResponse = cleanedResponse.substring(0, lastBrace + 1);
      }
      
      try {
        const analysis = JSON.parse(cleanedResponse);
        
        // ✅ CALCULER LE SCORE DE CORRESPONDANCE BASÉ SUR LES VRAIES DONNÉES
        if (analysis.extractedSkills && Array.isArray(analysis.extractedSkills)) {
          const matchingSkills = analysis.extractedSkills.filter(skill => skill.userHasSkill === true);
          const essentialSkills = analysis.extractedSkills.filter(skill => skill.importanceLevel === 'essential');
          const matchingEssentialSkills = essentialSkills.filter(skill => skill.userHasSkill === true);
          
          const totalSkills = analysis.extractedSkills.length;
          const overallScore = totalSkills > 0 ? Math.round((matchingSkills.length / totalSkills) * 100) : 0;
          const essentialScore = essentialSkills.length > 0 ? Math.round((matchingEssentialSkills.length / essentialSkills.length) * 100) : 100;
          
          analysis.overallMatchScore = overallScore;
          analysis.essentialSkillsScore = essentialScore;
          
          console.log(`📊 Score calculé - Global: ${overallScore}%, Essentiel: ${essentialScore}%`);
          console.log(`🔧 Compétences: ${matchingSkills.length}/${totalSkills} matchées`);
        } else {
          analysis.overallMatchScore = 0;
          analysis.essentialSkillsScore = 0;
        }
        
        console.log('✅ Analyse annonce réussie avec profil utilisateur ULTRA-COMPLET');
        return analysis;
        
      } catch (parseError) {
        console.error('❌ Erreur parsing JSON:', parseError);
        console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
        return this.extractBasicJobInfo(jobText);
      }

    } catch (error) {
      console.error('❌ Erreur Groq analyse annonce:', error);
      return this.extractBasicJobInfo(jobText);
    }
  },

  // ⭐ MÉTHODE FALLBACK : Extraction basique d'annonce
  extractBasicJobInfo(jobText) {
    console.log('🔄 Extraction basique annonce (fallback)');
    
    const analysis = {
      title: "Poste à analyser",
      company: "Entreprise à déterminer",
      location: "Lieu non spécifié",
      contractType: "CDI",
      experienceRequired: "À déterminer",
      salaryRange: "Non mentionné",
      extractedSkills: [],
      strengths: ["Analyse basique effectuée"],
      weaknesses: ["Profil utilisateur nécessaire pour une analyse détaillée"],
      recommendations: ["Complétez votre profil pour des recommandations personnalisées", "Utilisez l'IA pour une analyse plus précise"],
      canApply: true,
      analysisSummary: "Analyse basique effectuée. Complétez votre profil utilisateur pour une correspondance précise.",
      overallMatchScore: 50,
      essentialSkillsScore: 50
    };

    // ✅ TENTATIVE D'EXTRACTION DU TITRE
    const titlePatterns = [
      /(?:poste|titre|job|position)[:\s-]*([^\n]{10,60})/i,
      /(?:recherche|recrute)[:\s-]*([^\n]{10,60})/i,
      /^([A-Z][a-zA-Z\s\/\-]{10,60})(?:\n|$)/m
    ];
    for (const pattern of titlePatterns) {
      const match = jobText.match(pattern);
      if (match) {
        analysis.title = match[1].trim();
        break;
      }
    }

    // ✅ TENTATIVE D'EXTRACTION DE L'ENTREPRISE
    const companyPatterns = [
      /(?:entreprise|company|société)[:\s-]*([^\n]{2,40})/i,
      /(?:chez|at)[:\s-]*([^\n]{2,40})/i
    ];
    for (const pattern of companyPatterns) {
      const match = jobText.match(pattern);
      if (match) {
        analysis.company = match[1].trim();
        break;
      }
    }

    // ✅ EXTRACTION DES COMPÉTENCES COMMUNES
    const commonSkills = [
      { name: 'JavaScript', category: 'Programmation' },
      { name: 'React', category: 'Framework/Librairie' },
      { name: 'Node.js', category: 'Framework/Librairie' },
      { name: 'Python', category: 'Programmation' },
      { name: 'Java', category: 'Programmation' },
      { name: 'PHP', category: 'Programmation' },
      { name: 'SQL', category: 'Base de données' },
      { name: 'HTML', category: 'Technique' },
      { name: 'CSS', category: 'Technique' },
      { name: 'MongoDB', category: 'Base de données' },
      { name: 'Docker', category: 'DevOps/Cloud' },
      { name: 'Git', category: 'Technique' },
      { name: 'TypeScript', category: 'Programmation' },
      { name: 'Angular', category: 'Framework/Librairie' },
      { name: 'Vue', category: 'Framework/Librairie' }
    ];

    commonSkills.forEach(skill => {
      const regex = new RegExp(skill.name, 'i');
      if (regex.test(jobText)) {
        analysis.extractedSkills.push({
          skillName: skill.name,
          category: skill.category,
          importanceLevel: 'desired',
          yearsRequired: 1,
          userHasSkill: false,
          userProficiencyLevel: 0
        });
      }
    });

    console.log(`✅ Fallback: ${analysis.extractedSkills.length} compétences trouvées`);
    return analysis;
  },

  // ⭐ GÉNÉRER UNE LETTRE DE MOTIVATION AVEC PROFIL ULTRA-COMPLET - AMÉLIORÉ
  async generateCoverLetter(jobDescription, userProfile, aiInstructions = '') {
    try {
      console.log('✍️ Génération lettre de motivation...');
      console.log('👤 Profil utilisateur fourni:', !!userProfile);
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée');
      }

      // ✅ CONSTRUIRE UN RÉSUMÉ ULTRA-DÉTAILLÉ DU PROFIL
      let profileSummary = '';

      if (userProfile) {
        console.log('👤 Construction du résumé profil ULTRA-détaillé...');
        
        // ✅ INFORMATIONS PERSONNELLES
        profileSummary += `\n👤 CANDIDAT : ${userProfile.personalInfo?.firstName || 'Prénom'} ${userProfile.personalInfo?.lastName || 'Nom'}`;
        profileSummary += `\n📍 LOCALISATION : ${userProfile.personalInfo?.location || 'Non spécifiée'}`;
        profileSummary += `\n💼 TITRE ACTUEL : ${userProfile.personalInfo?.title || 'Candidat'}`;
        if (userProfile.personalInfo?.summary) {
          profileSummary += `\n📝 RÉSUMÉ PERSONNEL : ${userProfile.personalInfo.summary}`;
        }
        
        // ✅ COMPÉTENCES TECHNIQUES ULTRA-DÉTAILLÉES
        if (userProfile.skills && userProfile.skills.length > 0) {
          profileSummary += `\n\n🛠️ COMPÉTENCES TECHNIQUES (${userProfile.skills.length}) :`;
          userProfile.skills.forEach(skill => {
            profileSummary += `\n- ${skill.skillName || 'Compétence'} (Niveau: ${skill.proficiencyLevel || 'intermediate'}, ${skill.yearsExperience || 0} ans d'expérience, Catégorie: ${skill.category || 'Technique'}${skill.isPrimary ? ', ⭐ COMPÉTENCE PRINCIPALE' : ''})`;
          });
        }
        
        // ✅ EXPÉRIENCES PROFESSIONNELLES ULTRA-DÉTAILLÉES
        if (userProfile.experience && userProfile.experience.length > 0) {
          profileSummary += `\n\n💼 EXPÉRIENCES PROFESSIONNELLES (${userProfile.experience.length}) :`;
          userProfile.experience.forEach((exp, index) => {
            profileSummary += `\n${index + 1}. ${exp.position || 'Poste'} chez ${exp.company || 'Entreprise'}`;
            
            // Période complète
            if (exp.startDate || exp.endDate) {
              const period = exp.startDate ? 
                `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Actuellement'}` : 
                `Jusqu'à ${exp.endDate}`;
              profileSummary += ` (${period})`;
            }
            if (exp.duration) profileSummary += ` [Durée: ${exp.duration}]`;
            
            // Localisation
            if (exp.location) profileSummary += ` - ${exp.location}`;
            
            // Description détaillée (TRÈS IMPORTANT)
            if (exp.description) {
              profileSummary += `\n   📝 Mission: ${exp.description}`;
            }
            
            // Réalisations concrètes
            if (exp.achievements && exp.achievements.length > 0) {
              profileSummary += `\n   🏆 Réalisations:`;
              exp.achievements.forEach(achievement => {
                profileSummary += `\n     • ${achievement}`;
              });
            }
            
            // Technologies et compétences utilisées
            if (exp.technologiesUsed && exp.technologiesUsed.length > 0) {
              profileSummary += `\n   🛠️ Technologies: ${exp.technologiesUsed.join(', ')}`;
            }
            
            // Indicateur si c'est l'emploi actuel
            if (exp.isCurrent) {
              profileSummary += `\n   ⭐ POSTE ACTUEL`;
            }
          });
        }
        
        // ✅ FORMATIONS COMPLÈTES
        if (userProfile.education && userProfile.education.length > 0) {
          profileSummary += `\n\n🎓 FORMATIONS (${userProfile.education.length}) :`;
          userProfile.education.forEach((edu, index) => {
            profileSummary += `\n${index + 1}. ${edu.degreeType || 'Diplôme'} en ${edu.fieldOfStudy || 'Domaine'} - ${edu.institutionName || 'Établissement'}`;
            
            if (edu.startDate || edu.endDate) {
              const period = edu.startDate ? 
                `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ' - En cours'}` : 
                `Jusqu'à ${edu.endDate}`;
              profileSummary += ` (${period})`;
            }
            
            if (edu.location) profileSummary += ` - ${edu.location}`;
            if (edu.grade) profileSummary += ` | Mention: ${edu.grade}`;
            if (edu.description) profileSummary += `\n   Description: ${edu.description}`;
            if (edu.honors && edu.honors.length > 0) profileSummary += `\n   Distinctions: ${edu.honors.join(', ')}`;
          });
        }
        
        // ✅ PROJETS RÉALISÉS ULTRA-DÉTAILLÉS
        if (userProfile.projects && userProfile.projects.length > 0) {
          profileSummary += `\n\n🚀 PROJETS RÉALISÉS (${userProfile.projects.length}) :`;
          userProfile.projects.forEach((proj, index) => {
            profileSummary += `\n${index + 1}. ${proj.projectName || 'Projet'}`;
            if (proj.description) profileSummary += ` - ${proj.description}`;
            
            if (proj.technologiesUsed && proj.technologiesUsed.length > 0) {
              profileSummary += `\n   Technologies: ${proj.technologiesUsed.join(', ')}`;
            }
            
            if (proj.projectUrl) profileSummary += `\n   URL: ${proj.projectUrl}`;
            if (proj.repositoryUrl) profileSummary += `\n   Repository: ${proj.repositoryUrl}`;
            
            if (proj.startDate || proj.endDate) {
              const period = proj.startDate ? 
                `${proj.startDate}${proj.endDate ? ` - ${proj.endDate}` : ' - En cours'}` : 
                `Jusqu'à ${proj.endDate}`;
              profileSummary += `\n   Période: ${period}`;
            }
            
            if (proj.isOngoing) profileSummary += `\n   ⭐ PROJET EN COURS`;
          });
        }
        
        // ✅ CERTIFICATIONS DÉTAILLÉES
        if (userProfile.certifications && userProfile.certifications.length > 0) {
          profileSummary += `\n\n🏆 CERTIFICATIONS (${userProfile.certifications.length}) :`;
          userProfile.certifications.forEach((cert, index) => {
            profileSummary += `\n${index + 1}. ${cert.certificationName || 'Certification'} - ${cert.issuingOrganization || 'Organisme'}`;
            
            if (cert.issueDate) profileSummary += ` (Obtenu: ${cert.issueDate})`;
            if (cert.expirationDate && !cert.neverExpires) profileSummary += ` | Expire: ${cert.expirationDate}`;
            if (cert.neverExpires) profileSummary += ` | Valide à vie`;
            if (cert.credentialId) profileSummary += `\n   ID: ${cert.credentialId}`;
            if (cert.credentialUrl) profileSummary += `\n   URL: ${cert.credentialUrl}`;
          });
        }
        
        // ✅ LANGUES DÉTAILLÉES
        if (userProfile.languages && userProfile.languages.length > 0) {
          profileSummary += `\n\n🌍 LANGUES (${userProfile.languages.length}) :`;
          userProfile.languages.forEach(lang => {
            profileSummary += `\n- ${lang.languageName || 'Langue'} (${lang.proficiencyLevel || 'conversational'})`;
            if (lang.certification) profileSummary += ` | Certification: ${lang.certification}`;
            if (lang.description) profileSummary += ` | ${lang.description}`;
          });
        }
        
        // ✅ CENTRES D'INTÉRÊT DÉTAILLÉS
        if (userProfile.interests && userProfile.interests.length > 0) {
          profileSummary += `\n\n🎯 CENTRES D'INTÉRÊT (${userProfile.interests.length}) :`;
          userProfile.interests.forEach(interest => {
            profileSummary += `\n- ${interest.interestName || 'Intérêt'} (${interest.level || 'Amateur'})`;
            if (interest.description) profileSummary += ` - ${interest.description}`;
            if (interest.category) profileSummary += ` [${interest.category}]`;
          });
        }
        
        console.log('✅ Résumé profil ULTRA-COMPLET construit:', profileSummary.length, 'caractères');
      } else {
        profileSummary = '\n❌ AUCUN PROFIL UTILISATEUR FOURNI - Génération de lettre générique';
        console.log('⚠️ Aucun profil fourni pour la génération');
      }

      const prompt = `
Tu es un expert en rédaction de lettres de motivation ultra-personnalisées.

DESCRIPTION DU POSTE :
${jobDescription}
${profileSummary}

INSTRUCTIONS SPÉCIALES :
${aiInstructions || 'Lettre professionnelle standard'}

INSTRUCTIONS ULTRA-IMPORTANTES :
1. ANALYSE D'ABORD le secteur et type du poste (tech, commercial, finance, santé, etc.)
2. IDENTIFIE les expériences du candidat PERTINENTES pour ce secteur spécifique
3. UTILISE les descriptions détaillées d'expériences, missions, et réalisations concrètes
4. METS EN AVANT les technologies et compétences utilisées dans les expériences pertinentes
5. ÉTABLIS des liens concrets entre les réalisations passées et les besoins du poste
6. VALORISE les projets personnels s'ils sont en rapport avec le secteur
7. ADAPTE le ton selon le secteur et les instructions utilisateur
8. RESTE dans le cadre de l'annonce - ne mentionne QUE les éléments pertinents
9. UTILISE les chiffres et résultats concrets des réalisations si disponibles
10. PERSONNALISE avec le nom, localisation et éléments spécifiques du profil

STRUCTURE ATTENDUE :
1. Introduction personnalisée : Nom du candidat + motivation pour CE secteur/entreprise
2. Expériences PERTINENTES avec missions et réalisations concrètes chiffrées 
3. Compétences techniques et projets en rapport avec le poste
4. Formations/certifications pertinentes si applicables
5. Conclusion adaptée au secteur avec call-to-action

GÉNÉRER une lettre qui montre que le candidat MAÎTRISE le secteur et a les expériences/compétences appropriées.
UTILISER les vraies données du profil (noms d'entreprises, projets réels, technologies maîtrisées).
NE PAS inventer d'informations non présentes dans le profil.
`;

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Tu es un expert en rédaction de lettres de motivation ultra-personnalisées. Tu utilises TOUTES les informations détaillées du profil candidat (expériences avec descriptions complètes, projets avec technologies, réalisations chiffrées, formations) pour créer des lettres sur-mesure qui montrent une parfaite adéquation avec le poste. Tu ne mentionnes QUE les éléments pertinents pour le secteur visé."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 1500,
        stream: false
      });

      const letter = completion.choices[0]?.message?.content;
      
      if (!letter) {
        throw new Error('Impossible de générer la lettre');
      }

      console.log('✅ Lettre générée avec succès basée sur le profil ULTRA-COMPLET');
      return letter.trim();

    } catch (error) {
      console.error('❌ Erreur génération lettre:', error);
      return `Madame, Monsieur,

Je vous écris pour vous faire part de mon intérêt pour le poste proposé dans votre entreprise. 

Fort de mon expérience et de mes compétences, je suis convaincu de pouvoir apporter une valeur ajoutée à votre équipe.

Je reste à votre disposition pour tout complément d'information et serais ravi de vous rencontrer pour discuter de ma candidature.

Cordialement.`;
    }
  }
};

module.exports = groqService;
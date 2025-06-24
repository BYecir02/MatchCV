const dataExtractor = require('./dataExtractor');

const cvAnalyzer = {
  async analyzeCVAndExtractProfile(cvText, groq) {
    try {
      console.log('🤖 Début analyse CV avec Groq...');
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée dans les variables d\'environnement');
      }

      const prompt = this.buildCVAnalysisPrompt(cvText);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Tu es un expert en analyse de CV. Tu extrais les informations et les structures en JSON valide. IMPORTANT: Retourne UNIQUEMENT le JSON, sans texte avant ou après. Le JSON doit être parfaitement valide et respecter exactement le schéma demandé."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.05,
        max_tokens: 4000,
        top_p: 0.9,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('Réponse vide de Groq');
      }

      return this.processResponse(responseText, cvText);

    } catch (error) {
      console.error('❌ Erreur Groq:', error);
      return dataExtractor.extractBasicInfo(cvText);
    }
  },

  buildCVAnalysisPrompt(cvText) {
    return `ANALYSE CE CV ET EXTRAIT TOUTES LES INFORMATIONS POSSIBLES:

CV:
${cvText}

INSTRUCTIONS STRICTES - OBLIGATOIRES:

1. SÉPARER CHAQUE EXPÉRIENCE en entrée distincte
2. SÉPARER CHAQUE FORMATION en entrée distincte  
3. SÉPARER CHAQUE PROJET en entrée distincte
4. NE JAMAIS FUSIONNER plusieurs éléments dans une seule description

EXEMPLES DE SÉPARATION OBLIGATOIRE:

Si le CV contient:
"Employé commercial ELDPH (Super U) - Juillet 2024 - Août 2024, La madeleine France
Employé commercial (KESED Services) - Octobre 2021 - Juin 2023, Cotonou Bénin"

Cela doit donner 2 entrées séparées:
experience: [
  {
    "company": "ELDPH (Super U)",
    "position": "Employé commercial", 
    "startDate": "2024-07",
    "endDate": "2024-08",
    "location": "La madeleine France"
  },
  {
    "company": "KESED Services",
    "position": "Employé commercial",
    "startDate": "2021-10", 
    "endDate": "2023-06",
    "location": "Cotonou Bénin"
  }
]

Si le CV contient:
"CYCLE INGÉNIEUR - Institut Supérieur de l'Electronique et du Numérique (ISEN) - Depuis 2023, Lille France
CYCLE PRÉPARATOIRE - Cour Préparatoire Sainte Marie - Stella (CPMS) - 2021 - 2023, Cotonou Bénin"

Cela doit donner 2 entrées séparées:
education: [
  {
    "institutionName": "Institut Supérieur de l'Electronique et du Numérique (ISEN)",
    "degreeType": "CYCLE INGÉNIEUR",
    "startDate": "2023-01",
    "endDate": "",
    "location": "Lille France"
  },
  {
    "institutionName": "Cour Préparatoire Sainte Marie - Stella (CPMS)", 
    "degreeType": "CYCLE PRÉPARATOIRE",
    "startDate": "2021-01",
    "endDate": "2023-12", 
    "location": "Cotonou Bénin"
  }
]

RÈGLES STRICTES:
- Chaque ligne d'expérience = une entrée séparée dans experience[]
- Chaque ligne de formation = une entrée séparée dans education[]
- Chaque projet = une entrée séparée dans projects[]
- Ne JAMAIS fusionner plusieurs éléments dans une seule description
- Si une ligne contient plusieurs informations, créer une entrée par information
- Respecter EXACTEMENT la structure du CV fourni

PATTERNS À RECONNAÎTRE:

EXPÉRIENCES:
- "Poste - Entreprise - Date - Lieu"
- "Entreprise (Poste) - Date - Lieu" 
- "Poste chez Entreprise - Date - Lieu"

ÉDUCATION:
- "DIPLÔME - Établissement - Date - Lieu"
- "Établissement (Diplôme) - Date - Lieu"

PROJETS:
- "Nom du projet - Description"
- "Projet: Nom - Description"

COMPÉTENCES:
- Chercher dans la section "COMPÉTENCES" ou "SKILLS"
- Extraire chaque technologie mentionnée

LANGUES:
- Chercher dans la section "LANGUES" ou "LANGUAGES"
- "Français (langue maternelle)" -> languageName: "Français", proficiencyLevel: "native"
- "Anglais (intermédiaire)" -> languageName: "Anglais", proficiencyLevel: "conversational"

RÈGLES STRICTES:
1. Retourne UNIQUEMENT le JSON, sans texte avant ou après
2. Respecte EXACTEMENT les valeurs enum listées
3. Pour les dates: format YYYY-MM-DD si possible, sinon string vide
4. Pour les arrays vides: utilise [] pas null
5. Pour les booléens: true/false, pas "true"/"false"
6. Si une information n'est pas trouvée, laisse le champ vide "" ou []

VALEURS ENUM OBLIGATOIRES:
- skills.category: ["Technique", "Programmation", "Framework/Librairie", "Base de données", "DevOps/Cloud", "Design/UX", "Gestion de projet", "Marketing", "Communication", "Langues", "Soft Skills", "Autre"]
- skills.proficiencyLevel: ["beginner", "intermediate", "advanced", "expert", "master"]
- interests.category: ["Sport", "Arts", "Musique", "Lecture", "Cuisine", "Voyage", "Technologie", "Jeux", "Nature", "Bénévolat", "Culture", "Loisirs", "Collection", "Artisanat", "Autre"]
- interests.level: ["Débutant", "Amateur", "Passionné", "Expert", "Professionnel"]
- languages.proficiencyLevel: ["basic", "conversational", "fluent", "native", "professional"]

EXEMPLES DE MAPPING:
- "Avancé" -> "advanced"
- "Intermédiaire" -> "intermediate" 
- "Bases" -> "beginner"
- "Expert" -> "expert"
- "Programmation" -> "Programmation"
- "Base de données" -> "Base de données"
- "Framework" -> "Framework/Librairie"

JSON ATTENDU:
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
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "location": "",
      "description": "",
      "achievements": [],
      "technologiesUsed": []
    }
  ],
  "education": [
    {
      "institutionName": "",
      "degreeType": "",
      "fieldOfStudy": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "grade": "",
      "description": "",
      "honors": []
    }
  ],
  "skills": [
    {
      "skillName": "",
      "category": "Technique",
      "proficiencyLevel": "intermediate",
      "yearsExperience": 0,
      "isPrimary": false
    }
  ],
  "languages": [
    {
      "languageName": "",
      "proficiencyLevel": "conversational",
      "certification": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "projectName": "",
      "description": "",
      "projectUrl": "",
      "repositoryUrl": "",
      "technologiesUsed": [],
      "startDate": "",
      "endDate": "",
      "isOngoing": false,
      "screenshots": []
    }
  ],
  "certifications": [
    {
      "certificationName": "",
      "issuingOrganization": "",
      "credentialId": "",
      "issueDate": "",
      "expirationDate": "",
      "credentialUrl": "",
      "neverExpires": false
    }
  ],
  "interests": [
    {
      "interestName": "",
      "category": "Loisirs",
      "description": "",
      "level": "Amateur",
      "isActive": true
    }
  ]
}

IMPORTANT: 
- Analyse TOUT le CV et extrait TOUTES les informations disponibles
- SÉPARE CHAQUE expérience/formation/projet en entrée distincte
- Ne laisse rien de côté
- Ne fusionne JAMAIS plusieurs éléments dans une seule description
- Respecte la structure exacte du CV fourni
- Si tu vois plusieurs expériences/formations/projets, crée une entrée pour chacun

RÉPONSE: UNIQUEMENT LE JSON CI-DESSUS, RIEN D'AUTRE.`;
  },

  processResponse(responseText, cvText) {
    console.log('🤖 Réponse brute Groq:', responseText.substring(0, 200) + '...');

    let cleanedResponse = responseText.trim();
    
    const firstBrace = cleanedResponse.indexOf('{');
    const lastBrace = cleanedResponse.lastIndexOf('}');
    
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
    }
    
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    try {
      const extractedData = JSON.parse(cleanedResponse);
      
      const completeData = this.ensureAllSections(extractedData);
      
      const validatedData = this.validateAndNormalizeData(completeData);
      const normalizedData = dataExtractor.normalizeExtractedData(validatedData);
      
      console.log('✅ Données extraites et validées avec succès');
      console.log('📊 Sections trouvées:', {
        personalInfo: !!completeData.personalInfo,
        experience: completeData.experience?.length || 0,
        education: completeData.education?.length || 0,
        skills: completeData.skills?.length || 0,
        languages: completeData.languages?.length || 0,
        projects: completeData.projects?.length || 0,
        interests: completeData.interests?.length || 0
      });
      
      return normalizedData;
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
      return dataExtractor.extractBasicInfo(cvText);
    }
  },

  ensureAllSections(data) {
    const defaultStructure = {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: ""
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      interests: []
    };

    const completeData = { ...defaultStructure, ...data };

    if (!Array.isArray(completeData.experience)) completeData.experience = [];
    if (!Array.isArray(completeData.education)) completeData.education = [];
    if (!Array.isArray(completeData.skills)) completeData.skills = [];
    if (!Array.isArray(completeData.languages)) completeData.languages = [];
    if (!Array.isArray(completeData.projects)) completeData.projects = [];
    if (!Array.isArray(completeData.certifications)) completeData.certifications = [];
    if (!Array.isArray(completeData.interests)) completeData.interests = [];

    if (typeof completeData.personalInfo !== 'object' || !completeData.personalInfo) {
      completeData.personalInfo = defaultStructure.personalInfo;
    }

    return completeData;
  },

  validateAndNormalizeData(data) {
    const validSkillCategories = ["Technique", "Programmation", "Framework/Librairie", "Base de données", "DevOps/Cloud", "Design/UX", "Gestion de projet", "Marketing", "Communication", "Langues", "Soft Skills", "Autre"];
    const validSkillLevels = ["beginner", "intermediate", "advanced", "expert", "master"];
    const validInterestCategories = ["Sport", "Arts", "Musique", "Lecture", "Cuisine", "Voyage", "Technologie", "Jeux", "Nature", "Bénévolat", "Culture", "Loisirs", "Collection", "Artisanat", "Autre"];
    const validInterestLevels = ["Débutant", "Amateur", "Passionné", "Expert", "Professionnel"];
    const validLanguageLevels = ["basic", "conversational", "fluent", "native", "professional"];

    if (data.skills && Array.isArray(data.skills)) {
      data.skills = data.skills.map(skill => ({
        ...skill,
        category: validSkillCategories.includes(skill.category) ? skill.category : "Technique",
        proficiencyLevel: validSkillLevels.includes(skill.proficiencyLevel) ? skill.proficiencyLevel : "intermediate",
        yearsExperience: typeof skill.yearsExperience === 'number' ? skill.yearsExperience : 0,
        isPrimary: !!skill.isPrimary
      }));
    }

    if (data.interests && Array.isArray(data.interests)) {
      data.interests = data.interests.map(interest => ({
        ...interest,
        category: validInterestCategories.includes(interest.category) ? interest.category : "Loisirs",
        level: validInterestLevels.includes(interest.level) ? interest.level : "Amateur",
        isActive: !!interest.isActive
      }));
    }

    if (data.languages && Array.isArray(data.languages)) {
      data.languages = data.languages.map(language => ({
        ...language,
        proficiencyLevel: validLanguageLevels.includes(language.proficiencyLevel) ? language.proficiencyLevel : "conversational"
      }));
    }

    return data;
  },

  extractBasicInfo(cvText) {
    console.log('🔍 Extraction basique du CV...');
    
    const result = {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
        linkedinUrl: "",
        githubUrl: "",
        portfolioUrl: ""
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      interests: []
    };

    // Extraction des informations personnelles
    const emailMatch = cvText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      result.personalInfo.email = emailMatch[0];
    }

    const phoneMatch = cvText.match(/(?:\+33|0)[1-9](?:[0-9]{8}|[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2})/);
    if (phoneMatch) {
      result.personalInfo.phone = phoneMatch[0];
    }

    // Extraction du titre/résumé
    const lines = cvText.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (firstLine.length > 10 && firstLine.length < 100) {
        result.personalInfo.title = firstLine;
      }
    }

    // Extraction des sections avec patterns améliorés
    const sections = this.extractSections(cvText);
    
    // Extraction des expériences
    if (sections.experience) {
      const experienceLines = sections.experience.split('\n').filter(line => line.trim());
      experienceLines.forEach(line => {
        // Essayer de séparer les expériences sur la même ligne
        const expResults = this.parseExperienceLine(line);
        if (Array.isArray(expResults)) {
          // Plusieurs expériences trouvées
          expResults.forEach(exp => {
            if (exp) {
              result.experience.push(exp);
            }
          });
        } else if (expResults) {
          // Une seule expérience
          result.experience.push(expResults);
        }
      });
    }

    // Extraction de l'éducation
    if (sections.education) {
      const educationLines = sections.education.split('\n').filter(line => line.trim());
      educationLines.forEach(line => {
        const edu = this.parseEducationLine(line);
        if (edu) {
          result.education.push(edu);
        }
      });
    }

    // Extraction des compétences
    if (sections.skills) {
      const skills = this.extractSkills(sections.skills);
      result.skills = skills;
    }

    // Extraction des langues
    if (sections.languages) {
      const languages = this.extractLanguages(sections.languages);
      result.languages = languages;
    }

    // Extraction des projets
    if (sections.projects) {
      const projects = this.extractProjects(sections.projects);
      result.projects = projects;
    }

    return result;
  },

  extractSections(cvText) {
    const sections = {};
    
    // Patterns améliorés pour détecter les sections
    const sectionPatterns = {
      experience: /(?:EXPÉRIENCES?|EXPERIENCE|EMPLOI|TRAVAIL|STAGE|PARCOURS PROFESSIONNEL)[\s\S]*?(?=(?:ÉDUCATION|FORMATION|DIPLÔME|ÉTUDES|CYCLE|COMPÉTENCES|SKILLS|LANGUES|PROJETS|RÉALISATIONS|$))/i,
      education: /(?:ÉDUCATION|FORMATION|DIPLÔME|ÉTUDES|CYCLE|PARCOURS ACADÉMIQUE)[\s\S]*?(?=(?:EXPÉRIENCES?|EXPERIENCE|EMPLOI|TRAVAIL|STAGE|COMPÉTENCES|SKILLS|LANGUES|PROJETS|RÉALISATIONS|$))/i,
      skills: /(?:COMPÉTENCES?|SKILLS|TECHNOLOGIES?|CONNAISSANCES)[\s\S]*?(?=(?:EXPÉRIENCES?|EXPERIENCE|EMPLOI|TRAVAIL|STAGE|ÉDUCATION|FORMATION|DIPLÔME|ÉTUDES|CYCLE|LANGUES|PROJETS|RÉALISATIONS|$))/i,
      languages: /(?:LANGUES?|LANGUAGES?|LANGUE)[\s\S]*?(?=(?:EXPÉRIENCES?|EXPERIENCE|EMPLOI|TRAVAIL|STAGE|ÉDUCATION|FORMATION|DIPLÔME|ÉTUDES|CYCLE|COMPÉTENCES|SKILLS|PROJETS|RÉALISATIONS|$))/i,
      projects: /(?:PROJETS?|RÉALISATIONS?|PORTFOLIO|PROJETS ACADÉMIQUES)[\s\S]*?(?=(?:EXPÉRIENCES?|EXPERIENCE|EMPLOI|TRAVAIL|STAGE|ÉDUCATION|FORMATION|DIPLÔME|ÉTUDES|CYCLE|COMPÉTENCES|SKILLS|LANGUES|$))/i
    };

    Object.entries(sectionPatterns).forEach(([key, pattern]) => {
      const match = cvText.match(pattern);
      if (match) {
        // Nettoyer la section en retirant le titre
        let content = match[0];
        const titleMatch = content.match(/^[^\n]+/);
        if (titleMatch) {
          content = content.substring(titleMatch[0].length).trim();
        }
        sections[key] = content;
      }
    });

    // Si aucune section n'est trouvée, essayer de détecter par patterns
    if (!sections.experience && !sections.education) {
      // Chercher des patterns d'expériences dans tout le texte
      const experiencePatterns = [
        /([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)(?=\n|$)/g,
        /([^(]+?)\s*\(([^)]+?)\)\s*-\s*([^-]+?)\s*-\s*([^-]+?)(?=\n|$)/g
      ];
      
      let experienceMatches = [];
      experiencePatterns.forEach(pattern => {
        const matches = [...cvText.matchAll(pattern)];
        experienceMatches = experienceMatches.concat(matches);
      });
      
      if (experienceMatches.length > 0) {
        sections.experience = experienceMatches.map(match => match[0]).join('\n');
      }
    }

    return sections;
  },

  parseExperienceLine(line) {
    // D'abord, essayer de séparer si plusieurs expériences sont sur la même ligne
    const experiences = [];
    
    // Pattern pour détecter plusieurs expériences séparées par des espaces ou ponctuation
    const multiExpPattern = /([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)(?=\s+[^-]+?\s*-\s*[^-]+?\s*-\s*[^-]+?\s*-\s*[^-]+?|$)/g;
    let match;
    
    while ((match = multiExpPattern.exec(line)) !== null) {
      const [, position, company, dates, location] = match;
      const { startDate, endDate, isCurrent } = this.parseDates(dates);
      
      experiences.push({
        company: company.trim(),
        position: position.trim(),
        startDate,
        endDate,
        isCurrent,
        location: location.trim(),
        description: "",
        achievements: [],
        technologiesUsed: []
      });
    }
    
    // Si on a trouvé plusieurs expériences, les retourner
    if (experiences.length > 0) {
      return experiences;
    }
    
    // Sinon, essayer les patterns normaux
    const patterns = [
      // Pattern: "Poste - Entreprise - Date - Lieu"
      /^([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)\s*-\s*(.+)$/,
      // Pattern: "Entreprise (Poste) - Date - Lieu"
      /^([^(]+?)\s*\(([^)]+?)\)\s*-\s*([^-]+?)\s*-\s*(.+)$/,
      // Pattern: "Poste chez Entreprise - Date - Lieu"
      /^([^-]+?)\s+chez\s+([^-]+?)\s*-\s*([^-]+?)\s*-\s*(.+)$/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, position, company, dates, location] = match;
        const { startDate, endDate, isCurrent } = this.parseDates(dates);
        
        return {
          company: company.trim(),
          position: position.trim(),
          startDate,
          endDate,
          isCurrent,
          location: location.trim(),
          description: "",
          achievements: [],
          technologiesUsed: []
        };
      }
    }

    // Si aucun pattern ne match, créer une entrée basique
    if (line.trim().length > 10) {
      return {
        company: "",
        position: line.trim(),
        startDate: "",
        endDate: "",
        isCurrent: false,
        location: "",
        description: "",
        achievements: [],
        technologiesUsed: []
      };
    }

    return null;
  },

  parseEducationLine(line) {
    // Pattern pour détecter les formations
    const patterns = [
      // Pattern: "DIPLÔME - Établissement - Date - Lieu"
      /^([^-]+?)\s*-\s*([^-]+?)\s*-\s*([^-]+?)\s*-\s*(.+)$/,
      // Pattern: "Établissement (Diplôme) - Date - Lieu"
      /^([^(]+?)\s*\(([^)]+?)\)\s*-\s*([^-]+?)\s*-\s*(.+)$/
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const [, degree, institution, dates, location] = match;
        const { startDate, endDate } = this.parseDates(dates);
        
        return {
          institutionName: institution.trim(),
          degreeType: degree.trim(),
          fieldOfStudy: "",
          location: location.trim(),
          startDate,
          endDate,
          grade: "",
          description: "",
          honors: []
        };
      }
    }

    // Si aucun pattern ne match, créer une entrée basique
    if (line.trim().length > 10) {
      return {
        institutionName: "",
        degreeType: line.trim(),
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        grade: "",
        description: "",
        honors: []
      };
    }

    return null;
  },

  parseDates(dateString) {
    const currentYear = new Date().getFullYear();
    let startDate = "";
    let endDate = "";
    let isCurrent = false;

    // Pattern pour "Depuis 2023" ou "2023 - Présent"
    const currentMatch = dateString.match(/(?:Depuis|Since|From)\s+(\d{4})/i) || 
                        dateString.match(/(\d{4})\s*-\s*(?:Présent|Present|Now|Actuel)/i);
    if (currentMatch) {
      startDate = `${currentMatch[1]}-01`;
      isCurrent = true;
    } else {
      // Pattern pour "2021 - 2023" ou "2021-2023"
      const rangeMatch = dateString.match(/(\d{4})\s*-\s*(\d{4})/);
      if (rangeMatch) {
        startDate = `${rangeMatch[1]}-01`;
        endDate = `${rangeMatch[2]}-12`;
      } else {
        // Pattern pour une seule année
        const yearMatch = dateString.match(/(\d{4})/);
        if (yearMatch) {
          startDate = `${yearMatch[1]}-01`;
          endDate = `${yearMatch[1]}-12`;
        }
      }
    }

    return { startDate, endDate, isCurrent };
  },

  extractSkills(skillsText) {
    const skills = [];
    const lines = skillsText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      // Pattern pour détecter les compétences
      const skillMatch = line.match(/^([^:]+):\s*(.+)$/);
      if (skillMatch) {
        const [, skillName, description] = skillMatch;
        skills.push({
          skillName: skillName.trim(),
          category: "Technique",
          proficiencyLevel: "intermediate",
          yearsExperience: 0,
          isPrimary: false
        });
      } else if (line.trim().length > 2 && line.trim().length < 50) {
        // Si c'est juste un nom de compétence
        skills.push({
          skillName: line.trim(),
          category: "Technique",
          proficiencyLevel: "intermediate",
          yearsExperience: 0,
          isPrimary: false
        });
      }
    });
    
    return skills;
  },

  extractLanguages(languagesText) {
    const languages = [];
    const lines = languagesText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      // Pattern pour détecter les langues
      const languageMatch = line.match(/^([^(]+?)\s*\(([^)]+?)\)/);
      if (languageMatch) {
        const [, languageName, level] = languageMatch;
        let proficiencyLevel = "conversational";
        
        if (level.toLowerCase().includes("maternelle") || level.toLowerCase().includes("native")) {
          proficiencyLevel = "native";
        } else if (level.toLowerCase().includes("fluent") || level.toLowerCase().includes("courant")) {
          proficiencyLevel = "fluent";
        } else if (level.toLowerCase().includes("basic") || level.toLowerCase().includes("débutant")) {
          proficiencyLevel = "basic";
        }
        
        languages.push({
          languageName: languageName.trim(),
          proficiencyLevel,
          certification: "",
          description: ""
        });
      } else if (line.trim().length > 2 && line.trim().length < 30) {
        // Si c'est juste un nom de langue
        languages.push({
          languageName: line.trim(),
          proficiencyLevel: "conversational",
          certification: "",
          description: ""
        });
      }
    });
    
    return languages;
  },

  extractProjects(projectsText) {
    const projects = [];
    const lines = projectsText.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      // Pattern pour détecter les projets
      const projectMatch = line.match(/^([^-]+?)\s*-\s*(.+)$/);
      if (projectMatch) {
        const [, projectName, description] = projectMatch;
        projects.push({
          projectName: projectName.trim(),
          description: description.trim(),
          projectUrl: "",
          repositoryUrl: "",
          technologiesUsed: [],
          startDate: "",
          endDate: "",
          isOngoing: false,
          screenshots: []
        });
      } else if (line.trim().length > 5 && line.trim().length < 100) {
        // Si c'est juste un nom de projet
        projects.push({
          projectName: line.trim(),
          description: "",
          projectUrl: "",
          repositoryUrl: "",
          technologiesUsed: [],
          startDate: "",
          endDate: "",
          isOngoing: false,
          screenshots: []
        });
      }
    });
    
    return projects;
  }
};

module.exports = cvAnalyzer;
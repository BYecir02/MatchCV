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
    return `ANALYSE CE CV ET RETOURNE UNIQUEMENT LE JSON SUIVANT:

CV:
${cvText}

RÈGLES STRICTES:
1. Retourne UNIQUEMENT le JSON, sans texte avant ou après
2. Respecte EXACTEMENT les valeurs enum listées
3. Pour les dates: format YYYY-MM-DD si possible, sinon string vide
4. Pour les arrays vides: utilise [] pas null
5. Pour les booléens: true/false, pas "true"/"false"

VALEURS ENUM OBLIGATOIRES:
- skills.category: ["Technique", "Programmation", "Framework/Librairie", "Base de données", "DevOps/Cloud", "Design/UX", "Gestion de projet", "Marketing", "Communication", "Langues", "Soft Skills", "Autre"]
- skills.proficiencyLevel: ["beginner", "intermediate", "advanced", "expert", "master"]
- interests.category: ["Sport", "Arts", "Musique", "Lecture", "Cuisine", "Voyage", "Technologie", "Jeux", "Nature", "Bénévolat", "Culture", "Loisirs", "Collection", "Artisanat", "Autre"]
- interests.level: ["Débutant", "Amateur", "Passionné", "Expert", "Professionnel"]
- languages.proficiencyLevel: ["basic", "conversational", "fluent", "native", "professional"]

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
      
      const validatedData = this.validateAndNormalizeData(extractedData);
      const normalizedData = dataExtractor.normalizeExtractedData(validatedData);
      
      console.log('✅ Données extraites et validées avec succès');
      return normalizedData;
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
      return dataExtractor.extractBasicInfo(cvText);
    }
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
  }
};

module.exports = cvAnalyzer;
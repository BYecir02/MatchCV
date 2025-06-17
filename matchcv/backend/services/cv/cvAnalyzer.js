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

      return this.processResponse(responseText, cvText);

    } catch (error) {
      console.error('❌ Erreur Groq:', error);
      return dataExtractor.extractBasicInfo(cvText);
    }
  },

  buildCVAnalysisPrompt(cvText) {
    return `
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
  },

  processResponse(responseText, cvText) {
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
      const normalizedData = dataExtractor.normalizeExtractedData(extractedData);
      
      console.log('✅ Données extraites et normalisées avec succès');
      return normalizedData;
    } catch (parseError) {
      console.error('❌ Erreur parsing JSON:', parseError);
      console.error('🔍 Réponse problématique:', cleanedResponse.substring(0, 500));
      return dataExtractor.extractBasicInfo(cvText);
    }
  }
};

module.exports = cvAnalyzer;
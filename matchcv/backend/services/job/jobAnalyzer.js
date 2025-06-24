const skillsMatcher = require('./skillsMatcher');

const jobAnalyzer = {
  async analyzeJob(jobText, userProfile = null, groq) {
    try {
      console.log('🔍 Début analyse annonce d\'emploi...');
      console.log('👤 Profil utilisateur fourni:', !!userProfile);
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée');
      }

      const profileSummary = this.buildProfileSummary(userProfile);
      const prompt = this.buildJobAnalysisPrompt(jobText, profileSummary, userProfile);

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Tu es un expert RH spécialisé dans l'analyse d'annonces d'emploi et la correspondance avec des profils candidats. 
            ${userProfile ? 'Compare PRÉCISÉMENT chaque compétence demandée avec le profil fourni (compétences + expériences + projets + formations). Identifie les compétences implicites dans les descriptions d\'expériences et projets.' : 'Aucun profil fourni, marque toutes les compétences comme non possédées.'}
            Retourne UNIQUEMENT du JSON valide, sans texte avant ou après.`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.05,
        max_tokens: 3000,
        top_p: 0.9,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('Réponse vide de Groq');
      }

      return this.processJobAnalysisResponse(responseText, jobText);

    } catch (error) {
      console.error('❌ Erreur Groq analyse annonce:', error);
      return this.extractBasicJobInfo(jobText);
    }
  },

  buildProfileSummary(userProfile) {
    if (!userProfile) {
      return '\n❌ AUCUN PROFIL UTILISATEUR FOURNI';
    }

    let summary = `\n👤 PROFIL CANDIDAT :`;
    
    // Informations personnelles
    summary += `\n- Nom: ${userProfile.personalInfo?.firstName} ${userProfile.personalInfo?.lastName}`;
    summary += `\n- Titre: ${userProfile.personalInfo?.title || 'Non spécifié'}`;
    summary += `\n- Localisation: ${userProfile.personalInfo?.location || 'Non spécifiée'}`;
    if (userProfile.personalInfo?.summary) {
      summary += `\n- Résumé: ${userProfile.personalInfo.summary}`;
    }

    // Compétences
    if (userProfile.skills && userProfile.skills.length > 0) {
      summary += `\n\n🛠️ COMPÉTENCES (${userProfile.skills.length}):`;
      userProfile.skills.forEach(skill => {
        summary += `\n- ${skill.skillName} (${skill.proficiencyLevel}, ${skill.yearsExperience || 0} ans, ${skill.category}${skill.isPrimary ? ', ⭐ PRINCIPALE' : ''})`;
      });
    }

    // Expériences
    if (userProfile.experience && userProfile.experience.length > 0) {
      summary += `\n\n💼 EXPÉRIENCES (${userProfile.experience.length}):`;
      userProfile.experience.forEach((exp, index) => {
        summary += `\n${index + 1}. ${exp.position} chez ${exp.company}`;
        if (exp.startDate || exp.endDate) {
          const period = exp.startDate ? 
            `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Actuellement'}` : 
            `Jusqu'à ${exp.endDate}`;
          summary += ` (${period})`;
        }
        if (exp.location) summary += ` - ${exp.location}`;
        if (exp.description) summary += ` | ${exp.description}`;
        if (exp.achievements && exp.achievements.length > 0) {
          summary += ` | Réalisations: ${exp.achievements.join(', ')}`;
        }
        if (exp.technologiesUsed && exp.technologiesUsed.length > 0) {
          summary += ` | Technologies: ${exp.technologiesUsed.join(', ')}`;
        }
        if (exp.isCurrent) summary += ` | POSTE ACTUEL`;
      });
    }

    // Formations
    if (userProfile.education && userProfile.education.length > 0) {
      summary += `\n\n🎓 FORMATIONS (${userProfile.education.length}):`;
      userProfile.education.forEach((edu, index) => {
        summary += `\n${index + 1}. ${edu.degreeType} en ${edu.fieldOfStudy} - ${edu.institutionName}`;
        if (edu.startDate || edu.endDate) {
          const period = edu.startDate ? 
            `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ' - En cours'}` : 
            `Jusqu'à ${edu.endDate}`;
          summary += ` (${period})`;
        }
        if (edu.location) summary += ` - ${edu.location}`;
        if (edu.grade) summary += ` | Mention: ${edu.grade}`;
      });
    }

    // Projets
    if (userProfile.projects && userProfile.projects.length > 0) {
      summary += `\n\n🚀 PROJETS (${userProfile.projects.length}):`;
      userProfile.projects.forEach((proj, index) => {
        summary += `\n${index + 1}. ${proj.projectName}`;
        if (proj.description) summary += `: ${proj.description}`;
        if (proj.technologiesUsed && proj.technologiesUsed.length > 0) {
          summary += ` | Technologies: ${proj.technologiesUsed.join(', ')}`;
        }
        if (proj.projectUrl) summary += ` | URL: ${proj.projectUrl}`;
      });
    }

    // Certifications
    if (userProfile.certifications && userProfile.certifications.length > 0) {
      summary += `\n\n🏆 CERTIFICATIONS (${userProfile.certifications.length}):`;
      userProfile.certifications.forEach((cert, index) => {
        summary += `\n${index + 1}. ${cert.certificationName} - ${cert.issuingOrganization}`;
        if (cert.issueDate) summary += ` | ${cert.issueDate}`;
        if (cert.neverExpires) summary += ` | Valide à vie`;
        else if (cert.expirationDate) summary += ` | Expire: ${cert.expirationDate}`;
      });
    }

    // Langues
    if (userProfile.languages && userProfile.languages.length > 0) {
      summary += `\n\n🌍 LANGUES:`;
      const languagesText = userProfile.languages.map(lang => 
        `${lang.languageName} (${lang.proficiencyLevel})`
      ).join(', ');
      summary += `\n${languagesText}`;
    }

    return summary;
  },

  buildJobAnalysisPrompt(jobText, profileSummary, userProfile) {
    return `ANALYSE CETTE ANNONCE D'EMPLOI ET COMPARE AVEC LE PROFIL CANDIDAT:

ANNONCE:
${jobText}

${profileSummary}

${userProfile ? `
INSTRUCTIONS:
1. Identifie TOUTES les compétences demandées dans l'annonce
2. Compare avec le profil candidat (compétences + expériences + projets + formations)
3. Si une compétence apparaît dans les expériences/projets/technologies, marque userHasSkill: true
4. Calcule userProficiencyLevel en croisant niveau déclaré + expérience pratique
5. Score de correspondance basé sur l'ensemble du profil
6. Recommandations personnalisées basées sur les forces/faiblesses identifiées
` : `
AUCUN PROFIL FOURNI:
- Marque toutes les compétences avec userHasSkill: false
- userProficiencyLevel: 0 pour toutes les compétences
- Recommandations génériques
`}

RÈGLES STRICTES:
- Retourne UNIQUEMENT le JSON, sans texte avant ou après
- Pour les scores: nombres entre 0 et 100
- Pour les booléens: true/false, pas "true"/"false"
- Pour les arrays vides: utilise []

JSON ATTENDU:
{
  "jobAnalysis": {
    "jobTitle": "",
    "company": "",
    "location": "",
    "jobType": "",
    "experienceLevel": "",
    "salaryRange": "",
    "keyResponsibilities": [],
    "requiredSkills": [],
    "preferredSkills": [],
    "benefits": []
  },
  "extractedSkills": [
    {
      "skillName": "",
      "category": "",
      "importanceLevel": "essential",
      "yearsRequired": 1,
      "userHasSkill": false,
      "userProficiencyLevel": 0
    }
  ],
  "overallMatch": {
    "score": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendations": [],
    "estimatedFit": ""
  }
}

RÉPONSE: UNIQUEMENT LE JSON CI-DESSUS, RIEN D'AUTRE.`;
  },

  processJobAnalysisResponse(responseText, jobText) {
    console.log('🤖 Réponse brute:', responseText.substring(0, 200) + '...');

    // Nettoyer la réponse
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
      
      // 🔧 CORRECTION : Gérer les deux formats possibles
      let skillsArray = analysis.extractedSkills || analysis.skillsAnalysis || [];
      
      // Si c'est un objet avec jobAnalysis, extraire les compétences
      if (analysis.jobAnalysis && !skillsArray.length) {
        skillsArray = analysis.jobAnalysis.requiredSkills || analysis.jobAnalysis.preferredSkills || [];
      }
      
      console.log(`🔍 Compétences trouvées: ${skillsArray.length}`);
      console.log(`🔍 Format détecté: ${analysis.extractedSkills ? 'extractedSkills' : analysis.skillsAnalysis ? 'skillsAnalysis' : 'autre'}`);
      
      // Calculer le score de correspondance
      if (skillsArray && Array.isArray(skillsArray) && skillsArray.length > 0) {
        const matchingSkills = skillsArray.filter(skill => skill.userHasSkill === true);
        const essentialSkills = skillsArray.filter(skill => skill.importanceLevel === 'essential');
        const matchingEssentialSkills = essentialSkills.filter(skill => skill.userHasSkill === true);
        
        const totalSkills = skillsArray.length;
        const overallScore = totalSkills > 0 ? Math.round((matchingSkills.length / totalSkills) * 100) : 0;
        const essentialScore = essentialSkills.length > 0 ? Math.round((matchingEssentialSkills.length / essentialSkills.length) * 100) : 100;
        
        // 🔧 ASSURER LA COHÉRENCE DES DONNÉES
        analysis.extractedSkills = skillsArray;
        analysis.overallMatchScore = overallScore;
        analysis.essentialSkillsScore = essentialScore;
        
        console.log(`📊 Score calculé - Global: ${overallScore}%, Essentiel: ${essentialScore}%`);
        console.log(`🔧 Compétences: ${matchingSkills.length}/${totalSkills} matchées`);
        console.log(`🎯 Compétences essentielles: ${matchingEssentialSkills.length}/${essentialSkills.length} matchées`);
      } else {
        console.log('⚠️ Aucune compétence trouvée dans la réponse IA');
        analysis.extractedSkills = [];
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
  },

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

    // Tentative d'extraction du titre
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

    // Tentative d'extraction de l'entreprise
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

    // Extraction des compétences communes
    const commonSkills = skillsMatcher.getCommonSkills();
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
  }
};

module.exports = jobAnalyzer;
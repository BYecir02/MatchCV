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

      return this.processJobAnalysisResponse(responseText, jobText);

    } catch (error) {
      console.error('❌ Erreur Groq analyse annonce:', error);
      return this.extractBasicJobInfo(jobText);
    }
  },

  buildProfileSummary(userProfile) {
    if (!userProfile) {
      return '\n❌ AUCUN PROFIL UTILISATEUR FOURNI - Analyse générique';
    }

    let summary = `\n👤 PROFIL UTILISATEUR ULTRA-COMPLET ET DÉTAILLÉ :`;
    
    // Informations personnelles
    summary += `\n👤 INFORMATIONS PERSONNELLES :`;
    summary += `\n- Nom: ${userProfile.personalInfo?.firstName} ${userProfile.personalInfo?.lastName}`;
    summary += `\n- Titre actuel: ${userProfile.personalInfo?.title || 'Non spécifié'}`;
    summary += `\n- Localisation: ${userProfile.personalInfo?.location || 'Non spécifiée'}`;
    summary += `\n- Email: ${userProfile.personalInfo?.email || 'Non fourni'}`;
    summary += `\n- Résumé: ${userProfile.personalInfo?.summary || 'Non fourni'}`;
    summary += `\n- LinkedIn: ${userProfile.personalInfo?.linkedinUrl || 'Non fourni'}`;

    // Compétences détaillées
    if (userProfile.skills && userProfile.skills.length > 0) {
      summary += `\n\n🛠️ COMPÉTENCES TECHNIQUES DÉTAILLÉES (${userProfile.skills.length}) :`;
      userProfile.skills.forEach(skill => {
        summary += `\n- ${skill.skillName} (Niveau: ${skill.proficiencyLevel}, Expérience: ${skill.yearsExperience || 0} ans, Catégorie: ${skill.category}${skill.isPrimary ? ', ⭐ COMPÉTENCE PRINCIPALE' : ''})`;
      });
    }

    // Expériences détaillées
    if (userProfile.experience && userProfile.experience.length > 0) {
      summary += `\n\n💼 EXPÉRIENCES PROFESSIONNELLES ULTRA-DÉTAILLÉES (${userProfile.experience.length}) :`;
      userProfile.experience.forEach((exp, index) => {
        summary += `\n[EXP ${index + 1}] ${exp.position || 'Poste'} chez ${exp.company || 'Entreprise'}`;
        
        if (exp.startDate || exp.endDate) {
          const period = exp.startDate ? 
            `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Actuellement'}` : 
            `Jusqu'à ${exp.endDate}`;
          summary += ` (${period})`;
        }
        
        if (exp.location) summary += ` - ${exp.location}`;
        if (exp.description) summary += ` | Mission: ${exp.description}`;
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
      summary += `\n\n🎓 FORMATIONS COMPLÈTES (${userProfile.education.length}) :`;
      userProfile.education.forEach((edu, index) => {
        summary += `\n[EDU ${index + 1}] ${edu.degreeType || 'Diplôme'} en ${edu.fieldOfStudy || 'Domaine'} à ${edu.institutionName || 'Établissement'}`;
        
        if (edu.startDate || edu.endDate) {
          const period = edu.startDate ? 
            `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ' - En cours'}` : 
            `Jusqu'à ${edu.endDate}`;
          summary += ` (${period})`;
        }
        
        if (edu.location) summary += ` - ${edu.location}`;
        if (edu.grade) summary += ` | Mention: ${edu.grade}`;
        if (edu.description) summary += ` | Description: ${edu.description}`;
        if (edu.honors && edu.honors.length > 0) summary += ` | Distinctions: ${edu.honors.join(', ')}`;
      });
    }

    // Projets
    if (userProfile.projects && userProfile.projects.length > 0) {
      summary += `\n\n🚀 PROJETS RÉALISÉS DÉTAILLÉS (${userProfile.projects.length}) :`;
      userProfile.projects.forEach((proj, index) => {
        summary += `\n[PROJET ${index + 1}] ${proj.projectName || 'Projet'}`;
        if (proj.description) summary += `: ${proj.description}`;
        if (proj.technologiesUsed && proj.technologiesUsed.length > 0) {
          summary += ` | Technologies: ${proj.technologiesUsed.join(', ')}`;
        }
        if (proj.projectUrl) summary += ` | URL: ${proj.projectUrl}`;
        if (proj.repositoryUrl) summary += ` | Repository: ${proj.repositoryUrl}`;
        if (proj.startDate) summary += ` | Début: ${proj.startDate}`;
        if (proj.endDate) summary += ` | Fin: ${proj.endDate}`;
        if (proj.isOngoing) summary += ` | EN COURS`;
      });
    }

    // Certifications
    if (userProfile.certifications && userProfile.certifications.length > 0) {
      summary += `\n\n🏆 CERTIFICATIONS DÉTAILLÉES (${userProfile.certifications.length}) :`;
      userProfile.certifications.forEach((cert, index) => {
        summary += `\n[CERT ${index + 1}] ${cert.certificationName || 'Certification'} délivré par ${cert.issuingOrganization || 'Organisme'}`;
        if (cert.issueDate) summary += ` | Obtenu: ${cert.issueDate}`;
        if (cert.expirationDate && !cert.neverExpires) summary += ` | Expire: ${cert.expirationDate}`;
        if (cert.neverExpires) summary += ` | Valide à vie`;
        if (cert.credentialId) summary += ` | ID: ${cert.credentialId}`;
        if (cert.credentialUrl) summary += ` | URL: ${cert.credentialUrl}`;
      });
    }

    // Langues
    if (userProfile.languages && userProfile.languages.length > 0) {
      summary += `\n\n🌍 LANGUES PARLÉES DÉTAILLÉES (${userProfile.languages.length}) :`;
      const languagesText = userProfile.languages.map(lang => {
        let langText = `${lang.languageName || 'Langue'} (${lang.proficiencyLevel || 'conversational'})`;
        if (lang.certification) langText += ` | Certification: ${lang.certification}`;
        if (lang.description) langText += ` | Description: ${lang.description}`;
        return langText;
      }).join(', ');
      summary += `\n${languagesText}`;
    }

    // Centres d'intérêt
    if (userProfile.interests && userProfile.interests.length > 0) {
      summary += `\n\n🎯 CENTRES D'INTÉRÊT DÉTAILLÉS (${userProfile.interests.length}) :`;
      const interestsText = userProfile.interests.map(interest => {
        let interestText = `${interest.interestName || 'Intérêt'} (${interest.level || 'Amateur'})`;
        if (interest.description) interestText += ` - ${interest.description}`;
        if (interest.category) interestText += ` [${interest.category}]`;
        if (!interest.isActive) interestText += ` (Inactif)`;
        return interestText;
      }).join(', ');
      summary += `\n${interestsText}`;
    }

    return summary;
  },

  buildJobAnalysisPrompt(jobText, profileSummary, userProfile) {
    return `
Tu es un expert RH qui analyse des annonces d'emploi et compare avec des profils candidats ULTRA-DÉTAILLÉS.

ANNONCE D'EMPLOI À ANALYSER :
${jobText}

${profileSummary}

${userProfile ? `
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
      
      // Calculer le score de correspondance
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
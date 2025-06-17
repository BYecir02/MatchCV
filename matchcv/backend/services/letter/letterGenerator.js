const promptBuilder = require('./promptBuilder');

const letterGenerator = {
  async generateCoverLetter(jobDescription, userProfile, aiInstructions = '', groq) {
    // 🔧 NORMALISATION DES INSTRUCTIONS - VERSION CORRIGÉE
    let normalizedInstructions = '';
    
    try {
      console.log('🔍 DEBUG INSTRUCTIONS REÇUES:');
      console.log('   Type:', typeof aiInstructions);
      console.log('   Valeur:', aiInstructions);
      console.log('   Is null?', aiInstructions === null);
      console.log('   Is undefined?', aiInstructions === undefined);
      
      if (aiInstructions === null || aiInstructions === undefined) {
        normalizedInstructions = '';
        console.log('✅ Instructions null/undefined → string vide');
      } else if (typeof aiInstructions === 'string') {
        normalizedInstructions = aiInstructions.trim();
        console.log('✅ Instructions string → utilisées directement');
      } else if (typeof aiInstructions === 'object') {
        // Chercher dans l'objet les vraies instructions
        if (aiInstructions.instructions) {
          normalizedInstructions = String(aiInstructions.instructions);
          console.log('✅ Instructions trouvées dans .instructions');
        } else if (aiInstructions.text) {
          normalizedInstructions = String(aiInstructions.text);
          console.log('✅ Instructions trouvées dans .text');
        } else if (aiInstructions.content) {
          normalizedInstructions = String(aiInstructions.content);
          console.log('✅ Instructions trouvées dans .content');
        } else if (aiInstructions.message) {
          normalizedInstructions = String(aiInstructions.message);
          console.log('✅ Instructions trouvées dans .message');
        } else {
          // Chercher une propriété qui contient "informatique"
          let found = false;
          for (const [key, value] of Object.entries(aiInstructions)) {
            if (typeof value === 'string' && value.toLowerCase().includes('informatique')) {
              normalizedInstructions = value;
              console.log(`✅ Instructions trouvées dans .${key}:`, value);
              found = true;
              break;
            }
          }
          
          if (!found) {
            normalizedInstructions = '';
            console.log('⚠️ Instructions objet sans instructions valides → string vide');
            console.log('   Objet reçu:', JSON.stringify(aiInstructions));
          }
        }
      } else {
        // Convertir en string tout autre type
        normalizedInstructions = String(aiInstructions);
        console.log('✅ Instructions converties en string');
      }
    } catch (error) {
      console.error('❌ Erreur normalisation instructions:', error);
      normalizedInstructions = '';
    }

    console.log('🎯 INSTRUCTIONS FINALES NORMALISÉES:');
    console.log('   Type:', typeof normalizedInstructions);
    console.log('   Valeur:', normalizedInstructions);
    console.log('   Length:', normalizedInstructions.length);

    try {
      console.log('✍️ Génération lettre de motivation...');
      console.log('👤 Profil utilisateur fourni:', !!userProfile);
      
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY non configurée');
      }

      const profileSummary = this.buildProfileSummary(userProfile);
      const prompt = promptBuilder.buildLetterPrompt(jobDescription, profileSummary, normalizedInstructions);

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
      
      // Vérification des instructions
      if (normalizedInstructions && letter) {
        this.validateInstructions(letter, normalizedInstructions);
      }

      if (!letter) {
        throw new Error('Impossible de générer la lettre');
      }

      console.log('✅ Lettre générée avec succès basée sur le profil ULTRA-COMPLET');
      return letter.trim();

    } catch (error) {
      console.error('❌ Erreur génération lettre:', error);
      return this.getFallbackLetter();
    }
  },

  buildProfileSummary(userProfile) {
    if (!userProfile) {
      return '\n❌ AUCUN PROFIL UTILISATEUR FOURNI - Génération de lettre générique';
    }

    let profileSummary = '';
    console.log('👤 Construction du résumé profil ULTRA-détaillé...');
    
    // Informations personnelles
    profileSummary += `\n👤 CANDIDAT : ${userProfile.personalInfo?.firstName || 'Prénom'} ${userProfile.personalInfo?.lastName || 'Nom'}`;
    profileSummary += `\n📍 LOCALISATION : ${userProfile.personalInfo?.location || 'Non spécifiée'}`;
    profileSummary += `\n💼 TITRE ACTUEL : ${userProfile.personalInfo?.title || 'Candidat'}`;
    if (userProfile.personalInfo?.summary) {
      profileSummary += `\n📝 RÉSUMÉ PERSONNEL : ${userProfile.personalInfo.summary}`;
    }
    
    // Compétences techniques ultra-détaillées
    if (userProfile.skills && userProfile.skills.length > 0) {
      profileSummary += `\n\n🛠️ COMPÉTENCES TECHNIQUES (${userProfile.skills.length}) :`;
      userProfile.skills.forEach(skill => {
        profileSummary += `\n- ${skill.skillName || 'Compétence'} (Niveau: ${skill.proficiencyLevel || 'intermediate'}, ${skill.yearsExperience || 0} ans d'expérience, Catégorie: ${skill.category || 'Technique'}${skill.isPrimary ? ', ⭐ COMPÉTENCE PRINCIPALE' : ''})`;
      });
    }
    
    // Expériences professionnelles ultra-détaillées
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
    
    // Formations complètes
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
    
    // Projets réalisés ultra-détaillés
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
    
    // Certifications détaillées
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
    
    // Langues détaillées
    if (userProfile.languages && userProfile.languages.length > 0) {
      profileSummary += `\n\n🌍 LANGUES (${userProfile.languages.length}) :`;
      userProfile.languages.forEach(lang => {
        profileSummary += `\n- ${lang.languageName || 'Langue'} (${lang.proficiencyLevel || 'conversational'})`;
        if (lang.certification) profileSummary += ` | Certification: ${lang.certification}`;
        if (lang.description) profileSummary += ` | ${lang.description}`;
      });
    }
    
    // Centres d'intérêt détaillés
    if (userProfile.interests && userProfile.interests.length > 0) {
      profileSummary += `\n\n🎯 CENTRES D'INTÉRÊT (${userProfile.interests.length}) :`;
      userProfile.interests.forEach(interest => {
        profileSummary += `\n- ${interest.interestName || 'Intérêt'} (${interest.level || 'Amateur'})`;
        if (interest.description) profileSummary += ` - ${interest.description}`;
        if (interest.category) profileSummary += ` [${interest.category}]`;
      });
    }
    
    console.log('✅ Résumé profil ULTRA-COMPLET construit:', profileSummary.length, 'caractères');
    return profileSummary;
  },

  validateInstructions(letter, instructions) {
    console.log('🔍 VÉRIFICATION DES INSTRUCTIONS:');
    console.log('   Instructions:', instructions);
    
    let hasViolations = false;
    
    // Vérification informatique - RÈGLE ABSOLUE
    if (instructions.toLowerCase().includes('ne pas parler') && 
        (instructions.toLowerCase().includes('informatique') || instructions.toLowerCase().includes('info'))) {
      
      const forbiddenWords = [
        'informatique', 'programmation', 'développement', 'développeur', 
        'javascript', 'react', 'node.js', 'python', 'java', 'php',
        'web', 'logiciel', 'application', 'code', 'coding', 'tech'
      ];
      
      const foundViolations = forbiddenWords.filter(word => 
        letter.toLowerCase().includes(word)
      );
      
      if (foundViolations.length > 0) {
        console.log('❌ VIOLATIONS MAJEURES TROUVÉES:', foundViolations);
        console.log('🚨 LA LETTRE VIOLE LES INSTRUCTIONS UTILISATEUR !');
        hasViolations = true;
        
        // Log des phrases problématiques
        forbiddenWords.forEach(word => {
          if (letter.toLowerCase().includes(word)) {
            const sentences = letter.split(/[.!?]/).filter(s => s.toLowerCase().includes(word));
            console.log(`   Phrase avec "${word}":`, sentences[0]?.trim());
          }
        });
      } else {
        console.log('✅ Instructions "ne pas parler d\'informatique" respectées');
      }
    }
    
    // Vérification longueur
    const wordCount = letter.split(/\s+/).length;
    if (instructions.toLowerCase().includes('concis') && wordCount > 200) {
      console.log(`❌ LETTRE TROP LONGUE: ${wordCount} mots pour instruction "concis"`);
      hasViolations = true;
    } else if (instructions.toLowerCase().includes('concis')) {
      console.log(`✅ Longueur OK: ${wordCount} mots pour instruction "concis"`);
    }
    
    // 🚨 SI VIOLATIONS DÉTECTÉES, LOG WARNING
    if (hasViolations) {
      console.log('🚨 ATTENTION: LA LETTRE NE RESPECTE PAS LES INSTRUCTIONS !');
    }
    
    return !hasViolations;
  },

  getFallbackLetter() {
    return `Madame, Monsieur,

Je vous écris pour vous faire part de mon intérêt pour le poste proposé dans votre entreprise. 

Fort de mon expérience et de mes compétences, je suis convaincu de pouvoir apporter une valeur ajoutée à votre équipe.

Je reste à votre disposition pour tout complément d'information et serais ravi de vous rencontrer pour discuter de ma candidature.

Cordialement.`;
  }
};

module.exports = letterGenerator;
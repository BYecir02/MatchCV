const User = require('../models/User');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const UserSkill = require('../models/UserSkill');
const Certification = require('../models/Certification');
const Language = require('../models/Language');
const Project = require('../models/Project');
const Interest = require('../models/Interest');
const groqService = require('../services/groqService'); 

const profileController = {

  // ⭐ MÉTHODE HELPER CORRIGÉE : Récupérer données profil avec durée calculée
  async getProfileData(userId) {
    console.log('🔍 Récupération profil complet pour utilisateur:', userId);
    
    const [user, experiences, education, skills, certifications, languages, projects, interests] = await Promise.all([
      User.findById(userId).select('-password'),
      Experience.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      Education.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      UserSkill.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      Certification.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      Language.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      Project.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
      Interest.find({ userId }).sort({ displayOrder: 1, createdAt: -1 })
    ]);

    // ✅ VÉRIFICATION : Logger ce qui est récupéré
    console.log('📊 Éléments récupérés:', {
      user: !!user,
      experiences: experiences.length,
      education: education.length,
      skills: skills.length,
      certifications: certifications.length,
      languages: languages.length,
      projects: projects.length,
      interests: interests.length
    });

    const profileData = {
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        profilePictureUrl: user.profilePictureUrl,
        ...user.profile // ✅ Inclut tout le profil utilisateur
      },
      experience: experiences.map(exp => ({
        id: exp._id.toString(),
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        location: exp.location,
        description: exp.description,
        achievements: exp.achievements,
        technologiesUsed: exp.technologiesUsed,
        displayOrder: exp.displayOrder,
        // ✅ AJOUT : Calculer la durée pour Groq
        duration: profileController.calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)
      })),
      education: education.map(edu => ({
        id: edu._id.toString(),
        institutionName: edu.institutionName,
        degreeType: edu.degreeType,
        fieldOfStudy: edu.fieldOfStudy,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        grade: edu.grade,
        description: edu.description,
        honors: edu.honors,
        displayOrder: edu.displayOrder
      })),
      skills: skills.map(skill => ({
        id: skill._id.toString(),
        skillName: skill.skillName,
        category: skill.category,
        proficiencyLevel: skill.proficiencyLevel,
        yearsExperience: skill.yearsExperience,
        isPrimary: skill.isPrimary,
        displayOrder: skill.displayOrder
      })),
      certifications: certifications.map(cert => ({
        id: cert._id.toString(),
        certificationName: cert.certificationName,
        issuingOrganization: cert.issuingOrganization,
        credentialId: cert.credentialId,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        credentialUrl: cert.credentialUrl,
        neverExpires: cert.neverExpires,
        displayOrder: cert.displayOrder
      })),
      languages: languages.map(lang => ({
        id: lang._id.toString(),
        languageName: lang.languageName,
        proficiencyLevel: lang.proficiencyLevel,
        certification: lang.certification,
        description: lang.description,
        displayOrder: lang.displayOrder
      })),
      projects: projects.map(proj => ({
        id: proj._id.toString(),
        projectName: proj.projectName,
        description: proj.description,
        projectUrl: proj.projectUrl,
        repositoryUrl: proj.repositoryUrl,
        technologiesUsed: proj.technologiesUsed,
        startDate: proj.startDate,
        endDate: proj.endDate,
        isOngoing: proj.isOngoing,
        screenshots: proj.screenshots,
        displayOrder: proj.displayOrder
      })),
      interests: interests.map(interest => ({
        id: interest._id.toString(),
        interestName: interest.interestName,
        category: interest.category,
        description: interest.description,
        level: interest.level,
        isActive: interest.isActive,
        displayOrder: interest.displayOrder
      })),
      settings: user.settings
    };

    console.log('✅ Profil complet construit avec succès');
    return profileData;
  },

  // ✅ NOUVELLE FONCTION HELPER : Calculer la durée d'expérience
  calculateDuration(startDate, endDate, isCurrent) {
    if (!startDate) return 'Durée non spécifiée';
    
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate || new Date());
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    
    if (diffYears > 0) {
      return remainingMonths > 0 
        ? `${diffYears} an${diffYears > 1 ? 's' : ''} et ${remainingMonths} mois`
        : `${diffYears} an${diffYears > 1 ? 's' : ''}`;
    } else {
      return `${diffMonths} mois`;
    }
  },

  // ⭐ MÉTHODE CORRIGÉE : Récupérer le profil complet
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      // Utiliser la méthode helper améliorée
      const profileData = await profileController.getProfileData(userId);

      res.json({
        success: true,
        profileData
      });

    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message
      });
    }
  },

  // ⭐ FONCTION HELPER : Normaliser les valeurs enum pour les compétences
  normalizeSkillData(skillData) {
    // ⭐ VALEURS ENUM EXACTES DU MODÈLE UserSkill
    const validCategories = ['Technique', 'Programmation', 'Framework/Librairie', 'Base de données', 
                           'DevOps/Cloud', 'Design/UX', 'Gestion de projet', 'Marketing', 
                           'Communication', 'Langues', 'Soft Skills', 'Autre'];
    
    const validProficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];

    // ⭐ MAPPING CORRIGÉ SELON LES VRAIES VALEURS ENUM
    const categoryMapping = {
      // Cas exacts du modèle
      'Technique': 'Technique',
      'Programmation': 'Programmation',
      'Framework/Librairie': 'Framework/Librairie',
      'Base de données': 'Base de données',
      'DevOps/Cloud': 'DevOps/Cloud',
      'Design/UX': 'Design/UX',
      'Gestion de projet': 'Gestion de projet',
      'Marketing': 'Marketing',
      'Communication': 'Communication',
      'Langues': 'Langues',
      'Soft Skills': 'Soft Skills',
      'Autre': 'Autre',
      
      // Variations courantes -> Bonnes valeurs
      'technique': 'Technique',
      'Technical': 'Technique',
      'technical': 'Technique',
      'programmation': 'Programmation',
      'Programming': 'Programmation',
      'programming': 'Programmation',
      'Framework': 'Framework/Librairie',
      'framework': 'Framework/Librairie',
      'Librairie': 'Framework/Librairie',
      'librairie': 'Framework/Librairie',
      'Library': 'Framework/Librairie',
      'library': 'Framework/Librairie',
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
      'marketing': 'Marketing',
      'communication': 'Communication',
      'Personnel': 'Soft Skills',
      'personnel': 'Soft Skills',
      'Personal': 'Soft Skills',
      'personal': 'Soft Skills',
      'langues': 'Langues',
      'Languages': 'Langues',
      'languages': 'Langues',
      'Langue': 'Langues',
      'langue': 'Langues',
      'Language': 'Langues',
      'language': 'Langues',
      'autre': 'Autre',
      'Other': 'Autre',
      'other': 'Autre'
    };

    const originalCategory = skillData.category;
    const mappedCategory = categoryMapping[originalCategory] || 'Technique';
    
    // ⭐ VÉRIFICATION FINALE DE SÉCURITÉ
    const finalCategory = validCategories.includes(mappedCategory) ? mappedCategory : 'Technique';
    const finalProficiency = validProficiencyLevels.includes(skillData.proficiencyLevel) ? skillData.proficiencyLevel : 'intermediate';

    console.log(`🔧 Normalisation compétence: "${originalCategory}" -> "${finalCategory}"`);
    
    return {
      ...skillData,
      category: finalCategory,
      proficiencyLevel: finalProficiency
    };
  },

  // ⭐ FONCTION HELPER : Normaliser les valeurs enum pour les centres d'intérêt
  normalizeInterestData(interestData) {
    // ⭐ VALEURS ENUM EXACTES DU MODÈLE Interest
    const validCategories = [
      'Sport', 'Arts', 'Musique', 'Lecture', 'Cuisine', 'Voyage', 
      'Technologie', 'Jeux', 'Nature', 'Bénévolat', 'Culture', 
      'Loisirs', 'Collection', 'Artisanat', 'Autre'
    ];
    
    const validLevels = ['Débutant', 'Amateur', 'Passionné', 'Expert', 'Professionnel'];

    // ⭐ MAPPING COMPLET SELON LES VRAIES VALEURS ENUM
    const categoryMapping = {
      // Valeurs exactes du modèle
      'Sport': 'Sport',
      'Arts': 'Arts',
      'Musique': 'Musique',
      'Lecture': 'Lecture',
      'Cuisine': 'Cuisine',
      'Voyage': 'Voyage',
      'Technologie': 'Technologie',
      'Jeux': 'Jeux',
      'Nature': 'Nature',
      'Bénévolat': 'Bénévolat',
      'Culture': 'Culture',
      'Loisirs': 'Loisirs',
      'Collection': 'Collection',
      'Artisanat': 'Artisanat',
      'Autre': 'Autre',
      
      // Variations courantes -> Bonnes valeurs
      'sport': 'Sport',
      'Sports': 'Sport',
      'sports': 'Sport',
      'art': 'Arts',
      'Art': 'Arts',
      'arts': 'Arts',
      'music': 'Musique',
      'Music': 'Musique',
      'musique': 'Musique',
      'reading': 'Lecture',
      'Reading': 'Lecture',
      'lecture': 'Lecture',
      'cooking': 'Cuisine',
      'Cooking': 'Cuisine',
      'cuisine': 'Cuisine',
      'travel': 'Voyage',
      'Travel': 'Voyage',
      'voyage': 'Voyage',
      'technology': 'Technologie',
      'Technology': 'Technologie',
      'technologie': 'Technologie',
      'games': 'Jeux',
      'Games': 'Jeux',
      'Gaming': 'Jeux',
      'gaming': 'Jeux',
      'jeux': 'Jeux',
      'nature': 'Nature',
      'Nature': 'Nature',
      'volunteer': 'Bénévolat',
      'Volunteer': 'Bénévolat',
      'volunteering': 'Bénévolat',
      'Volunteering': 'Bénévolat',
      'bénévolat': 'Bénévolat',
      'culture': 'Culture',
      'Culture': 'Culture',
      'cultural': 'Culture',
      'Cultural': 'Culture',
      'hobby': 'Loisirs',
      'Hobby': 'Loisirs',
      'hobbies': 'Loisirs',
      'Hobbies': 'Loisirs',
      'loisir': 'Loisirs',
      'loisirs': 'Loisirs',
      'personal': 'Loisirs',
      'Personal': 'Loisirs',
      'personnel': 'Loisirs',
      'Personnel': 'Loisirs',
      'collection': 'Collection',
      'Collection': 'Collection',
      'collecting': 'Collection',
      'Collecting': 'Collection',
      'craft': 'Artisanat',
      'Craft': 'Artisanat',
      'crafts': 'Artisanat',
      'Crafts': 'Artisanat',
      'artisanat': 'Artisanat',
      'handicraft': 'Artisanat',
      'other': 'Autre',
      'Other': 'Autre',
      'autre': 'Autre'
    };

    const levelMapping = {
      // Valeurs exactes du modèle
      'Débutant': 'Débutant',
      'Amateur': 'Amateur',
      'Passionné': 'Passionné',
      'Expert': 'Expert',
      'Professionnel': 'Professionnel',
      
      // Variations courantes -> Bonnes valeurs
      'débutant': 'Débutant',
      'beginner': 'Débutant',
      'Beginner': 'Débutant',
      'amateur': 'Amateur',
      'Amateur': 'Amateur',
      'hobby': 'Amateur',
      'Hobby': 'Amateur',
      'passionné': 'Passionné',
      'passionate': 'Passionné',
      'Passionate': 'Passionné',
      'intermediate': 'Amateur',
      'Intermediate': 'Amateur',
      'intermédiaire': 'Amateur',
      'Intermédiaire': 'Amateur',
      'expert': 'Expert',
      'Expert': 'Expert',
      'advanced': 'Expert',
      'Advanced': 'Expert',
      'avancé': 'Expert',
      'Avancé': 'Expert',
      'professionnel': 'Professionnel',
      'professional': 'Professionnel',
      'Professional': 'Professionnel',
      'pro': 'Professionnel',
      'Pro': 'Professionnel'
    };

    const originalCategory = interestData.category;
    const originalLevel = interestData.level;
    
    const mappedCategory = categoryMapping[originalCategory] || 'Loisirs';
    const mappedLevel = levelMapping[originalLevel] || 'Amateur';
    
    // ⭐ VÉRIFICATION FINALE DE SÉCURITÉ
    const finalCategory = validCategories.includes(mappedCategory) ? mappedCategory : 'Loisirs';
    const finalLevel = validLevels.includes(mappedLevel) ? mappedLevel : 'Amateur';

    console.log(`🔧 Normalisation centre d'intérêt: "${originalCategory}" -> "${finalCategory}", "${originalLevel}" -> "${finalLevel}"`);

    return {
      ...interestData,
      category: finalCategory,
      level: finalLevel
    };
  },

  // ⭐ FONCTION HELPER : Normaliser les valeurs enum pour les langues
  normalizeLanguageData(languageData) {
    // ⭐ VALEURS ENUM EXACTES DU MODÈLE Language
    const validProficiencyLevels = ['basic', 'conversational', 'fluent', 'native', 'professional'];

    const proficiencyMapping = {
      // Valeurs exactes du modèle
      'basic': 'basic',
      'conversational': 'conversational',
      'fluent': 'fluent',
      'native': 'native',
      'professional': 'professional',
      
      // Variations courantes -> Bonnes valeurs
      'Basic': 'basic',
      'Conversational': 'conversational',
      'Fluent': 'fluent',
      'Native': 'native',
      'Professional': 'professional',
      
      'Débutant': 'basic',
      'débutant': 'basic',
      'Beginner': 'basic',
      'beginner': 'basic',
      
      'Intermédiaire': 'conversational',
      'intermédiaire': 'conversational',
      'Intermediate': 'conversational',
      'intermediate': 'conversational',
      
      'Avancé': 'fluent',
      'avancé': 'fluent',
      'Advanced': 'fluent',
      'advanced': 'fluent',
      
      'Natif': 'native',
      'natif': 'native',
      'Langue maternelle': 'native',
      'langue maternelle': 'native',
      
      'Professionnel': 'professional',
      'professionnel': 'professional'
    };

    const originalProficiency = languageData.proficiencyLevel;
    const mappedProficiency = proficiencyMapping[originalProficiency] || 'conversational';
    
    // ⭐ VÉRIFICATION FINALE DE SÉCURITÉ
    const finalProficiency = validProficiencyLevels.includes(mappedProficiency) ? mappedProficiency : 'conversational';

    console.log(`🔧 Normalisation langue: "${originalProficiency}" -> "${finalProficiency}"`);

    return {
      ...languageData,
      proficiencyLevel: finalProficiency
    };
  },

  // ⭐ IMPORT ET ANALYSE DE CV AVEC PARSING JSON INTELLIGENT
  async importAndAnalyzeCV(req, res) {
    try {
      const { cvText, replaceExisting = false } = req.body;
      const userId = req.user.id;

      if (!cvText || cvText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le contenu du CV est requis'
        });
      }

      console.log('🔍 Début analyse CV pour utilisateur:', userId);
      console.log('📄 Taille du CV:', cvText.length, 'caractères');
      console.log('🔄 Mode remplacement:', replaceExisting);

      // ⭐ FONCTION HELPER LOCALE : Échapper les caractères spéciaux pour regex
      const escapeRegex = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      // 1. Récupérer le profil EXISTANT
      const currentUser = await User.findById(userId).select('-password');
      console.log('👤 Profil actuel récupéré');

      // 2. ⭐ ANALYSER LE CV AVEC PARSING JSON INTELLIGENT
      let extractedData;
      try {
        console.log('🤖 Début analyse CV avec Groq...');
        extractedData = await groqService.analyzeCVAndExtractProfile(cvText);
        console.log('✅ Analyse Groq réussie');
      } catch (groqError) {
        console.error('❌ Erreur Groq:', groqError);
        console.log('🔄 Utilisation de l\'extraction basique (fallback)');
        
        // ⭐ FALLBACK : Extraction basique améliorée
        extractedData = profileController.extractBasicCVInfo(cvText);
      }

      console.log('✅ Données extraites:', Object.keys(extractedData));

      // 3. Préparer les compteurs
      const importStats = {
        created: 0,
        updated: 0,
        skipped: 0,
        errors: 0
      };

      // 4. ⭐ ENRICHISSEMENT INTELLIGENT DES INFOS PERSONNELLES
      if (extractedData.personalInfo && Object.values(extractedData.personalInfo).some(v => v)) {
        try {
          const allowedUserFields = ['firstName', 'lastName', 'phone'];
          const allowedProfileFields = ['title', 'summary', 'location', 'linkedinUrl', 'githubUrl', 'portfolioUrl'];
          const forbiddenFields = ['email', 'password', '_id', 'id'];

          const userUpdate = {};
          const profileUpdate = {};

          // ⭐ VALEURS PAR DÉFAUT À REMPLACER (considérées comme "vides")
          const defaultValues = [
            '', null, undefined, 
            'Pas de nom', 'Pas de numéro de téléphone', 'Pas de titre',
            'Non renseigné', 'Non défini', 'Aucun', 'Inconnu',
            'Pas de nom de famille fourni'
          ];

          const isEmptyValue = (value) => {
            if (!value) return true;
            if (typeof value !== 'string') return false;
            const trimmed = value.trim();
            return trimmed === '' || defaultValues.includes(trimmed);
          };

          Object.keys(extractedData.personalInfo).forEach(key => {
            const newValue = extractedData.personalInfo[key];
            
            // ⭐ SÉCURITÉ : Ignorer les champs interdits
            if (forbiddenFields.includes(key.toLowerCase())) {
              console.log(`🔒 Champ protégé ignoré: ${key}`);
              return;
            }
            
            if (newValue && typeof newValue === 'string' && newValue.trim()) {
              const trimmedValue = newValue.trim();
              
              if (allowedUserFields.includes(key)) {
                const currentValue = currentUser[key];
                
                if (isEmptyValue(currentValue) || replaceExisting) {
                  userUpdate[key] = trimmedValue;
                  console.log(`✅ ${key}: "${currentValue || 'vide'}" -> "${trimmedValue}"`);
                } else {
                  console.log(`⏭️ ${key}: garde "${currentValue}" (ignore "${trimmedValue}")`);
                  importStats.skipped++;
                }
                
              } else if (allowedProfileFields.includes(key)) {
                const currentValue = currentUser.profile?.[key];
                
                if (isEmptyValue(currentValue) || replaceExisting) {
                  profileUpdate[`profile.${key}`] = trimmedValue;
                  console.log(`✅ profile.${key}: "${currentValue || 'vide'}" -> "${trimmedValue}"`);
                } else {
                  console.log(`⏭️ profile.${key}: garde "${currentValue}"`);
                  importStats.skipped++;
                }
              }
            }
          });

          // Appliquer les mises à jour
          if (Object.keys(userUpdate).length > 0 || Object.keys(profileUpdate).length > 0) {
            const finalUpdate = { ...userUpdate, ...profileUpdate };
            await User.findByIdAndUpdate(userId, finalUpdate, { new: true });
            importStats.updated++;
            console.log('✅ Infos personnelles enrichies');
          }
        } catch (error) {
          console.error('❌ Erreur enrichissement infos personnelles:', error);
          importStats.errors++;
        }
      }

      // 5. ⭐ ENRICHISSEMENT DES EXPÉRIENCES
      if (extractedData.experience && extractedData.experience.length > 0) {
        console.log(`📋 Traitement de ${extractedData.experience.length} expériences...`);
        
        for (const expData of extractedData.experience) {
          try {
            // Vérifier si l'expérience existe déjà (même entreprise + poste)
            const existingExp = await Experience.findOne({
              userId,
              company: { $regex: new RegExp(`^${escapeRegex(expData.company)}$`, 'i') },
              position: { $regex: new RegExp(`^${escapeRegex(expData.position)}$`, 'i') }
            });

            if (!existingExp) {
              // ⭐ NOUVELLE EXPÉRIENCE -> CRÉER
              const displayOrder = await Experience.countDocuments({ userId });
              await Experience.create({
                ...expData,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouvelle expérience: ${expData.company} - ${expData.position}`);
            } else if (replaceExisting) {
              // ⭐ MISE À JOUR si demandée
              await Experience.findByIdAndUpdate(existingExp._id, expData);
              importStats.updated++;
              console.log(`🔄 Expérience mise à jour: ${expData.company}`);
            } else {
              // ⭐ GARDER L'EXISTANTE
              importStats.skipped++;
              console.log(`⏭️ Expérience gardée: ${expData.company} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur expérience:', error);
            importStats.errors++;
          }
        }
      }

      // 6. ⭐ ENRICHISSEMENT DES FORMATIONS
      if (extractedData.education && extractedData.education.length > 0) {
        console.log(`🎓 Traitement de ${extractedData.education.length} formations...`);
        
        for (const eduData of extractedData.education) {
          try {
            // Vérifier si la formation existe déjà
            const existingEdu = await Education.findOne({
              userId,
              institutionName: { $regex: new RegExp(`^${escapeRegex(eduData.institutionName)}$`, 'i') },
              degreeType: { $regex: new RegExp(`^${escapeRegex(eduData.degreeType)}$`, 'i') }
            });

            if (!existingEdu) {
              const displayOrder = await Education.countDocuments({ userId });
              await Education.create({
                ...eduData,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouvelle formation: ${eduData.degreeType} - ${eduData.institutionName}`);
            } else if (replaceExisting) {
              await Education.findByIdAndUpdate(existingEdu._id, eduData);
              importStats.updated++;
              console.log(`🔄 Formation mise à jour: ${eduData.institutionName}`);
            } else {
              importStats.skipped++;
              console.log(`⏭️ Formation gardée: ${eduData.institutionName} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur formation:', error);
            importStats.errors++;
          }
        }
      }

      // 7. ⭐ ENRICHISSEMENT DES COMPÉTENCES (FUSION INTELLIGENTE)
      if (extractedData.skills && extractedData.skills.length > 0) {
        console.log(`🛠️ Traitement de ${extractedData.skills.length} compétences...`);
        
        for (const skillData of extractedData.skills) {
          try {
            // ⭐ NORMALISER les données avant insertion
            const normalizedSkill = profileController.normalizeSkillData(skillData);
            
            // Vérifier si la compétence existe (nom similaire)
            const existingSkill = await UserSkill.findOne({
              userId,
              skillName: { $regex: new RegExp(`^${escapeRegex(normalizedSkill.skillName)}$`, 'i') }
            });

            if (!existingSkill) {
              // ⭐ NOUVELLE COMPÉTENCE -> CRÉER
              const displayOrder = await UserSkill.countDocuments({ userId });
              await UserSkill.create({
                ...normalizedSkill,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouvelle compétence: ${normalizedSkill.skillName} (${normalizedSkill.proficiencyLevel})`);
            } else if (replaceExisting) {
              // ⭐ MISE À JOUR si demandée
              await UserSkill.findByIdAndUpdate(existingSkill._id, normalizedSkill);
              importStats.updated++;
              console.log(`🔄 Compétence mise à jour: ${normalizedSkill.skillName}`);
            } else {
              // ⭐ AMÉLIORATION INTELLIGENTE du niveau si c'est mieux
              const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4, 'master': 5 };
              const currentLevel = levelOrder[existingSkill.proficiencyLevel] || 1;
              const newLevel = levelOrder[normalizedSkill.proficiencyLevel] || 1;
              
              const shouldUpdate = 
                newLevel > currentLevel || 
                (normalizedSkill.yearsExperience && normalizedSkill.yearsExperience > existingSkill.yearsExperience);

              if (shouldUpdate) {
                await UserSkill.findByIdAndUpdate(existingSkill._id, {
                  proficiencyLevel: normalizedSkill.proficiencyLevel,
                  yearsExperience: Math.max(normalizedSkill.yearsExperience || 0, existingSkill.yearsExperience || 0)
                });
                importStats.updated++;
                console.log(`🔄 Compétence améliorée: ${normalizedSkill.skillName} (${existingSkill.proficiencyLevel} -> ${normalizedSkill.proficiencyLevel})`);
              } else {
                importStats.skipped++;
                console.log(`⏭️ Compétence gardée: ${normalizedSkill.skillName} (niveau suffisant)`);
              }
            }
          } catch (error) {
            console.error('❌ Erreur compétence:', error);
            importStats.errors++;
          }
        }
      }

      // 8. ⭐ ENRICHISSEMENT DES LANGUES
      if (extractedData.languages && extractedData.languages.length > 0) {
        console.log(`🌍 Traitement de ${extractedData.languages.length} langues...`);
        
        for (const languageData of extractedData.languages) {
          try {
            const normalizedLanguage = profileController.normalizeLanguageData(languageData);
            
            const existingLanguage = await Language.findOne({
              userId,
              languageName: { $regex: new RegExp(`^${escapeRegex(normalizedLanguage.languageName)}$`, 'i') }
            });

            if (!existingLanguage) {
              const displayOrder = await Language.countDocuments({ userId });
              await Language.create({
                ...normalizedLanguage,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouvelle langue: ${normalizedLanguage.languageName} (${normalizedLanguage.proficiencyLevel})`);
            } else if (replaceExisting) {
              await Language.findByIdAndUpdate(existingLanguage._id, normalizedLanguage);
              importStats.updated++;
              console.log(`🔄 Langue mise à jour: ${normalizedLanguage.languageName}`);
            } else {
              importStats.skipped++;
              console.log(`⏭️ Langue gardée: ${normalizedLanguage.languageName} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur langue:', error);
            importStats.errors++;
          }
        }
      }

      // 9. ⭐ ENRICHISSEMENT DES PROJETS
      if (extractedData.projects && extractedData.projects.length > 0) {
        console.log(`🚀 Traitement de ${extractedData.projects.length} projets...`);
        
        for (const projData of extractedData.projects) {
          try {
            const existingProj = await Project.findOne({
              userId,
              projectName: { $regex: new RegExp(`^${escapeRegex(projData.projectName)}$`, 'i') }
            });

            if (!existingProj) {
              const displayOrder = await Project.countDocuments({ userId });
              await Project.create({
                ...projData,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouveau projet: ${projData.projectName}`);
            } else if (replaceExisting) {
              await Project.findByIdAndUpdate(existingProj._id, projData);
              importStats.updated++;
              console.log(`🔄 Projet mis à jour: ${projData.projectName}`);
            } else {
              importStats.skipped++;
              console.log(`⏭️ Projet gardé: ${projData.projectName} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur projet:', error);
            importStats.errors++;
          }
        }
      }

      // 10. ⭐ ENRICHISSEMENT DES CERTIFICATIONS
      if (extractedData.certifications && extractedData.certifications.length > 0) {
        console.log(`🏆 Traitement de ${extractedData.certifications.length} certifications...`);
        
        for (const certData of extractedData.certifications) {
          try {
            const existingCert = await Certification.findOne({
              userId,
              certificationName: { $regex: new RegExp(`^${escapeRegex(certData.certificationName)}$`, 'i') }
            });

            if (!existingCert) {
              const displayOrder = await Certification.countDocuments({ userId });
              await Certification.create({
                ...certData,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouvelle certification: ${certData.certificationName}`);
            } else if (replaceExisting) {
              await Certification.findByIdAndUpdate(existingCert._id, certData);
              importStats.updated++;
              console.log(`🔄 Certification mise à jour: ${certData.certificationName}`);
            } else {
              importStats.skipped++;
              console.log(`⏭️ Certification gardée: ${certData.certificationName} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur certification:', error);
            importStats.errors++;
          }
        }
      }

      // 11. ⭐ ENRICHISSEMENT DES CENTRES D'INTÉRÊT
      if (extractedData.interests && extractedData.interests.length > 0) {
        console.log(`🎯 Traitement de ${extractedData.interests.length} centres d'intérêt...`);
        
        for (const interestData of extractedData.interests) {
          try {
            const normalizedInterest = profileController.normalizeInterestData(interestData);
            
            const existingInterest = await Interest.findOne({
              userId,
              interestName: { $regex: new RegExp(`^${escapeRegex(normalizedInterest.interestName)}$`, 'i') }
            });

            if (!existingInterest) {
              const displayOrder = await Interest.countDocuments({ userId });
              await Interest.create({
                ...normalizedInterest,
                userId,
                displayOrder
              });
              importStats.created++;
              console.log(`✅ Nouveau centre d'intérêt: ${normalizedInterest.interestName} (${normalizedInterest.category}/${normalizedInterest.level})`);
            } else if (replaceExisting) {
              await Interest.findByIdAndUpdate(existingInterest._id, normalizedInterest);
              importStats.updated++;
              console.log(`🔄 Centre d'intérêt mis à jour: ${normalizedInterest.interestName}`);
            } else {
              importStats.skipped++;
              console.log(`⏭️ Centre d'intérêt gardé: ${normalizedInterest.interestName} (existe déjà)`);
            }
          } catch (error) {
            console.error('❌ Erreur centre d\'intérêt:', error);
            importStats.errors++;
          }
        }
      }

      // 12. Récupérer le profil final enrichi
      const updatedProfile = await profileController.getProfileData(userId);

      console.log('📊 Statistiques finales:', importStats);

      // 13. Message personnalisé selon le mode
      const message = replaceExisting 
        ? `CV importé et remplacé avec succès ! ${importStats.created} créés, ${importStats.updated} mis à jour`
        : `Profil enrichi avec succès ! ${importStats.created} ajouts, ${importStats.updated} améliorations, ${importStats.skipped} conservés`;

      res.json({
        success: true,
        message,
        importStats,
        extractedData, // Pour debug/preview
        profileData: updatedProfile
      });

    } catch (error) {
      console.error('❌ Erreur enrichissement CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'enrichissement du profil avec le CV',
        error: error.message
      });
    }
  },

  // ⭐ MÉTHODE HELPER : Échapper les caractères spéciaux pour regex
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  // ⭐ MÉTHODE HELPER : Extraction basique améliorée (fallback)
  extractBasicCVInfo(cvText) {
    console.log('🔄 Utilisation de l\'extraction basique (fallback)');
    
    const extractedData = {
      personalInfo: {},
      experience: [],
      education: [],
      skills: [],
      languages: [],
      projects: [],
      certifications: [],
      interests: []
    };

    const lines = cvText.split('\n').map(line => line.trim()).filter(line => line);

    // ⭐ EXTRACTION AMÉLIORÉE DU NOM
    const nameRegex = /\*\*([^*]+)\*\*/;
    const fullNameMatch = cvText.match(nameRegex);
    
    if (fullNameMatch) {
      const fullName = fullNameMatch[1].trim();
      const nameParts = fullName.split(/\s+/);
      
      if (nameParts.length >= 2) {
        extractedData.personalInfo.lastName = nameParts[0];
        extractedData.personalInfo.firstName = nameParts.slice(1).join(' ');
      } else {
        extractedData.personalInfo.firstName = fullName;
      }
      
      console.log('✅ Nom extrait:', extractedData.personalInfo.firstName, extractedData.personalInfo.lastName);
    }

    // ⭐ EXTRACTION AMÉLIORÉE DU TÉLÉPHONE
    const phoneRegex = /📞\s*([0-9\s\-\+\(\)]{10,})/;
    const phoneMatch = cvText.match(phoneRegex);
    if (phoneMatch) {
      extractedData.personalInfo.phone = phoneMatch[1].trim();
      console.log('✅ Téléphone extrait:', extractedData.personalInfo.phone);
    }

    // ⭐ EXTRACTION AMÉLIORÉE DE L'EMAIL
    const emailRegex = /📧\s*\[?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\]?/;
    const emailMatch = cvText.match(emailRegex);
    if (emailMatch) {
      extractedData.personalInfo.email = emailMatch[1].trim();
      console.log('✅ Email extrait:', extractedData.personalInfo.email);
    }

    // ⭐ EXTRACTION AMÉLIORÉE DE L'ADRESSE
    const addressRegex = /📍\s*([^📞📧\n🚗]+)/;
    const addressMatch = cvText.match(addressRegex);
    if (addressMatch) {
      extractedData.personalInfo.location = addressMatch[1].trim();
      console.log('✅ Adresse extraite:', extractedData.personalInfo.location);
    }

    // ⭐ EXTRACTION AMÉLIORÉE DU TITRE/POSTE
    const titleLines = lines.filter(line => 
      /(?:Développeur|Developer|Ingénieur|Engineer|Consultant|Analyst|Manager|Alternance|Stage|Étudiant)/i.test(line) &&
      !line.includes('📞') && !line.includes('📧') && !line.includes('📍')
    );
    
    if (titleLines.length > 0) {
      extractedData.personalInfo.title = titleLines[0].replace(/[*#]/g, '').trim();
      console.log('✅ Titre extrait:', extractedData.personalInfo.title);
    }

    // ⭐ EXTRACTION BASIQUE DES COMPÉTENCES
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
      
      console.log('✅ Compétences extraites:', extractedData.skills.length);
    }

    // ⭐ EXTRACTION BASIQUE DES LANGUES
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

  // Mettre à jour les informations personnelles
  async updatePersonalInfo(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Séparer les champs utilisateur des champs profil
      const userFields = ['firstName', 'lastName', 'email', 'phone'];
      const profileFields = ['title', 'summary', 'location', 'city', 'country', 'industry', 
                           'yearsExperience', 'currentPosition', 'desiredPosition', 'availability',
                           'desiredSalaryMin', 'desiredSalaryMax', 'linkedinUrl', 'githubUrl', 'portfolioUrl'];

      const userUpdate = {};
      const profileUpdate = {};

      // Répartir les champs
      Object.keys(updateData).forEach(key => {
        if (userFields.includes(key)) {
          userUpdate[key] = updateData[key];
        } else if (profileFields.includes(key)) {
          profileUpdate[`profile.${key}`] = updateData[key];
        }
      });

      // Combiner les mises à jour
      const finalUpdate = { ...userUpdate, ...profileUpdate };

      const user = await User.findByIdAndUpdate(
        userId,
        finalUpdate,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Informations personnelles mises à jour avec succès',
        personalInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          ...user.profile
        }
      });

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil',
        error: error.message
      });
    }
  },

  // Ajouter une expérience
  async addExperience(req, res) {
    try {
      const userId = req.user.id;
      const experienceData = { ...req.body, userId };

      const experience = await Experience.create(experienceData);

      res.status(201).json({
        success: true,
        message: 'Expérience ajoutée avec succès',
        data: {
          id: experience._id.toString(),
          ...experience.toObject()
        }
      });
    } catch (error) {
      console.error('Erreur ajout expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout de l\'expérience',
        error: error.message
      });
    }
  },

  async updateExperience(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const experience = await Experience.findOneAndUpdate(
        { _id: id, userId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Expérience non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Expérience mise à jour avec succès',
        data: {
          id: experience._id.toString(),
          ...experience.toObject()
        }
      });
    } catch (error) {
      console.error('Erreur mise à jour expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'expérience',
        error: error.message
      });
    }
  },

  async deleteExperience(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const experience = await Experience.findOneAndDelete({ _id: id, userId });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Expérience non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Expérience supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'expérience',
        error: error.message
      });
    }
  },

  // Méthode générique pour gérer toutes les sections
  async updateSection(req, res) {
    try {
      const { section, action, id } = req.params;
      const userId = req.user.id;
      const data = req.body;

      // Mapping des sections vers les modèles
      const modelMap = {
        'experience': Experience,
        'education': Education,
        'skills': UserSkill,
        'certifications': Certification,
        'languages': Language,
        'projects': Project,
        'interests': Interest
      };

      const Model = modelMap[section];
      if (!Model) {
        return res.status(400).json({
          success: false,
          message: 'Section invalide'
        });
      }

      let result;
      
      switch (action) {
        case 'add':
          result = await Model.create({ ...data, userId });
          if (result) {
            result = result.toObject();
            result.id = result._id.toString();
          }
          break;
        case 'update':
          result = await Model.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true, runValidators: true }
          );
          if (result) {
            result = result.toObject();
            result.id = result._id.toString();
          }
          break;
        case 'delete':
          result = await Model.findOneAndDelete({ _id: id, userId });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Action invalide'
          });
      }

      if (!result && (action === 'update' || action === 'delete')) {
        return res.status(404).json({
          success: false,
          message: 'Élément non trouvé'
        });
      }

      res.json({
        success: true,
        message: `${section} ${action === 'add' ? 'ajouté' : action === 'update' ? 'mis à jour' : 'supprimé'} avec succès`,
        data: result
      });

    } catch (error) {
      console.error(`Erreur ${req.params.action} ${req.params.section}:`, error);
      res.status(500).json({
        success: false,
        message: `Erreur lors de l'opération sur ${req.params.section}`,
        error: error.message
      });
    }
  }
};

module.exports = profileController;
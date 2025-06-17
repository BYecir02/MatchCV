const JobAnalysis = require('../models/JobAnalysis');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
const UserSkill = require('../models/UserSkill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Language = require('../models/Language');
const Interest = require('../models/Interest');
const groqService = require('../services/groqService');

const jobController = {
  
  // ✅ FONCTION UTILITAIRE : RÉCUPÉRER LE PROFIL COMPLET
  async getCompleteUserProfile(userId) {
    try {
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

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const completeProfile = {
        personalInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          title: user.profile?.title || 'Candidat',
          location: user.profile?.location || 'Non spécifiée',
          phone: user.profile?.phone || '',
          summary: user.profile?.summary || ''
        },
        skills: skills.map(skill => ({
          skillName: skill.skillName,
          proficiencyLevel: skill.proficiencyLevel,
          yearsExperience: skill.yearsExperience,
          category: skill.category
        })),
        experience: experiences.map(exp => ({
          position: exp.position,
          company: exp.company,
          duration: exp.duration,
          description: exp.description,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent
        })),
        education: education.map(edu => ({
          degreeType: edu.degreeType,
          fieldOfStudy: edu.fieldOfStudy,
          institutionName: edu.institutionName,
          graduationYear: edu.graduationYear,
          location: edu.location,
          description: edu.description
        })),
        projects: projects.map(proj => ({
          projectName: proj.projectName,
          description: proj.description,
          technologiesUsed: proj.technologiesUsed,
          projectUrl: proj.projectUrl,
          githubUrl: proj.githubUrl,
          startDate: proj.startDate,
          endDate: proj.endDate
        })),
        certifications: certifications.map(cert => ({
          certificationName: cert.certificationName,
          issuingOrganization: cert.issuingOrganization,
          issueDate: cert.issueDate,
          expirationDate: cert.expirationDate,
          credentialId: cert.credentialId,
          credentialUrl: cert.credentialUrl
        })),
        languages: languages.map(lang => ({
          languageName: lang.languageName,
          proficiencyLevel: lang.proficiencyLevel
        })),
        interests: interests.map(interest => ({
          interestName: interest.interestName,
          description: interest.description
        }))
      };

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

      console.log('✅ Profil complet construit avec succès');
      return completeProfile;

    } catch (error) {
      console.error('❌ Erreur récupération profil complet:', error);
      throw error;
    }
  },

  // ⭐ ANALYSER UNE ANNONCE AVEC PROFIL UTILISATEUR COMPLET
  async analyzeJob(req, res) {
    try {
      const { 
        jobText, 
        saveJob = false, 
        jobTitle, 
        companyName, 
        userProfile
      } = req.body;
      const userId = req.user.id;

      if (!jobText || jobText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le texte de l\'annonce est requis'
        });
      }

      console.log('🔍 Début analyse annonce pour utilisateur:', userId);
      console.log('👤 Profil utilisateur fourni:', userProfile ? 'Oui' : 'Non');

      // 1. ✅ RÉCUPÉRER LE PROFIL UTILISATEUR COMPLET
      let completeUserProfile = null;
      
      if (userProfile) {
        completeUserProfile = userProfile;
        console.log('📊 Profil frontend - Compétences:', userProfile.skills?.length || 0);
      } else {
        try {
          completeUserProfile = await jobController.getCompleteUserProfile(userId);
        } catch (error) {
          console.error('❌ Erreur récupération profil:', error);
          completeUserProfile = null;
        }
      }

      console.log('🤖 Envoi à Groq avec profil:', completeUserProfile ? 'Complet' : 'Vide');
      const analysis = await groqService.analyzeJob(jobText, completeUserProfile);
      
      let stats = {
        totalSkills: 0,
        matchingSkills: 0,
        overallScore: 0
      };

      if (analysis.extractedSkills && Array.isArray(analysis.extractedSkills)) {
        stats.totalSkills = analysis.extractedSkills.length;
        stats.matchingSkills = analysis.extractedSkills.filter(skill => skill.userHasSkill === true).length;
        stats.overallScore = stats.totalSkills > 0 
          ? Math.round((stats.matchingSkills / stats.totalSkills) * 100)
          : 0;
      }

      console.log('📊 Statistiques calculées:', stats);

      let jobPostingId = null;
      if (saveJob) {
        try {
          const jobPosting = new JobPosting({
            userId,
            title: jobTitle || analysis.title || 'Annonce sans titre',
            companyName: companyName || analysis.company || 'Entreprise inconnue',
            originalDescription: jobText,
            cleanedDescription: jobText.substring(0, 1000),
            location: analysis.location,
            contractType: analysis.contractType || 'CDI',
            experienceRequired: analysis.experienceRequired,
            salaryRange: analysis.salaryRange,
            status: 'active'
          });

          await jobPosting.save();
          jobPostingId = jobPosting._id;
          console.log('✅ Annonce sauvegardée:', jobPostingId);
        } catch (saveError) {
          console.error('⚠️ Erreur sauvegarde annonce:', saveError);
        }
      }

      const jobAnalysis = new JobAnalysis({
        userId,
        jobPostingId,
        jobText,
        analysis: {
          ...analysis,
          description: jobText.substring(0, 200) + '...',
          userProfileUsed: completeUserProfile ? {
            skillsCount: completeUserProfile.skills?.length || 0,
            experienceCount: completeUserProfile.experience?.length || 0,
            projectsCount: completeUserProfile.projects?.length || 0,
            certificationsCount: completeUserProfile.certifications?.length || 0,
            languagesCount: completeUserProfile.languages?.length || 0,
            educationCount: completeUserProfile.education?.length || 0,
            interestsCount: completeUserProfile.interests?.length || 0,
            hasProfile: true
          } : { hasProfile: false }
        }
      });

      await jobAnalysis.save();

      res.json({
        success: true,
        message: 'Analyse terminée avec succès',
        analysis: jobAnalysis.analysis,
        analysisId: jobAnalysis._id,
        jobPostingId: jobPostingId,
        stats: stats,
        profileUsed: completeUserProfile ? true : false
      });

    } catch (error) {
      console.error('❌ Erreur analyse job:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'analyse de l\'annonce',
        error: error.message
      });
    }
  },

  // ⭐ SAUVEGARDER UNE ANNONCE SEULE
  async saveJobPosting(req, res) {
    try {
      const { title, companyName, jobText, location, contractType, salaryRange } = req.body;
      const userId = req.user.id;

      if (!jobText) {
        return res.status(400).json({
          success: false,
          message: 'Le texte de l\'annonce est requis'
        });
      }

      const jobPosting = new JobPosting({
        userId,
        title: title || 'Annonce sans titre',
        companyName: companyName || 'Entreprise inconnue', 
        originalDescription: jobText,
        cleanedDescription: jobText.substring(0, 1000),
        location,
        contractType: contractType || 'CDI',
        salaryRange,
        experienceRequired: null,
        status: 'active'
      });

      await jobPosting.save();

      res.json({
        success: true,
        message: 'Annonce sauvegardée avec succès',
        jobPosting: {
          id: jobPosting._id,
          title: jobPosting.title,
          companyName: jobPosting.companyName,
          location: jobPosting.location,
          contractType: jobPosting.contractType,
          createdAt: jobPosting.createdAt
        }
      });

    } catch (error) {
      console.error('❌ Erreur sauvegarde annonce:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de l\'annonce',
        error: error.message
      });
    }
  },

  // ⭐ GÉNÉRER UNE LETTRE DE MOTIVATION AVEC PROFIL COMPLET - ✅ CORRIGÉ
  async generateCoverLetter(req, res) {
    try {
      const { 
        jobDescription, 
        userProfile, 
        aiInstructions,
        jobTitle,
        companyName,
        saveToHistory = false
      } = req.body;
      const userId = req.user.id;

          // 🚨 DEBUG : Vérifier les instructions reçues
    console.log('🔍 INSTRUCTIONS REÇUES DANS CONTROLLER:');
    console.log('   Type:', typeof aiInstructions);
    console.log('   Valeur:', aiInstructions);
    console.log('   Length:', aiInstructions?.length);

    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La description du poste est requise'
      });
    }

    // ✅ RÉCUPÉRER LE PROFIL COMPLET SI PAS FOURNI
    let completeUserProfile = null;

    if (userProfile && typeof userProfile === 'object') {
      completeUserProfile = userProfile;
      console.log('📊 Profil fourni dans la requête - Compétences:', userProfile.skills?.length || 0);
    } else {
      console.log('🔍 Récupération profil complet depuis BDD...');
      try {
        completeUserProfile = await jobController.getCompleteUserProfile(userId);
        console.log('📊 Éléments récupérés depuis BDD:', {
          skills: completeUserProfile?.skills?.length || 0,
          experience: completeUserProfile?.experience?.length || 0,
          projects: completeUserProfile?.projects?.length || 0,
          certifications: completeUserProfile?.certifications?.length || 0,
          languages: completeUserProfile?.languages?.length || 0,
          education: completeUserProfile?.education?.length || 0,
          interests: completeUserProfile?.interests?.length || 0
        });
      } catch (error) {
        console.error('❌ Erreur récupération profil:', error);
        console.error('❌ Stack trace:', error.stack);
        completeUserProfile = null;
      }
    }

    console.log('✍️ Génération lettre avec profil:', {
      hasProfile: !!completeUserProfile,
      skillsCount: completeUserProfile?.skills?.length || 0,
      experienceCount: completeUserProfile?.experience?.length || 0
    });
    
    // 🚨 DEBUG FINAL AVANT GROQ
    console.log('📝 INSTRUCTIONS ENVOYÉES À GROQ:', aiInstructions);

    // ✅ UTILISER GROQ POUR GÉNÉRER LA LETTRE AVEC PROFIL COMPLET
    const letterContent = await groqService.generateCoverLetter(
      jobDescription, 
      completeUserProfile, 
      aiInstructions || ''  // ← 🚨 BIEN PASSÉ ICI
    );

    console.log('✅ Lettre générée avec succès basée sur le profil complet');

    // ✅ SAUVEGARDER DANS L'HISTORIQUE SI DEMANDÉ
    let letterId = null;
    if (saveToHistory) {
      try {
        const coverLetter = new JobAnalysis({
          userId,
          jobText: jobDescription,
          analysis: {
            type: 'cover_letter',
            title: jobTitle || 'Lettre de motivation',
            company: companyName || 'Entreprise',
            letterContent: letterContent,
            aiInstructions: aiInstructions || '',  // ← SAUVÉ AUSSI
            profileSnapshot: completeUserProfile ? {
              skillsCount: completeUserProfile.skills?.length || 0,
              experienceCount: completeUserProfile.experience?.length || 0,
              projectsCount: completeUserProfile.projects?.length || 0,
              certificationsCount: completeUserProfile.certifications?.length || 0,
              languagesCount: completeUserProfile.languages?.length || 0,
              educationCount: completeUserProfile.education?.length || 0,
              interestsCount: completeUserProfile.interests?.length || 0,
              hasProfile: true
            } : { hasProfile: false },
            wordCount: letterContent.split(/\s+/).length,
            characterCount: letterContent.length,
            generatedAt: new Date()
          }
        });

        await coverLetter.save();
        letterId = coverLetter._id;
        console.log('✅ Lettre sauvegardée:', letterId);
      } catch (saveError) {
        console.error('⚠️ Erreur sauvegarde lettre:', saveError);
      }
    }

    res.json({
      success: true,
      message: 'Lettre générée avec succès',
      letter: letterContent,
      letterId: letterId,
      profileUsed: completeUserProfile ? true : false,
      stats: {
        wordCount: letterContent.split(/\s+/).length,
        characterCount: letterContent.length,
        hasInstructions: !!aiInstructions,
        instructionsReceived: aiInstructions || 'Aucune',  // ← DEBUG
        profileElements: completeUserProfile ? {
          skills: completeUserProfile.skills?.length || 0,
          experience: completeUserProfile.experience?.length || 0,
          projects: completeUserProfile.projects?.length || 0,
          certifications: completeUserProfile.certifications?.length || 0,
          languages: completeUserProfile.languages?.length || 0,
          education: completeUserProfile.education?.length || 0,
          interests: completeUserProfile.interests?.length || 0
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Erreur génération lettre:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de la lettre',
      error: error.message
    });
  }
},

  // ⭐ SAUVEGARDER UNE LETTRE DE MOTIVATION (méthode dédiée)
  async saveCoverLetter(req, res) {
    try {
      const { 
        letterContent, 
        jobTitle, 
        companyName, 
        jobDescription,
        aiInstructions,
        userProfile,
        tags = []
      } = req.body;
      const userId = req.user.id;

      if (!letterContent || letterContent.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le contenu de la lettre est requis'
        });
      }

      // ✅ SAUVEGARDER LA LETTRE AVEC MÉTADONNÉES COMPLÈTES
      const coverLetter = new JobAnalysis({
        userId,
        jobText: jobDescription || 'Description non fournie',
        analysis: {
          type: 'cover_letter',
          title: jobTitle || 'Lettre de motivation',
          company: companyName || 'Entreprise',
          letterContent: letterContent,
          aiInstructions: aiInstructions || '',
          tags: Array.isArray(tags) ? tags : [],
          profileSnapshot: userProfile ? {
            skillsCount: userProfile.skills?.length || 0,
            experienceCount: userProfile.experience?.length || 0,
            projectsCount: userProfile.projects?.length || 0,
            certificationsCount: userProfile.certifications?.length || 0,
            languagesCount: userProfile.languages?.length || 0,
            educationCount: userProfile.education?.length || 0,
            interestsCount: userProfile.interests?.length || 0,
            hasProfile: true
          } : { hasProfile: false },
          // ✅ STATISTIQUES DE LA LETTRE
          wordCount: letterContent.split(/\s+/).length,
          characterCount: letterContent.length,
          paragraphCount: letterContent.split(/\n\s*\n/).length,
          generatedAt: new Date(),
          lastModified: new Date()
        }
      });

      await coverLetter.save();

      res.json({
        success: true,
        message: 'Lettre sauvegardée avec succès',
        letterId: coverLetter._id,
        stats: {
          wordCount: coverLetter.analysis.wordCount,
          characterCount: coverLetter.analysis.characterCount,
          paragraphCount: coverLetter.analysis.paragraphCount
        }
      });

    } catch (error) {
      console.error('❌ Erreur sauvegarde lettre:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde de la lettre',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER MES LETTRES DE MOTIVATION
  async getMyCoverLetters(req, res) {
    try {
      const { page = 1, limit = 10, search, company } = req.query;
      const userId = req.user.id;

      // ✅ CONSTRUIRE LA REQUÊTE DE RECHERCHE
      const query = { 
        userId,
        'analysis.type': 'cover_letter'
      };

      if (search) {
        query.$or = [
          { 'analysis.title': { $regex: search, $options: 'i' } },
          { 'analysis.company': { $regex: search, $options: 'i' } },
          { 'analysis.letterContent': { $regex: search, $options: 'i' } }
        ];
      }

      if (company) {
        query['analysis.company'] = { $regex: company, $options: 'i' };
      }

      const letters = await JobAnalysis.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('analysis.title analysis.company analysis.letterContent analysis.wordCount analysis.tags analysis.profileSnapshot analysis.generatedAt createdAt');

      const total = await JobAnalysis.countDocuments(query);

      res.json({
        success: true,
        letters: letters.map(letter => ({
          id: letter._id,
          title: letter.analysis?.title || 'Lettre sans titre',
          company: letter.analysis?.company || 'Entreprise inconnue',
          preview: letter.analysis?.letterContent?.substring(0, 200) + '...' || '',
          wordCount: letter.analysis?.wordCount || 0,
          tags: letter.analysis?.tags || [],
          hasProfile: letter.analysis?.profileSnapshot?.hasProfile || false,
          profileElements: letter.analysis?.profileSnapshot || {},
          createdAt: letter.createdAt,
          generatedAt: letter.analysis?.generatedAt || letter.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: letters.length,
          totalItems: total
        }
      });

    } catch (error) {
      console.error('❌ Erreur récupération lettres:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des lettres',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER UNE LETTRE SPÉCIFIQUE
  async getCoverLetterById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const letter = await JobAnalysis.findOne({
        _id: id,
        userId,
        'analysis.type': 'cover_letter'
      }).select('analysis jobText createdAt');

      if (!letter) {
        return res.status(404).json({
          success: false,
          message: 'Lettre non trouvée'
        });
      }

      res.json({
        success: true,
        letter: {
          id: letter._id,
          title: letter.analysis?.title || 'Lettre sans titre',
          company: letter.analysis?.company || 'Entreprise inconnue',
          content: letter.analysis?.letterContent || '',
          jobDescription: letter.jobText || '',
          aiInstructions: letter.analysis?.aiInstructions || '',
          tags: letter.analysis?.tags || [],
          stats: {
            wordCount: letter.analysis?.wordCount || 0,
            characterCount: letter.analysis?.characterCount || 0,
            paragraphCount: letter.analysis?.paragraphCount || 0
          },
          profileSnapshot: letter.analysis?.profileSnapshot || {},
          createdAt: letter.createdAt,
          generatedAt: letter.analysis?.generatedAt || letter.createdAt
        }
      });

    } catch (error) {
      console.error('❌ Erreur récupération lettre:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la lettre',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER L'HISTORIQUE DES ANALYSES AVEC STATS
  async getMyAnalyses(req, res) {
    try {
      const { page = 1, limit = 20, type = 'job_analysis' } = req.query;
      const userId = req.user.id;

      const query = { userId };
      
      // ✅ FILTRER PAR TYPE (analyses d'emploi ou lettres)
      if (type === 'job_analysis') {
        query.$or = [
          { 'analysis.type': { $exists: false } },
          { 'analysis.type': 'job_analysis' }
        ];
      } else if (type === 'cover_letter') {
        query['analysis.type'] = 'cover_letter';
      }

      const analyses = await JobAnalysis.find(query)
        .populate('jobPostingId', 'title companyName location')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('analysis createdAt jobPostingId jobText');

      const total = await JobAnalysis.countDocuments(query);

      res.json({
        success: true,
        analyses: analyses.map(analysis => {
          if (analysis.analysis?.type === 'cover_letter') {
            return {
              id: analysis._id,
              type: 'cover_letter',
              title: analysis.analysis?.title || 'Lettre sans titre',
              company: analysis.analysis?.company || 'Entreprise inconnue',
              preview: analysis.analysis?.letterContent?.substring(0, 200) + '...' || '',
              wordCount: analysis.analysis?.wordCount || 0,
              hasProfile: analysis.analysis?.profileSnapshot?.hasProfile || false,
              createdAt: analysis.createdAt
            };
          } else {
            return {
              id: analysis._id,
              type: 'job_analysis',
              title: analysis.analysis?.title || 'Analyse sans titre',
              company: analysis.analysis?.company || 'Entreprise inconnue',
              overallScore: analysis.analysis?.overallMatchScore || 0,
              essentialScore: analysis.analysis?.essentialSkillsScore || 0,
              skillsCount: analysis.analysis?.extractedSkills?.length || 0,
              matchingSkills: analysis.analysis?.extractedSkills?.filter(s => s.userHasSkill)?.length || 0,
              createdAt: analysis.createdAt,
              hasProfile: analysis.analysis?.userProfileUsed?.hasProfile || false,
              jobPosting: analysis.jobPostingId ? {
                id: analysis.jobPostingId._id,
                title: analysis.jobPostingId.title,
                company: analysis.jobPostingId.companyName
              } : null
            };
          }
        }),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: analyses.length,
          totalItems: total
        }
      });

    } catch (error) {
      console.error('❌ Erreur récupération analyses:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des analyses',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER UNE ANALYSE SPÉCIFIQUE COMPLÈTE
  async getAnalysisById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const analysis = await JobAnalysis.findOne({
        _id: id,
        userId
      }).populate('jobPostingId');

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analyse non trouvée'
        });
      }

      // ✅ RECALCULER LES STATS SI NÉCESSAIRE
      let stats = {
        totalSkills: analysis.analysis?.extractedSkills?.length || 0,
        matchingSkills: analysis.analysis?.extractedSkills?.filter(s => s.userHasSkill)?.length || 0,
        overallScore: analysis.analysis?.overallMatchScore || 0,
        essentialScore: analysis.analysis?.essentialSkillsScore || 0
      };

      res.json({
        success: true,
        analysis: {
          id: analysis._id,
          type: analysis.analysis?.type || 'job_analysis',
          ...analysis.analysis,
          jobText: analysis.jobText,
          createdAt: analysis.createdAt,
          jobPosting: analysis.jobPostingId,
          stats: stats
        }
      });

    } catch (error) {
      console.error('❌ Erreur récupération analyse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'analyse',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER LES ANNONCES SAUVEGARDÉES
  async getMySavedJobs(req, res) {
    try {
      const { page = 1, limit = 50, status, search } = req.query;
      const userId = req.user.id;

      const query = { userId };
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      const jobs = await JobPosting.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('title companyName location contractType status createdAt salaryRange experienceRequired');

      const total = await JobPosting.countDocuments(query);

      res.json({
        success: true,
        jobs: jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.companyName,
          location: job.location,
          contractType: job.contractType,
          salaryRange: job.salaryRange,
          experienceRequired: job.experienceRequired,
          status: job.status,
          createdAt: job.createdAt
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: jobs.length,
          totalItems: total
        }
      });

    } catch (error) {
      console.error('❌ Erreur récupération annonces:', error);  
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des annonces',
        error: error.message
      });
    }
  },

  // ⭐ SUPPRIMER UNE ANALYSE
  async deleteAnalysis(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const analysis = await JobAnalysis.findOneAndDelete({
        _id: id,
        userId
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analyse non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Analyse supprimée avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur suppression analyse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression',
        error: error.message
      });
    }
  },

  // ⭐ SUPPRIMER UNE ANNONCE SAUVEGARDÉE
  async deleteJobPosting(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const job = await JobPosting.findOneAndDelete({
        _id: id,
        userId
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Annonce non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Annonce supprimée avec succès'
      });

    } catch (error) {
      console.error('❌ Erreur suppression annonce:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression',
        error: error.message
      });
    }
  },

  // ⭐ ENDPOINT DE TEST PROFIL
  async testProfileRetrieval(req, res) {
    try {
      const userId = req.user.id;
      console.log('🧪 Test récupération profil pour:', userId);
      
      const completeUserProfile = await jobController.getCompleteUserProfile(userId);
      
      const stats = {
        hasProfile: !!completeUserProfile,
        personalInfo: !!completeUserProfile?.personalInfo,
        skills: completeUserProfile?.skills?.length || 0,
        experience: completeUserProfile?.experience?.length || 0,
        projects: completeUserProfile?.projects?.length || 0,
        certifications: completeUserProfile?.certifications?.length || 0,
        languages: completeUserProfile?.languages?.length || 0,
        education: completeUserProfile?.education?.length || 0,
        interests: completeUserProfile?.interests?.length || 0
      };
      
      const samples = {
        personalInfo: completeUserProfile?.personalInfo || null,
        firstSkill: completeUserProfile?.skills?.[0] || null,
        firstExperience: completeUserProfile?.experience?.[0] || null,
        firstProject: completeUserProfile?.projects?.[0] || null
      };
      
      res.json({
        success: true,
        message: 'Test profil OK',
        stats,
        samples
      });
      
    } catch (error) {
      console.error('❌ Erreur test profil:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

};

module.exports = jobController;
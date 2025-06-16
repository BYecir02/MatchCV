const JobAnalysis = require('../models/JobAnalysis');
const JobPosting = require('../models/JobPosting');
const User = require('../models/User');
const groqService = require('../services/groqService');

const jobController = {
  
  // ⭐ ANALYSER UNE ANNONCE AVEC PROFIL UTILISATEUR COMPLET
  async analyzeJob(req, res) {
    try {
      const { 
        jobText, 
        saveJob = false, 
        jobTitle, 
        companyName, 
        userProfile // ✅ NOUVEAU : Profil utilisateur depuis le frontend
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
        // Utiliser le profil fourni par le frontend
        completeUserProfile = userProfile;
        console.log('📊 Profil frontend - Compétences:', userProfile.skills?.length || 0);
      } else {
        // Fallback: récupérer depuis la base de données
        const user = await User.findById(userId).select('-password');
        if (user && user.profile) {
          completeUserProfile = {
            personalInfo: {
              firstName: user.firstName,
              lastName: user.lastName,
              title: user.profile.title,
              location: user.profile.location
            },
            skills: user.profile.skills || [],
            experience: user.profile.experience || [],
            education: user.profile.education || [],
            languages: user.profile.languages || []
          };
          console.log('📊 Profil BDD - Compétences:', user.profile.skills?.length || 0);
        }
      }

      // 2. ✅ ANALYSER L'ANNONCE AVEC LE PROFIL COMPLET
      console.log('🤖 Envoi à Groq avec profil:', completeUserProfile ? 'Complet' : 'Vide');
      const analysis = await groqService.analyzeJob(jobText, completeUserProfile);
      
      // ✅ CALCULER LES STATISTIQUES RÉELLES
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

      // 3. ✅ SAUVEGARDER L'ANNONCE SI DEMANDÉ
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

      // 4. ✅ SAUVEGARDER L'ANALYSE AVEC PROFIL
      const jobAnalysis = new JobAnalysis({
        userId,
        jobPostingId,
        jobText,
        analysis: {
          ...analysis,
          description: jobText.substring(0, 200) + '...',
          // ✅ INCLURE LE PROFIL UTILISÉ POUR L'ANALYSE
          userProfileUsed: completeUserProfile ? {
            skillsCount: completeUserProfile.skills?.length || 0,
            experienceCount: completeUserProfile.experience?.length || 0,
            hasProfile: true
          } : { hasProfile: false }
        }
      });

      await jobAnalysis.save();

      // 5. ✅ RÉPONSE COMPLÈTE AVEC VRAIES STATISTIQUES
      res.json({
        success: true,
        message: 'Analyse terminée avec succès',
        analysis: jobAnalysis.analysis,
        analysisId: jobAnalysis._id,
        jobPostingId: jobPostingId,
        stats: stats, // ✅ STATS RÉELLES CALCULÉES
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

      const jobPosting = new JobPosting({
        userId,
        title: title || 'Annonce sans titre',
        companyName: companyName || 'Entreprise inconnue', 
        originalDescription: jobText,
        location,
        contractType: contractType || 'CDI',
        salaryRange,
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

  // ⭐ GÉNÉRER UNE LETTRE DE MOTIVATION AVEC PROFIL
  async generateCoverLetter(req, res) {
    try {
      const { jobDescription, userProfile, aiInstructions } = req.body;
      const userId = req.user.id;

      if (!jobDescription) {
        return res.status(400).json({
          success: false,
          message: 'La description du poste est requise'
        });
      }

      // ✅ RÉCUPÉRER LE PROFIL SI PAS FOURNI
      let completeUserProfile = userProfile;
      if (!completeUserProfile) {
        const user = await User.findById(userId).select('-password');
        if (user && user.profile) {
          completeUserProfile = {
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.profile.title || 'Candidat',
            experience: user.profile.experience?.map(exp => 
              `${exp.position} chez ${exp.company} (${exp.duration})`
            ).join(', ') || 'Voir CV joint'
          };
        }
      }

      console.log('✍️ Génération lettre avec profil:', completeUserProfile ? 'Oui' : 'Non');

      // Utiliser Groq pour générer la lettre
      const letter = await groqService.generateCoverLetter(
        jobDescription, 
        completeUserProfile, 
        aiInstructions
      );

      res.json({
        success: true,
        letter,
        profileUsed: completeUserProfile ? true : false
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

  // ⭐ RÉCUPÉRER L'HISTORIQUE DES ANALYSES AVEC STATS
  async getMyAnalyses(req, res) {
    try {
      const analyses = await JobAnalysis.find({ userId: req.user.id })
        .populate('jobPostingId', 'title companyName location')
        .sort({ createdAt: -1 })
        .select('analysis createdAt jobPostingId')
        .limit(20);

      res.json({
        success: true,
        count: analyses.length,
        analyses: analyses.map(analysis => ({
          id: analysis._id,
          title: analysis.analysis?.title || 'Analyse sans titre',
          company: analysis.analysis?.company || 'Entreprise inconnue',
          overallScore: analysis.analysis?.overallMatchScore || 0,
          skillsCount: analysis.analysis?.extractedSkills?.length || 0,
          matchingSkills: analysis.analysis?.extractedSkills?.filter(s => s.userHasSkill)?.length || 0,
          createdAt: analysis.createdAt,
          hasProfile: analysis.analysis?.userProfileUsed?.hasProfile || false,
          jobPosting: analysis.jobPostingId ? {
            id: analysis.jobPostingId._id,
            title: analysis.jobPostingId.title,
            company: analysis.jobPostingId.companyName
          } : null
        }))
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
      const analysis = await JobAnalysis.findOne({
        _id: req.params.id,
        userId: req.user.id
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
        overallScore: analysis.analysis?.overallMatchScore || 0
      };

      res.json({
        success: true,
        analysis: {
          id: analysis._id,
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
      const jobs = await JobPosting.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .select('title companyName location contractType status createdAt salaryRange')
        .limit(50);

      res.json({
        success: true,
        count: jobs.length,
        jobs: jobs.map(job => ({
          id: job._id,
          title: job.title,
          company: job.companyName,
          location: job.location,
          contractType: job.contractType,
          salaryRange: job.salaryRange,
          status: job.status,
          createdAt: job.createdAt
        }))
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

  // ✅ NOUVEAU : SAUVEGARDER UNE LETTRE DE MOTIVATION
  async saveCoverLetter(req, res) {
    try {
      const { letterText, jobTitle, companyName, jobDescription } = req.body;
      const userId = req.user.id;

      // Tu peux créer un modèle CoverLetter si tu veux
      // Pour l'instant, on peut utiliser JobAnalysis avec un type spécial
      
      const coverLetter = new JobAnalysis({
        userId,
        jobText: jobDescription || 'Lettre générée',
        analysis: {
          type: 'cover_letter',
          title: jobTitle || 'Lettre de motivation',
          company: companyName || 'Entreprise',
          letterContent: letterText,
          createdAt: new Date()
        }
      });

      await coverLetter.save();

      res.json({
        success: true,
        message: 'Lettre sauvegardée avec succès',
        letterId: coverLetter._id
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

  // ✅ NOUVEAU : RÉCUPÉRER MES LETTRES DE MOTIVATION
  async getMyCoverLetters(req, res) {
    try {
      const letters = await JobAnalysis.find({ 
        userId: req.user.id,
        'analysis.type': 'cover_letter'
      })
        .sort({ createdAt: -1 })
        .select('analysis.title analysis.company analysis.letterContent createdAt')
        .limit(20);

      res.json({
        success: true,
        count: letters.length,
        letters: letters.map(letter => ({
          id: letter._id,
          title: letter.analysis?.title || 'Lettre sans titre',
          company: letter.analysis?.company || 'Entreprise inconnue',
          content: letter.analysis?.letterContent?.substring(0, 200) + '...' || '',
          createdAt: letter.createdAt
        }))
      });

    } catch (error) {
      console.error('❌ Erreur récupération lettres:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des lettres',
        error: error.message
      });
    }
  }
};

module.exports = jobController;
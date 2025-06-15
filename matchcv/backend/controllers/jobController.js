const JobAnalysis = require('../models/JobAnalysis');
const groqService = require('../services/groqService');

const jobController = {
  // Analyser une annonce d'emploi
  async analyzeJob(req, res) {
    try {
      const { jobText } = req.body;

      if (!jobText || jobText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Le texte de l\'annonce est requis'
        });
      }

      // Utiliser Groq pour analyser l'annonce
      const analysis = await groqService.analyzeJob(jobText);

      // Sauvegarder l'analyse en base
      const jobAnalysis = new JobAnalysis({
        userId: req.user.id,
        jobText,
        analysis: {
          ...analysis,
          description: jobText.substring(0, 200) + '...',
          matchScore: Math.floor(Math.random() * 40) + 60 // Score simulé pour l'instant
        }
      });

      await jobAnalysis.save();

      res.json({
        success: true,
        message: 'Analyse terminée avec succès',
        analysis: jobAnalysis.analysis,
        analysisId: jobAnalysis._id
      });

    } catch (error) {
      console.error('Erreur analyse job:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'analyse de l\'annonce',
        error: error.message
      });
    }
  },

  // Générer une lettre de motivation
  async generateCoverLetter(req, res) {
    try {
      const { jobDescription, userProfile, aiInstructions } = req.body;

      if (!jobDescription || !userProfile) {
        return res.status(400).json({
          success: false,
          message: 'La description du poste et le profil utilisateur sont requis'
        });
      }

      // Utiliser Groq pour générer la lettre
      const letter = await groqService.generateCoverLetter(
        jobDescription, 
        userProfile, 
        aiInstructions
      );

      res.json({
        success: true,
        letter
      });

    } catch (error) {
      console.error('Erreur génération lettre:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération de la lettre',
        error: error.message
      });
    }
  },

  // Récupérer l'historique des analyses
  async getMyAnalyses(req, res) {
    try {
      const analyses = await JobAnalysis.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .select('analysis.title analysis.company analysis.matchScore createdAt')
        .limit(20);

      res.json({
        success: true,
        count: analyses.length,
        analyses
      });

    } catch (error) {
      console.error('Erreur récupération analyses:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des analyses',
        error: error.message
      });
    }
  },

  // Récupérer une analyse spécifique
  async getAnalysisById(req, res) {
    try {
      const analysis = await JobAnalysis.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analyse non trouvée'
        });
      }

      res.json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error('Erreur récupération analyse:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'analyse',
        error: error.message
      });
    }
  }
};

module.exports = jobController;
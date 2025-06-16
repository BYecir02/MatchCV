const express = require('express');
const jobController = require('../controllers/jobController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// ⭐ ROUTES PRINCIPALES (toutes protégées)
router.post('/analyze', authenticateToken, jobController.analyzeJob);
router.post('/save-job', authenticateToken, jobController.saveJobPosting);
router.get('/my-analyses', authenticateToken, jobController.getMyAnalyses);
router.get('/my-saved-jobs', authenticateToken, jobController.getMySavedJobs);
router.get('/analysis/:id', authenticateToken, jobController.getAnalysisById);

// ⭐ ROUTES POUR LES LETTRES DE MOTIVATION
router.post('/generate-cover-letter', authenticateToken, jobController.generateCoverLetter);

// Route publique pour la génération de lettre (compatibilité)
router.post('/generate-cover-letter-public', jobController.generateCoverLetter);

// ⭐ ROUTE DE TEST (à retirer en production)
router.get('/test-profile', authenticateToken, jobController.testProfileRetrieval);

module.exports = router;
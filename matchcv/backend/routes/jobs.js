const express = require('express');
const jobController = require('../controllers/jobController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Routes pour l'analyse d'emploi (toutes protégées)
router.post('/analyze', authenticateToken, jobController.analyzeJob);
router.post('/generate-cover-letter', authenticateToken, jobController.generateCoverLetter);
router.get('/my-analyses', authenticateToken, jobController.getMyAnalyses);
router.get('/analysis/:id', authenticateToken, jobController.getAnalysisById);

// Route publique pour la génération de lettre (compatibilité)
router.post('/generate-cover-letter-public', jobController.generateCoverLetter);

module.exports = router;
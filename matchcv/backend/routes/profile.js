const express = require('express');
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');
const { uploadCV, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Toutes les routes sont protégées par authentification
router.use(authenticateToken);

// Routes principales
router.get('/', profileController.getProfile);
router.put('/personal-info', profileController.updatePersonalInfo);

// Import et analyse de CV
router.post('/import-cv', profileController.importAndAnalyzeCV);

// ⭐ NOUVELLE ROUTE : Upload et analyse de fichier CV
router.post('/upload-cv', uploadCV, handleUploadError, profileController.uploadAndAnalyzeCV);

// Routes spécifiques pour les expériences (avec les méthodes dédiées)
router.post('/experience', profileController.addExperience);
router.put('/experience/:id', profileController.updateExperience);
router.delete('/experience/:id', profileController.deleteExperience);

// Routes génériques pour toutes les autres sections (education, skills, certifications, languages, projects, interests)
// Format attendu par le frontend: /api/profile/section/action/id
router.post('/:section/add', (req, res) => {
  req.params.action = 'add';
  profileController.updateSection(req, res);
});

router.put('/:section/update/:id', (req, res) => {
  req.params.action = 'update';
  profileController.updateSection(req, res);
});

router.delete('/:section/delete/:id', (req, res) => {
  req.params.action = 'delete';
  profileController.updateSection(req, res);
});

module.exports = router;
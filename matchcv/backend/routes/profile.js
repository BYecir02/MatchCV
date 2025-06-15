const express = require('express');
const profileController = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Toutes les routes sont protégées par authentification
router.use(authenticateToken);

// Routes principales
router.get('/', profileController.getProfile);
router.put('/personal-info', profileController.updatePersonalInfo);

// Import et analyse de CV
router.post('/import-cv', profileController.importAndAnalyzeCV);

// Routes spécifiques pour les expériences (avec les méthodes dédiées)
router.post('/experience', profileController.addExperience);
router.put('/experience/:id', profileController.updateExperience);
router.delete('/experience/:id', profileController.deleteExperience);

// Routes génériques pour toutes les autres sections (education, skills, certifications, languages, projects, interests)
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
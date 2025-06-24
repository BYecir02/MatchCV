const express = require('express');
const cvController = require('../controllers/cvController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Routes CV de base (toutes protégées)
router.post('/save', authenticateToken, cvController.saveCV);
router.get('/my-cvs', authenticateToken, cvController.getMyCVs);
router.get('/:id', authenticateToken, cvController.getCVById);
router.put('/:id', authenticateToken, cvController.updateCV);
router.delete('/:id', authenticateToken, cvController.deleteCV);

module.exports = router;
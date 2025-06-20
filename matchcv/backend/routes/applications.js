const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, applicationController.getMyApplications);
router.post('/', authenticateToken, applicationController.addApplication);
router.put('/:id', authenticateToken, applicationController.updateApplication);
router.delete('/:id', authenticateToken, applicationController.deleteApplication);
router.get('/count-pending', authenticateToken, applicationController.countPendingApplications);

module.exports = router;
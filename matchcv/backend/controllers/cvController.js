const CV = require('../models/CV');

const cvController = {
  // Sauvegarder un CV
  async saveCV(req, res) {
    try {
      const { templateId, title, cvData, optimizedFor } = req.body;

      const cv = new CV({
        userId: req.user.id,
        templateId: templateId || 'default',
        title: title || 'Mon CV',
        cvData,
        optimizedFor
      });

      await cv.save();

      res.json({
        success: true,
        message: 'CV sauvegardé avec succès',
        cv: cv
      });

    } catch (error) {
      console.error('Erreur sauvegarde CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde du CV',
        error: error.message
      });
    }
  },

  // Récupérer les CVs de l'utilisateur
  async getMyCVs(req, res) {
    try {
      const cvs = await CV.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .select('templateId title optimizedFor createdAt');

      res.json({
        success: true,
        count: cvs.length,
        cvs
      });

    } catch (error) {
      console.error('Erreur récupération CVs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des CVs',
        error: error.message
      });
    }
  },

  // Récupérer un CV par ID
  async getCVById(req, res) {
    try {
      const cv = await CV.findOne({ 
        _id: req.params.id, 
        userId: req.user.id 
      });

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        cv
      });

    } catch (error) {
      console.error('Erreur récupération CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du CV',
        error: error.message
      });
    }
  },

  // Mettre à jour un CV
  async updateCV(req, res) {
    try {
      const cv = await CV.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'CV mis à jour avec succès',
        cv
      });

    } catch (error) {
      console.error('Erreur mise à jour CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du CV',
        error: error.message
      });
    }
  },

  // Supprimer un CV
  async deleteCV(req, res) {
    try {
      const cv = await CV.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user.id 
      });

      if (!cv) {
        return res.status(404).json({
          success: false,
          message: 'CV non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'CV supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur suppression CV:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du CV',
        error: error.message
      });
    }
  }
};

module.exports = cvController;
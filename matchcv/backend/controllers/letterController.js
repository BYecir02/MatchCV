const CoverLetter = require('../models/CoverLetter');

const letterController = {
  
  // ⭐ SAUVEGARDER UNE LETTRE COMPLÈTE
  async saveCoverLetter(req, res) {
    try {
      const { 
        letterContent,
        originalContent,
        jobTitle, 
        companyName, 
        jobDescription,
        aiInstructions,    // ← Instructions utilisateur
        profileUsed,       // ← Profil utilisé
        tags,
        status = 'draft'
      } = req.body;
      
      const userId = req.user.id;
      
      const coverLetter = new CoverLetter({
        userId,
        jobTitle,
        companyName,
        jobDescription,
        letterContent,
        originalContent,
        aiInstructions,    // ← SAUVÉ !
        profileSnapshot: {
          skillsCount: profileUsed?.skills?.length || 0,
          experienceCount: profileUsed?.experience?.length || 0,
          hasProjects: (profileUsed?.projects?.length || 0) > 0,
          hasCertifications: (profileUsed?.certifications?.length || 0) > 0
        },
        status,
        tags: tags || [],
        wordCount: letterContent.split(/\s+/).length,
        characterCount: letterContent.length,
        isModified: letterContent !== originalContent
      });

      await coverLetter.save();

      res.json({
        success: true,
        message: 'Lettre sauvegardée avec succès',
        letterId: coverLetter._id,
        letter: coverLetter
      });

    } catch (error) {
      console.error('❌ Erreur sauvegarde lettre:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde',
        error: error.message
      });
    }
  },

  // ⭐ RÉCUPÉRER MES LETTRES
  async getMyLetters(req, res) {
    try {
      const { page = 1, limit = 10, status, company } = req.query;
      
      const query = { userId: req.user.id };
      if (status) query.status = status;
      if (company) query.companyName = new RegExp(company, 'i');
      
      const letters = await CoverLetter.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await CoverLetter.countDocuments(query);
      
      res.json({
        success: true,
        letters: letters.map(letter => ({
          id: letter._id,
          jobTitle: letter.jobTitle,
          companyName: letter.companyName,
          status: letter.status,
          wordCount: letter.wordCount,
          isModified: letter.isModified,
          createdAt: letter.createdAt,
          lastModified: letter.lastModified,
          preview: letter.letterContent.substring(0, 150) + '...'
        })),
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: letters.length,
          totalItems: total
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur récupération lettres:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération',
        error: error.message
      });
    }
  }
};

module.exports = letterController;
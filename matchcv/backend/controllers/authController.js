const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  // Inscription
  async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      // Créer nouvel utilisateur
      const user = new User({
        firstName,
        lastName,
        email,
        password
      });

      await user.save();

      // Créer JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        token,
        user: user.getPublicProfile()
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  // Connexion
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      // Créer JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        token,
        user: user.getPublicProfile()
      });

    } catch (error) {
      console.error('Erreur connexion:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  }
};

module.exports = authController;
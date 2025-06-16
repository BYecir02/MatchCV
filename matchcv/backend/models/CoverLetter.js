const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Informations sur l'offre
  jobTitle: String,
  companyName: String, 
  jobDescription: String,
  
  // Contenu de la lettre
  letterContent: {
    type: String,
    required: true
  },
  originalContent: String, // Version non éditée
  
  // Paramètres de génération
  aiInstructions: String,  // ← IMPORTANT : Instructions utilisateur
  profileSnapshot: {       // ← Profil utilisé pour générer
    skillsCount: Number,
    experienceCount: Number,
    hasProjects: Boolean,
    hasCertifications: Boolean
  },
  
  // Métadonnées
  generatedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  isModified: {
    type: Boolean,
    default: false
  },
  
  // Statut
  status: {
    type: String,
    enum: ['draft', 'final', 'sent'],
    default: 'draft'
  },
  
  // Tags pour organisation
  tags: [String],
  
  // Statistiques
  wordCount: Number,
  characterCount: Number
  
}, {
  timestamps: true
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
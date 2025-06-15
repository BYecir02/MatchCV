const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  position: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  startDate: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  achievements: [{
    type: String,
    trim: true
  }],
  technologiesUsed: [{
    type: String,
    trim: true
  }],
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
experienceSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
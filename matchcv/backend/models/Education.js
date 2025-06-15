const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institutionName: {
    type: String,
    required: false, // ⭐ Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  degreeType: {
    type: String,
    required: false, // ⭐ Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  fieldOfStudy: {
    type: String,
    required: false, // ⭐ Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  startDate: {
    type: String,
    default: ''
  },
  endDate: {
    type: String,
    default: ''
  },
  grade: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  honors: [{
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
educationSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Education', educationSchema);
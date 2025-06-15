const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  languageName: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  proficiencyLevel: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel
    enum: ['basic', 'conversational', 'fluent', 'native', 'professional'],
    default: 'basic'
  },
  certification: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

LanguageSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Language', LanguageSchema);
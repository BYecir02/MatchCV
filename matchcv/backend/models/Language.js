const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  languageName: {
    type: String,
    required: [true, 'Le nom de la langue est requis'],
    trim: true
  },
  proficiencyLevel: {
    type: String,
    required: [true, 'Le niveau est requis'],
    enum: ['basic', 'conversational', 'fluent', 'native'],
    default: 'basic'
  },
  certification: {
    type: String,
    trim: true
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
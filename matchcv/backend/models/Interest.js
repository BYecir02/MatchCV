const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interestName: {
    type: String,
    required: false, // ⭐ Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: false,
    trim: true,
    default: 'Loisirs',
    enum: [
      'Sport', 'Arts', 'Musique', 'Lecture', 'Cuisine', 'Voyage', 
      'Technologie', 'Jeux', 'Nature', 'Bénévolat', 'Culture', 
      'Loisirs', 'Collection', 'Artisanat', 'Autre'
    ]
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  level: {
    type: String,
    enum: ['Débutant', 'Amateur', 'Passionné', 'Expert', 'Professionnel'],
    default: 'Amateur'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

InterestSchema.index({ userId: 1, displayOrder: 1 });
InterestSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Interest', InterestSchema);
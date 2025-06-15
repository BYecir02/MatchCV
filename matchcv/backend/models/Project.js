const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  projectUrl: {
    type: String,
    trim: true,
    default: ''
  },
  repositoryUrl: {
    type: String,
    trim: true,
    default: ''
  },
  technologiesUsed: {
    type: [String],
    default: []
  },
  startDate: {
    type: String, // Format: "YYYY-MM"
    default: ''
  },
  endDate: {
    type: String, // Format: "YYYY-MM"
    default: ''
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  screenshots: {
    type: [String], // URLs des captures d'écran
    default: []
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ProjectSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
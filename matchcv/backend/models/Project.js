const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  projectUrl: {
    type: String,
    trim: true
  },
  repositoryUrl: {
    type: String,
    trim: true
  },
  technologiesUsed: [String],
  startDate: {
    type: String // Format: "YYYY-MM"
  },
  endDate: {
    type: String // Format: "YYYY-MM"
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  screenshots: [String], // URLs des captures d'écran
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

ProjectSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Project', ProjectSchema);
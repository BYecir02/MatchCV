const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  originalDescription: {
    type: String,
    required: true
  },
  cleanedDescription: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  contractType: {
    type: String,
    enum: ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance', 'Interim'],
    default: 'CDI'
  },
  experienceRequired: {
    type: String,
    trim: true
  },
  salaryRange: {
    type: String,
    trim: true
  },
  sourceUrl: {
    type: String,
    trim: true
  },
  sourcePlatform: {
    type: String,
    enum: ['LinkedIn', 'Indeed', 'Monster', 'Pole Emploi', 'Welcome to the Jungle', 'Autre'],
    default: 'Autre'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'applied', 'rejected'],
    default: 'active'
  },
  postedDate: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index pour les recherches
jobPostingSchema.index({ userId: 1, createdAt: -1 });
jobPostingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
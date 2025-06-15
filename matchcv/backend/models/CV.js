const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  templateId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  cvData: {
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      location: String,
      title: String,
      linkedin: String,
      github: String,
      portfolio: String
    },
    summary: String,
    experience: [{
      company: String,
      position: String,
      period: String,
      location: String,
      description: String,
      achievements: [String]
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      period: String,
      location: String,
      grade: String
    }],
    skills: [{
      name: String,
      level: String,
      category: String,
      highlighted: Boolean
    }],
    languages: [{
      name: String,
      level: String
    }],
    projects: [{
      name: String,
      description: String,
      url: String,
      technologies: [String],
      period: String
    }]
  },
  optimizedFor: {
    company: String,
    position: String,
    keywords: [String],
    jobAnalysisId: mongoose.Schema.Types.ObjectId
  },
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CV', CVSchema);
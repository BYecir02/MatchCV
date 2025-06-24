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
      website: String
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
      period: String,
      location: String,
      grade: String
    }],
    skills: [{
      name: String,
      level: String
    }],
    languages: [{
      name: String,
      level: String
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: String
    }],
    projects: [{
      name: String,
      description: String,
      url: String,
      technologies: [String]
    }]
  },
  optimizedFor: {
    company: String,
    position: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CV', CVSchema);
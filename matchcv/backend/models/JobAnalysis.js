const mongoose = require('mongoose');

const JobAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobText: {
    type: String,
    required: true
  },
  analysis: {
    title: String,
    company: String,
    skills: [{
      name: String,
      level: String,
      match: Boolean,
      userHas: Boolean
    }],
    experience: String,
    location: String,
    contract: String,
    salary: String,
    description: String,
    matchScore: Number
  },
  profileMatch: {
    overallScore: Number,
    essentialScore: Number,
    canApply: Boolean,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobAnalysis', JobAnalysisSchema);
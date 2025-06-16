const mongoose = require('mongoose');

const jobAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobPostingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: false // Optionnel si analyse directe sans sauvegarde annonce
  },
  jobText: {
    type: String,
    required: true
  },
  analysis: {
    title: String,
    company: String,
    location: String,
    contractType: String,
    experienceRequired: String,
    salaryRange: String,
    
    // Compétences extraites
    extractedSkills: [{
      skillName: String,
      category: String,
      importanceLevel: {
        type: String,
        enum: ['essential', 'desired', 'nice_to_have'],
        default: 'desired'
      },
      yearsRequired: Number,
      userHasSkill: Boolean,
      userProficiencyLevel: Number
    }],
    
    // Scores de correspondance
    overallMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    essentialSkillsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    
    // Analyse détaillée
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    canApply: {
      type: Boolean,
      default: true
    },
    analysisSummary: String,
    
    // Métadonnées
    description: String,
    matchScore: Number // Pour compatibilité
  },
  
  analysisStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  
  analyzedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les recherches
jobAnalysisSchema.index({ userId: 1, createdAt: -1 });
jobAnalysisSchema.index({ userId: 1, 'analysis.overallMatchScore': -1 });

module.exports = mongoose.model('JobAnalysis', jobAnalysisSchema);
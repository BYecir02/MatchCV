const Groq = require('groq-sdk');
const cvAnalyzer = require('./cv/cvAnalyzer');
const jobAnalyzer = require('./job/jobAnalyzer');
const letterGenerator = require('./letter/letterGenerator');

// ⭐ VÉRIFIER : Initialisation du client Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const groqService = {
  // Déléguer à des modules spécialisés
  async analyzeCVAndExtractProfile(cvText) {
    return cvAnalyzer.analyzeCVAndExtractProfile(cvText, groq);
  },

  async analyzeJob(jobText, userProfile = null) {
    return jobAnalyzer.analyzeJob(jobText, userProfile, groq);
  },

  async generateCoverLetter(jobDescription, userProfile, aiInstructions = '') {
    return letterGenerator.generateCoverLetter(jobDescription, userProfile, aiInstructions, groq);
  }
};

module.exports = groqService;
const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: false, // ⭐ Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: false,
    trim: true,
    default: 'Technique',
    enum: ['Technique', 'Programmation', 'Framework/Librairie', 'Base de données', 
           'DevOps/Cloud', 'Design/UX', 'Gestion de projet', 'Marketing', 
           'Communication', 'Langues', 'Soft Skills', 'Autre']
  },
  proficiencyLevel: {
    type: String,
    required: false,
    default: 'intermediate',
    enum: ['beginner', 'intermediate', 'advanced', 'expert', 'master']
  },
  yearsExperience: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
userSkillSchema.index({ userId: 1, displayOrder: 1 });
userSkillSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('UserSkill', userSkillSchema);
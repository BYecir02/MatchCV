const mongoose = require('mongoose');

const UserSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Le nom de la compétence est requis'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: ['Technique', 'Soft Skills', 'Langages', 'Outils'],
    default: 'Technique'
  },
  proficiencyLevel: {
    type: String,
    required: [true, 'Le niveau est requis'],
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  yearsExperience: {
    type: Number,
    min: 0,
    max: 50,
    default: 1
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

UserSkillSchema.index({ userId: 1, displayOrder: 1 });
UserSkillSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('UserSkill', UserSkillSchema);
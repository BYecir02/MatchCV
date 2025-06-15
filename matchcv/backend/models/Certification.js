const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificationName: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  issuingOrganization: {
    type: String,
    required: false, // ⭐ CHANGÉ : Optionnel pour permettre création vide
    trim: true,
    default: ''
  },
  credentialId: {
    type: String,
    trim: true,
    default: ''
  },
  issueDate: {
    type: String, // ⭐ CHANGÉ : String pour cohérence avec les autres modèles
    default: ''
  },
  expirationDate: {
    type: String, // ⭐ CHANGÉ : String pour cohérence
    default: ''
  },
  credentialUrl: {
    type: String,
    trim: true,
    default: ''
  },
  neverExpires: {
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

CertificationSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Certification', CertificationSchema);
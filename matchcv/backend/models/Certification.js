const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificationName: {
    type: String,
    required: [true, 'Le nom de la certification est requis'],
    trim: true
  },
  issuingOrganization: {
    type: String,
    required: [true, 'L\'organisme émetteur est requis'],
    trim: true
  },
  credentialId: {
    type: String,
    trim: true
  },
  issueDate: {
    type: Date,
    required: [true, 'La date d\'obtention est requise']
  },
  expirationDate: {
    type: Date
  },
  credentialUrl: {
    type: String,
    trim: true
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
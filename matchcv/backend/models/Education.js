const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institutionName: {
    type: String,
    required: [true, 'Le nom de l\'institution est requis'],
    trim: true
  },
  degreeType: {
    type: String,
    required: [true, 'Le type de diplôme est requis'],
    trim: true
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Le domaine d\'étude est requis'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: String, // Format: "YYYY-MM"
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: String // Format: "YYYY-MM"
  },
  grade: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  honors: [String],
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

EducationSchema.index({ userId: 1, displayOrder: 1 });

module.exports = mongoose.model('Education', EducationSchema);
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: String,
  salary: String,
  notes: String,
  status: { type: String, enum: ['pending', 'in_progress', 'accepted', 'rejected'], default: 'pending' },
  appliedDate: Date,
  lastUpdate: Date
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
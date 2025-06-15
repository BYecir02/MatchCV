const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6
  },
  phone: String,
  profilePictureUrl: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  
  // Profil utilisateur intégré
  profile: {
    title: String,
    summary: String,
    location: String,
    city: String,
    country: String,
    industry: String,
    yearsExperience: Number,
    currentPosition: String,
    desiredPosition: String,
    availability: String,
    desiredSalaryMin: String,
    desiredSalaryMax: String,
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String
  },
  
  // Paramètres utilisateur
  settings: {
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacySettings: {
      profilePublic: { type: Boolean, default: false },
      allowRecruiterContact: { type: Boolean, default: true },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    },
    preferredLanguage: { type: String, default: 'fr' },
    timezone: { type: String, default: 'Europe/Paris' }
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password avant sauvegarde
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthodes
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    profilePictureUrl: this.profilePictureUrl,
    profile: this.profile,
    settings: this.settings,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
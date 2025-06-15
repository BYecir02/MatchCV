const User = require('../models/User');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const UserSkill = require('../models/UserSkill');
const Certification = require('../models/Certification');
const Language = require('../models/Language');
const Project = require('../models/Project');
const Interest = require('../models/Interest'); // ⭐ AJOUTER cette ligne

const profileController = {
  // Récupérer le profil complet
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      // ⭐ AJOUTER interests dans Promise.all
      const [user, experiences, education, skills, certifications, languages, projects, interests] = await Promise.all([
        User.findById(userId).select('-password'),
        Experience.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        Education.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        UserSkill.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        Certification.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        Language.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        Project.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }),
        Interest.find({ userId }).sort({ displayOrder: 1, createdAt: -1 }) // ⭐ AJOUTER cette ligne
      ]);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Structurer les données comme attendu par le frontend
      const profileData = {
        personalInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
          profilePictureUrl: user.profilePictureUrl,
          ...user.profile
        },
        experience: experiences.map(exp => ({
          id: exp._id.toString(),
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          location: exp.location,
          description: exp.description,
          achievements: exp.achievements,
          technologiesUsed: exp.technologiesUsed,
          displayOrder: exp.displayOrder
        })),
        education: education.map(edu => ({
          id: edu._id.toString(),
          institutionName: edu.institutionName,
          degreeType: edu.degreeType,
          fieldOfStudy: edu.fieldOfStudy,
          location: edu.location,
          startDate: edu.startDate,
          endDate: edu.endDate,
          grade: edu.grade,
          description: edu.description,
          honors: edu.honors,
          displayOrder: edu.displayOrder
        })),
        skills: skills.map(skill => ({
          id: skill._id.toString(),
          skillName: skill.skillName,
          category: skill.category,
          proficiencyLevel: skill.proficiencyLevel,
          yearsExperience: skill.yearsExperience,
          isPrimary: skill.isPrimary,
          displayOrder: skill.displayOrder
        })),
        certifications: certifications.map(cert => ({
          id: cert._id.toString(),
          certificationName: cert.certificationName,
          issuingOrganization: cert.issuingOrganization,
          credentialId: cert.credentialId,
          issueDate: cert.issueDate,
          expirationDate: cert.expirationDate,
          credentialUrl: cert.credentialUrl,
          neverExpires: cert.neverExpires,
          displayOrder: cert.displayOrder
        })),
        languages: languages.map(lang => ({
          id: lang._id.toString(),
          languageName: lang.languageName,
          proficiencyLevel: lang.proficiencyLevel,
          certification: lang.certification,
          description: lang.description, // ⭐ AJOUTER si manquant
          displayOrder: lang.displayOrder
        })),
        projects: projects.map(proj => ({
          id: proj._id.toString(),
          projectName: proj.projectName,
          description: proj.description,
          projectUrl: proj.projectUrl,
          repositoryUrl: proj.repositoryUrl,
          technologiesUsed: proj.technologiesUsed,
          startDate: proj.startDate,
          endDate: proj.endDate,
          isOngoing: proj.isOngoing,
          screenshots: proj.screenshots,
          displayOrder: proj.displayOrder
        })),
        // ⭐ AJOUTER la section interests
        interests: interests.map(interest => ({
          id: interest._id.toString(),
          interestName: interest.interestName,
          category: interest.category,
          description: interest.description,
          level: interest.level,
          isActive: interest.isActive,
          displayOrder: interest.displayOrder
        })),
        settings: user.settings
      };

      res.json({
        success: true,
        profileData
      });

    } catch (error) {
      console.error('Erreur récupération profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error.message
      });
    }
  },

  // Mettre à jour les informations personnelles
  async updatePersonalInfo(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      // Séparer les champs utilisateur des champs profil
      const userFields = ['firstName', 'lastName', 'email', 'phone'];
      const profileFields = ['title', 'summary', 'location', 'city', 'country', 'industry', 
                           'yearsExperience', 'currentPosition', 'desiredPosition', 'availability',
                           'desiredSalaryMin', 'desiredSalaryMax', 'linkedinUrl', 'githubUrl', 'portfolioUrl'];

      const userUpdate = {};
      const profileUpdate = {};

      // Répartir les champs
      Object.keys(updateData).forEach(key => {
        if (userFields.includes(key)) {
          userUpdate[key] = updateData[key];
        } else if (profileFields.includes(key)) {
          profileUpdate[`profile.${key}`] = updateData[key];
        }
      });

      // Combiner les mises à jour
      const finalUpdate = { ...userUpdate, ...profileUpdate };

      const user = await User.findByIdAndUpdate(
        userId,
        finalUpdate,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Informations personnelles mises à jour avec succès',
        personalInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          ...user.profile
        }
      });

    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil',
        error: error.message
      });
    }
  },

  // Ajouter une expérience (méthode dédiée)
  async addExperience(req, res) {
    try {
      const userId = req.user.id;
      const experienceData = { ...req.body, userId };

      const experience = await Experience.create(experienceData);

      res.status(201).json({
        success: true,
        message: 'Expérience ajoutée avec succès',
        data: {
          id: experience._id.toString(),
          ...experience.toObject()
        }
      });
    } catch (error) {
      console.error('Erreur ajout expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout de l\'expérience',
        error: error.message
      });
    }
  },

  async updateExperience(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const experience = await Experience.findOneAndUpdate(
        { _id: id, userId },
        req.body,
        { new: true, runValidators: true }
      );

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Expérience non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Expérience mise à jour avec succès',
        data: {
          id: experience._id.toString(),
          ...experience.toObject()
        }
      });
    } catch (error) {
      console.error('Erreur mise à jour expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'expérience',
        error: error.message
      });
    }
  },

  async deleteExperience(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const experience = await Experience.findOneAndDelete({ _id: id, userId });

      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Expérience non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Expérience supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression expérience:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'expérience',
        error: error.message
      });
    }
  },

  // Méthode générique pour gérer toutes les sections
  async updateSection(req, res) {
    try {
      const { section, action, id } = req.params;
      const userId = req.user.id;
      const data = req.body;

      // ⭐ AJOUTER interests dans le mapping
      const modelMap = {
        'experience': Experience,
        'education': Education,
        'skills': UserSkill,
        'certifications': Certification,
        'languages': Language,
        'projects': Project,
        'interests': Interest // ⭐ AJOUTER cette ligne
      };

      const Model = modelMap[section];
      if (!Model) {
        return res.status(400).json({
          success: false,
          message: 'Section invalide'
        });
      }

      let result;
      
      switch (action) {
        case 'add':
          result = await Model.create({ ...data, userId });
          if (result) {
            result = result.toObject();
            result.id = result._id.toString();
          }
          break;
        case 'update':
          result = await Model.findOneAndUpdate(
            { _id: id, userId },
            data,
            { new: true, runValidators: true }
          );
          if (result) {
            result = result.toObject();
            result.id = result._id.toString();
          }
          break;
        case 'delete':
          result = await Model.findOneAndDelete({ _id: id, userId });
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Action invalide'
          });
      }

      if (!result && (action === 'update' || action === 'delete')) {
        return res.status(404).json({
          success: false,
          message: 'Élément non trouvé'
        });
      }

      res.json({
        success: true,
        message: `${section} ${action === 'add' ? 'ajouté' : action === 'update' ? 'mis à jour' : 'supprimé'} avec succès`,
        data: result
      });

    } catch (error) {
      console.error(`Erreur ${req.params.action} ${req.params.section}:`, error);
      res.status(500).json({
        success: false,
        message: `Erreur lors de l'opération sur ${req.params.section}`,
        error: error.message
      });
    }
  }
};

module.exports = profileController;
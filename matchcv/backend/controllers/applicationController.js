const Application = require('../models/Application');

const applicationController = {
  async getMyApplications(req, res) {
    try {
      const userId = req.user.id;
      const applications = await Application.find({ userId }).sort({ createdAt: -1 });
      res.json({ success: true, applications });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async addApplication(req, res) {
    try {
      const userId = req.user.id;
      const data = { ...req.body, userId };
      const application = await Application.create(data);
      res.json({ success: true, application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateApplication(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const application = await Application.findOneAndUpdate(
        { _id: id, userId },
        req.body,
        { new: true }
      );
      res.json({ success: true, application });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async deleteApplication(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await Application.findOneAndDelete({ _id: id, userId });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async countPendingApplications(req, res) {
    try {
      const userId = req.user.id;
      const total = await Application.countDocuments({
        userId,
        status: { $in: ['pending', 'en cours'] }
      });
      res.json({ success: true, total });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = applicationController;
import BaseApiService from './base.js';

class ApplicationsService extends BaseApiService {
  async getMyApplications() {
    return this.request('/applications');
  }
  async addApplication(data) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  async updateApplication(id, data) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  async deleteApplication(id) {
    return this.request(`/applications/${id}`, {
      method: 'DELETE'
    });
  }
}

export default new ApplicationsService();
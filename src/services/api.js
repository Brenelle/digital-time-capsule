const API_BASE_URL = import.meta.env.VITE_API_URL;


class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Capsule endpoints
  async createCapsule(capsuleData) {
    return this.request('/capsules', {
      method: 'POST',
      body: JSON.stringify(capsuleData),
    });
  }

  async getCapsule(id) {
    return this.request(`/capsules/${id}`);
  }

  async getUserCapsules(userId = 'default-user') {
    return this.request(`/capsules/user/${userId}`);
  }

  async getSharedCapsule(slug) {
    return this.request(`/capsules/shared/${slug}`);
  }

  async deleteCapsule(id) {
    return this.request(`/capsules/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
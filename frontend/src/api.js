const API_BASE = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.replace(/\/+$/, '') + '/api')
  : '/api';

const getHeaders = () => {
  const token = localStorage.getItem('agriconnect_token');
  const user = JSON.parse(localStorage.getItem('agriconnect_user') || '{}');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (user && user._id) {
    headers['x-demo-user-id'] = user._id;
  }
  if (user && user.role) {
    headers['x-demo-role'] = user.role;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  async getDemoProfiles() {
    const res = await fetch(`${API_BASE}/auth/demo-profiles`);
    return res.json();
  },

  async seedDemoData() {
    const res = await fetch(`${API_BASE}/seed`);
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update profile');
    }
    return res.json();
  },

  // Products
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
    return res.json();
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async getFarmerProducts() {
    const res = await fetch(`${API_BASE}/products/farmer/my-products`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to place order');
    }
    return res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateOrderStatus(id, status, rejectionReason) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, rejectionReason })
    });
    return res.json();
  },

  async submitOrderReview(id, reviewData) {
    const res = await fetch(`${API_BASE}/orders/${id}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  async getOrderDetails(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Negotiations
  async createNegotiation(data) {
    const res = await fetch(`${API_BASE}/negotiations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to send negotiation offer');
    return res.json();
  },

  async getMyNegotiations() {
    const res = await fetch(`${API_BASE}/negotiations/my-negotiations`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async respondNegotiation(id, responseData) {
    const res = await fetch(`${API_BASE}/negotiations/${id}/respond`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(responseData)
    });
    return res.json();
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getPendingVerifications() {
    const res = await fetch(`${API_BASE}/admin/pending-verifications`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async verifyUser(id, action) {
    const res = await fetch(`${API_BASE}/admin/verify-user/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  async getAllAdminOrders() {
    const res = await fetch(`${API_BASE}/admin/all-orders`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async getAllAdminProducts() {
    const res = await fetch(`${API_BASE}/admin/all-products`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async moderateProduct(id, action) {
    const res = await fetch(`${API_BASE}/admin/moderate-product/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ action })
    });
    return res.json();
  },

  // ML
  async getPriceTrends(params = {}) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/ml/price-trends?${searchParams.toString()}`);
    return res.json();
  },

  async getDemandPrediction(params = {}) {
    const searchParams = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/ml/demand-prediction?${searchParams.toString()}`);
    return res.json();
  },

  async getCropRecommendations(params) {
    const res = await fetch(`${API_BASE}/ml/crop-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  }
};

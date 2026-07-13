import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    // Check if unauthorized (token expired) and not retrying already
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // We could trigger a logout or token refresh here
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authAPI = {
  login: async (identifier, password) => {
    const response = await apiClient.post('/auth/login', { identifier, password });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error('Logout request failed on server', e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }
  },
};

export const pharmacyAPI = {
  getMedicines: () => apiClient.get('/pharmacy/medicines'),
  getCart: () => apiClient.get('/pharmacy/cart'),
  getStores: () => apiClient.get('/pharmacy/stores'),
  getAddresses: () => apiClient.get('/pharmacy/addresses'),
  addToCart: (medicineId, quantity = 1) => 
    apiClient.post('/pharmacy/cart/items', { medicineId, quantity }),
  updateCartItem: (medicineId, quantity) => 
    apiClient.patch(`/pharmacy/cart/items/${medicineId}`, { quantity }),
  uploadPrescription: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/pharmacy/prescriptions/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  checkout: (orderData) => apiClient.post('/pharmacy/orders/checkout', orderData),
};

export const doctorAPI = {
  getDoctors: () => apiClient.get('/telemedicine/doctors'),
  bookAppointment: (doctorId, timeSlotId) => 
    apiClient.post('/telemedicine/appointments', { doctorId, timeSlotId }),
  getAppointments: () => apiClient.get('/telemedicine/appointments'),
};

export const aiAPI = {
  chat: (message, contextType = 'GENERAL_TRIAGE') => 
    apiClient.post('/ai/chat', { message, contextType }),
  symptomTriage: (symptoms) => 
    apiClient.post('/ai/symptom-triage', { symptoms }),
  checkInteractions: (medicineIds) => 
    apiClient.post('/ai/drug-interactions', { medicineIds }),
};

export const adminAPI = {
  getOrders: () => apiClient.get('/admin/orders'),
  updateOrderStatus: (orderId, status) => 
    apiClient.patch(`/admin/orders/${orderId}/status`, { status }),
  onboardDoctor: (doctorData) => apiClient.post('/admin/doctors', doctorData),
  addMedicine: (medicineData) => apiClient.post('/admin/medicines', medicineData),
  getSafetyLogs: () => apiClient.get('/admin/safety-logs'),
};

export default apiClient;

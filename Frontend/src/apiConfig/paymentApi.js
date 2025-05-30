import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/payments/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);

// Payment API endpoints
const paymentApi = {
    createPayment: async (data) => {
        try {
            const response = await api.post('create/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create payment' };
        }
    },

    executePayment: async (data) => {
        try {
            const response = await api.post('execute/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to execute payment' };
        }
    }
};

export default paymentApi; 
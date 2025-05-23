import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // Increased timeout to 10 seconds
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(new Error('Failed to make request'))
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Network or connection error
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject(new Error('Connection failed - please check if the server is running'));
        }

        // Handle specific status codes
        switch (error.response.status) {
            case 401:
                localStorage.clear();
                window.location.href = '/admin-login';
                return Promise.reject(new Error('Session expired - please login again'));
            case 403:
                return Promise.reject(new Error('Access denied - insufficient permissions'));
            case 404:
                return Promise.reject(new Error('Resource not found'));
            case 500:
                return Promise.reject(new Error('Server error - please try again later'));
            default:
                return Promise.reject(error.response.data?.message || 'An unexpected error occurred');
        }
    }
);

export default axiosInstance;
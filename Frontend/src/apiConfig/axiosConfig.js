import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

axiosInstance.interceptors.request.use(
    config => {
        if (!config.url.includes('/login/google/') && !config.url.includes('/login/')) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => Promise.reject(new Error('Failed to make request'))
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
          
            return Promise.reject(new Error('Connection failed - please check if the server is running'));
        }

        const errorData = error.response.data;
        let message = errorData?.message || errorData?.error || errorData?.detail || 'An unexpected error occurred';

        switch (error.response.status) {
            case 400:
                console.error('Bad Request Error:', errorData);
                if (error.config.url?.includes('google')) {
                    message = errorData.error || 'Google login failed. Please try again.';
                } else {
                    message = errorData.message || 'Invalid request. Please check your input.';
                }
                break;
            case 401:
                localStorage.clear();
                window.location.href = '/admin-login';
                message = 'Session expired - please login again';
                break;
            case 403:
                message = 'Access denied - insufficient permissions';
                break;
            case 404:
                message = 'Resource not found';
                break;
            case 500:
                message = 'Server error - please try again later';
                break;
        }

        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
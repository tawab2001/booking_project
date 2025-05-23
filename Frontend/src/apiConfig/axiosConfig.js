// import axios from 'axios';

// const axiosInstance = axios.create();

// axiosInstance.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             // Update the format to match Django's JWT expectation
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         config.headers['Content-Type'] = 'application/json';
//         return config;
//     },
//     error => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response?.status === 403 || error.response?.status === 401) {
//             localStorage.clear();
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 5000 // 5 seconds timeout
});


axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    localStorage.clear();
                    window.location.href = '/admin-login';
                    return Promise.reject(new Error('Session expired. Please login again.'));
                case 403:
                    return Promise.reject(new Error('You are not authorized to perform this action.'));
                case 404:
                    return Promise.reject(new Error('The requested resource was not found.'));
                case 500:
                    return Promise.reject(new Error('Internal server error. Please try again later.'));
                default:
                    return Promise.reject(error.response.data);
            }
        } else if (error.request) {
            // Request was made but no response
            return Promise.reject(new Error('No response from server. Please check your connection.'));
        } else {
            // Error in request configuration
            return Promise.reject(new Error('Error in making the request.'));
        }
    }
);

export default axiosInstance;
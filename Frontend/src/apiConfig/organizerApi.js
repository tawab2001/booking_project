import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Handle FormData vs JSON
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        
        // Log outgoing requests in development
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        
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
        // Log successful responses in development
        console.log(`[API Response] ${response.status}`, response.data);
        return response.data;
    },
    error => {
        // Log errors in development
        console.error('[API Error]', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(new Error('Session expired. Please login again.'));
        }
        
        if (error.response?.status === 403) {
            if (error.response.data?.message === 'User is not an organizer') {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(new Error('User is not an organizer'));
            }
            return Promise.reject(new Error('You do not have permission to access this resource'));
        }

        if (error.response?.status === 404) {
            return Promise.reject(new Error('The requested resource was not found'));
        }

        return Promise.reject(new Error(error.response?.data?.message || error.message || 'An error occurred'));
    }
);

// Organizer API endpoints
const organizerApi = {
    // Get all events for the logged-in organizer
    getOrganizerEvents: async () => {
        try {
            return await api.get('organizer/events/');
        } catch (error) {
            console.error('Get organizer events error:', error);
            throw error;
        }
    },

    // Get specific event details
    getOrganizerEvent: async (eventId) => {
        try {
            return await api.get(`organizer/events/${eventId}/`);
        } catch (error) {
            console.error('Get organizer event error:', error);
            throw error;
        }
    },

    // Create a new event
    createEvent: async (formData) => {
        try {
            const data = formData instanceof FormData ? formData : new FormData();
            
            if (!(formData instanceof FormData)) {
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object') {
                            data.append(key, JSON.stringify(value));
                        } else {
                            data.append(key, value);
                        }
                    }
                });
            }

            return await api.post('organizer/events/', data);
        } catch (error) {
            console.error('Create event error:', error);
            throw error;
        }
    },

    // Update an existing event
    updateEvent: async (eventId, formData) => {
        try {
            const data = formData instanceof FormData ? formData : new FormData();
            
            if (!(formData instanceof FormData)) {
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object') {
                            data.append(key, JSON.stringify(value));
                        } else {
                            data.append(key, value);
                        }
                    }
                });
            }

            return await api.put(`organizer/events/${eventId}/`, data);
        } catch (error) {
            console.error('Update event error:', error);
            throw error;
        }
    },

    // Delete an event
    deleteEvent: async (eventId) => {
        try {
            return await api.delete(`organizer/events/${eventId}/`);
        } catch (error) {
            console.error('Delete event error:', error);
            throw error;
        }
    },

    // Get organizer dashboard statistics
    getDashboardStats: async () => {
        try {
            console.log('Fetching dashboard stats...'); // Debug log
            const response = await api.get('organizer/stats/');
            console.log('Dashboard stats response:', response); // Debug log
            return response;
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    }
};

export default organizerApi; 
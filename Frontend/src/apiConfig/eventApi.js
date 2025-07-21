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
        console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data);
        
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
        return response;
    },
    error => {
        // Handle authentication errors
        if (error.response?.status === 403 || error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }

        // Log errors in development
        console.error('[API Error]', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        return Promise.reject(error.response?.data || error);
    }
);

// Event API endpoints
const eventApi = {
    createEvent: async (formData) => {
        try {
            // Ensure we're working with FormData
            const data = formData instanceof FormData ? formData : new FormData();
            
            // If plain object, convert to FormData
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

            const response = await api.post('events/create/', formData);
            return response.data;
        } catch (error) {
            console.error('Create event error:', error);
            throw error.response?.data || { message: 'Failed to create event' };
        }
    },

    getAllEvents: async (params = {}) => {
        try {
            // Convert params object to URLSearchParams
            const queryString = Object.keys(params)
                .filter(key => params[key] !== undefined && params[key] !== '')
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');

            const url = `events/${queryString ? `?${queryString}` : ''}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error('Get events error:', error);
            throw error.response?.data || { message: 'Failed to fetch events' };
        }
    },

    getEventById: async (id) => {
        try {
            const response = await api.get(`events/${id}/`);
            return response.data;
        } catch (error) {
            console.error('Get event error:', error);
            throw error.response?.data || { message: 'Failed to fetch event' };
        }
    },

    updateEvent: async (id, formData) => {
        try {
            // Ensure we're working with FormData for file uploads
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

            const response = await api.put(`events/${id}/update/`, data);
            return response.data;
        } catch (error) {
            console.error('Update event error:', error);
            throw error.response?.data || { message: 'Failed to update event' };
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`events/${id}/delete/`);
            return response.data;
        } catch (error) {
            console.error('Delete event error:', error);
            throw error.response?.data || { message: 'Failed to delete event' };
        }
    }
};

export default eventApi;
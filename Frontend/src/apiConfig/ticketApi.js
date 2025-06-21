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

// Ticket API endpoints
const ticketApi = {
    getTicketTypes: async (eventId) => {
        try {
            const response = await api.get(`tickets/types/?event=${eventId}`);
            return response.data;
        } catch (error) {
            console.error('Get ticket types error:', error);
            throw error;
        }
    },

    createTicketType: async (ticketTypeData) => {
        try {
            const response = await api.post('tickets/types/', ticketTypeData);
            return response.data;
        } catch (error) {
            console.error('Create ticket type error:', error);
            throw error;
        }
    },

    bookTickets: async (bookingData) => {
        try {
            console.log('Booking data:', bookingData);
            const response = await api.post('tickets/book-tickets/', bookingData);
            return response.data;
        } catch (error) {
            console.error('Book tickets error:', error);
            throw error;
        }
    },

    printTicket: async (ticketId) => {
        try {
            const response = await api.get(`tickets/${ticketId}/print-ticket/`);
            return response.data;
        } catch (error) {
            console.error('Print ticket error:', error);
            throw error;
        }
    }
};

export default ticketApi; 
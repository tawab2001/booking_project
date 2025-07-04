export const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const ENDPOINTS = {
  USER_SIGNUP: `${API_BASE_URL}signup/user/`,
  ORGANIZER_SIGNUP: `${API_BASE_URL}signup/organizer/`,
   USER_SIGNUP_GOOGLE: `${API_BASE_URL}signup/user/google/`,
  ORGANIZER_SIGNUP_GOOGLE: `${API_BASE_URL}signup/organizer/google/`,
  LOGIN: `${API_BASE_URL}login/`,
  GOOGLE_LOGIN: `${API_BASE_URL}login/google/`,
  PROFILE: `${API_BASE_URL}profile/`,
  UPLOAD_AVATAR: `${API_BASE_URL}profile/avatar/`,
  REQUEST_RESET_PASSWORD: `${API_BASE_URL}password_reset/`,
  RESET_PASSWORD: `${API_BASE_URL}password_reset_confirm/`,
  ADMIN_STATS: `${API_BASE_URL}admin/stats/`,
  ADMIN_USERS: `${API_BASE_URL}admin/users/`,
  ADMIN_EVENTS: `${API_BASE_URL}admin/events/`,
  // ADMIN_SETTINGS: `${API_BASE_URL}admin/settings/`,
  ADMIN_LOGIN: `${API_BASE_URL}admin/login/`,
  // Organizer Dashboard Endpoints
  ORGANIZER_EVENTS: `${API_BASE_URL}organizer/events/`,
  ORGANIZER_STATS: `${API_BASE_URL}organizer/stats/`,
  ORGANIZER_EVENT_DETAIL: (eventId) => `${API_BASE_URL}organizer/events/${eventId}/`,
  ORGANIZER_EVENT_CREATE: `${API_BASE_URL}organizer/events/create/`,
};


// export const ENDPOINTS = {
//     LOGIN: '/api/login/',
//     GOOGLE_LOGIN: '/api/login/google/',
//     USER_SIGNUP: '/api/signup/user/',
//     USER_SIGNUP_GOOGLE: '/api/signup/user/google/',
//     ORGANIZER_SIGNUP: '/api/signup/organizer/',
//     ORGANIZER_SIGNUP_GOOGLE: '/api/signup/organizer/google/',
//     PROFILE: '/api/profile/',
//     REQUEST_PASSWORD_RESET: '/api/password-reset/request/',
//     PASSWORD_RESET_CONFIRM: '/api/password-reset/confirm/',
// };
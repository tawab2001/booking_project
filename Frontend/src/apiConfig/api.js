

export const API_BASE_URL = "http://127.0.0.1:8000/api/";

export const ENDPOINTS = {
  USER_SIGNUP: `${API_BASE_URL}signup/user/`,
  ORGANIZER_SIGNUP: `${API_BASE_URL}signup/organizer/`,
    USER_SIGNUP_GOOGLE: `${API_BASE_URL}signup/user/google/`,
  ORGANIZER_SIGNUP_GOOGLE: `${API_BASE_URL}signup/organizer/google/`,
  LOGIN: `${API_BASE_URL}login/`,
  GOOGLE_LOGIN: `${API_BASE_URL}login/google/`,
  PROFILE: `${API_BASE_URL}profile/`,
  REQUEST_RESET_PASSWORD: `${API_BASE_URL}password_reset/`,
  RESET_PASSWORD: `${API_BASE_URL}password_reset_confirm/`  
};
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  SHORTEN: `${API_BASE_URL}/api/links`,
  GET_URL: (shortCode) => `${API_BASE_URL}/api/urls/${shortCode}`,
  GET_STATS: (shortCode) => `${API_BASE_URL}/api/urls/${shortCode}/stats`,
  DELETE_LINK: (shortCode) => `${API_BASE_URL}/api/links/${shortCode}`,
  HEALTH: `${API_BASE_URL}/api/health`
};

export default API_ENDPOINTS;

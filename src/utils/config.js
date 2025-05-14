export const API_BASE_URL = "http://localhost:8080";
export const API_BASE_AUTH_URL = `${API_BASE_URL}/auth`;

export const API_ENDPOINTS = {
  register: `${API_BASE_AUTH_URL}/register`,
  login: `${API_BASE_AUTH_URL}/login`,
  me: `${API_BASE_AUTH_URL}/me`,
  transactions: `${API_BASE_URL}/transactions`,
  accountsById: (id) => `${API_BASE_URL}/users/${id}/accounts`
};
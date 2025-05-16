export const API_BASE_URL = "http://localhost:8080";
export const API_BASE_AUTH_URL = `${API_BASE_URL}/auth`;

export const API_ENDPOINTS = {
  register: `${API_BASE_AUTH_URL}/register`,
  login: `${API_BASE_AUTH_URL}/login`,
  me: `${API_BASE_AUTH_URL}/me`,
  transactions: `${API_BASE_URL}/transactions`,
  atmTransactions: `${API_BASE_URL}/atm/transactions`,
  atmTransactionsById: (id) => `${API_BASE_URL}/atm/transactions/${id}`,
  accountsById: (id) => `${API_BASE_URL}/users/${id}/accounts`,
  accounts: `${API_BASE_URL}/accounts`,
  accountTransactionsbyId: (id) => `${API_BASE_URL}/accounts/${id}/transactions`,
  updateLimits: (iban) => `${API_BASE_URL}/accounts/${iban}/limits`,
  accountsByName: (firstName, lastName) => `${API_BASE_URL}/users/accounts/${firstName}/${lastName}`
};
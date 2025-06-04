export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_AUTH_URL = `${API_BASE_URL}/auth`;

export const API_ENDPOINTS = {
  register: `${API_BASE_AUTH_URL}/register`,
  login: `${API_BASE_AUTH_URL}/login`,
  me: `${API_BASE_AUTH_URL}/me`,
  transactions: `${API_BASE_URL}/transactions`,
  atmTransactions: `${API_BASE_URL}/atm/transactions`,
  atmTransactionsById: (id) => `${API_BASE_URL}/atm/transactions/${id}`,
  accountsById: (id) => `${API_BASE_URL}/users/${id}/accounts`,
  checkingAccountsById: (id) => `${API_BASE_URL}/users/${id}/checking-accounts`,
  accounts: `${API_BASE_URL}/accounts`,
  usersPending: `${API_BASE_URL}/users/pending`,
  usersApproval: (id) => `${API_BASE_URL}/users/${id}/approval-status`,
  usersById: (id) => `${API_BASE_URL}/users/${id}`,
  accountsByIdReview: (id) => `${API_BASE_URL}/users/${id}/accounts/review`,
  updateLimits: (iban) => `${API_BASE_URL}/accounts/${iban}/limits`,
  accountsByName: (firstName, lastName) => `${API_BASE_URL}/users/accounts/${firstName}/${lastName}`,
  userAccounts: (id) => `${API_BASE_URL}/users/${id}/accounts`,
  accountTransactionsbyId: (id) => `${API_BASE_URL}/accounts/${id}/transactions`,
  closeAccount: (iban) => `${API_BASE_URL}/accounts/${iban}/close`,
};
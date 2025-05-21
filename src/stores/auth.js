import { defineStore } from "pinia";

import axios from '@/utils/axios'

import { API_ENDPOINTS } from "@/utils/config";
import { useAccountStore } from '@/stores/account'
import { enforceMinimumDelay } from '@/utils/timers'

import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);
  const wasRegistered = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const fieldErrors = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const isEmployee = computed(() => user.value?.role === "EMPLOYEE");

  const accountStore = useAccountStore();

  async function login(credentials) {
    const response = await axios.post(API_ENDPOINTS.login, credentials);

    if (response.data.token) {
      token.value = response.data.token;
      sessionStorage.setItem("authToken", token.value);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      await fetchUser();
      await accountStore.fetchUserAccounts(user.value.id);
      return response;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    sessionStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  }

  async function initializeAuth() {
    const storedToken = sessionStorage.getItem("authToken");
    if (storedToken) {
      token.value = storedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      try {
        await fetchUser();
        await accountStore.fetchUserAccounts(user.value.id);
      } catch {
        logout();
      }
    }
  }

  async function fetchUser() {
    const storedToken = sessionStorage.getItem("authToken");

    if (storedToken) {
      try {
        const response = await axios.get(API_ENDPOINTS.me, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        user.value = response.data;
      } catch {
        logout();
      }
    } else {
      user.value = null;
    }
  }

  async function register(credentials) {
    clearUiState();
    
    const start = Date.now();
    isLoading.value = true;

    try {
      await axios.post(API_ENDPOINTS.register, credentials);
      wasRegistered.value = true;
    } catch (err) {
      handleRegistrationError(err);
    } finally {
      await enforceMinimumDelay(start);
      isLoading.value = false;
    }
  }

  function setWasRegistered(value) {
    wasRegistered.value = value
  }

  function extractFieldErrors(messages) {
    return messages.map(msg => {
      const [key, ...rest] = msg.split(': ');
      const messageText = rest.join(': ').trim();
      return key && messageText ? { key, messageText } : null;
    }).filter(Boolean);
  }

  function handleRegistrationError(err) {
    const raw = err?.response?.data?.message || 'An error occurred. Please try again.';
    const messages = Array.isArray(raw) ? raw : [raw];
    const parsedMessages = extractFieldErrors(messages);

    if (parsedMessages.length > 0) {
      fieldErrors.value = parsedMessages;
    } else {
      error.value = messages[0]
    }
  }

  function clearUiState() {
    error.value = null
    fieldErrors.value = null
    isLoading.value = false
  }

  return {
    register,
    user,
    token,
    isAuthenticated,
    isEmployee,
    login,
    logout,
    initializeAuth,
    fetchUser,
    setWasRegistered,
    wasRegistered,
    isLoading,
    error,
    fieldErrors,
    clearUiState
  };
});

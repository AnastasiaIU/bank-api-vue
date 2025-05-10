import { defineStore } from "pinia";

import axios from "axios";

import { API_ENDPOINTS } from "@/utils/config";

import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(null);

  const isAuthenticated = computed(() => !!token.value);
  const isEmployee = computed(() => user.value?.role === "EMPLOYEE");

  async function login(credentials) {
    const response = await axios.post(API_ENDPOINTS.login, credentials);

    if (response.data.token) {
      token.value = response.data.token;
      localStorage.setItem("authToken", token.value);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
      await fetchUser();
      return response;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  }

  async function initializeAuth() {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      token.value = storedToken;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      try {
        await fetchUser();
      } catch {
        logout();
      }
    }
  }

  async function fetchUser() {
    const storedToken = localStorage.getItem("authToken");

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
    await axios.post(API_ENDPOINTS.register, credentials);
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
  };
});

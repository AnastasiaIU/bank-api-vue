import { ref } from "vue";
import { defineStore } from "pinia";

import axios from "@/utils/axios";

import { API_ENDPOINTS } from "@/utils/config";
import { useAuthStore } from "@/stores/auth";

export const useAccountStore = defineStore(
  "pinia-account",
  () => {
    const userAccounts = ref([]);

    const authStore = useAuthStore();

    const totalPages = ref(0);
    const isLastPage = ref(false);
    const isFirstPage = ref(false);
    const error = ref(null);

    async function fetchAllAccounts(page, pageSize) {
      error.value = null;

      try {
        const response = await axios.get(API_ENDPOINTS.accounts, {
          params: { page, size: pageSize },
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        });

        userAccounts.value = response.data.content;
        totalPages.value = response.data.totalPages;
        isLastPage.value = response.data.last;
        isFirstPage.value = response.data.first;
      } catch (err) {
        error.value = "Failed to load accounts.";
        userAccounts.value = [];
        totalPages.value = 0;
        isLastPage.value = true;
        isFirstPage.value = true;
      }
    }

    function updateAccountLimits(updatedData) {
      return axios.put(
        API_ENDPOINTS.updateLimits(updatedData.iban),
        {
          dailyLimit: updatedData.dailyLimit,
          absoluteLimit: updatedData.absoluteLimit,
          withdrawLimit: updatedData.withdrawLimit,
        },
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    }

    async function fetchUserAccounts(userId) {
      const response = await axios.get(API_ENDPOINTS.accountsById(userId));
      userAccounts.value = response.data;
    }

    return {
      userAccounts,
      fetchUserAccounts,
      fetchAllAccounts,
      updateAccountLimits,
      totalPages,
      isLastPage,
      isFirstPage,
      error,
    };
  },
  { persist: { storage: sessionStorage } }
);

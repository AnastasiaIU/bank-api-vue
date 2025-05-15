<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import { API_ENDPOINTS } from "@/utils/config";
import { formatEuro } from "../utils/formatters.js";

const authStore = useAuthStore();

const accounts = ref([]);
const totalPages = ref(0);
const totalElements = ref(0);
const isLastPage = ref(false);
const isFirstPage = ref(false);
const error = ref(null);
const page = ref(0);
const pageSize = 10;

async function fetchAccounts() {
  error.value = null;

  try {
    const response = await axios.get(API_ENDPOINTS.accounts, {
      params: { page: page.value, size: pageSize },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    accounts.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalElements.value = response.data.totalElements;
    isLastPage.value = response.data.last;
    isFirstPage.value = response.data.first;
  } catch (err) {
    error.value = "Failed to load accounts.";
    console.error(err);
    accounts.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
    isLastPage.value = true;
    isFirstPage.value = true;
  }
}

onMounted(() => {
  fetchAccounts();
});

watch(page, () => {
  fetchAccounts();
});

function previousPage() {
  if (page.value > 0) {
    page.value--;
  }
}

function nextPage() {
  if (!isLastPage.value) {
    page.value++;
  }
}
</script>

<template>
  <div
    v-if="authStore.isAuthenticated && authStore.isEmployee"
    class="container my-5"
  >
    <h1 class="h2 text-center mb-4">Customer Accounts</h1>

    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <table
      v-else
      class="table table-striped table-bordered text-center align-middle"
    >
      <thead class="table-primary">
        <tr>
          <th>Customer Name</th>
          <th>IBAN</th>
          <th>Type</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="accounts.length > 0">
          <tr v-for="(account, index) in accounts" :key="index">
            <td>{{ account.firstName }} {{ account.lastName }}</td>
            <td>{{ account.iban }}</td>
            <td>{{ account.type }}</td>
            <td>{{ formatEuro(account.balance) }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="4" class="text-center text-muted fw-semibold">
            No accounts found.
          </td>
        </tr>
      </tbody>
    </table>

    <nav
      aria-label="Page navigation example"
      class="d-flex justify-content-center mt-4 align-items-center gap-3"
    >
      <button
        class="btn btn-outline-primary"
        @click="previousPage"
        :disabled="isFirstPage"
        title="Previous Page"
      >
        <!-- You can add SVG or font-awesome icon here -->
        <i class="bi bi-chevron-left"></i>
        Previous
      </button>

      <span class="text-muted fw-semibold">
        Page {{ page + 1 }} of {{ totalPages }}
      </span>

      <button
        class="btn btn-outline-primary"
        @click="nextPage"
        :disabled="isLastPage"
        title="Next Page"
      >
        Next
        <i class="bi bi-chevron-right"></i>
      </button>
    </nav>
  </div>
</template>

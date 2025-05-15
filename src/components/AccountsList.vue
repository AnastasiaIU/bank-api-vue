<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { API_ENDPOINTS } from "@/utils/config";
import { formatEuro } from "../utils/formatters.js";

const authStore = useAuthStore();

const accounts = ref([]);
const loading = ref(true);
const error = ref(null);

const page = ref(0);
const pageSize = 1;

const isLastPage = ref(false);

async function fetchAccounts() {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(API_ENDPOINTS.accounts, {
      params: { page: page.value, size: pageSize },
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    accounts.value = response.data;
    // If returned accounts are less than pageSize, we're on last page
    isLastPage.value = response.data.length < pageSize;
  } catch (err) {
    error.value = "Failed to load accounts.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchAccounts();
});

watch(page, () => {
  fetchAccounts();
});

function previousPage() {
  if (page.value > 1) {
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
    <h1 class="text-center mb-4">Customer Accounts</h1>

    <div v-if="loading" class="d-flex justify-content-center my-5">
      <Spinner />
    </div>

    <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>

    <table
      v-else
      class="table table-striped table-bordered text-center align-middle"
    >
      <thead class="table-light">
        <tr>
          <th>Customer Name</th>
          <th>IBAN</th>
          <th>Type</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(account, index) in accounts" :key="index">
          <td>{{ account.firstName }} {{ account.lastName }}</td>
          <td>{{ account.iban }}</td>
          <td>{{ account.type }}</td>
          <td>{{ formatEuro(account.balance) }}</td>
        </tr>
      </tbody>
    </table>

    <nav
      aria-label="Page navigation example"
      class="d-flex justify-content-center mt-4"
    >
      <ul class="pagination">
        <li :class="['page-item', { disabled: page === 1 || loading }]">
          <button
            class="page-link"
            @click="previousPage"
            :disabled="page === 1 || loading"
          >
            Previous
          </button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">Page {{ page }}</span>
        </li>
        <li :class="['page-item', { disabled: isLastPage || loading }]">
          <button
            class="page-link"
            @click="nextPage"
            :disabled="isLastPage || loading"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from '@/utils/axios';
import { useAuthStore } from "@/stores/auth";
import Toast from "./shared/Toast.vue";
import { API_ENDPOINTS } from "@/utils/config";

const authStore = useAuthStore();
const selectedAccount = ref(null);
const toastRef = ref(null);
const accounts = ref([]);

function selectAccount(account) {
  selectedAccount.value = account;
}

async function confirmCloseAccount() {
  if (!selectedAccount.value) return;

  try {
    await axios.put(
        API_ENDPOINTS.closeUserAccountWithBankAcc(selectedAccount.value.id),
        {},
        {
          headers: { Authorization: `Bearer ${authStore.token}` }
        }
    );

    toastRef.value.setToast("User and all accounts closed successfully", "success");
    await fetchActiveAccounts();
    selectedAccount.value = null;
  } catch (error) {
    toastRef.value.setToast("Failed to close user and accounts", "error");
  }
}

async function fetchActiveAccounts() {
  try {
    const response = await axios.get(API_ENDPOINTS.activeAccounts, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    accounts.value = response.data;
  } catch (error) {
    toastRef.value.setToast("Failed to load accounts", "error");
  }
}

onMounted(fetchActiveAccounts);
</script>

<template>
  <div v-if="authStore.isAuthenticated && authStore.isEmployee" class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 m-0">Active Customer Accounts</h1>
      <button
          class="btn btn-danger"
          @click="confirmCloseAccount"
          :disabled="!selectedAccount"
      >
        Close Account
      </button>
    </div>

    <table class="table table-light table-bordered table-hover text-center align-middle">
      <thead class="table-success">
      <tr>
        <th class="d-none">User ID</th>
        <th>Customer Name</th>
        <th>BSN</th>
        <th>Email</th>
        <th>Phone Number</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(account, index) in accounts"
          :key="index"
          :class="['clickable-row', { 'table-active': selectedAccount?.iban === account.iban }]"
          @click="selectAccount(account)"
      >
        <td class="d-none">{{ account.userId }}</td>
        <td>{{ account.firstName }} {{ account.lastName }}</td>
        <td>{{ account.bsn }}</td>
        <td>{{ account.email }}</td>
        <td>{{ account.phoneNumber }}</td>
      </tr>
      <tr v-if="accounts.length === 0">
        <td colspan="4" class="text-center text-muted fw-semibold">
          No active accounts found.
        </td>
      </tr>
      </tbody>
    </table>

    <Toast ref="toastRef" />
  </div>
</template>

<style scoped>
.clickable-row {
  cursor: pointer;
}
</style>
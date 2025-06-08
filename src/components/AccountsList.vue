<script setup>
import { ref, onMounted, watch } from "vue";

import axios from '@/utils/axios'
import { useAuthStore } from "@/stores/auth";
import { useAccountStore } from "@/stores/account.js";
import { formatEuro } from "../utils/formatters.js";
import UpdateLimitsModal from "@/components/UpdateLimitsModal.vue";
import Toast from "./shared/Toast.vue";
import { API_ENDPOINTS } from "@/utils/config";
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '../router/routes.js'

const authStore = useAuthStore();
const accountStore = useAccountStore();
const router = useRouter();

const page = ref(0);
const pageSize = 10;
const selectedAccount = ref(null);
const showModal = ref(false);
const toastRef = ref(null);

function selectAccount(account) {
  selectedAccount.value = account;
}

function openModal() {
  if (selectedAccount.value) {
    showModal.value = true;
  }
}

async function confirmCloseAccount()
{
   await axios.delete(
        API_ENDPOINTS.closeAccount(selectedAccount.value.iban),
        {
          headers: {
             Authorization: `Bearer ${authStore.token}`
          }
        }
    );

     selectedAccount.value = null; // Reset selection
    await fetchAccounts();        // Refresh account list
}

async function submitLimitUpdate(updatedData) {
  try {
    const response = await accountStore.updateAccountLimits(updatedData);

    if (response.status === 200) {
      showModal.value = false;
      await fetchAccounts();
      selectedAccount.value = null;
      toastRef.value.setToast("Account Limits Updated Successfully", "success");
    } else {
      toastRef.value.setToast("Failed to update account limits", "error");
    }
  } catch (error) {
    toastRef.value.setToast("Failed to update account limits", "error");
  }
}

async function fetchAccounts() {
  accountStore.fetchAllAccounts(page.value, pageSize);
}

watch(page, fetchAccounts, { immediate: true });

function previousPage() {
  if (page.value > 0) {
    page.value--;
  }
}

function nextPage() {
  if (!accountStore.isLastPage.value) {
    page.value++;
  }
}
function goToTransactionList() {
  if (selectedAccount.value) {
    router.push({
      name: ROUTE_NAMES.EMPLOYEE_TRANSACTIONS, 
      params: { accountId: selectedAccount.value.id },
      query: { iban: selectedAccount.value.iban }
    });
  }
}
</script>

<template>
  <div
    v-if="authStore.isAuthenticated && authStore.isEmployee"
    class="container my-5"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 m-0">All Customer Bank Accounts</h1>
      <button
          class="btn btn-danger"
          @click="confirmCloseAccount"
          :disabled="!selectedAccount || selectedAccount.status === 'CLOSED'"
      >
        Close Account
      </button>

      <div class="d-flex gap-2">
        <button
          class="btn btn-primary"
          @click="openModal"
          :disabled="!selectedAccount || selectedAccount.status === 'CLOSED'"
        >
          Update Account Limits
        </button>
        <button class="btn btn-primary" 
        :disabled="!selectedAccount || selectedAccount.status === 'CLOSED'"
        @click="goToTransactionList"
        >
          View Transactions
        </button>
      </div>
    </div>
    

    <div v-if="accountStore.error" class="alert alert-danger text-center">
      {{ accountStore.error }}
    </div>

    <table
      v-else
      class="table table-light table-bordered table-hover text-center align-middle"
    >
      <thead class="table-success">
        <tr>
          <th>Customer Name</th>
          <th>IBAN</th>
          <th>Type</th>
          <th>Balance</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="accountStore.userAccounts.length > 0">
          <tr
            v-for="(account, index) in accountStore.userAccounts"
            :key="index"
            :class="[
              'clickable-row',
              { 'table-active': selectedAccount?.iban === account.iban },
              { 'text-muted no-pointer': account.status === 'CLOSED' }
            ]"
            @click="account.status !== 'CLOSED' && selectAccount(account)"
          >
            <td>{{ account.firstName }} {{ account.lastName }}</td>
            <td>{{ account.iban }}</td>
            <td>{{ account.type }}</td>
            <td>{{ formatEuro(account.balance) }}</td>
            <td> {{account.status}}</td>
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
        :disabled="accountStore.isFirstPage"
        title="Previous Page"
      >
        <i class="bi bi-chevron-left"></i>
        Previous
      </button>

      <span class="text-muted fw-semibold">
        Page {{ page + 1 }} of {{ accountStore.totalPages }}
      </span>

      <button
        class="btn btn-outline-primary"
        @click="nextPage"
        :disabled="accountStore.isLastPage"
        title="Next Page"
      >
        Next
        <i class="bi bi-chevron-right"></i>
      </button>
    </nav>
  </div>

  <UpdateLimitsModal
    v-if="showModal"
    :account="selectedAccount"
    @close="showModal = false"
    @submit="submitLimitUpdate"
  />
  <Toast ref="toastRef" />
</template>

<style scoped>
.clickable-row {
  cursor: pointer;
}

.no-pointer {
  cursor: default;
}

.no-pointer:hover {
  background-color: none !important;
}
</style>

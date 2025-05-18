<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

import { useAuthStore } from "@/stores/auth";
import { useAccountStore } from "@/stores/account.js";
import { API_ENDPOINTS } from "@/utils/config";
import { formatEuro } from "../utils/formatters.js";
import UpdateLimitsModal from "@/components/UpdateLimitsModal.vue";
import Toast from "./shared/Toast.vue";

const authStore = useAuthStore();
const accountStore = useAccountStore();

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

async function submitLimitUpdate(updatedData) {
  try {
    const response = await axios.put(
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

    if (response.status === 200) {
      showModal.value = false;
      await fetchAccounts();
       // Deselect account after successful update
      selectedAccount.value = null;
      toastRef.value.setToast("Account Limits Updated Successfully", "success");
    }
  } catch (error) {
    toastRef.value.setToast("Failed to update account limits", "error");
  }
}
async function fetchAccounts() {
  accountStore.fetchAllAccounts(page.value, pageSize);
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
  if (!accountStore.isLastPage.value) {
    page.value++;
  }
}
</script>

<template>
  <div
    v-if="authStore.isAuthenticated && authStore.isEmployee"
    class="container my-5"
  >
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 m-0">Customer Accounts</h1>
      <button
        class="btn btn-primary"
        @click="openModal"
        :disabled="!selectedAccount"
      >
        Update Account Limits
      </button>
    </div>

    <div v-if="accountStore.error" class="alert alert-danger text-center">
      {{ accountStore.error }}
    </div>

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
        <template v-if="accountStore.userAccounts.length > 0">
          <tr
            v-for="(account, index) in accountStore.userAccounts"
            :key="index"
            :class="{ 'table-active': selectedAccount?.iban === account.iban }"
            @click="selectAccount(account)"
            style="cursor: pointer"
          >
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

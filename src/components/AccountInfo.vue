<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import Brand from '@/components/shared/Brand.vue'
import {formatEuro} from "../utils/formatters.js";
import { API_ENDPOINTS } from "@/utils/config";

// Access the auth store
const authStore = useAuthStore()
const token = authStore.token
const customer = ref(authStore.user)

const userId = ref(authStore.user?.id)
const accounts = ref([])
const combinedTotal = ref(0)

async function fetchAccountDetails(id) {
  const response = await axios.get(API_ENDPOINTS.account(id), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  accounts.value = response.data
  combinedTotal.value = accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
}

onMounted(() => {
  fetchAccountDetails(userId.value)
})
</script>

<template>
  <div class="container min-vh-100 d-flex justify-content-center align-items-start">
    <section class="card col-md-8 col-lg-6 col-xl-5 p-4 m-4">
      <Brand />
      <h5 class="mb-4 text-center">Account Summary</h5>

      <div class="mb-4">
        <p><strong>Name:</strong> {{ customer.firstName }} {{ customer.lastName }}</p>
        <p><strong>Email:</strong> {{ customer.email }}</p>
        <p><strong>Phone:</strong> {{ customer.phoneNumber }}</p>
      </div>

      <div class="mb-3" v-if="accounts.length > 0">
        <h6>Accounts:</h6>
        <ul class="list-group">
          <li v-for="(account, index) in accounts" :key="index" class="list-group-item d-flex justify-content-between">
            <div>
              <strong>{{ account.type }} IBAN:</strong><br />
              {{ account.iban }}
            </div>
            <div class="text-end">
              <span class="text-muted">Balance:</span><br />
              {{ formatEuro(account.balance) }}
            </div>
          </li>
        </ul>
      </div>

      <div class="mt-4 text-end" v-if="accounts.length > 0">
        <h6>Total Balance:</h6>
        <p class="h5 text-success">{{ formatEuro(combinedTotal) }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
ul.list-group {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
</style>
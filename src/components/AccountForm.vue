<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import Brand from '@/components/shared/Brand.vue'

// Access the auth store
const authStore = useAuthStore()
const token = authStore.token
const customer = ref(authStore.user || {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
})

const userId = ref(authStore.user?.id || null)
const accounts = ref([])
const combinedTotal = ref(0)

async function fetchAccountDetails(id) {
  try {
    const response = await axios.get(`http://localhost:8080/users/${id}/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    accounts.value = response.data
    combinedTotal.value = accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
  } catch (error) {
    console.error('Failed to fetch account details:', error)
  }
}

onMounted(() => {
  if (token && userId.value) {
    fetchAccountDetails(userId.value)
  } else {
    console.error('Token or user info missing, please log in')
  }
})
</script>

<template>
  <section class="card col-md-8 col-lg-6 col-xl-5 p-4 m-4">
    <Brand />
    <h5 class="mb-4 text-center">Account Summary</h5>

    <div class="mb-4">
      <p><strong>Name:</strong> {{ customer.firstName }} {{ customer.lastName }}</p>
      <p><strong>Email:</strong> {{ customer.email }}</p>
      <p><strong>Phone:</strong> {{ customer.phoneNumber }}</p>
    </div>

    <div class="mb-3">
      <h6>Accounts:</h6>
      <ul class="list-group">
        <li v-for="(account, index) in accounts" :key="index" class="list-group-item d-flex justify-content-between">
          <div>
            <strong>{{ account.type }} IBAN:</strong><br />
            {{ account.iban }}
          </div>
          <div class="text-end">
            <span class="text-muted">Balance:</span><br />
            € {{ account.balance.toFixed(2) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="mt-4 text-end">
      <h6>Total Balance:</h6>
      <p class="h5 text-success">€ {{ combinedTotal.toFixed(2) }}</p>
    </div>
  </section>
</template>

<style scoped>
ul.list-group {
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
</style>
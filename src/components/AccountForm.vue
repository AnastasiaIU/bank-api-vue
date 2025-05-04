<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import Brand from '@/components/Brand.vue'

// Simulated store or API call (replace with actual store or API call)
const route = useRoute()
const accountId = ref(route.params.id)

const customer = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

const accounts = ref([
  // Example structure; in real usage, fetch this from the backend
  { type: 'Checking', iban: '', balance: 0 },
  { type: 'Savings', iban: '', balance: 0 }
])

const combinedTotal = ref(0)

async function fetchAccountDetails(id) {
  // Simulated fetch; replace with your actual API call
  // Example:
  // const data = await api.getAccountDetails(id)
  // customer.value = data.customer
  // accounts.value = data.accounts
  // combinedTotal.value = data.combinedTotal

  customer.value = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890'
  }

  accounts.value = [
    { type: 'Checking', iban: 'NL91ABNA0417164300', balance: 1250.50 },
    { type: 'Savings', iban: 'NL91ABNA0417164301', balance: 2750.25 }
  ]

  combinedTotal.value = accounts.value.reduce((sum, acc) => sum + acc.balance, 0)
}

onMounted(() => {
  fetchAccountDetails(accountId.value)
})
</script>

<template>
  <section class="card col-md-8 col-lg-6 col-xl-5 p-4 m-4">
    <Brand />
    <h5 class="mb-4 text-center">Account Summary</h5>

    <div class="mb-4">
      <p><strong>Name:</strong> {{ customer.firstName }} {{ customer.lastName }}</p>
      <p><strong>Email:</strong> {{ customer.email }}</p>
      <p><strong>Phone:</strong> {{ customer.phone }}</p>
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
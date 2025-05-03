<script setup>
import { ref, onMounted } from 'vue'
import TransactionList from '../components/TransactionList.vue'
import axios from 'axios'

const transactions = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/accounts/1/transactions')
    transactions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
})
</script>

<template>
  <main class="container-fluid d-flex flex-column flex-grow-1 align-items-center p-0">
    <TransactionList :transactions="transactions" />
  </main>
</template>
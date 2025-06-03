<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { API_ENDPOINTS } from '@/utils/config'
import TransactionCard from '@/components/TransactionCard.vue'

const route = useRoute()

const transactions = ref([])
const accountId = route.params.accountId
const accountIban = route.query.iban

onMounted(fetchTransactions)

async function fetchTransactions() {
  if (!accountId) {
    console.warn("Missing accountId for employee view")
    return
  }

  try {
    const response = await axios.get(API_ENDPOINTS.accountTransactionsbyId(accountId))
    transactions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-center mb-3">Customer Transactions</h2>

    <div v-if="transactions.length === 0" class="text-muted text-center">
      No transactions found.
    </div>

    <ul class="list-group mb-4">
      <TransactionCard
        v-for="tx in transactions"
        :key="tx.id"
        :transaction="tx"
        :reference-iban="accountIban"
      />
    </ul>
  </div>
</template>

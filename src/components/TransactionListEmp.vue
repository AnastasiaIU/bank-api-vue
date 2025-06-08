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

const page = ref(0)
const pageSize = ref(10)
const totalPages = ref(0) 
const totalElements = ref(0)

onMounted(fetchTransactions)

async function fetchTransactions(requestedPage = page.value) {
  if (!accountId) {
    console.warn("Missing accountId for employee view")
    return
  }

  try {
    const params = new URLSearchParams()
    params.append('page', requestedPage)
    params.append('size', pageSize.value)
    params.append('sort', 'timestamp,desc')

    const url = `${API_ENDPOINTS.accountTransactionsbyId(accountId)}?${params.toString()}`
    const response = await axios.get(url)
    
    transactions.value = response.data.content
    totalPages.value = response.data.totalPages
    totalElements.value = response.data.totalElements
    page.value = response.data.number
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-center mb-3">Transactions for {{accountIban}}</h2>

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
    <nav aria-label="Page navigation" class="d-flex justify-content-center align-items-center m-4 gap-3">
      <button class="btn btn-outline-primary" @click="previousPage" :disabled="page === 0"><i class="bi bi-chevron-left"></i> Previous</button>
      <span class="text-muted fw-semibold">
        Page {{ page + 1 }} of {{ totalPages }}
      </span>
      <button class="btn btn-outline-primary" @click="nextPage" :disabled="page >= totalPages - 1">Next <i class="bi bi-chevron-right"></i></button>
    </nav>
  </div>
</template>

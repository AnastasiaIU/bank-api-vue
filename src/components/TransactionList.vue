<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'
import { API_ENDPOINTS } from '@/utils/config'
import TransactionFilters from './TransactionFilters.vue'
import TransactionCard from '@/components/TransactionCard.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const accounts = ref([])
const selectedAccount = ref(null)
const transactions = ref([])

const page = ref(0)
const pageSize = ref(10)
const totalPages = ref(0) 
const totalElements = ref(0)

const filters = ref({
  startDate: route.query.startDate || '',
  endDate: route.query.endDate || '',
  amount: route.query.amount || '',
  comparison: route.query.comparison || '',
  sourceIban: route.query.sourceIban || '',
  targetIban: route.query.targetIban || '',
  description: route.query.description || ''
})

const showFilters = ref(false)

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function clearFilters() {
  Object.keys(filters.value).forEach(k => (filters.value[k] = ''))
  updateUrlFilters()
}

function updateFilters(newFilters) {
  filters.value = newFilters
  updateUrlFilters()
}

function updateUrlFilters() {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_, value]) => value !== '' && value != null)
  )

  router.push({
    query: cleanedFilters
  })
}

onMounted(fetchAccounts)

watch(() => route.query, (newQuery) => {
  Object.assign(filters.value, newQuery)
  fetchTransactions()
})

async function fetchAccounts() {
  try {
    const response = await axios.get(API_ENDPOINTS.accountsById(authStore.user.id))
    accounts.value = response.data

    if (accounts.value.length > 0) {
      selectedAccount.value = accounts.value[0]
      await fetchTransactions()
    }
  } catch (error) {
    console.error('Failed to fetch accounts:', error)
  }
}

async function fetchTransactions(requestedPage = page.value) {
  if (!selectedAccount.value) return

  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters.value)) {
      if (value) {
        params.append(key, value)
      }
    }

    params.append('page', requestedPage)
    params.append('size', pageSize.value)

    const url = `${API_ENDPOINTS.accountTransactionsbyId(selectedAccount.value.id)}?${params.toString()}`
    const response = await axios.get(url)
    transactions.value = response.data.content
    totalPages.value = response.data.totalPages
    totalElements.value = response.data.totalElements
    page.value = response.data.number
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

function previousPage() {
  if (page.value > 0) {
    fetchTransactions(page.value - 1)
  }
}

function nextPage() {
  if (page.value < totalPages.value - 1) {
    fetchTransactions(page.value + 1)
  }
}

function switchAccount(type) {
  const newAccount = accounts.value.find(acc => acc.type === type)
  if (newAccount && newAccount !== selectedAccount.value) {
    selectedAccount.value = newAccount
    page.value = 0 
    fetchTransactions(0)
  }
}
</script>
<template>
  <div class="m-3 text-center">
  <button
    class="btn me-2"
    :class="selectedAccount?.type === 'CHECKING' ? 'btn-primary' : 'btn-secondary'"
    @click="switchAccount('CHECKING')"
  >
    View CHECKING
  </button>

  <button
    class="btn"
    :class="selectedAccount?.type === 'SAVINGS' ? 'btn-primary' : 'btn-secondary'"
    @click="switchAccount('SAVINGS')"
  >
    View SAVINGS
  </button>
</div>

  <div v-if="selectedAccount">
    <h1 class="h2 text-center mb-3">Transactions for {{ selectedAccount.iban}}</h1>

    <div class="text-center mb-3">
      <button class="btn btn-primary" @click="toggleFilters">
        {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
      </button>
    </div>
    <TransactionFilters 
      v-if="showFilters"
      :filters="filters"
      @update:filters="updateFilters"
      @submit="fetchTransactions"
      @clear="clearFilters"/>

    <div v-if="transactions.length === 0" class="text-muted text-center">
      No transactions found.
    </div>

    <ul class="list-group mb-4">
      <TransactionCard
        v-for="tx in transactions"
        :key="tx.id"
        :transaction="tx"
        :reference-iban="selectedAccount.iban"
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
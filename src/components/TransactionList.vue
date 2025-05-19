<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'
import { API_ENDPOINTS } from '@/utils/config'
import TransactionFilters from './TransactionFilters.vue'

const authStore = useAuthStore()
const accounts = ref([])
const selectedAccount = ref(null)
const transactions = ref([])

const filters = ref({
  startDate: '',
  endDate: '',
  amount: '',
  comparison: '',
  sourceIban: '',
  targetIban: ''
})

function clearFilters() {
  Object.keys(filters.value).forEach(k => (filters.value[k] = ''))
}

onMounted(async () => {
    await fetchAccounts()
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

async function fetchTransactions() {
  if (!selectedAccount.value) return

  try {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters.value)) {
      if (value) {
        params.append(key, value)
      }
    }

    const url = `${API_ENDPOINTS.accountTransactionsbyId(selectedAccount.value.id)}?${params.toString()}`
    const response = await axios.get(url)
    transactions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

function switchAccount(type) {
  selectedAccount.value = accounts.value.find(acc => acc.type === type)
  fetchTransactions()
}

function updateFilters(newFilters) {
  filters.value = newFilters
}

const showFilters = ref(false)
function toggleFilters() {
  showFilters.value = !showFilters.value
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
      <li v-for="tx in transactions" :key="tx.id" class="list-group-item d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-bold">{{ new Date(tx.timestamp).toLocaleString() }}</div>
          <small class="text-muted">{{ tx.description }}</small>
        </div>
        <div class="text-end">
          <div :class="tx.targetIban === selectedAccount.iban ? 'text-success' : ''">
            {{ tx.targetIban === selectedAccount.iban ? '+' : '-' }}€{{ tx.amount.toFixed(2) }}
          </div>
          <small class="text-muted">
            From: {{ tx.sourceIban || 'N/A' }}<br />
            To: {{ tx.targetIban || 'N/A' }}
          </small>
        </div>
      </li>
    </ul>
  </div>
</template>
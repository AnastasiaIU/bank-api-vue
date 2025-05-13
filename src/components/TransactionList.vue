<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'

const transactions = ref([])

const filters = ref({
  onDate: '',
  before: '',
  after: '',
  amount: '',
  comparison: '',
  sourceIban: '',
  targetIban: ''
})

const fetchTransactions = async () => {
  try {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(filters.value)) {
      if (value) {
        params.append(key, value)
      }
    }

    const url = `http://localhost:8080/accounts/1/transactions?${params.toString()}`
    const response = await axios.get(url)
    transactions.value = response.data
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  }
}

fetchTransactions()
</script>

<template>
  <div class="mb-4 mt-4">
  <form @submit.prevent="fetchTransactions">
    <div class="row g-2 mb-2">
      <div class="col-md">
        <input v-model="filters.onDate" type="date" class="form-control" placeholder="On Date" />
      </div>
      <div class="col-md">
        <input v-model="filters.before" type="datetime-local" class="form-control" placeholder="Before" />
      </div>
      <div class="col-md">
        <input v-model="filters.after" type="datetime-local" class="form-control" placeholder="After" />
      </div>
      <div class="col-md">
        <input v-model="filters.amount" type="number" step="0.01" class="form-control" placeholder="Amount" />
      </div>
      <div class="col-md">
        <select v-model="filters.comparison" class="form-select">
          <option value="">Compare</option>
          <option value="lt">Less than</option>
          <option value="gt">Greater than</option>
          <option value="eq">Equal to</option>
        </select>
      </div>
    </div>

    <div class="row g-2">
      <div class="col-md">
        <input v-model="filters.sourceIban" type="text" class="form-control" placeholder="Source IBAN" />
      </div>
      <div class="col-md">
        <input v-model="filters.targetIban" type="text" class="form-control" placeholder="Target IBAN" />
      </div>
      <div class="col-md-auto">
        <button type="submit" class="btn btn-primary w-100">Filter</button>
      </div>
    </div>
  </form>
</div>
  <section class="card p-4 m-4">
    <h5 class="text-center mb-3">Transaction History</h5>

    <div v-if="transactions.length === 0" class="text-muted text-center">
      No transactions found.
    </div>

    <ul class="list-group">
      <li v-for="tx in transactions" :key="tx.id" class="list-group-item d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-bold">{{ tx.description }}</div>
          <small class="text-muted">{{ new Date(tx.timestamp).toLocaleString() }}</small>
        </div>
        <div class="text-end">
          <div :class="tx.amount > 0 ? 'text-success' : 'text-danger'">
            €{{ tx.amount.toFixed(2) }}
          </div>
          <small class="text-muted">
            From: {{ tx.sourceIban || 'N/A' }}<br />
            To: {{ tx.targetIban || 'N/A' }}
          </small>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.card {
  max-width: 600px;
  margin: auto;
}
.list-group-item {
  padding: 1rem;
}
</style>
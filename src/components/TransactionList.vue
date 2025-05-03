<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true
  }
})
</script>

<template>
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

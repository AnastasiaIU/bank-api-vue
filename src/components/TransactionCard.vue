<script setup>
    import { formatEuro } from '@/utils/formatters'

    const props = defineProps({
        transaction: Object,
        referenceIban: String
    })
</script>
<template>
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <div>
      <div class="fw-bold">{{ new Date(transaction.timestamp).toLocaleString() }}</div>
      <small class="text-muted">{{ transaction.description }}</small>
    </div>
    <div class="text-end">
      <div :class="transaction.targetIban === referenceIban ? 'text-success' : ''">
        {{ transaction.targetIban === referenceIban ? '+' : '-' }}{{ formatEuro(transaction.amount) }}
      </div>
      <small class="text-muted">
        From: {{ transaction.sourceIban || 'N/A' }}<br />
        To: {{ transaction.targetIban || 'N/A' }}
      </small>
    </div>
  </li>
</template>
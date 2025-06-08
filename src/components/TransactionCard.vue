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
      <div class="fw-bold">
        {{ new Date(transaction.timestamp).toLocaleString('nl-NL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) }}
      </div>
      <small class="text-muted">{{ transaction.description }}</small>
    </div>
    <div class="text-end">
      <div :class="transaction.targetIban === referenceIban ? 'text-success' : ''">
        {{ transaction.targetIban === referenceIban ? '+' : '-' }}{{ formatEuro(transaction.amount) }}
      </div>
      <small class="text-muted">
        <template v-if="transaction.sourceIban && transaction.targetIban">
          From: {{ transaction.sourceIban }}<br />
          To: {{ transaction.targetIban }}
        </template>
        <template v-else-if="transaction.sourceIban && !transaction.targetIban">
          From: {{ transaction.sourceIban }}
        </template>
        <template v-else-if="!transaction.sourceIban && transaction.targetIban">
          To: {{ transaction.targetIban }}
        </template>
      </small>
    </div>
  </li>
</template>
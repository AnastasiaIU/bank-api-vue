<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  filters: Object
})
const emit = defineEmits(['update:filters', 'submit', 'clear'])

const localFilters = ref({ ...props.filters })

function onInputChange(key, value) {
  if (key === 'amount') {
    const numeric = parseFloat(value)
    if (isNaN(numeric) || numeric < 0.01) {
      localFilters.value[key] = ''
      return
    }
  }
  localFilters.value[key] = value
}

function apply() {
  emit('update:filters', { ...localFilters.value })
  emit('submit')
}

function clearAll() {
  Object.keys(localFilters.value).forEach(k => localFilters.value[k] = '')
  emit('update:filters', {})
  emit('clear')
}
</script>

<template>
  <div class="border p-3 rounded mb-3">
    <h5 class="mb-3">Transaction Filters</h5>
    <div class="mb-2">
  <label class="form-label">Description</label>
  <input
    type="text"
    class="form-control"
    v-model="localFilters.description"
    placeholder="e.g. groceries, transfer, salary"
  />
</div>

    <!-- Amount -->
    <div class="row mb-3">
      <div class="col-md-4">
        <label class="form-label">Amount</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          class="form-control"
          :value="filters.amount"
          @input="onInputChange('amount', $event.target.value)"
        />
      </div>
      <div class="col-md-4">
        <label class="form-label">Comparison</label>
        <select
          class="form-select"
          :value="filters.comparison"
          @change="onInputChange('comparison', $event.target.value)"
        >
          <option value="">Select</option>
          <option value="lt">Less than</option>
          <option value="eq">Equal to</option>
          <option value="gt">Greater than</option>
        </select>
      </div>
    </div>

    <hr />

    <!-- Date -->
    <div class="row mb-3">
  <div class="col-md-6">
    <label class="form-label">Start Date</label>
    <input
      type="date"
      class="form-control"
      :value="filters.startDate"
      @input="onInputChange('startDate', $event.target.value)"
    />
  </div>
  <div class="col-md-6">
    <label class="form-label">End Date</label>
    <input
      type="date"
      class="form-control"
      :value="filters.endDate"
      @input="onInputChange('endDate', $event.target.value)"
    />
  </div>
</div>

    <hr />

    <!-- IBANs -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label class="form-label">Source IBAN</label>
        <input
          type="text"
          class="form-control"
          :value="filters.sourceIban"
          @input="onInputChange('sourceIban', $event.target.value)"
        />
      </div>
      <div class="col-md-6">
        <label class="form-label">Target IBAN</label>
        <input
          type="text"
          class="form-control"
          :value="filters.targetIban"
          @input="onInputChange('targetIban', $event.target.value)"
        />
      </div>
    </div>
    <hr />

    <!-- Buttons -->
    <div class="text-center">
        <button type="submit" class="btn btn-primary me-2" @click="apply">Apply Filters</button>
        <button type="button" class="btn btn-secondary" @click="clearAll">Clear Filters</button>
    </div>
  </div>
</template>
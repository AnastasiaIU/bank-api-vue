<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: String,
  isValid: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'update:isValid']);

const localValue = ref(props.modelValue || '');
const ibanError = ref('');

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal || '';
});

function isValidIban(value) {
  return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(value.toUpperCase());
}

const validateIban = () => {
  const trimmed = localValue.value.trim().toUpperCase();

  if (isValidIban(trimmed)) {
    ibanError.value = '';
    localValue.value = trimmed;
    emit('update:modelValue', trimmed);
    emit('update:isValid', true);
  } else {
    ibanError.value = 'Invalid IBAN format';
    emit('update:modelValue', null);
    emit('update:isValid', false);
  }
};
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      type="text"
      class="form-control"
      v-model="localValue"
      @blur="validateIban"
      :class="{ 'is-invalid': ibanError }"
      placeholder="Enter IBAN"
    />
    <div class="invalid-feedback">{{ ibanError }}</div>
  </div>
</template>
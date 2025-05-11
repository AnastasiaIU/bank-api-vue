<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: [String],
    isValid: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'update:isValid']);

const localValue = ref(props.modelValue);
const amountError = ref('');

watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal;
});

const validateAmount = () => {
  const numericValue = parseFloat(localValue.value);

  if (!isNaN(numericValue) && numericValue > 0) {
    const formatted = numericValue.toFixed(2);
    localValue.value = formatted;
    amountError.value = '';
    emit('update:modelValue', formatted);
    emit('update:isValid', true);
  } else {
    amountError.value = 'Please enter a valid amount';
    emit('update:modelValue', null);
    emit('update:isValid', false);
  }
};
</script>

<template>
    <div class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <input :id="id" type="text" class="form-control" v-model="localValue" @blur="validateAmount"
            :class="{ 'is-invalid': amountError }" placeholder="Enter amount to transfer" />
        <div class="invalid-feedback">{{ amountError }}</div>
    </div>
</template>
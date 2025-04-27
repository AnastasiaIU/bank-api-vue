<template>
    <div class="mb-3">
        <label :for="id" class="form-label">{{ label }}</label>
        <input :id="id" type="text" class="form-control" v-model="localValue" @blur="updateValue"
            placeholder="Enter text" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    label: { type: String, required: true },
    modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const localValue = ref(props.modelValue || '');

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
    localValue.value = newVal || '';
});

// Emit trimmed text when input loses focus
const updateValue = () => {
    const trimmed = localValue.value.trim();
    emit('update:modelValue', trimmed);
};
</script>
<script setup>
import { useField } from 'vee-validate'
import { formatEuro } from '@/utils/formatters';

const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: String,
    transform: String
})

const { value, errorMessage, handleBlur } = useField(props.name)

function applyTransform(event) {
    let val = event.target.value

    if (props.transform === 'uppercase') {
        value.value = val.toUpperCase()
    }

    if (props.type === 'currency') {
        // Remove any formatting/symbols before parsing
        const clean = val.replace(/[^0-9.,]/g, '').replace(',', '.')
        value.value = clean
    }
}

function handleCurrencyBlur() {
    if (props.type === 'currency') {
        value.value = formatEuro(value.value)
    }
    handleBlur()
}
</script>

<template>
    <div class="form-group mb-2">
        <label :for="name" class="form-label">{{ label }}</label>
        <input :id="name" :name="name" :type="type" class="form-control" :class="{ 'is-invalid': errorMessage }"
            v-model="value" @blur="handleCurrencyBlur" @input="applyTransform" :placeholder="placeholder || label" />
        <div class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>
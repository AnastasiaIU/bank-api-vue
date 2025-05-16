<script setup>
import { useField } from 'vee-validate'
import { formatEuro, parseEuro } from '@/utils/formatters';

const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: String,
    transform: String
})

const { value, errorMessage, handleBlur, setValue } = useField(props.name)

function applyTransform(event) {
    let raw = event.target.value

    if (props.transform === 'uppercase') {
        raw = raw.toUpperCase()
    }

    if (props.type === 'currency') {
        const numericValue = parseEuro(raw)
        setValue(numericValue)
    } else {
        value.value = raw
    }
}

function handleCurrencyBlur() {
    if (props.type === 'currency' && value.value !== '') {
        const numeric = parseFloat(value.value)
        if (!isNaN(numeric)) {
            value.value = formatEuro(numeric)
        }
    }
    handleBlur()
}

function handleFocus(event) {
    if (props.type === 'currency') {
        const raw = parseEuro(event.target.value)
        value.value = raw.toString()
    }
}
</script>

<template>
    <div class="form-group mb-2">
        <label :for="name" class="form-label">{{ label }}</label>
        <input :id="name" :name="name" :type="type" class="form-control" :class="{ 'is-invalid': errorMessage }"
            v-model="value" @blur="handleCurrencyBlur" @focus="handleFocus" @input="applyTransform"
            :placeholder="placeholder || label" />
        <div class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>
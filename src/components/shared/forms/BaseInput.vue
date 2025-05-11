<script setup>
import { useField } from 'vee-validate'

const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    placeholder: String,
    transform: String
})

const { value, errorMessage, handleBlur } = useField(props.name)

function applyTransform(event) {
    if (props.transform === 'uppercase') {
        value.value = event.target.value.toUpperCase()
    }
}
</script>

<template>
    <div class="form-group mb-2">
        <label :for="name" class="form-label">{{ label }}</label>
        <input :id="name" :name="name" :type="type" class="form-control" :class="{ 'is-invalid': errorMessage }"
            v-model="value" @blur="handleBlur" @input="applyTransform" :placeholder="placeholder || label" />
        <div class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>
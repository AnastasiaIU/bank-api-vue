<script setup>
import { ref } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
    name: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: String
})

const showPassword = ref(false)

function toggleVisibility() {
    showPassword.value = !showPassword.value
}

const { value, errorMessage, handleBlur } = useField(props.name)
</script>

<template>
    <div class="form-group mb-3">
        <label :for="name" class="form-label">{{ label }}</label>
        <div class="input-group">
            <input :id="name" :name="name" :type="showPassword ? 'text' : 'password'" class="form-control"
                :class="{ 'is-invalid': errorMessage }" v-model="value" @blur="handleBlur"
                :placeholder="placeholder || label" />
            <button type="button" class="btn btn-outline-secondary" @click="toggleVisibility">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
        </div>
        <div class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>

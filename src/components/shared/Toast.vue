<script setup>
import { ref } from 'vue'

const props = defineProps({
    text: String,
    variant: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'error', 'info', 'warning'].includes(value)
    }
})

const showToast = ref(false)

function displayToast() {
    showToast.value = true
    setTimeout(() => (showToast.value = false), 3000)
}

defineExpose({ displayToast })
</script>

<template>
    <div v-if="showToast" :class="['toast-message', `toast-${variant}`]" role="alert" aria-live="assertive"
        aria-atomic="true">{{ text }}</div>
</template>

<style scoped>
.toast-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 1;
    transition: opacity 0.5s ease-out;
    z-index: 1000;
}

.toast-success {
    background-color: var(--color-success);
}

.toast-error {
    background-color: var(--color-danger);
}

.toast-info {
    background-color: var(--color-info);
    color: black;
}

.toast-warning {
    background-color: var(--color-warning);
    color: black;
}
</style>

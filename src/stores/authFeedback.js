import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthFeedbackStore = defineStore('auth-feedback', () => {
    const wasRegistered = ref(false)

    function setWasRegistered(value) {
        wasRegistered.value = value
    }

    return { wasRegistered, setWasRegistered }
}, { persist: { storage: sessionStorage } })
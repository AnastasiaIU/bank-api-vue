import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from '@/utils/axios'

import { API_ENDPOINTS } from '@/utils/config'

export const useAccountStore = defineStore('pinia-account', () => {
    const userAccounts = ref([])

    async function fetchUserAccounts(userId) {
        const response = await axios.get(API_ENDPOINTS.accountsById(userId))
        userAccounts.value = response.data
    }

    return { userAccounts, fetchUserAccounts }
}, { persist: true })
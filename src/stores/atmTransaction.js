import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from '@/utils/axios'

import { API_ENDPOINTS } from '@/utils/config'

export const useAtmTransactionStore = defineStore('pinia-atm-transaction', () => {
    const transactions = ref([])

    async function create(transactionData) {
        const response = await axios.post(API_ENDPOINTS.atmTransactions, transactionData)
        transactions.value.push(response.data)
        return response
    }

    async function getById(id) {
        const response = await axios.get(API_ENDPOINTS.atmTransactionsById(id))
        return response.data
    }

    return { create, getById }
}, { persist: { storage: sessionStorage } })
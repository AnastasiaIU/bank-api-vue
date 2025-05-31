import { ref } from 'vue'
import { defineStore } from 'pinia'

import axios from '@/utils/axios'

import { API_ENDPOINTS } from '@/utils/config'

import { useAuthStore } from "@/stores/auth"
import { useAccountStore } from "@/stores/account"
import { enforceMinimumDelay } from '@/utils/timers'

export const useTransactionStore = defineStore('transaction', () => {
    const POLL_INTERVAL = 4000;
    const POLL_TIMEOUT = 10000;

    const transactions = ref([])
    const isLoading = ref(false);
    const error = ref(null);

    const authStore = useAuthStore()
    const accountStore = useAccountStore()

    async function create(transactionData) {
        const response = await axios.post(API_ENDPOINTS.transactions, transactionData)
        transactions.value.push(response.data)
        return response
    }

    async function getById(id) {
        const response = await axios.get(API_ENDPOINTS.transactionById(id))
        return response.data
    }

    async function pollStatus(id) {
        const startTime = Date.now();

        while (Date.now() - startTime < POLL_TIMEOUT) {
            const transaction = await getById(id);
            if (transaction.status !== 'PENDING') {
                return transaction;
            }
            await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
        }

        throw new Error('Transaction status check timed out.');
    };

    async function processTransaction(transactionData) {
        clearUiState()

        const start = Date.now();
        isLoading.value = true;

        try {
            const createdTransaction = await create(transactionData)
            const finalTransaction = await pollStatus(createdTransaction.data.id)

            if (finalTransaction.status === 'SUCCEEDED') {
                await accountStore.fetchUserAccounts(authStore.user.id)
                return { message: "Transaction succeeded, funds transferred", type: "success" }
            } else {
                return { message: finalTransaction.failureReason || "Transaction failed.", type: "error" }
            }

        } catch (err) {
            error.value = err?.response?.data?.message || err?.message || 'An error occurred. Please try again.'

        } finally {
            await enforceMinimumDelay(start);
            isLoading.value = false;
        }
    }

    function clearUiState() {
        error.value = null
        isLoading.value = false
    }

    return { processTransaction, isLoading, error, clearUiState }
})
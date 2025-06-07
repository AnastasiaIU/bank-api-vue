<script setup>
import TransactionEntity from './TransactionEntity.vue';
import { ref, onMounted, computed } from 'vue';
import axios from '@/utils/axios';
import { API_ENDPOINTS } from '@/utils/config';
import Toast from './shared/Toast.vue';

const toastRef = ref(null);
const transactions = ref([]);
const atmTransactions = ref([]);

async function fetchTransactions() {
    try {
        const response = await axios.get(API_ENDPOINTS.allTransactions);
        transactions.value = response.data;
    } catch (error) {
        toastRef.value.setToast("Failed to load transactions. Please try again.", "error");
    }
}

async function fetchAtmTransactions() {
    try {
        const response = await axios.get(API_ENDPOINTS.allAtmTransactions);
        atmTransactions.value = response.data;
    } catch (error) {
        toastRef.value.setToast("Failed to load ATM transactions. Please try again.", "error");
        console.error(error);
    }
}

async function fetchAllTransactions() {
    await fetchTransactions();
    await fetchAtmTransactions();
}

onMounted(async () => {
    await fetchAllTransactions();
})

const allTransactions = computed(() => {
    return [...transactions.value, ...atmTransactions.value]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});
</script>

<template>
    <h1 class="h2 text-center m-4">Transactions</h1>
    <div class="wrapper">
        <div v-for="t in allTransactions">
            <div v-if="t.type == null">
                <TransactionEntity :from-account="t.sourceIban" :to-account="t.targetIban" :amount="t.amount"
                    :initiated-by="t.initiatedBy" :timestamp="t.timestamp" />
            </div>
            <div v-else-if="t.type === 'DEPOSIT'">
                <TransactionEntity :to-account="t.iban" :amount="t.amount" :initiated-by="t.initiatedBy"
                    :timestamp="t.timestamp" />
            </div>
            <div v-else>
                <TransactionEntity :from-account="t.iban" :amount="t.amount" :initiated-by="t.initiatedBy"
                    :timestamp="t.timestamp" />
            </div>
        </div>
    </div>
    <Toast ref="toastRef" />
</template>

<style scoped>
.wrapper {
    background: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 8px 0 0 0;
}
</style>
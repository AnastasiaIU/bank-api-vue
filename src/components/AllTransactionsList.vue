<script setup>
import TransactionEntity from './TransactionEntity.vue';
import { ref, onMounted, computed } from 'vue';
import axios from '@/utils/axios';
import { API_ENDPOINTS } from '@/utils/config';
import Toast from './shared/Toast.vue';

const toastRef = ref(null);
const transactions = ref([]);
const atmTransactions = ref([]);
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);

async function fetchAllTransactions() {
    try {
        const response = await axios.get(API_ENDPOINTS.combinedTransactions(page.value, size.value));
        const data = response.data;

        transactions.value = data.content;
        totalPages.value = data.totalPages;
        console.log(data);
    } catch (error) {
        toastRef.value.setToast('Failed to fetch transactions', 'error');
    }
}

function nextPage() {
    if (page.value < totalPages.value - 1) {
        page.value++;
        fetchAllTransactions();
    }
}

function prevPage() {
    if (page.value > 0) {
        page.value--;
        fetchAllTransactions();
    }
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
            <div v-if="t.type == 'TRANSFER'">
                <TransactionEntity :from-account="t.sourceIban" :to-account="t.targetIban" :amount="t.amount"
                    :initiated-by="t.initiatedBy" :timestamp="t.timestamp" :status="t.status" />
            </div>
            <div v-else-if="t.type === 'DEPOSIT'">
                <TransactionEntity :to-account="t.sourceIban" :amount="t.amount" :initiated-by="t.initiatedBy"
                    :timestamp="t.timestamp" :status="t.status" />
            </div>
            <div v-else>
                <TransactionEntity :from-account="t.sourceIban" :amount="t.amount" :initiated-by="t.initiatedBy"
                    :timestamp="t.timestamp" :status="t.status" />
            </div>
        </div>
        <nav aria-label="Page navigation" class="d-flex justify-content-center align-items-center m-4 gap-3">
            <button class="btn btn-outline-primary" @click="prevPage" :disabled="page === 0"><i
                    class="bi bi-chevron-left"></i> Previous</button>
            <span class="text-muted fw-semibold">
                Page {{ page + 1 }} of {{ totalPages }}
            </span>
            <button class="btn btn-outline-primary" @click="nextPage" :disabled="page >= totalPages - 1">Next <i
                    class="bi bi-chevron-right"></i></button>
        </nav>
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
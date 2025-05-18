<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import { useAuthStore } from '@/stores/auth';
import { API_ENDPOINTS } from '@/utils/config';
import AmountInput from './shared/forms/AmountInput.vue';
import TextInput from './shared/forms/TextInput.vue';
import AccountDropdown from './shared/forms/AccountDropdown.vue';
import Toast from './shared/Toast.vue';

const authStore = useAuthStore();

const accounts = ref([]);
const fromAccount = ref(null);
const toAccount = ref(null);
const amount = ref('');
const isValidAmount = ref(false);
const description = ref('');
const toastRef = ref(null);

function disableButton() {
    return (
        !fromAccount.value ||
        !toAccount.value ||
        fromAccount.value === toAccount.value ||
        !amount.value ||
        parseFloat(amount.value) <= 0
    );
}

async function transferFunds() {
    try {
        const transaction = {
            sourceAccount: fromAccount.value,
            targetAccount: toAccount.value,
            amount: parseFloat(amount.value),
            description: description.value || null,
        };

        const response = await axios.post(API_ENDPOINTS.transactions, transaction);

        if (response.status === 201) {
            toastRef.value.setToast('Transaction created successfully!', 'success');

            fromAccount.value = null;
            toAccount.value = null;
            amount.value = '';
            isValidAmount.value = false;
            description.value = null;

            await fetchAccounts();
        } else {
            toastRef.value.setToast('Failed to create transaction. Please try again.', 'error');
        }
    } catch (error) {
        toastRef.value.setToast('An error occurred while creating the transaction.', 'error');
    }
}

async function fetchAccounts() {
    try {
        const response = await axios.get(API_ENDPOINTS.accountsById(authStore.user.id));
        accounts.value = response.data;
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

onMounted(() => {
    fetchAccounts();
});
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">Transfer Funds</h1>
        <div>
            <AccountDropdown :accounts="accounts" v-model:selectedAccount="fromAccount" label="From Account" />
            <AccountDropdown :accounts="accounts" v-model:selectedAccount="toAccount" label="To Account" />
            <AmountInput id="transferAmount" label="Amount to Transfer" v-model="amount"
                v-model:isValid="isValidAmount" />
            <TextInput id="description" label="Description" v-model="description" />
            <button class="btn btn-primary" @click="transferFunds" :disabled="disableButton()">Transfer</button>
        </div>
        <Toast ref="toastRef" />
    </section>
</template>

<style scoped>
.btn:disabled {
    background-color: #ccc;
    border: #ccc;
    cursor: not-allowed;
}
</style>
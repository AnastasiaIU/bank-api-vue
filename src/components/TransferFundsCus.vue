<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import { useAuthStore } from '@/stores/auth'
import { API_ENDPOINTS } from '@/utils/config'
import { useForm } from 'vee-validate'
import transferCustomerSchema from '@/schemas/transferCustomerSchema'
import AccountDropdown from './shared/forms/AccountDropdown.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'
import TextInput from './shared/forms/TextInput.vue'
import Toast from './shared/Toast.vue'
import { parseEuro } from '@/utils/formatters';
import { enforceMinimumDelay } from '@/utils/timers'
import Spinner from "@/components/shared/Spinner.vue"

const authStore = useAuthStore()

const toastRef = ref(null)
const accounts = ref([])
const isLoading = ref(false)

const POLL_INTERVAL = 4000;
const POLL_TIMEOUT = 10000;

const { handleSubmit, meta, resetForm, setFieldValue } = useForm({
    validationSchema: transferCustomerSchema,
    initialValues: {
        fromAccountIban: '',
        toAccountIban: '',
        amount: '',
        description: ''
    },
    validateOnMount: true
})

async function fetchAccounts() {
    try {
        const response = await axios.get(API_ENDPOINTS.accountsById(authStore.user.id))
        accounts.value = response.data
    } catch (error) {
        console.error('Error fetching accounts:', error)
    }
}

const onSubmit = handleSubmit(async (values) => {
     const start = Date.now();
      isLoading.value = true;

   try {
    const transaction = {
        sourceAccount: values.fromAccountIban,
        targetAccount: values.toAccountIban,
        amount: parseEuro(values.amount),
        description: values.description || null
    };

    const createdTransaction = await axios.post(API_ENDPOINTS.transactions, transaction);
    const finalTransaction = await pollStatus(createdTransaction.data.id);

    if (finalTransaction.status === 'SUCCEEDED') {
        toastRef.value.setToast("Transaction succeeded, funds transferred", "success");
        await fetchAccounts();
        resetForm();
    } else {
        toastRef.value.setToast(
            finalTransaction.failureReason || 'Failed to create transaction. Please try again.',
            "error"
        );
    }
} catch (error) {
    toastRef.value.setToast('An error occurred while creating the transaction.', 'error');
} finally {
    await enforceMinimumDelay(start);
    isLoading.value = false;
}

})

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

    async function getById(id) {
        const response = await axios.get(API_ENDPOINTS.transactionById(id))
        return response.data
    }

onMounted(fetchAccounts)
</script>

<template>
    <Spinner v-if="isLoading" size="md" message="Creating the transaction..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">Transfer Funds</h1>
        <form @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
            <AccountDropdown :accounts="accounts" label="From Account"
                @update:selectedAccount="account => setFieldValue('fromAccountIban', account ? account.iban : '')" />
            <AccountDropdown :accounts="accounts" label="To Account"
                @update:selectedAccount="account => setFieldValue('toAccountIban', account ? account.iban : '')" />
            <BaseInput name="amount" label="Amount to Transfer" type="currency" />
            <TextInput name="description" label="Description" />
            <button class="btn btn-primary" type="submit" :disabled="!meta.valid">Transfer</button>
        </form>
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
<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import { useAuthStore } from '@/stores/auth';
import { API_ENDPOINTS } from '@/utils/config';
import { useForm } from 'vee-validate';
import transferSchema from '@/schemas/transferSchema';
import AccountDropdown from './shared/forms/AccountDropdown.vue';
import BaseInput from '@/components/shared/forms/BaseInput.vue';
import { parseEuro } from '@/utils/formatters';

const props = defineProps({
    toast: Object
});

const authStore = useAuthStore();
const accounts = ref([]);
const formKey = ref(0);

const { handleSubmit, meta, resetForm, setFieldValue } = useForm({
    validationSchema: transferSchema,
    initialValues: {
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    }
})

async function fetchAccounts() {
    try {
        const response = await axios.get(API_ENDPOINTS.accountsById(authStore.user.id));
        accounts.value = response.data;
    } catch (error) {
        props.toast.setToast('Faild to get accounts. Please try again', 'error');
    }
}

const onSubmit = handleSubmit(async (values) => {
    try {
        const transaction = {
            sourceAccount: values.fromAccount,
            targetAccount: values.toAccount,
            initiatedBy: authStore.user.id,
            amount: parseEuro(values.amount),
            description: values.description || null,
        }
        const response = await axios.post(API_ENDPOINTS.transactions, transaction);
        if (response.status === 201) {
            props.toast.setToast('Transaction created successfully!', 'success');
            resetForm();
            formKey.value++;
            await fetchAccounts();
        } else {
            props.toast.setToast('Failed to create transaction. Please try again.', 'error');
        }
    } catch (error) {
        props.toast.setToast('An error occurred while creating the transaction.', 'error');
    }
})

onMounted(fetchAccounts);
</script>

<template>
    <h1 class="h2 text-center">Transfer Funds</h1>
    <form :key="formKey" @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
        <AccountDropdown :accounts="accounts" label="From Account"
            @update:selectedAccount="account => setFieldValue('fromAccount', account ? account.iban : '')" />
        <AccountDropdown :accounts="accounts" label="To Account"
            @update:selectedAccount="account => setFieldValue('toAccount', account ? account.iban : '')" />
        <BaseInput name="amount" label="Amount to Transfer" type="currency" />
        <BaseInput name="description" label="Description" />
        <button class="btn btn-primary" type="submit" :disabled="!meta.valid">Transfer</button>
    </form>
</template>

<style scoped>
.btn:disabled {
    background-color: #ccc;
    border: #ccc;
    cursor: not-allowed;
}
</style>
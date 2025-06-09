<script setup>
import Toast from './shared/Toast.vue';
import { API_ENDPOINTS } from "@/utils/config";
import axios from '@/utils/axios';
import BaseInput from '@/components/shared/forms/BaseInput.vue';
import { useForm } from 'vee-validate';
import { parseEuro } from '@/utils/formatters';
import transferSchema from '@/schemas/transferSchema';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const toastRef = ref(null);
const authStore = useAuthStore();

const { handleSubmit, meta, resetForm } = useForm({
    validationSchema: transferSchema,
        initialValues: {
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    }
});

const onSubmit = handleSubmit(async (values) => {
    try {
        const transaction = {
            sourceAccount: values.fromAccount,
            targetAccount: values.toAccount,
            initiatedBy: authStore.user.id,
            amount: parseEuro(values.amount),
            description: values.description || null,
        };
        const response = await axios.post(API_ENDPOINTS.transactions, transaction);
        if (response.status === 201) {
            toastRef.value.setToast('Transaction created successfully!', 'success');
            resetForm();
        } else {
            toastRef.value.setToast('Failed to create transaction. Please try again.', 'error');
        }
    } catch (error) {
        toastRef.value.setToast('An error occurred while creating the transaction.', 'error');
    }
});
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="text-center">Transfer Funds</h1>
        <form @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
            <BaseInput name="fromAccount" label="From IBAN" />
            <BaseInput name="toAccount" label="To IBAN" />
            <BaseInput name="amount" label="Amount to Transfer" type="currency" />
            <BaseInput name="description" label="Description" />
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
<script setup>
import Toast from './shared/Toast.vue';
import { API_ENDPOINTS } from "@/utils/config";
import axios from '@/utils/axios';
import BaseInput from '@/components/shared/forms/BaseInput.vue';
import { useForm } from 'vee-validate';
import { parseEuro } from '@/utils/formatters';
import transferEmployeeSchema from '@/schemas/transferEmployeeSchema';
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transaction'
const toastRef = ref(null);
const transactionStore = useTransactionStore();

const { handleSubmit, meta, resetForm } = useForm({
    validationSchema: transferEmployeeSchema,
    validateOnMount: true
});

const onSubmit = handleSubmit(async (values) => {
        const transaction = {
            sourceAccount: values.fromAccountIban,
            targetAccount: values.toAccountIban,
            amount: parseEuro(values.amount),
            description: values.description || null,
        }

        const { message, type } = await transactionStore.processTransaction(transaction)
        toastRef.value.setToast(message, type);

        resetForm();
})
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="text-center">Transfer Funds</h1>
        <form @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
            <BaseInput name="fromAccountIban" label="From IBAN" />
            <BaseInput name="toAccountIban" label="To IBAN" />
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
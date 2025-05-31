<script setup>
import { ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { useAccountStore } from '@/stores/account'

import transferCustomerSchema from '@/schemas/transferCustomerSchema'
import AccountDropdown from './shared/forms/AccountDropdown.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'
import Toast from './shared/Toast.vue'
import Spinner from "@/components/shared/Spinner.vue"

import { parseEuro } from '@/utils/formatters';
import { useForm } from 'vee-validate'

const authStore = useAuthStore()
const transactionStore = useTransactionStore();
const accountStore = useAccountStore();

const toastRef = ref(null)
const selectedFromAccount = ref(null)
const selectedToAccount = ref(null)

const formContext = useForm({
    validationSchema:  transferCustomerSchema
})

const { handleSubmit, meta, setFieldValue } = formContext

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

function resetForm() {
        formContext.resetForm();
        transactionStore.clearUiState();
        selectedFromAccount.value = null;
        selectedToAccount.value = null;
}

watch(selectedFromAccount, (newAccount) => {
    setFieldValue('fromAccountIban', newAccount ? newAccount.iban : '');
});

watch(selectedToAccount, (newAccount) => {
    setFieldValue('toAccountIban', newAccount ? newAccount.iban : '');
});

</script>

<template>
    <Spinner v-if="transactionStore.isLoading" size="md" message="Creating the transaction..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">Transfer Funds</h1>
        <form @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
            <AccountDropdown :accounts="accountStore.userAccounts" label="From Account" v-model:selectedAccount="selectedFromAccount" />
            <AccountDropdown :accounts="accountStore.userAccounts" label="To Account" v-model:selectedAccount="selectedToAccount"/>
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
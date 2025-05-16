<script setup>
import Spinner from "@/components/shared/Spinner.vue"
import Toast from "./shared/Toast.vue"
import AccountDropdown from '@/components/shared/forms/AccountDropdown.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'

import atmSchema from "@/schemas/atmSchema"

import { useAuthStore } from "@/stores/auth"
import { useAccountStore } from '@/stores/account'
import { useAtmTransactionStore } from '@/stores/atmTransaction'

import { parseEuro } from '@/utils/formatters'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 10000;

const authStore = useAuthStore();
const accountStore = useAccountStore();
const atmTransactionStore = useAtmTransactionStore();
const route = useRoute();

const selectedAccount = ref('');
const generalError = ref('')
const isLoading = ref(false);
const toastRef = ref(null);

const props = defineProps({
    transactionType: String
})

const formContext = useForm({
    validationSchema: atmSchema
})

const { handleSubmit, meta } = formContext

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true;
    try {
        generalError.value = ''

        const data = {
            iban: selectedAccount.value,
            type: props.transactionType.toUpperCase(),
            amount: parseEuro(values.amount)
        }

        const createdTransaction = await atmTransactionStore.create(data)
        const finalTransaction = await pollTransactionStatus(createdTransaction.data.id)

        if (finalTransaction.status === 'SUCCEEDED') {
            await accountStore.fetchUserAccounts(authStore.user.id)
            toastRef.value.setToast("Transaction succeeded. Money dispensed.", "success");
        } else {
            toastRef.value.setToast(finalTransaction.failureReason || "Transaction failed.", "error")
        }

        resetForm();

    } catch (err) {
        generalError.value = err?.response?.data?.message || err?.message || 'An error occurred. Please try again.'
    } finally {
        isLoading.value = false;
    }
});

async function pollTransactionStatus(id) {
    const startTime = Date.now();

    while (Date.now() - startTime < POLL_TIMEOUT) {
        const transaction = await atmTransactionStore.getById(id);
        if (transaction.status !== 'PENDING') {
            return transaction;
        }
        await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
    }

    throw new Error('Transaction status check timed out.');
};

// Reset when route changes
watch(
    () => route.fullPath,
    () => {
        resetForm();
    }
);

function resetForm() {
    selectedAccount.value = '';
    formContext.resetForm();
    generalError.value = '';
}

</script>

<template>
    <Spinner v-if="isLoading" size="md" message="Creating the transaction..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">{{ transactionType }}</h1>
        <div v-if="generalError" class="alert alert-danger" role="alert">{{ generalError }}</div>
        <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit" @keydown.enter.prevent>
            <AccountDropdown :accounts="accountStore.userAccounts" v-model:selectedAccount="selectedAccount"
                label="Select an account" />
            <BaseInput name="amount" label="Enter amount" type="currency" />
            <button class="btn btn-primary my-3 fw-bold" :disabled="!meta.valid || selectedAccount === ''">{{
                transactionType }}</button>
        </form>
        <Toast ref="toastRef" text="" />
    </section>
</template>
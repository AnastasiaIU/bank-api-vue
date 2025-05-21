<script setup>
import Spinner from "@/components/shared/Spinner.vue"
import Toast from "./shared/Toast.vue"
import AccountDropdown from '@/components/shared/forms/AccountDropdown.vue'
import BaseInput from '@/components/shared/forms/BaseInput.vue'

import atmSchema from "@/schemas/atmSchema"

import { useAccountStore } from '@/stores/account'
import { useAtmTransactionStore } from '@/stores/atmTransaction'

import { parseEuro } from '@/utils/formatters'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

const accountStore = useAccountStore();
const atmTransactionStore = useAtmTransactionStore();

const route = useRoute();

const toastRef = ref(null);
const selectedAccount = ref(null);

const props = defineProps({
    transactionType: String
})

const formContext = useForm({
    validationSchema: atmSchema
})

const { handleSubmit, meta } = formContext

const onSubmit = handleSubmit(async (values) => {
    const data = {
        iban: selectedAccount.value.iban,
        type: props.transactionType.toUpperCase(),
        amount: parseEuro(values.amount)
    }

    const { message, type } = await atmTransactionStore.processTransaction(data)
    toastRef.value.setToast(message, type);

    resetForm();
})

// Reset when route changes
watch(
    () => route.fullPath,
    () => {
        resetForm();
    }
);

function resetForm() {
    selectedAccount.value = null;
    formContext.resetForm();
    atmTransactionStore.clearUiState();
}

</script>

<template>
    <Spinner v-if="atmTransactionStore.isLoading" size="md" message="Creating the transaction..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">{{ transactionType }}</h1>
        <div v-if="atmTransactionStore.error" class="alert alert-danger" role="alert">{{ atmTransactionStore.error }}
        </div>
        <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit" @keydown.enter.prevent>
            <AccountDropdown :accounts="accountStore.userAccounts" v-model:selectedAccount="selectedAccount"
                label="Select an account" />
            <BaseInput name="amount" label="Enter amount" type="currency" />
            <button class="btn btn-primary my-3 fw-bold" :disabled="!meta.valid || selectedAccount === null">{{
                transactionType }}</button>
        </form>
        <Toast ref="toastRef" text="" />
    </section>
</template>
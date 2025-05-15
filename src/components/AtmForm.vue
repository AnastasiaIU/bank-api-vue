<script setup>
import Spinner from "@/components/shared/Spinner.vue";
import Toast from "./shared/Toast.vue";
import AccountDropdown from '@/components/shared/forms/AccountDropdown.vue';
import BaseInput from '@/components/shared/forms/BaseInput.vue'

import atmSchema from "@/schemas/atmSchema";

import { useAccountStore } from '@/stores/account'
import { useAtmTransactionStore } from '@/stores/atmTransaction'

import { parseEuro } from '@/utils/formatters';

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useForm } from 'vee-validate'

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

    setTimeout(async () => {
        try {
            generalError.value = ''

            const data = {
                iban: selectedAccount.value,
                type: props.transactionType.toUpperCase(),
                amount: parseEuro(values.amount)
            }

            await atmTransactionStore.create(data)

            toastRef.value.displayToast();
            resetForm();

        } catch (err) {
            generalError.value = err?.response?.data?.message || 'An error occurred. Please try again.'
        } finally {
            isLoading.value = false;
        }
    }, 3000)
});

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
        <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit">
            <AccountDropdown :accounts="accountStore.userAccounts" v-model:selectedAccount="selectedAccount"
                label="Select an account" />
            <BaseInput name="amount" label="Enter amount" type="currency" />
            <button class="btn btn-primary my-3 fw-bold" :disabled="!meta.valid || selectedAccount === ''">{{
                transactionType }}</button>
        </form>
        <Toast ref="toastRef" text="The transaction was recorded." variant="success" />
    </section>
</template>
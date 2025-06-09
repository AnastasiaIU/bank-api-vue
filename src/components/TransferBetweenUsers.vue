<script setup>
import { ref } from 'vue';
import axios from '@/utils/axios';
import TextInput from './shared/forms/TextInput.vue';
import { API_ENDPOINTS } from '@/utils/config';
import { useAuthStore } from '@/stores/auth';
import AccountDropdown from './shared/forms/AccountDropdown.vue';
import { useForm } from 'vee-validate'
import transferSchema from '@/schemas/transferSchema';
import { parseEuro } from '@/utils/formatters';
import BaseInput from './shared/forms/BaseInput.vue';

const props = defineProps({
  toast: Object
})

const authStore = useAuthStore();

const { handleSubmit, meta, resetForm, setFieldValue } = useForm({
    validationSchema: transferSchema,
    initialValues: {
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
    }
})

const firstName = ref('');
const lastName = ref('');
const accounts = ref([]);
const yourAccounts = ref([]);
const searched = ref(false);
const formKey = ref(0);

async function findIbans() {
    searched.value = false;

    const accountsResponse = await axios.get(API_ENDPOINTS.accountsByName(firstName.value, lastName.value, authStore.user.id), {
        headers: {
            Authorization: `Bearer ${authStore.token}`
        }
    });

    searched.value = true;

    if (accountsResponse.status === 200) {
        accounts.value = accountsResponse.data;
        await fetchYourAccounts();
    } else {
        props.toast.setToast('Failed to fetch IBANs. Please try again.', 'error');
    }
}

async function fetchYourAccounts() {
    try {
        const response = await axios.get(API_ENDPOINTS.checkingAccountsById(authStore.user.id), {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
        yourAccounts.value = response.data;
    } catch (error) {
        props.toast.setToast('Error getting your accounts. Please try again.', 'error');
    }
}

function disableFindButton() {
    return !(firstName.value && lastName.value);
}

const onSubmit = handleSubmit(async (formValues) => {
    if (!formValues.fromAccount) {
        props.toast.setToast('Please select an IBAN to transfer from.', 'error');
        return;
    }
    try {
        const transaction = {
            sourceAccount: formValues.fromAccount,
            targetAccount: formValues.toAccount,
            initiatedBy: authStore.user.id,
            amount: parseEuro(formValues.amount),
            description: formValues.description || null,
        };
        const response = await axios.post(API_ENDPOINTS.transactions, transaction, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
        if (response.status === 201) {
            props.toast.setToast('Transaction created successfully!', 'success');
            resetForm();
            formKey.value++;
        } else {
            props.toast.setToast('Failed to create transaction. Please try again.', 'error');
        }
    } catch (error) {
        props.toast.setToast('An error occurred while creating the transaction.', 'error');
    }
});
</script>

<template>
    <h1 class="h2 text-center">Find IBAN</h1>
    <div>
        <div class="d-flex flex-row justify-content-between">
            <TextInput id="firstName" label="Enter first name" v-model="firstName" />
            <TextInput id="lastName" label="Enter last name" v-model="lastName" />
        </div>
        <button class="btn btn-primary mt-3 w-100" @click="findIbans" :disabled="disableFindButton()">Find IBAN</button>
    </div>
    <div class="mt-4">
        <div v-if="accounts.length" class="list-group">
            <form :key="formKey" @submit.prevent="onSubmit" class="d-flex flex-column gap-2">
                <AccountDropdown :accounts="yourAccounts" label="Select your account:"
                    @update:selectedAccount="yourAccounts => setFieldValue('fromAccount', yourAccounts ? yourAccounts.iban : '')" />
                <AccountDropdown :accounts="accounts" label="IBANs found:"
                    @update:selectedAccount="account => setFieldValue('toAccount', account ? account.iban : '')"
                    :balanceVisible="false" />
                <BaseInput name="amount" label="Amount to Transfer" type="currency" />
                <BaseInput name="description" label="Description" />
                <button class="btn btn-primary" type="submit" :disabled="!meta.valid">Transfer</button>
            </form>
        </div>
        <div v-else-if="searched" class="text-center text-muted mt-3">
            No IBANs found for the given name.
        </div>
    </div>
</template>

<style scoped>
.btn:disabled {
    background-color: #ccc;
    border: #ccc;
    cursor: not-allowed;
}
</style>
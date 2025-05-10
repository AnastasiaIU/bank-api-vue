<script setup>
import { ref } from 'vue'
import IbanInput from './shared/IbanInput.vue';
import AmountInput from './shared/AmountInput.vue';
import TextInput from './shared/TextInput.vue';
import Toast from './shared/Toast.vue';
import { API_ENDPOINTS } from "@/utils/config";
import axios from 'axios';

const fromAccountIban = ref('');
const isFromIbanValid = ref(false);
const toAccountIban = ref('');
const isToIbanValid = ref(false);
const amount = ref('');
const isValidAmount = ref(false);
const description = ref('');
const toastRef = ref(null);
const toastText = ref('');
const toastVariant = ref('success');

function disableButton() {
    return !(isFromIbanValid.value && isToIbanValid.value && isValidAmount.value);
}

async function transferFunds() {
    try {
        const transaction = {
            sourceAccount: fromAccountIban.value,
            targetAccount: toAccountIban.value,
            amount: parseFloat(amount.value),
            description: description.value || null,
        };

        const response = await axios.post(API_ENDPOINTS.transactions, transaction);

        if (response.status === 201) {
            setToast('Transaction created successfully!', 'success');

            fromAccountIban.value = '';
            isFromIbanValid.value = false;
            toAccountIban.value = '';
            isToIbanValid.value = false;
            amount.value = '';
            isValidAmount.value = false;
            description.value = null;
        } else {
            setToast('Failed to create transaction. Please try again.', 'error');
        }
    } catch (error) {
        setToast('An error occurred while creating the transaction.', 'error');
    }
}

function setToast(msg, type) {
    toastText.value = msg;
    toastVariant.value = type;
    toastRef.value.displayToast();
}
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="text-center">Transfer Funds</h1>
        <div>
            <IbanInput id="fromIban" label="From IBAN" v-model="fromAccountIban" v-model:isValid="isFromIbanValid" />
            <IbanInput id="toIban" label="To IBAN" v-model="toAccountIban" v-model:isValid="isToIbanValid" />
            <AmountInput id="transferAmount" label="Amount to Transfer" v-model="amount"
                v-model:isValid="isValidAmount" />
            <TextInput id="description" label="Description" v-model="description" />
            <button class="btn btn-primary" @click="transferFunds" :disabled="disableButton()">Transfer</button>
        </div>
        <Toast ref="toastRef" :text="toastText" :variant="toastVariant" />
    </section>
</template>

<style scoped>
.btn:disabled {
    background-color: #ccc;
    border: #ccc;
    cursor: not-allowed;
}
</style>
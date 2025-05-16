<script setup>
import { ref } from 'vue';
import axios from 'axios';
import TextInput from './shared/forms/TextInput.vue';
import { API_ENDPOINTS } from '@/utils/config';
import Toast from './shared/Toast.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const ibans = ref([]);
const searched = ref(false);
const toastRef = ref(null);
const toastText = ref('');
const toastVariant = ref('success');

async function findIbans() {
    searched.value = false;

    const response = await axios.get(API_ENDPOINTS.accountsByName(firstName.value, lastName.value), {
        headers: {
            Authorization: `Bearer ${authStore.token}`
        }
    });

    searched.value = true;
    clearInputs();

    if (response.status === 200) {
        ibans.value = response.data;
    } else {
        setToast('Failed to fetch IBANs. Please try again.', 'error');
    }
}

function setToast(msg, type) {
    toastText.value = msg;
    toastVariant.value = type;
    toastRef.value.displayToast();
}

function disableButton() {
    return !(firstName.value && lastName.value);
}

function clearInputs() {
    firstName.value = '';
    lastName.value = '';
}
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <h1 class="h2 text-center">Find IBAN</h1>
        <div>
            <div class="d-flex flex-row justify-content-between">
                <TextInput id="firstName" label="Enter first name" v-model="firstName" />
                <TextInput id="lastName" label="Enter last name" v-model="lastName" />
            </div>
            <button class="btn btn-primary mt-3 w-100" @click="findIbans" :disabled="disableButton()">Find IBAN</button>
        </div>
        <div class="mt-4">
            <h2 v-if="ibans.length" class="h5 mb-3">IBANs found:</h2>
            <ul v-if="ibans.length" class="list-group">
                <li v-for="account in ibans" :key="account.iban" class="list-group-item text-center">
                    <span class="fw-bold">{{ account.iban }}</span>
                </li>
            </ul>
            <div v-else-if="searched" class="text-center text-muted mt-3">
                No IBANs found for the given name.
            </div>
        </div>
        <Toast ref="toastRef" :text="toastText" :variant="toastVariant" />
    </section>
</template>
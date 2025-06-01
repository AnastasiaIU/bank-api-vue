<script setup>
import { ref, watch } from 'vue';
import { formatEuro } from '@/utils/formatters';

const props = defineProps({
    accounts: {
        type: Array,
        required: true
    },
    selectedAccount: {
        type: [Object, String, null]
    },
    label: {
        type: String,
        required: true
    },
        balanceVisible: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:selectedAccount']);

const localSelectedIban = ref(
    props.selectedAccount && typeof props.selectedAccount === 'object'
        ? props.selectedAccount.iban
        : props.selectedAccount || ''
);

watch(localSelectedIban, (newIban) => {
    const selected = props.accounts.find(acc => acc.iban === newIban) || null;
    emit('update:selectedAccount', selected);
});

watch(
    () => props.selectedAccount,
    (newValue) => {
        localSelectedIban.value =
            newValue && typeof newValue === 'object'
                ? newValue.iban
                : newValue || '';
    }
);
</script>

<template>
    <div>
        <label :for="label" class="form-label">{{ label }}</label>
        <select :id="label" v-model="localSelectedIban" class="form-select">
            <option disabled value="">Select an account</option>
            <option v-for="account in accounts" :key="account.iban" :value="account.iban">
                {{ account.iban }} <span v-if="balanceVisible"> ({{ formatEuro(account.balance) }})</span>
            </option>
        </select>
    </div>
</template>

<style scoped>
.form-select {
    margin-bottom: 1rem;
}
</style>
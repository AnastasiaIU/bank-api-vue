<script setup>
import { ref, watch } from 'vue';
import { formatEuro } from '@/utils/formatters';

const props = defineProps({
    accounts: {
        type: Array,
        required: true
    },
    selectedAccount: {
        type: [String]
    },
    label: {
        type: String,
        required: true
    },
});

const emit = defineEmits(['update:selectedAccount']);

const localSelectedAccount = ref(props.selectedAccount);

watch(localSelectedAccount, (newValue) => {
    emit('update:selectedAccount', newValue);
});

watch(
    () => props.selectedAccount,
    (newValue) => {
        localSelectedAccount.value = newValue;
    }
);
</script>

<template>
    <div>
        <label :for="label" class="form-label">{{ label }}</label>
        <select :id="label" v-model="localSelectedAccount" class="form-select">
            <option disabled value="">Select an account</option>
            <option v-for="account in accounts" :key="account.iban" :value="account.iban">
                {{ account.iban }} ({{ formatEuro(account.balance) }})
            </option>
        </select>
    </div>
</template>

<style scoped>
.form-select {
    margin-bottom: 1rem;
}
</style>
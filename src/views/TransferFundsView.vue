<script setup>
import TransferFundsEmp from '@/components/TransferFundsEmp.vue';
import TransferFundsCus from '@/components/TransferFundsCus.vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userRole = authStore.user.role;
</script>

<template>
    <main class="container-fluid d-flex flex-column flex-grow-1 align-items-center p-0">
        <TransferFundsEmp v-if="userRole === 'EMPLOYEE'" />
        <TransferFundsCus v-else-if="userRole === 'CUSTOMER'" />
    </main>
</template>
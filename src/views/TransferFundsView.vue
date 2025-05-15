<script setup>
import TransferFundsEmp from '@/components/TransferFundsEmp.vue';
import TransferFundsCus from '@/components/TransferFundsCus.vue';
import axios from '@/utils/axios';
import { ref, onMounted } from 'vue';
import { API_ENDPOINTS } from '@/utils/config';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userRole = ref(null);

async function fetchUserRole() {
    try {
        const response = await axios.get(API_ENDPOINTS.me, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });

        userRole.value = response.data.role;
    } catch (error) {
        console.error('Error fetching user role:', error);
        userRole.value = null;
    }
}

onMounted(async () => {
    await fetchUserRole();
});
</script>

<template>
    <main class="container-fluid d-flex flex-column flex-grow-1 align-items-center p-0">
        <TransferFundsEmp v-if="userRole === 'EMPLOYEE'" />
        <TransferFundsCus v-else-if="userRole === 'CUSTOMER'" />
    </main>
</template>
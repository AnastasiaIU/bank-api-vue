<script setup>
import AtmForm from '../components/AtmForm.vue';

defineProps({
    transactionType: String
})
</script>

<template>
    <main class="container-fluid d-flex flex-column flex-grow-1 align-items-center p-0">
        <AtmForm :transactionType="transactionType"/>
    </main>
</template>
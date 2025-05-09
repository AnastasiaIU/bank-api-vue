<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue';

const authStore = useAuthStore()
</script>

<template>
  <div class="container-fluid align-items-center p-0">
    <Navbar v-if="authStore.isAuthenticated" />
    <RouterView />
  </div>
</template>

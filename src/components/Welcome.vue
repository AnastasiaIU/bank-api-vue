
<template>
    <section v-if="authStore.isAuthenticated" class="text-center mt-5">
      <h1 class="display-4">Welcome, {{ user?.firstName }}!</h1>
      <p class="lead">Your role: <strong>{{ user?.role }}</strong></p>

      <button class="btn btn-danger mt-4" @click="handleLogout">Log out</button>
    </section>

    <section v-else class="text-center mt-5">
    <h2>You are not logged in.</h2>
    <router-link to="/login" class="btn btn-primary mt-3">Go to Login</router-link>
  </section>


  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRouter } from 'vue-router'

const router = useRouter()
  
  const authStore = useAuthStore()
  const user = authStore.user

  function handleLogout() {
  authStore.logout()
  router.push('/login')
}
  </script>
  
  <style scoped>
  section {
    max-width: 600px;
    margin: auto;
  }
  </style>
  
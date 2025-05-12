<template>
  <section v-if="authStore.isAuthenticated" class="text-center mt-5">
    <h1 class="display-4">Welcome, {{ authStore.user?.firstName }}!</h1>
    <p class="lead">
      Your role is <strong>{{ authStore.user?.role }}</strong>
    </p>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();
</script>

<style scoped>
section {
  max-width: 1000px;
  margin: auto;
  background: var(--color-background);
  color: var(--color-text);
  padding: 20px;
  border-radius: 10px;
}

h1, h2, p {
  color: var(--color-text);
}

h1 {
  text-align: center;
  word-break: break-word;
}
</style>

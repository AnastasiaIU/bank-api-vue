<script setup>
import WelcomePage from '../components/Welcome.vue';
import Navbar from '../components/Navbar.vue';
</script>

<template>
  <div class="layout-container">
    <Navbar />
    <main class="main-content">
      <WelcomePage />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background: var(--color-background);
  color: var(--color-text);
}
</style>

<script setup>
import WelcomePage from '../components/Welcome.vue';
</script>

<template>
  <div class="layout-container">
    <main class="main-content">
      <WelcomePage />
    </main>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
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

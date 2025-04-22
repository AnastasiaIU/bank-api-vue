<script setup>
import LogoIcon from './icons/IconLogo.vue'
import AppNameIcon from './icons/IconAppName.vue'
</script>

<template>
  <section class="card p-3">
    <div class="d-flex align-items-center justify-content-center">
      <LogoIcon class="my-3 me-3" size="48" />
      <AppNameIcon height="48" />
    </div>
    <div class="d-flex align-items-center justify-content-between">
      <RouterLink to="/login"><button class="btn btn-primary">Bank App</button></RouterLink>
      <RouterLink to="/atm"><button class="btn btn-primary">ATM</button></RouterLink>
    </div>
  </section>
</template>

<style scoped>
.card {
  width: 300px;
  justify-self: center;
  margin: 16px;
}

.btn {
  height: 56px;
  width: 120px;
}
</style>

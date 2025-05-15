<template>
  <div class="col">
    <router-link
      :to="route"
      class="card h-100 shadow-sm btn btn-outline-primary text-center text-decoration-none d-flex flex-column justify-content-center align-items-center"
      tabindex="0"
    >
        <div class="card-header">
            <h5 class="card-title mb-0">{{ title }}</h5>
        </div>
      <div class="card-body">
        <p class="card-subtitle mb-3 fw-normal">{{ subtitle }}</p>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  route: { type: String, required: true },
})
</script>

<style scoped>
.card-header {
  background-color: transparent;
  border: none;
}
</style>
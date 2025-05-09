<template>
    <div class="spinner-overlay" role="status">
      <div :class="spinnerClass" aria-hidden="true"></div>
      <span v-if="message" class="text-muted mt-2">{{ message }}</span>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    size: {
      type: String,
      default: "md", // 'sm', 'md', 'lg'
    },
    message: {
      type: String,
      default: "",
    },
  });
  
  const spinnerClass = {
    sm: "spinner-border spinner-border-sm text-primary",
    md: "spinner-border text-primary",
    lg: "spinner-border text-primary",
  }[props.size];
  </script>
  
  <style scoped>
  .spinner-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.765);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  </style>
  
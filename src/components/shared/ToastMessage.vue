<template>
    <div v-if="visible" :class="['toast-message', toastClass]">
      {{ message }}
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, computed } from "vue";
  
  const props = defineProps({
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "success", // success, error, warning, info
    },
    duration: {
      type: Number,
      default: 3000,
    },
  });
  
  const visible = ref(false);
  
  const toastClass = computed(() => {
    switch (props.type) {
      case "error":
        return "toast-error";
      case "warning":
        return "toast-warning";
      case "info":
        return "toast-info";
      default:
        return "toast-success";
    }
  });
  
  onMounted(() => {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, props.duration);
  });
  </script>
  
  <style scoped>
  .toast-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 1;
    transition: opacity 0.5s ease-out;
    z-index: 1000;
  }
  
  /* Color variants */
  .toast-success {
    background-color: #28a745;
  }
  
  .toast-error {
    background-color: #dc3545;
  }
  
  .toast-warning {
    background-color: #ffc107;
    color: #212529;
  }
  
  .toast-info {
    background-color: #17a2b8;
  }
  </style>
  
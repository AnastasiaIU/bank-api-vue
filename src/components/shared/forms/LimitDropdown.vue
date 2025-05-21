<script setup>
const props = defineProps({
  modelValue: Number,
  options: Array
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <select
      class="form-select form-select-sm"
      :value="modelValue"
      @change="emit('update:modelValue', Number($event.target.value))"
  >
    <option v-for="option in options" :key="option" :value="option">
      {{ option.toLocaleString() }}
    </option>
  </select>
</template>
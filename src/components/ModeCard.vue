<script setup lang="ts">
defineProps<{
  modelValue: string;
  mode: 'photo' | 'illustration';
  title: string;
  description: string;
  icon: string;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <label 
    class="option-card" 
    :class="{ active: modelValue === mode }"
  >
    <input 
      type="radio" 
      name="mode" 
      :value="mode" 
      :checked="modelValue === mode"
      @change="$emit('update:modelValue', mode)"
      :aria-checked="modelValue === mode"
    >
    <span class="option-title">
      <span class="material-icons" style="font-size: 1.2rem; vertical-align: bottom;">{{ icon }}</span> {{ title }}
    </span>
    <span class="option-desc">{{ description }}</span>
    <span class="material-icons check-icon" aria-hidden="true">check_circle</span>
  </label>
</template>

<style scoped></style>

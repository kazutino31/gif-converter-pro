<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ modelValue: number }>();
const emit = defineEmits(['update:modelValue']);

const { locale, t } = useI18n();
const isOpen = ref(false);

const qualityLevelsMap: Record<string, string[]> = {
  'ja': ['最高', '非常に高い', '高い', 'やや高い', '標準', 'やや低い', '低い', '非常に低い', '最低', '最速'],
  'zh-TW': ['最高', '非常高', '高', '較高', '標準', '較低', '低', '非常低', '最低', '最快'],
  'en': ['Highest', 'Very High', 'High', 'Above Avg', 'Standard', 'Below Avg', 'Low', 'Very Low', 'Lowest', 'Fastest']
};

const currentLevel = computed(() => {
  const levels = qualityLevelsMap[locale.value] || qualityLevelsMap['zh-TW'];
  if (!levels) return 'N/A';
  // Slider is 1-10. Array is 0-9.
  return levels[props.modelValue - 1] || levels[0];
});

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
  }
  if (e.key === 'ArrowDown' && isOpen.value) {
    e.preventDefault();
    // 聚焦到滑桿
    const slider = document.querySelector('.quality-slider') as HTMLInputElement;
    slider?.focus();
  }
};
</script>

<template>
  <div class="accordion-item">
    <button 
      class="accordion-header" 
      type="button" 
      :aria-expanded="isOpen" 
      @click="isOpen = !isOpen"
      @keydown="handleKeydown"
      data-accordion-target="qualityPanel"
    >
      <span>
        <span class="material-icons" style="font-size:1.1rem; vertical-align:middle;">tune</span>
        <span> {{ t('accordion_quality') }}</span>
      </span>
      <span class="accordion-chevron material-icons">chevron_right</span>
    </button>
    
    <div v-show="isOpen" class="accordion-panel" id="qualityPanel">
      <div class="quality-control">
        <div class="quality-header">
          <div class="quality-label">
            <span class="material-icons" style="font-size: 1.2rem;">tune</span>
            <span>{{ t('quality_label') }}</span>
          </div>
          <div class="quality-value">{{ currentLevel }}</div>
        </div>
        <input 
          type="range" 
          class="quality-slider" 
          min="1" max="10" step="1"
          :value="modelValue" 
          @input="e => $emit('update:modelValue', parseInt((e.target as HTMLInputElement).value))"
          aria-label="GIF quality control"
        >
        <div class="quality-hints">
          <span>{{ t('quality_high') }}</span>
          <span>{{ t('quality_low') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

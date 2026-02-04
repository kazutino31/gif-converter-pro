<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFileDialog } from '@vueuse/core';
import colors from '../utils/colors.ts';

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
  (e: 'files-selected', files: File[]): void
}>();

const { t } = useI18n();

const isDragOver = ref(false);
const batchMode = ref(false);

const { open, onChange } = useFileDialog({
  accept: 'image/png,image/jpeg,image/jpg',
  multiple: true
});

// 監聽檔案選擇
onChange((files) => {
  if (!files || files.length === 0) return;
  
  if (batchMode.value) {
    // 批量模式：發送所有選中的檔案
    emit('files-selected', Array.from(files));
  } else {
    // 單檔模式：只處理第一個檔案
    const firstFile = files[0];
    if (firstFile) {
      emit('file-selected', firstFile);
    }
  }
});

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;
  
  if (batchMode.value) {
    // 批量模式：發送所有拖放的檔案
    emit('files-selected', Array.from(files));
  } else {
    // 單檔模式：只處理第一個檔案
    const firstFile = files[0];
    if (firstFile) {
      emit('file-selected', firstFile);
    }
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    open();
  }
};

const handleDragEnd = () => {
  isDragOver.value = false;
};
</script>

<template>
  <div class="upload-container">
    <!-- Batch Mode Toggle -->
    <div class="batch-toggle">
      <label class="toggle-label">
        <input type="checkbox" v-model="batchMode" class="toggle-checkbox" />
        <span class="toggle-text">
          <span class="material-icons">burst_mode</span>
          {{ t('batch_mode') }}
        </span>
      </label>
    </div>

    <div 
      class="upload-area" 
      :class="{ dragover: isDragOver }"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @dragend="handleDragEnd"
      @drop.prevent="onDrop"
      @click="open()"
      @keydown="handleKeydown"
      role="button" 
      tabindex="0" 
      aria-label="選擇圖片檔案"
    >
      <div class="upload-icon" aria-hidden="true">
        <span class="material-icons">cloud_upload</span>
      </div>
      <p class="upload-text" data-i18n="upload_text">{{ t('upload_text') }}</p>
      <p class="upload-hint" data-i18n="upload_hint">
        {{ batchMode ? t('upload_hint_batch') : t('upload_hint') }}
      </p>

      <div class="upload-custom-btn">
        <span class="material-icons" style="font-size: 1.2rem;">folder_open</span>
        <span data-i18n="btn_select_file">{{ t('btn_select_file') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.batch-toggle {
  display: flex;
  justify-content: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 1rem;
  background: v-bind('colors.white');
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.toggle-label:hover {
  border-color: var(--primary-color);
}

.toggle-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
}

.toggle-text .material-icons {
  font-size: 1.2rem;
  color: var(--primary-color);
}
</style>
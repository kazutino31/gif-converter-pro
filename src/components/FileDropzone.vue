<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>();

const { t } = useI18n();

const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) emit('file-selected', file);
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) emit('file-selected', file);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.value?.click();
  }
};

const handleDragEnd = () => {
  isDragOver.value = false;
};
</script>

<template>
  <div 
    class="upload-area" 
    :class="{ dragover: isDragOver }"
    @dragover.prevent="isDragOver = true"
    @dragleave="isDragOver = false"
    @dragend="handleDragEnd"
    @drop.prevent="onDrop"
    @click="fileInput?.click()"
    @keydown="handleKeydown"
    role="button" 
    tabindex="0" 
    aria-label="選擇圖片檔案"
  >
    <div class="upload-icon" aria-hidden="true">
      <span class="material-icons">cloud_upload</span>
    </div>
    <p class="upload-text" data-i18n="upload_text">{{ t('upload_text') }}</p>
    <p class="upload-hint" data-i18n="upload_hint">{{ t('upload_hint') }}</p>

    <div class="upload-custom-btn">
      <span class="material-icons" style="font-size: 1.2em;">folder_open</span>
      <span data-i18n="btn_select_file">{{ t('btn_select_file') }}</span>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      id="fileInput"
      accept="image/png,image/jpeg,image/jpg" 
      aria-label="選擇圖片檔案"
      @change="onFileChange"
      @click.stop
    >
  </div>
</template>

<style scoped></style>
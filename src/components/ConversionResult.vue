<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  resultUrl: string;
  originalSize: number;
  gifSize: number;
}

defineProps<Props>();
const emit = defineEmits(['reset', 'reconvert', 'download']);
const { t } = useI18n();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};
</script>

<template>
  <div class="result-area" id="resultView">
    <div class="result-header">
      <div class="result-title">
        <span class="material-icons">verified</span> 
        <span data-i18n="complete">{{ t('complete') }}</span>
      </div>
    </div>

    <div class="file-info" id="fileInfo">
      <div class="file-info-item">
        <span class="material-icons">insert_photo</span>
        <span data-i18n="original_size">{{ t('original_size') }}</span>:
        <span class="file-info-value" id="originalSize">{{ formatFileSize(originalSize) }}</span>
      </div>
      <div class="file-info-item">
        <span class="material-icons">gif</span>
        <span data-i18n="gif_size">{{ t('gif_size') }}</span>:
        <span class="file-info-value" id="gifSize">{{ formatFileSize(gifSize) }}</span>
      </div>
    </div>

    <div class="preview-box">
      <img :src="resultUrl" alt="Generated GIF" id="resultImage">
    </div>

    <div class="action-buttons">
      <button class="btn btn-secondary" id="resetBtn" @click="emit('reset')">
        <span class="material-icons">arrow_back</span>
        <span data-i18n="btn_reset">{{ t('btn_reset') }}</span>
      </button>
      <button class="btn btn-secondary" id="reconvertBtn" @click="emit('reconvert')">
        <span class="material-icons">autorenew</span>
        <span data-i18n="btn_reconvert">{{ t('btn_reconvert') }}</span>
      </button>
      <button class="btn btn-primary" id="downloadBtn" @click="emit('download')">
        <span class="material-icons">download</span>
        <span data-i18n="btn_download">{{ t('btn_download') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped></style>

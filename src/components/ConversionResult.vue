<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  resultUrl: string;
  originalSize: number;
  gifSize: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['reset', 'reconvert', 'download']);
const { t } = useI18n();

const downloadFormat = ref<'gif' | 'webp' | 'png'>('gif');

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

const compressionRatio = computed(() => {
  if (props.originalSize === 0) return '0';
  const ratio = ((props.originalSize - props.gifSize) / props.originalSize) * 100;
  return ratio.toFixed(1);
});

const sizeChange = computed(() => {
  const diff = props.gifSize - props.originalSize;
  return diff > 0 ? '+' + formatFileSize(diff) : formatFileSize(Math.abs(diff));
});
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
      
      <!-- Compression Stats -->
      <div class="compression-stats">
        <div class="stat-item">
          <span class="stat-label">{{ t('compression_ratio') }}</span>
          <span class="stat-value" :class="{ 'stat-positive': parseFloat(compressionRatio) > 0, 'stat-negative': parseFloat(compressionRatio) < 0 }">
            {{ compressionRatio }}%
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">{{ t('size_change') }}</span>
          <span class="stat-value" :class="{ 'stat-positive': gifSize < originalSize, 'stat-negative': gifSize > originalSize }">
            {{ sizeChange }}
          </span>
        </div>
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
    </div>

    <!-- Download Section with Format Selection -->
    <div class="download-section">
      <div class="format-selector">
        <label>{{ t('download_format') }}</label>
        <select v-model="downloadFormat" class="format-select">
          <option value="gif">GIF</option>
          <option value="webp">WebP</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <button class="btn btn-primary btn-download-full" id="downloadBtn" @click="emit('download', downloadFormat)">
        <span class="material-icons">download</span>
        <span data-i18n="btn_download">{{ t('btn_download') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.download-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.format-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.format-selector label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.format-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.format-select:focus {
  border-color: var(--primary-color);
}

.btn-download-full {
  width: 100%;
  justify-content: center;
}
</style>

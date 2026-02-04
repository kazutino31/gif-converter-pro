<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import colors from '../utils/colors.ts';

interface BatchItem {
  name: string;
  resultUrl: string;
  originalSize: number;
  gifSize: number;
  status: 'processing' | 'completed' | 'error';
  progress: number;
}

interface Props {
  items: BatchItem[];
}

const props = defineProps<Props>();
const emit = defineEmits(['download-all', 'download-item', 'reset']);
const { t } = useI18n();

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

const completedItems = computed(() => props.items.filter(item => item.status === 'completed'));
const processingItems = computed(() => props.items.filter(item => item.status === 'processing'));
const totalProgress = computed(() => {
  if (props.items.length === 0) return 0;
  const sum = props.items.reduce((acc, item) => acc + item.progress, 0);
  return Math.round(sum / props.items.length);
});
</script>

<template>
  <div class="batch-results">
    <div class="batch-header">
      <h3>
        <span class="material-icons">collections</span>
        {{ t('batch_results') }}
      </h3>
      <div class="batch-stats">
        <span>{{ completedItems.length }} / {{ items.length }} {{ t('completed') }}</span>
        <span v-if="processingItems.length > 0" class="processing-indicator">
          <span class="spinner-small"></span>
          {{ t('processing') }}
        </span>
      </div>
    </div>

    <!-- Overall Progress -->
    <div v-if="processingItems.length > 0" class="overall-progress">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: totalProgress + '%' }">
          <span class="progress-percentage">{{ totalProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- Items List -->
    <div class="batch-items">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        class="batch-item"
        :class="{ 'item-completed': item.status === 'completed', 'item-processing': item.status === 'processing' }"
      >
        <div class="item-preview">
          <img v-if="item.resultUrl" :src="item.resultUrl" :alt="item.name" />
          <div v-else class="preview-placeholder">
            <span class="material-icons">image</span>
          </div>
        </div>
        
        <div class="item-info">
          <div class="item-name">{{ item.name }}</div>
          <div class="item-details">
            <span v-if="item.status === 'completed'">
              {{ formatFileSize(item.gifSize) }}
            </span>
            <span v-else-if="item.status === 'processing'" class="processing-text">
              {{ item.progress }}%
            </span>
          </div>
        </div>

        <div class="item-actions">
          <button 
            v-if="item.status === 'completed'"
            @click="emit('download-item', index)"
            class="btn-icon"
            :title="t('btn_download')"
          >
            <span class="material-icons">download</span>
          </button>
          <span v-else-if="item.status === 'processing'" class="status-icon">
            <span class="spinner-small"></span>
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="batch-actions">
      <button 
        @click="emit('reset')" 
        class="btn btn-secondary"
      >
        <span class="material-icons">arrow_back</span>
        {{ t('btn_reset') }}
      </button>
      <button 
        @click="emit('download-all')" 
        class="btn btn-primary"
        :disabled="completedItems.length === 0"
      >
        <span class="material-icons">download</span>
        {{ t('download_all') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.batch-results {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.batch-header {
  text-align: center;
}

.batch-header h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-main);
}

.batch-header h3 .material-icons {
  color: var(--primary-color);
}

.batch-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.processing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid v-bind('colors.borderMedium');
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.overall-progress {
  margin: 1rem 0;
}

.batch-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.batch-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: v-bind('colors.white');
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}
.batch-item {
  width: 100%;
  box-sizing: border-box;
}

.item-preview img {
  max-width: 100%;
  height: auto;
  display: block;
}

.item-completed {
  border-color: v-bind('colors.success');
  background: #f0fdf4; /* Light green, 可以考慮新增到 colors.ts */
}

.item-processing {
  border-color: var(--primary-color);
  background: v-bind('colors.bgBlue');
}

.item-preview {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: v-bind('colors.gray100');
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  color: v-bind('colors.gray400');
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-details {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.processing-text {
  color: var(--primary-color);
  font-weight: 600;
}

.item-actions {
  display: flex;
  align-items: center;
}

.btn-icon {
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: v-bind('colors.gray200');
}

.status-icon {
  padding: 0.5rem;
}

.batch-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .batch-actions {
    flex-direction: column;
  }
  
  .batch-actions button {
    width: 100%;
  }
}
</style>

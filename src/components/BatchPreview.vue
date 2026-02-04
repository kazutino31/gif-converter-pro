<template>
  <div class="batch-preview">
    <div class="batch-preview-header">
      <h3>{{ t('batch_preview_title') }}</h3>
      <p class="batch-info">
        {{ t('batch_file_count', { count: files.length, limit: batchLimit }) }}
      </p>
    </div>

    <!-- 新增更多檔案按鈕 -->
    <div v-if="files.length < batchLimit" class="add-more-section">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        multiple
        style="display: none"
        @change="handleFileChange"
      />
      <button @click="triggerFileInput" class="btn btn-add-more">
        <span class="material-icons">add_photo_alternate</span>
        {{ t('add_more_files') }}
      </button>
    </div>

    <div class="file-list">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <div class="file-icon">
          <span class="material-icons">image</span>
        </div>
        <div class="file-info">
          <div class="file-name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <button 
          @click="removeFile(index)" 
          class="btn-remove"
          :title="t('remove_file')"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>

    <div class="batch-actions">
      <button @click="emit('cancel')" class="btn btn-secondary">
        <span class="material-icons">close</span>
        {{ t('cancel_batch') }}
      </button>
      <button @click="emit('confirm')" class="btn btn-primary">
        <span class="material-icons">check</span>
        {{ t('confirm_batch') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import colors from '../utils/colors.ts';

interface Props {
  files: File[];
  batchLimit: number;
}

interface Emits {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'add-more', files: File[]): void;
  (e: 'remove', index: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useI18n();
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (files.length > 0) {
    emit('add-more', files);
  }
  // 清空 input，允許重複選擇相同檔案
  input.value = '';
};

const removeFile = (index: number) => {
  emit('remove', index);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
.batch-preview {
  display: flex;
  flex-direction: column;
}

.add-more-section {
  margin-bottom: 16px;
  text-align: center;
}

.btn-add-more {
  background: v-bind('colors.gray200');
  color: v-bind('colors.deep');
  border: 2px dashed v-bind('colors.borderColor');
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
}

.btn-add-more:hover {
  background: v-bind('colors.gray300');
  border-color: v-bind('colors.borderDark');
  transform: translateY(-1px);
}

.btn-add-more .material-icons {
  font-size: 1.25rem;
}

.batch-preview-header {
  margin-bottom: 20px;
  text-align: center;
}

.batch-preview-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-main);
}

.batch-info {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.file-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
  position: relative;
}

.file-item:hover {
  background-color: v-bind('colors.gray100');
}

.file-item:hover .btn-remove {
  opacity: 1;
}

.file-icon {
  margin-right: 12px;
  color: var(--primary-color);
}

.file-icon .material-icons {
  font-size: 2rem;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 0.25rem;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  opacity: 0;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: v-bind('colors.errorDark');
  color: v-bind('colors.white');
  transform: scale(1.1);
}

.btn-remove .material-icons {
  font-size: 1.125rem;
}

.batch-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Removed local .btn and .btn-cancel styles to use global ones */

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-muted);
  opacity: 0;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: v-bind('colors.errorDark');
  color: v-bind('colors.white');
  transform: scale(1.1);
}

.btn-remove .material-icons {
  font-size: 1.125rem;
}

@media (max-width: 500px) {
  .batch-actions {
    flex-direction: column;
  }
  .batch-actions button {
    width: 100%;
  }
  .file-item:hover .btn-remove {
    opacity: 1; 
  }
  .btn-remove {
    opacity: 1; 
  }
}
</style>

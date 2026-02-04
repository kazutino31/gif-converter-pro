<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGif } from './composables/useGif';
import { toast } from 'vue-sonner'
import LangSelector from './components/LangSelector.vue';
import ModeCard from './components/ModeCard.vue';
import SettingsPanel from './components/SettingsPanel.vue';
import FileDropzone from './components/FileDropzone.vue';
import ConversionResult from './components/ConversionResult.vue';
import ImageCropper from './components/ImageCropper.vue';
import WatermarkPanel from './components/WatermarkPanel.vue';
import BatchResults from './components/BatchResults.vue';
import BatchPreview from './components/BatchPreview.vue';
import MainLayout from './components/common/MainLayout.vue';
import type { WatermarkOptions } from './composables/useGif';
import WatermarkLivePreview from './components/WatermarkLivePreview.vue';
import colors from './utils/colors.ts';

const { t } = useI18n();

const { isProcessing, resultUrl, state, generateGif, originalImage, cleanup, progress } = useGif();

const selectedMode = ref<'photo' | 'illustration'>('photo');

const quality = ref(1);

// 浮水印設定
const watermarkOptions = ref<WatermarkOptions>({
  enabled: false,
  type: 'text',
  text: '',
  position: 'bottom-right',
  fontSize: 24,
  imageSize: 100,
  opacity: 0.7,
  color: colors.white
});

// 裁切流程狀態
const isCropping = ref(false);
const enableCrop = ref(false);
const showCropOption = ref(false);
const tempImageUrl = ref('');
const tempFile = ref<File | null>(null);

// 批量處理狀態
interface BatchItem {
  name: string;
  resultUrl: string;
  originalSize: number;
  gifSize: number;
  status: 'processing' | 'completed' | 'error';
  progress: number;
}
const batchMode = ref(false);
const batchItems = ref<BatchItem[]>([]);
const batchPendingFiles = ref<File[]>([]);
const isBatchProcessing = ref(false);
const BATCH_LIMIT = 20; // 批量處理上限

// 檔案類型驗證
const SUPPORTED_FORMATS = /image\/(png|jpe?g)/;

const handleFileSelect = (file: File) => {
  // 驗證檔案類型
  if (!file?.type?.match(SUPPORTED_FORMATS)) {
    toast.error(t('error_file_type'));
    return;
  }

  state.originalName = file.name.replace(/\.[^/.]+$/, '');
  state.originalSize = file.size;
  tempFile.value = file;
  
  // 讀取圖片並顯示裁切選項
  const reader = new FileReader();
  reader.onload = (event) => {
    tempImageUrl.value = event.target?.result as string;
    showCropOption.value = true;
    enableCrop.value = false;
  };
  reader.readAsDataURL(file);
};

const handleFilesSelect = async (files: File[]) => {
  // 驗證批量上限
  if (files.length > BATCH_LIMIT) {
    toast.error(t('batch_limit_exceeded', { limit: BATCH_LIMIT }));
    return;
  }

  // 驗證檔案類型
  const validFiles = files.filter(file => file?.type?.match(SUPPORTED_FORMATS));
  if (validFiles.length === 0) {
    toast.error(t('error_file_type'));
    return;
  }

  if (validFiles.length < files.length) {
    toast.warning(t('some_files_skipped', { count: files.length - validFiles.length }));
  }

  // 儲存待處理檔案，等待使用者確認
  batchPendingFiles.value = validFiles;
  batchMode.value = true;
};

const handleAddMoreFiles = async (newFiles: File[]) => {
  // 計算目前檔案數 + 新檔案數
  const currentCount = batchPendingFiles.value.length;
  const totalCount = currentCount + newFiles.length;
  
  // 驗證是否超過上限
  if (totalCount > BATCH_LIMIT) {
    const allowedCount = BATCH_LIMIT - currentCount;
    toast.error(t('batch_add_limit_exceeded', { current: currentCount, limit: BATCH_LIMIT, allowed: allowedCount }));
    return;
  }

  // 驗證檔案類型
  const validFiles = newFiles.filter(file => file?.type?.match(SUPPORTED_FORMATS));
  if (validFiles.length === 0) {
    toast.error(t('error_file_type'));
    return;
  }

  if (validFiles.length < newFiles.length) {
    toast.warning(t('some_files_skipped', { count: newFiles.length - validFiles.length }));
  }

  // 過濾重複檔案（根據檔名和大小）
  const existingFileKeys = new Set(
    batchPendingFiles.value.map(f => `${f.name}_${f.size}`)
  );
  const uniqueFiles = validFiles.filter(
    f => !existingFileKeys.has(`${f.name}_${f.size}`)
  );

  if (uniqueFiles.length < validFiles.length) {
    const duplicateCount = validFiles.length - uniqueFiles.length;
    toast.warning(t('duplicate_files_skipped', { count: duplicateCount }));
  }

  if (uniqueFiles.length > 0) {
    // 累積檔案
    batchPendingFiles.value = [...batchPendingFiles.value, ...uniqueFiles];
    toast.success(t('files_added', { count: uniqueFiles.length }));
  }
};

const handleRemoveFile = (index: number) => {
  const removedFile = batchPendingFiles.value[index];
  batchPendingFiles.value.splice(index, 1);
  
  // 如果刪除後沒有檔案了，關閉批量模式
  if (batchPendingFiles.value.length === 0) {
    batchMode.value = false;
  }
  
  toast.success(t('file_removed', { name: removedFile?.name || '' }));
};

const confirmBatchProcessing = async () => {
  if (batchPendingFiles.value.length === 0) return;
  
  // 標記為處理中
  isBatchProcessing.value = true;
  
  // 初始化批量項目
  const files = batchPendingFiles.value;
  batchItems.value = files.map(file => ({
    name: file.name,
    resultUrl: '',
    originalSize: file.size,
    gifSize: 0,
    status: 'processing' as const,
    progress: 0
  }));

  // 清空待處理檔案
  batchPendingFiles.value = [];

  // 依序處理每個檔案
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const item = batchItems.value[i];
    if (!item || !file) continue;

    try {
      await processFileToBatch(file, i);
    } catch (error) {
      if (batchItems.value[i]) {
        batchItems.value[i]!.status = 'error';
      }
      console.error(`處理 ${file.name} 時發生錯誤:`, error);
    }
  }
  
  // 處理完成
  isBatchProcessing.value = false;
};

const cancelBatchProcessing = () => {
  // 取消批量處理，清空待處理檔案
  batchPendingFiles.value = [];
  batchMode.value = false;
};

const processFileToBatch = (file: File, index: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // 建立臨時 GIF 處理
          const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js').catch(() => fetch('/gif.worker.js'));
          const workerBlob = await response.blob();
          const workerUrl = URL.createObjectURL(workerBlob);

          const GIF = (window as any).GIF;
          const gif = new GIF({
            workers: 2,
            quality: quality.value,
            width: img.width,
            height: img.height,
            workerScript: workerUrl,
            background: colors.black,
            transparent: null,
            dither: selectedMode.value === 'photo' ? 'FloydSteinberg' : false
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d', { alpha: true });
          ctx?.drawImage(img, 0, 0);

          // 加入浮水印
          if (watermarkOptions.value?.enabled) {
            if (watermarkOptions.value.type === 'text' && watermarkOptions.value.text) {
              // 文字浮水印
              ctx!.font = `${watermarkOptions.value.fontSize}px Arial`;
              ctx!.fillStyle = watermarkOptions.value.color;
              ctx!.globalAlpha = watermarkOptions.value.opacity;
              const textMetrics = ctx!.measureText(watermarkOptions.value.text);
              const textWidth = textMetrics.width;
              const textHeight = watermarkOptions.value.fontSize;
              let x = 10, y = 10 + textHeight;
              switch (watermarkOptions.value.position) {
                case 'top-right':
                  x = canvas.width - textWidth - 10;
                  break;
                case 'bottom-left':
                  y = canvas.height - 10;
                  break;
                case 'bottom-right':
                  x = canvas.width - textWidth - 10;
                  y = canvas.height - 10;
                  break;
                case 'center':
                  x = (canvas.width - textWidth) / 2;
                  y = (canvas.height + textHeight) / 2;
                  break;
              }
              ctx!.fillText(watermarkOptions.value.text, x, y);
              ctx!.globalAlpha = 1;
            } else if (watermarkOptions.value.type === 'image' && watermarkOptions.value.imageUrl) {
              // 圖片浮水印
              await new Promise<void>((resolveWatermark) => {
                const watermarkImg = new Image();
                watermarkImg.crossOrigin = 'anonymous';
                watermarkImg.onload = () => {
                  const imgSize = watermarkOptions.value!.imageSize;
                  const aspectRatio = watermarkImg.width / watermarkImg.height;
                  const imgWidth = imgSize;
                  const imgHeight = imgSize / aspectRatio;
                  
                  let x = 10, y = 10;
                  
                  switch (watermarkOptions.value!.position) {
                    case 'top-left':
                      x = 10;
                      y = 10;
                      break;
                    case 'top-right':
                      x = canvas.width - imgWidth - 10;
                      y = 10;
                      break;
                    case 'bottom-left':
                      x = 10;
                      y = canvas.height - imgHeight - 10;
                      break;
                    case 'bottom-right':
                      x = canvas.width - imgWidth - 10;
                      y = canvas.height - imgHeight - 10;
                      break;
                    case 'center':
                      x = (canvas.width - imgWidth) / 2;
                      y = (canvas.height - imgHeight) / 2;
                      break;
                  }
                  
                  ctx!.globalAlpha = watermarkOptions.value!.opacity;
                  ctx!.drawImage(watermarkImg, x, y, imgWidth, imgHeight);
                  ctx!.globalAlpha = 1;
                  resolveWatermark();
                };
                watermarkImg.onerror = () => resolveWatermark();
                watermarkImg.src = watermarkOptions.value!.imageUrl!;
              });
            }
          }

          gif.addFrame(ctx, { delay: 500, copy: true });
          gif.addFrame(ctx, { delay: 500, copy: true });

          gif.on('progress', (p: number) => {
            const item = batchItems.value[index];
            if (item) {
              item.progress = Math.round(p * 100);
            }
          });

          gif.on('finished', (blob: Blob) => {
            const item = batchItems.value[index];
            if (item) {
              item.resultUrl = URL.createObjectURL(blob);
              item.gifSize = blob.size;
              item.status = 'completed';
              item.progress = 100;
            }
            URL.revokeObjectURL(workerUrl);
            resolve();
          });

          gif.render();
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const handleCropConfirm = (canvas: HTMLCanvasElement) => {
  // 將裁切後的 canvas 轉換為圖片並產生 GIF
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      generateGif(img, { quality: quality.value, mode: selectedMode.value, watermark: watermarkOptions.value });
      isCropping.value = false;
      tempImageUrl.value = '';
    };
    img.src = url;
  }, 'image/png');
};

const handleCropCancel = () => {
  isCropping.value = false;
  showCropOption.value = false;
  tempImageUrl.value = '';
  tempFile.value = null;
  enableCrop.value = false;
};

const handleProceed = () => {
  if (!tempImageUrl.value) return;
  
  if (enableCrop.value) {
    // 進入裁切模式
    showCropOption.value = false;
    isCropping.value = true;
  } else {
    // 直接轉換
    const img = new Image();
    img.onload = () => {
      generateGif(img, { quality: quality.value, mode: selectedMode.value, watermark: watermarkOptions.value });
      showCropOption.value = false;
      tempImageUrl.value = '';
    };
    img.src = tempImageUrl.value;
  }
};

const handleReconvert = () => {
  // 使用保存的原始圖片重新轉換
  if (!originalImage.value) {
    console.warn('沒有原始圖片可以重新轉換');
    return;
  }
  generateGif(originalImage.value, { quality: quality.value, mode: selectedMode.value, watermark: watermarkOptions.value });
};

const reset = () => {
  cleanup();
  if (originalImage.value) {
    originalImage.value = null;
  }
  
  // 重置所有設定到初始狀態
  selectedMode.value = 'photo';
  quality.value = 1;
  
  // 重置浮水印設定
  watermarkOptions.value = {
    enabled: false,
    type: 'text',
    text: '',
    position: 'bottom-right',
    fontSize: 24,
    imageSize: 100,
    opacity: 0.7,
    color: colors.white
  };
  
  // 重置裁切狀態
  isCropping.value = false;
  enableCrop.value = false;
  showCropOption.value = false;
  tempImageUrl.value = '';
  tempFile.value = null;
  
  // 重置批量處理狀態
  batchMode.value = false;
  batchItems.value = [];
  batchPendingFiles.value = [];
  isBatchProcessing.value = false;
};

const downloadBatchItem = (index: number) => {
  const item = batchItems.value[index];
  if (!item || item.status !== 'completed') return;
  
  const link = document.createElement('a');
  link.href = item.resultUrl;
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  link.download = `${item.name.replace(/\.[^/.]+$/, '')}_HQ_${timestamp}.gif`;
  link.click();
};

const downloadAllBatch = () => {
  batchItems.value.forEach((item, index) => {
    if (item.status === 'completed') {
      setTimeout(() => downloadBatchItem(index), index * 300);
    }
  });
};

const download = async (format: 'gif' | 'webp' | 'png' = 'gif') => {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  
  if (format === 'gif') {
    // 直接下載 GIF
    const link = document.createElement('a');
    link.href = resultUrl.value;
    link.download = `${state.originalName}_HQ_${timestamp}.gif`;
    link.click();
  } else {
    // 轉換為其他格式
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${state.originalName}_HQ_${timestamp}.${format}`;
            link.click();
            URL.revokeObjectURL(url);
          }
        }, `image/${format}`, format === 'webp' ? 0.9 : 1.0);
      };
      img.src = resultUrl.value;
    } catch (error) {
      toast.error(t('error_occurred'));
    }
  }
};

</script>

<template>
  <MainLayout>
    <template #header>
      <LangSelector />
      <h1>
        <span class="material-icons" style="font-size: 3rem; color: var(--primary-color);">gif_box</span>
        <span>{{ t('title') }}</span>
        <span class="badge">BETA</span>
      </h1>
      <p class="subtitle">{{ t('subtitle') }}</p>
    </template>

    <!-- Options -->
    <div class="options-grid" role="radiogroup" :aria-label="t('accordion_options')">
      <ModeCard 
        v-model="selectedMode" 
        mode="photo"
        :title="t('mode_photo')"
        :description="t('mode_photo_desc')"
        icon="image"
      />
      <ModeCard 
        v-model="selectedMode" 
        mode="illustration"
        :title="t('mode_illustration')"
        :description="t('mode_illustration_desc')"
        icon="brush"
      />
    </div>

    <!-- Quality -->
    <div class="accordion" id="mainAccordion">
      <SettingsPanel v-model="quality" />
      <WatermarkPanel v-model="watermarkOptions" />
      <WatermarkLivePreview v-if="watermarkOptions.enabled && (tempImageUrl || resultUrl)" :image-url="tempImageUrl || resultUrl" :watermark="watermarkOptions" />
    </div>

    <!-- Views -->
    
    <!-- Crop Option View -->
    <div v-if="showCropOption" id="cropOptionView">
      <div class="crop-option-container">
        <div class="crop-option-header">
          <h3>
            <span class="material-icons">image</span>
            {{ t('preview_image') }}
          </h3>
        </div>
        
        <div class="crop-preview-box">
          <img :src="tempImageUrl" alt="Preview" />
        </div>
        
        <div class="crop-option-control">
          <label class="crop-checkbox-label">
            <input type="checkbox" v-model="enableCrop" class="crop-checkbox" />
            <span class="material-icons">{{ enableCrop ? 'check_box' : 'check_box_outline_blank' }}</span>
            <span class="crop-checkbox-text">{{ t('enable_crop') }}</span>
          </label>
        </div>
        
        <div class="crop-option-actions">
          <button @click="handleCropCancel" class="btn btn-secondary">
            <span class="material-icons">close</span>
            {{ t('btn_cancel') }}
          </button>
          <button @click="handleProceed" class="btn btn-primary">
            <span class="material-icons">{{ enableCrop ? 'crop' : 'play_arrow' }}</span>
            {{ enableCrop ? t('btn_start_crop') : t('btn_start_convert') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Cropper View -->
    <div v-else-if="isCropping" id="cropperView">
      <ImageCropper 
        :image-url="tempImageUrl" 
        @confirm="handleCropConfirm"
        @cancel="handleCropCancel"
      />
    </div>

    <!-- Batch Preview -->
    <BatchPreview
      v-else-if="batchPendingFiles.length > 0"
      :files="batchPendingFiles"
      :batch-limit="BATCH_LIMIT"
      @confirm="confirmBatchProcessing"
      @cancel="cancelBatchProcessing"
      @add-more="handleAddMoreFiles"
      @remove="handleRemoveFile"
    />

    <!-- Upload View -->
    <div v-else-if="!isProcessing && !resultUrl && !batchMode" id="uploadView">
      <FileDropzone 
        @file-selected="handleFileSelect"
        @files-selected="handleFilesSelect"
      />
    </div>

    <!-- Loading View -->
    <div v-if="isProcessing" class="loading" id="loadingView">
      <div class="spinner"></div>
      <div class="progress-text">{{ t('processing') }}</div>
      <div class="progress-detail">{{ t('optimizing') }}</div>
      
      <!-- Progress Bar -->
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }">
          <span class="progress-percentage">{{ progress }}%</span>
        </div>
      </div>
    </div>

    <!-- Result View -->
    <ConversionResult 
      v-if="resultUrl && !isProcessing && !batchMode"
      :result-url="resultUrl"
      :original-size="state.originalSize"
      :gif-size="state.gifSize"
      @reset="reset"
      @reconvert="handleReconvert"
      @download="download"
    />

    <!-- Batch Results View -->
    <BatchResults
      v-if="batchMode && batchItems.length > 0"
      :items="batchItems"
      @download-all="downloadAllBatch"
      @download-item="downloadBatchItem"
      @reset="reset"
    />
  </MainLayout>
  <Toaster position="top-center" :close-button="true" closeButtonPosition="top-right" richColors />
</template>

<style scoped>
.crop-option-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.crop-option-header {
  text-align: center;
}

.crop-option-header h3 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-main);
}

.crop-option-header h3 .material-icons {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.crop-preview-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: v-bind('colors.gray50');
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
}

.crop-preview-box img {
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.crop-option-control {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.crop-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  padding: 0.75rem 1.5rem;
  background: v-bind('colors.white');
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.crop-checkbox-label:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px v-bind('colors.shadowMedium');
}

.crop-checkbox {
  display: none;
}

.crop-checkbox-label .material-icons {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.crop-checkbox-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
}

.crop-option-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .crop-preview-box img {
    max-height: 300px;
  }
  
  .crop-option-actions {
    flex-direction: column;
  }
  
  .crop-option-actions button {
    width: 100%;
  }
}
</style>

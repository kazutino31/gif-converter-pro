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

const { t } = useI18n();

const { isProcessing, resultUrl, state, generateGif, originalImage } = useGif();

const selectedMode = ref<'photo' | 'illustration'>('photo');

const quality = ref(1);

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
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
        generateGif(img, { quality: quality.value, mode: selectedMode.value });
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleReconvert = () => {
  // 使用保存的原始圖片重新轉換
  if (!originalImage.value) {
    console.log('沒有原始圖片可以重新轉換');
    return;
  }
  generateGif(originalImage.value, { quality: quality.value, mode: selectedMode.value });
};

const reset = () => {
  resultUrl.value = '';
  if (originalImage.value) {
    originalImage.value = null;
  }
};

const download = () => {
  const link = document.createElement('a');
  link.href = resultUrl.value;
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  link.download = `${state.originalName}_HQ_${timestamp}.gif`;
  link.click();
};

</script>

<template>
  <div class="container">
    <header>
      <LangSelector />
      <h1>
        <span class="material-icons" style="font-size: 3rem; color: var(--primary-color);">gif_box</span>
        <span>{{ t('title') }}</span>
        <span class="badge">BETA</span>
      </h1>
      <p class="subtitle">{{ t('subtitle') }}</p>
    </header>

    <div class="panel">
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
      </div>

      <!-- Views -->
      
      <!-- Upload View -->
      <div v-if="!isProcessing && !resultUrl" id="uploadView">
        <FileDropzone @file-selected="handleFileSelect" />
      </div>

      <!-- Loading View -->
      <div v-if="isProcessing" class="loading" id="loadingView">
        <div class="spinner"></div>
        <div class="progress-text">{{ t('processing') }}</div>
        <div class="progress-detail">{{ t('optimizing') }}</div>
      </div>

      <!-- Result View -->
      <ConversionResult 
        v-if="resultUrl && !isProcessing"
        :result-url="resultUrl"
        :original-size="state.originalSize"
        :gif-size="state.gifSize"
        @reset="reset"
        @reconvert="handleReconvert"
        @download="download"
      />

    </div>
  </div>
  <Toaster position="top-center" :close-button="true" closeButtonPosition="top-right" richColors />
</template>

<style scoped></style>

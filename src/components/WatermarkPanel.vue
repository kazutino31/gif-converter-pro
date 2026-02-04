<script setup lang="ts">
import { ref, onScopeDispose } from 'vue';
import { useI18n } from 'vue-i18n';
import colors from '../utils/colors.ts';

export interface WatermarkOptions {
  enabled: boolean;
  type: 'text' | 'image';
  text: string;
  imageUrl?: string;
  imageFile?: File;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: number;
  imageSize: number;
  opacity: number;
  color: string;
}

const watermark = defineModel<WatermarkOptions>({
  required: true
});

const { t } = useI18n();
const isOpen = ref(false);
const imageInputRef = ref<HTMLInputElement | null>(null);

const positions = [
  { value: 'top-left', label: t('watermark_position_tl') },
  { value: 'top-right', label: t('watermark_position_tr') },
  { value: 'bottom-left', label: t('watermark_position_bl') },
  { value: 'bottom-right', label: t('watermark_position_br') },
  { value: 'center', label: t('watermark_position_center') }
];

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      watermark.value.enabled = true;
    }
  }
};

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    watermark.value.enabled = true;
  } else {
    watermark.value.enabled = false;
  }
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && file.type.match(/^image\//)) {
    watermark.value.imageFile = file;
    watermark.value.imageUrl = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  if (watermark.value.imageUrl) {
    URL.revokeObjectURL(watermark.value.imageUrl);
  }
  watermark.value.imageUrl = undefined;
  watermark.value.imageFile = undefined;
  if (imageInputRef.value) {
    imageInputRef.value.value = '';
  }
};

// 元件卸載時清理圖片 URL
onScopeDispose(() => {
  if (watermark.value.imageUrl) {
    URL.revokeObjectURL(watermark.value.imageUrl);
  }
});
</script>

<template>
  <div class="accordion-item">
    <button 
      class="accordion-header" 
      type="button" 
      :aria-expanded="isOpen" 
      @click="toggleAccordion"
      @keydown="handleKeydown"
      data-accordion-target="watermarkPanel"
    >
      <span>
        <span class="material-icons" style="font-size:1.1rem; vertical-align:middle;">text_fields</span>
        <span> {{ t('watermark_title') }}</span>
      </span>
      <span class="accordion-chevron material-icons">chevron_right</span>
    </button>

    <div v-show="isOpen" class="accordion-panel" id="watermarkPanel">
      <div class="watermark-content">
      <!-- 類型選擇 -->
      <div class="form-group">
        <label>{{ t('watermark_type') }}</label>
        <div class="type-selector">
          <label class="type-option" :class="{ active: watermark.type === 'text' }">
            <input type="radio" v-model="watermark.type" value="text" />
            <span class="material-icons">text_fields</span>
            <span>{{ t('watermark_type_text') }}</span>
          </label>
          <label class="type-option" :class="{ active: watermark.type === 'image' }">
            <input type="radio" v-model="watermark.type" value="image" />
            <span class="material-icons">image</span>
            <span>{{ t('watermark_type_image') }}</span>
          </label>
        </div>
      </div>

      <!-- 文字輸入 (文字模式) -->
      <div v-if="watermark.type === 'text'" class="form-group">
        <label>{{ t('watermark_text') }}</label>
        <input 
          type="text" 
          v-model="watermark.text"
          :placeholder="t('watermark_text_placeholder')"
          class="form-input"
          maxlength="50"
        />
      </div>

      <!-- 位置選擇 -->
      <div class="form-group">
        <label>{{ t('watermark_position') }}</label>
        <select v-model="watermark.position" class="form-select">
          <option 
            v-for="pos in positions" 
            :key="pos.value" 
            :value="pos.value"
          >
            {{ pos.label }}
          </option>
        </select>
      </div>

      <!-- 字體大小 (文字模式) -->
      <div v-if="watermark.type === 'text'" class="form-group">
        <label>{{ t('watermark_font_size') }}: {{ watermark.fontSize }}px</label>
        <input 
          type="range" 
          v-model.number="watermark.fontSize"
          min="12"
          max="72"
          class="form-range"
        />
      </div>

      <!-- 圖片上傳 (圖片模式) -->
      <div v-if="watermark.type === 'image'" class="form-group">
        <label>{{ t('watermark_image') }}</label>
        <input 
          ref="imageInputRef"
          type="file" 
          accept="image/*"
          @change="handleImageUpload"
          style="display: none;"
        />
        <div v-if="!watermark.imageUrl" class="image-upload-area" @click="imageInputRef?.click()">
          <span class="material-icons">add_photo_alternate</span>
          <span>{{ t('watermark_upload_image') }}</span>
        </div>
        <div v-else class="image-preview">
          <img :src="watermark.imageUrl" alt="Watermark" />
          <button @click="removeImage" class="btn-remove-image" type="button">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>

      <!-- 圖片大小 (圖片模式) -->
      <div v-if="watermark.type === 'image'" class="form-group">
        <label>{{ t('watermark_image_size') }}: {{ watermark.imageSize }}px</label>
        <input 
          type="range" 
          v-model.number="watermark.imageSize"
          min="50"
          max="500"
          class="form-range"
        />
      </div>

      <!-- 透明度 -->
      <div class="form-group">
        <label>{{ t('watermark_opacity') }}: {{ Math.round(watermark.opacity * 100) }}%</label>
        <input 
          type="range" 
          v-model.number="watermark.opacity"
          min="0"
          max="1"
          step="0.1"
          class="form-range"
        />
      </div>

      <!-- 顏色選擇 (文字模式) -->
      <div v-if="watermark.type === 'text'" class="form-group">
        <label>{{ t('watermark_color') }}</label>
        <div class="color-picker">
          <input 
            type="color" 
            v-model="watermark.color"
            class="form-color"
          />
          <span class="color-value">{{ watermark.color }}</span>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watermark-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
}

.type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  background: v-bind('colors.white');
}

.type-option input {
  display: none;
}

.type-option:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.type-option.active {
  border-color: var(--primary-color);
  background: v-bind('colors.bgBlue');
}

.type-option .material-icons {
  font-size: 1rem;
  color: var(--primary-color);
}

.type-option span:not(.material-icons) {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.image-upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* gap: 0.5rem;
  padding: 2rem; */
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  background: v-bind('colors.gray50');
}

.image-upload-area:hover {
  border-color: var(--primary-color);
  background: v-bind('colors.bgBlue');
}

.image-upload-area .material-icons {
  /* font-size: 3rem; */
  color: var(--primary-color);
}

.image-upload-area span:not(.material-icons) {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.image-preview {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border-color);
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: v-bind('colors.error') + 'e6'; /* 90% opacity */
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: v-bind('colors.white');
  transition: all 0.2s;
}

.btn-remove-image:hover {
  background: v-bind('colors.errorDarker');
  transform: scale(1.1);
}

.btn-remove-image .material-icons {
  font-size: 1.25rem;
}
</style>

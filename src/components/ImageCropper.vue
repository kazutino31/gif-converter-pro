<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import colors from '../utils/colors.ts';

const props = defineProps<{
  imageUrl: string
}>();


const emit = defineEmits<{
  (e: 'confirm', canvas: HTMLCanvasElement): void
  (e: 'cancel'): void
}>();

const { t } = useI18n();
const cropperRef = ref<InstanceType<typeof Cropper>>();

const handleConfirm = () => {
  const result = cropperRef.value?.getResult();
  if (result?.canvas) {
    emit('confirm', result.canvas);
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="cropper-container">
    <div class="cropper-header">
      <h2>
        <span class="material-icons">crop</span>
        {{ t('cropper_title') }}
      </h2>
      <p class="cropper-hint">{{ t('cropper_hint') }}</p>
    </div>

    <div class="cropper-wrapper">
      <Cropper
        ref="cropperRef"
        :src="imageUrl"
        :stencil-props="{
          aspectRatio: undefined,
        }"
        class="cropper"
      />
    </div>

    <div class="cropper-actions">
      <button @click="handleCancel" class="btn btn-secondary">
        <span class="material-icons">close</span>
        {{ t('btn_cancel') }}
      </button>
      <button @click="handleConfirm" class="btn btn-primary">
        <span class="material-icons">check</span>
        {{ t('btn_confirm') }}
      </button>
    </div>

  </div>
</template>

<style scoped>
.cropper-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cropper-header {
  text-align: center;
}

.cropper-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.cropper-header h2 .material-icons {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.cropper-hint {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.cropper-wrapper {
  width: 100%;
  height: 400px;
  background: v-bind('colors.black');
  border-radius: 8px;
  overflow: hidden;
}

.cropper {
  width: 100%;
  max-width: 90vw;
  height: 400px;
  background: v-bind('colors.black');
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  gap: 1rem;
  justify-content: center;
  width: 100%;
}

.cropper-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

@media (max-width: 768px) {
  .cropper-wrapper {
    height: 300px;
  }

  .cropper-actions {
    flex-direction: column;
  }

  .cropper-actions .btn {
    width: 100%;
    justify-content: center;
  }
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

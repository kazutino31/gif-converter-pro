<script setup lang="ts">
import { watch, ref } from 'vue';
import type { WatermarkOptions } from '../composables/useGif';
import colors from '../utils/colors.ts';

const props = defineProps<{
  imageUrl: string;
  watermark: WatermarkOptions;
}>();

const previewUrl = ref('');
const canvasRef = ref<HTMLCanvasElement | null>(null);

const drawPreview = async () => {
  if (!props.imageUrl) {
    previewUrl.value = '';
    return;
  }
  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  img.onload = async () => {
    const canvas = canvasRef.value!;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    // 浮水印渲染
    if (props.watermark.enabled) {
      if (props.watermark.type === 'text' && props.watermark.text) {
        ctx.font = `${props.watermark.fontSize}px Arial`;
        ctx.fillStyle = props.watermark.color;
        ctx.globalAlpha = props.watermark.opacity;
        const textMetrics = ctx.measureText(props.watermark.text);
        const textWidth = textMetrics.width;
        const textHeight = props.watermark.fontSize;
        let x = 10, y = 10 + textHeight;
        switch (props.watermark.position) {
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
        ctx.fillText(props.watermark.text, x, y);
        ctx.globalAlpha = 1;
      } else if (props.watermark.type === 'image' && props.watermark.imageUrl) {
        await new Promise<void>((resolve) => {
          const watermarkImg = new window.Image();
          watermarkImg.crossOrigin = 'anonymous';
          watermarkImg.onload = () => {
            const imgSize = props.watermark.imageSize;
            const aspectRatio = watermarkImg.width / watermarkImg.height;
            const imgWidth = imgSize;
            const imgHeight = imgSize / aspectRatio;
            let x = 10, y = 10;
            switch (props.watermark.position) {
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
            ctx.globalAlpha = props.watermark.opacity;
            ctx.drawImage(watermarkImg, x, y, imgWidth, imgHeight);
            ctx.globalAlpha = 1;
            resolve();
          };
          watermarkImg.onerror = () => resolve();
          watermarkImg.src = props.watermark.imageUrl!;
        });
      }
    }
    previewUrl.value = canvas.toDataURL('image/png');
  };
  img.onerror = () => {
    previewUrl.value = '';
  };
  img.src = props.imageUrl;
};

watch(() => [props.imageUrl, props.watermark], drawPreview, { deep: true, immediate: true });
</script>

<template>
  <div class="watermark-live-preview">
    <canvas ref="canvasRef" style="display:none;"></canvas>
    <div v-if="previewUrl">
      <img :src="previewUrl" alt="Live Preview" class="preview-image" />
    </div>
    <div v-else class="preview-placeholder">
      <span class="material-icons">image</span>
      <span>預覽區</span>
    </div>
  </div>
</template>

<style scoped>
.watermark-live-preview {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.preview-image {
  max-width: 100%;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px v-bind('colors.shadowMedium');
}
.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-muted);
  font-size: 1rem;
  gap: 0.5rem;
  padding: 2rem;
}
.preview-placeholder .material-icons {
  font-size: 2rem;
}
</style>

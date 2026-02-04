import { ref, reactive, onScopeDispose } from 'vue'
import { toast } from 'vue-sonner'

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

// 宣告 gif.js 的型別
declare const GIF: any;

export function useGif() {
  const isProcessing = ref(false);
  const resultUrl = ref('');
  const progress = ref(0);
  const originalImage = ref<HTMLImageElement | null>(null); // 保存原始圖片以便重新轉換

  const state = reactive({
    originalSize: 0,
    gifSize: 0,
    originalName: ''
  });

  // 清理函式：釋放 blob URL
  const cleanup = () => {
    if (resultUrl.value) {
      URL.revokeObjectURL(resultUrl.value)
      resultUrl.value = ''
    }
  }
  
  // 元件卸載時自動清理
  onScopeDispose(() => {
    cleanup()
  })

const generateGif = async (imgElement: HTMLImageElement, options: { quality: number, mode: string, watermark?: WatermarkOptions }) => {
    // 在產生新的 GIF 之前，先釋放舊的 blob URL
    cleanup()
    
    isProcessing.value = true;
    progress.value = 0;
    originalImage.value = imgElement; // 保存原始圖片

    try {
      // 載入 Worker，先嘗試 CDN，失敗則 fallback 本地
      let response: Response;
      try {
        response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
        if (!response.ok) throw new Error('CDN worker 載入失敗');
      } catch {
        response = await fetch('/gif.worker.js');
        if (!response.ok) throw new Error('本地 worker 載入失敗');
      }
      const workerBlob = await response.blob();
      const workerUrl = URL.createObjectURL(workerBlob);

      // 實作 GIF 生成邏輯
      const gif = new GIF({
        workers: navigator.hardwareConcurrency || 4,
        quality: options.quality,
        width: imgElement.width,
        height: imgElement.height,
        workerScript: workerUrl,
        background: '#000000',
        transparent: null,
        dither: options.mode === 'photo' ? 'FloydSteinberg' : false
      });

      const canvas = document.createElement('canvas');
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx?.drawImage(imgElement, 0, 0);

      // 加入浮水印
      if (options.watermark?.enabled) {
        if (options.watermark.type === 'text' && options.watermark.text) {
          // 文字浮水印
        ctx!.font = `${options.watermark.fontSize}px Arial`;
        ctx!.fillStyle = options.watermark.color;
        ctx!.globalAlpha = options.watermark.opacity;
        
        const textMetrics = ctx!.measureText(options.watermark.text);
        const textWidth = textMetrics.width;
        const textHeight = options.watermark.fontSize;
        
        let x = 10, y = 10 + textHeight;
        
        switch (options.watermark.position) {
          case 'top-left':
            x = 10;
            y = 10 + textHeight;
            break;
          case 'top-right':
            x = canvas.width - textWidth - 10;
            y = 10 + textHeight;
            break;
          case 'bottom-left':
            x = 10;
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
        
        ctx!.fillText(options.watermark.text, x, y);
        ctx!.globalAlpha = 1;
        } else if (options.watermark.type === 'image' && options.watermark.imageUrl) {
          // 圖片浮水印
          await new Promise<void>((resolve) => {
            const watermarkImg = new Image();
            watermarkImg.crossOrigin = 'anonymous';
            watermarkImg.onload = () => {
              const imgSize = options.watermark!.imageSize;
              const aspectRatio = watermarkImg.width / watermarkImg.height;
              const imgWidth = imgSize;
              const imgHeight = imgSize / aspectRatio;
              
              let x = 10, y = 10;
              
              switch (options.watermark!.position) {
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
              
              ctx!.globalAlpha = options.watermark!.opacity;
              ctx!.drawImage(watermarkImg, x, y, imgWidth, imgHeight);
              ctx!.globalAlpha = 1;
              resolve();
            };
            watermarkImg.onerror = () => resolve();
            watermarkImg.src = options.watermark!.imageUrl!;
          });
        }
      }

      // 加入兩幀以形成動畫
      gif.addFrame(ctx, { delay: 500, copy: true });
      gif.addFrame(ctx, { delay: 500, copy: true });

      // 監聽進度
      gif.on('progress', (p: number) => {
        progress.value = Math.round(p * 100);
      });

      gif.on('finished', (blob: Blob) => {
        resultUrl.value = URL.createObjectURL(blob);
        state.gifSize = blob.size;
        isProcessing.value = false;
        progress.value = 100;
        URL.revokeObjectURL(workerUrl);
        toast.success('GIF 轉換完成！');
      });

      gif.render();
    } catch (error) {
      toast.error(`發生錯誤: ${error}`);
      isProcessing.value = false;
    }
  };

  return { isProcessing, resultUrl, state, generateGif, progress, originalImage, cleanup };
}
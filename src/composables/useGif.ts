import { ref, reactive } from 'vue'
import { toast } from 'vue-sonner'

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

const generateGif = async (imgElement: HTMLImageElement, options: { quality: number, mode: string }) => {
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

      // 加入兩幀以形成動畫
      gif.addFrame(ctx, { delay: 500, copy: true });
      gif.addFrame(ctx, { delay: 500, copy: true });

      gif.on('finished', (blob: Blob) => {
        resultUrl.value = URL.createObjectURL(blob);
        state.gifSize = blob.size;
        isProcessing.value = false;
        URL.revokeObjectURL(workerUrl);
        toast.success('GIF 轉換完成！');
      });

      gif.render();
    } catch (error) {
      toast.error(`發生錯誤: ${error}`);
      isProcessing.value = false;
    }
  };

  return { isProcessing, resultUrl, state, generateGif, progress, originalImage };
}
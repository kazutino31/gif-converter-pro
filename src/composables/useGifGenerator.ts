import { ref } from 'vue'

export function useGifGenerator() {
  const isProcessing = ref(false)
  const resultUrl = ref('')
  
  const processImage = async (file: File, options: { quality: number, mode: string }) => {
    isProcessing.value = true
    // 這裡封裝 gif.js 的實作
    // 記得將 Worker 檔案放置在 public 資料夾中，避免 Vite 路徑解析失敗
    isProcessing.value = false
  }

  return { isProcessing, resultUrl, processImage }
}
import { ref } from 'vue'

// 宣告 gif.js 的型別
declare const GIF: any;

export function useGifGenerator() {
  const isProcessing = ref(false)
  const resultUrl = ref('')
  const progress = ref(0)
  
  const processImage = async (file: File, options: { quality: number, mode: string }) => {
    isProcessing.value = true
    progress.value = 0

    try {
      // 讀取圖片檔案
      const reader = new FileReader()
      
      return new Promise<void>((resolve, reject) => {
        reader.onload = async (event) => {
          try {
            const img = new Image()
            
            img.onload = async () => {
              try {
                // 載入 Worker
                const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
                if (!response.ok) throw new Error(`Worker 載入失敗: ${response.status}`)
                
                const workerBlob = await response.blob()
                const workerUrl = URL.createObjectURL(workerBlob)

                // 建立 GIF 實例
                const gif = new GIF({
                  workers: navigator.hardwareConcurrency || 4,
                  quality: options.quality,
                  width: img.width,
                  height: img.height,
                  workerScript: workerUrl,
                  background: '#000000',
                  transparent: null,
                  dither: options.mode === 'photo' ? 'FloydSteinberg' : false
                })

                // 建立 canvas 並繪製圖片
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d', { alpha: true })
                ctx?.drawImage(img, 0, 0)

                // 加入兩幀以形成動畫
                gif.addFrame(ctx, { delay: 500, copy: true })
                gif.addFrame(ctx, { delay: 500, copy: true })

                // 監聽進度
                gif.on('progress', (p: number) => {
                  progress.value = Math.round(p * 100)
                })

                // 完成後處理
                gif.on('finished', (blob: Blob) => {
                  resultUrl.value = URL.createObjectURL(blob)
                  isProcessing.value = false
                  URL.revokeObjectURL(workerUrl)
                  resolve()
                })

                // 開始渲染
                gif.render()
              } catch (error) {
                isProcessing.value = false
                reject(error)
              }
            }

            img.onerror = () => {
              isProcessing.value = false
              reject(new Error('圖片載入失敗'))
            }

            img.src = event.target?.result as string
          } catch (error) {
            isProcessing.value = false
            reject(error)
          }
        }

        reader.onerror = () => {
          isProcessing.value = false
          reject(new Error('檔案讀取失敗'))
        }

        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('GIF 產生錯誤:', error)
      isProcessing.value = false
      throw error
    }
  }

  return { isProcessing, resultUrl, progress, processImage }
}
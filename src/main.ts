import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Toaster } from 'vue-sonner';
import App from './App.vue';
import 'vue-sonner/style.css';
import './assets/style.css';

const messages = {
  'ja': {
    title: 'GIFコンバーター',
    subtitle: 'PNG/JPEGを高画質アニメーションGIFに変換',
    mode_photo: '写真・グラデーション',
    mode_photo_desc: 'ディザリング有効。写真や複雑な色の画像向け。',
    mode_illustration: 'イラスト・文字',
    mode_illustration_desc: 'ディザリング無効。ベタ塗りやテキストが綺麗に出ます。',
    upload_text: '画像をドラッグ&ドロップ',
    btn_select_file: 'ファイルを選択',
    accordion_options: '変換モード',
    accordion_quality: '画質設定',
    accordion_upload: 'アップロード',
    upload_hint: 'またはクリックして選択 (PNG, JPEG)',
    processing: '最高画質で処理中...',
    optimizing: 'パレット最適化を実行しています',
    complete: '変換完了',
    btn_reset: '別の画像',
    btn_reconvert: '別モードで再変換',
    btn_download: '保存する',
    quality_label: '画質',
    quality_low: '低 (速い)',
    quality_high: '高 (遅い)',
    quality_levels: ['最高', '非常に高い', '高い', 'やや高い', '標準', 'やや低い', '低い', '非常に低い', '最低', '最速'],
    original_size: '元のサイズ',
    gif_size: 'GIFサイズ',
    error_file_type: 'PNGまたはJPEG形式の画像のみ対応しています。',
    error_occurred: 'エラーが発生しました'
  },
  'zh-TW': {
    title: 'GIF 轉換器',
    subtitle: '將 PNG/JPEG 轉換為高畫質動畫 GIF',
    mode_photo: '照片・漸層',
    mode_photo_desc: '啟用抖動效果，適合照片或複雜色彩的圖片。',
    mode_illustration: '插圖・文字',
    mode_illustration_desc: '停用抖動效果，平塗或文字會更清晰。',
    upload_text: '拖放圖片到此處',
    btn_select_file: '選擇檔案',
    accordion_options: '轉換模式',
    accordion_quality: '畫質設定',
    accordion_upload: '上傳',
    upload_hint: '或點擊選擇檔案 (PNG, JPEG)',
    processing: '正在以最高畫質處理...',
    optimizing: '正在執行調色盤優化',
    complete: '轉換完成',
    btn_reset: '選擇其他圖片',
    btn_reconvert: '以其他模式重新轉換',
    btn_download: '下載',
    quality_label: '畫質',
    quality_low: '低 (快速)',
    quality_high: '高 (較慢)',
    quality_levels: ['最高', '非常高', '高', '較高', '標準', '較低', '低', '非常低', '最低', '最快'],
    original_size: '原始大小',
    gif_size: 'GIF 大小',
    error_file_type: '僅支援 PNG 或 JPEG 格式的圖片。',
    error_occurred: '發生錯誤'
  },
  'en': {
    title: 'GIF Converter',
    subtitle: 'Convert PNG/JPEG to High-Quality Animated GIF',
    mode_photo: 'Photo・Gradient',
    mode_photo_desc: 'Dithering enabled. Best for photos and complex colors.',
    mode_illustration: 'Illustration・Text',
    mode_illustration_desc: 'Dithering disabled. Best for flat colors and text.',
    upload_text: 'Drag & Drop Image Here',
    btn_select_file: 'Select File',
    accordion_options: 'Mode',
    accordion_quality: 'Quality',
    accordion_upload: 'Upload',
    upload_hint: 'or Click to Select (PNG, JPEG)',
    processing: 'Processing in Highest Quality...',
    optimizing: 'Optimizing Color Palette',
    complete: 'Conversion Complete',
    btn_reset: 'Another Image',
    btn_reconvert: 'Reconvert (Different Mode)',
    btn_download: 'Download',
    quality_label: 'Quality',
    quality_low: 'Low (Fast)',
    quality_high: 'High (Slow)',
    quality_levels: ['Highest', 'Very High', 'High', 'Above Avg', 'Standard', 'Below Avg', 'Low', 'Very Low', 'Lowest', 'Fastest'],
    original_size: 'Original Size',
    gif_size: 'GIF Size',
    error_file_type: 'Only PNG or JPEG images are supported.',
    error_occurred: 'An error occurred'
  }
};

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('gifConverter_lang') || 'zh-TW',
  fallbackLocale: 'en',
  messages,
}) as any; 

const app = createApp(App);
app.use(i18n);
app.component('Toaster', Toaster);
app.mount('#app');

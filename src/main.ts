import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { Toaster } from 'vue-sonner';
import App from './App.vue';
import 'vue-sonner/style.css';
import './assets/style.css';
import { colors, cssVariables } from './utils/colors';

// 將 colors.ts 中的顏色設置到 CSS 變數
const setColorVariables = () => {
  const root = document.documentElement;
  
  // 設置所有 CSS 變數
  Object.entries(cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // 額外設置其他變數
  root.style.setProperty('--white', colors.white);
  root.style.setProperty('--black', colors.black);
  root.style.setProperty('--gray-50', colors.gray50);
  root.style.setProperty('--gray-100', colors.gray100);
  root.style.setProperty('--gray-200', colors.gray200);
  root.style.setProperty('--gray-300', colors.gray300);
  root.style.setProperty('--gray-400', colors.gray400);
  root.style.setProperty('--gray-500', colors.gray500);
  root.style.setProperty('--bg-light', colors.bgLight);
  root.style.setProperty('--bg-lighter', colors.bgLighter);
  root.style.setProperty('--bg-blue', colors.bgBlue);
  root.style.setProperty('--bg-blue-lighter', colors.bgBlueLighter);
  root.style.setProperty('--bg-dark', colors.bgDark);
  root.style.setProperty('--border-light', colors.borderLight);
  root.style.setProperty('--border-medium', colors.borderMedium);
  root.style.setProperty('--border-dark', colors.borderDark);
  root.style.setProperty('--success', colors.success);
  root.style.setProperty('--success-light', colors.successLight);
  root.style.setProperty('--error', colors.error);
  root.style.setProperty('--error-dark', colors.errorDark);
  root.style.setProperty('--error-darker', colors.errorDarker);
  root.style.setProperty('--warning', colors.warning);
  root.style.setProperty('--info', colors.info);
  root.style.setProperty('--checkerboard', colors.checkerboard);
  root.style.setProperty('--text-secondary', colors.textSecondary);
};

// 設置顏色變數
setColorVariables();

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
    error_occurred: 'エラーが発生しました',
    cropper_title: '画像を切り抜き',
    cropper_hint: 'ドラッグして範囲を選択、ピンチで拡大縮小',
    preview_image: '画像プレビュー',
    enable_crop: '画像を切り抜く',
    btn_start_crop: '切り抜き開始',
    btn_start_convert: '変換開始',
    btn_cancel: 'キャンセル',
    btn_confirm: '確定',
    btn_direct: '切り抜かず変換',
    watermark_title: '透かし',
    watermark_type: 'タイプ',
    watermark_type_text: 'テキスト',
    watermark_type_image: '画像',
    watermark_text: 'テキスト',
    watermark_text_placeholder: 'テキストを入力',
    watermark_image: '画像',
    watermark_upload_image: '画像をアップロード',
    watermark_image_size: '画像サイズ',
    watermark_position: '位置',
    watermark_position_tl: '左上',
    watermark_position_tr: '右上',
    watermark_position_bl: '左下',
    watermark_position_br: '右下',
    watermark_position_center: '中央',
    watermark_font_size: 'フォントサイズ',
    watermark_opacity: '不透明度',
    watermark_color: '色',
    compression_ratio: '圧縮率',
    size_change: 'サイズ変化',
    download_format: 'ダウンロード形式',
    batch_mode: 'バッチ処理',
    batch_results: 'バッチ結果',
    completed: '完了',
    upload_hint_batch: '複数の画像を選択できます',
    download_all: '全てダウンロード',
    batch_preview_title: 'バッチ処理プレビュー',
    batch_file_count: '{count} / {limit} ファイル選択済み',
    confirm_batch: '確定して開始',
    cancel_batch: 'キャンセル',
    batch_limit_exceeded: 'バッチ上限を超えています（{limit}ファイル）',
    some_files_skipped: '一部のファイルがスキップされました（{count}個）',
    add_more_files: 'ファイルを追加',
    batch_add_limit_exceeded: '追加できません！現在{current}個、上限{limit}個、あと{allowed}個のみ追加可能',
    duplicate_files_skipped: '重複ファイルがスキップされました（{count}個）',
    files_added: '{count}個のファイルを追加しました',
    remove_file: 'ファイルを削除',
    file_removed: '{name} を削除しました'
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
    error_occurred: '發生錯誤',
    cropper_title: '裁切圖片',
    cropper_hint: '拖曳選擇範圍，捏合縮放',    preview_image: '圖片預覽',
    enable_crop: '啟用裁切功能',
    btn_start_crop: '開始裁切',
    btn_start_convert: '開始轉換',    btn_cancel: '取消',
    btn_confirm: '確認',
    btn_direct: '直接轉換',
    watermark_title: '浮水印',
    watermark_type: '類型',
    watermark_type_text: '文字',
    watermark_type_image: '圖片',
    watermark_text: '文字',
    watermark_text_placeholder: '輸入文字',
    watermark_image: '圖片',
    watermark_upload_image: '上傳圖片',
    watermark_image_size: '圖片大小',
    watermark_position: '位置',
    watermark_position_tl: '左上',
    watermark_position_tr: '右上',
    watermark_position_bl: '左下',
    watermark_position_br: '右下',
    watermark_position_center: '中間',
    watermark_font_size: '字體大小',
    watermark_opacity: '透明度',
    watermark_color: '顏色',
    compression_ratio: '壓縮率',
    size_change: '大小變化',
    download_format: '下載格式',
    batch_mode: '批量處理',
    batch_results: '批量結果',
    completed: '完成',
    upload_hint_batch: '可選擇多個圖片',
    download_all: '下載全部',
    batch_preview_title: '批量處理預覽',
    batch_file_count: '已選擇 {count} / {limit} 個檔案',
    confirm_batch: '確認並開始',
    cancel_batch: '取消',
    batch_limit_exceeded: '超過批量上限（{limit} 個檔案）',
    some_files_skipped: '部分檔案被跳過（{count} 個）',
    add_more_files: '新增更多檔案',
    batch_add_limit_exceeded: '無法加入！目前 {current} 個，上限 {limit} 個，僅可再加入 {allowed} 個',
    duplicate_files_skipped: '重複檔案已跳過（{count} 個）',
    files_added: '成功加入 {count} 個檔案',
    remove_file: '移除檔案',
    file_removed: '已移除 {name}'
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
    error_occurred: 'An error occurred',
    cropper_title: 'Crop Image',
    cropper_hint: 'Drag to select area, pinch to zoom',
    preview_image: 'Image Preview',
    enable_crop: 'Enable Crop',
    btn_start_crop: 'Start Cropping',
    btn_start_convert: 'Start Converting',
    btn_cancel: 'Cancel',
    btn_confirm: 'Confirm',
    btn_direct: 'Convert Directly',
    watermark_title: 'Watermark',
    watermark_type: 'Type',
    watermark_type_text: 'Text',
    watermark_type_image: 'Image',
    watermark_text: 'Text',
    watermark_text_placeholder: 'Enter text',
    watermark_image: 'Image',
    watermark_upload_image: 'Upload Image',
    watermark_image_size: 'Image Size',
    watermark_position: 'Position',
    watermark_position_tl: 'Top Left',
    watermark_position_tr: 'Top Right',
    watermark_position_bl: 'Bottom Left',
    watermark_position_br: 'Bottom Right',
    watermark_position_center: 'Center',
    watermark_font_size: 'Font Size',
    watermark_opacity: 'Opacity',
    watermark_color: 'Color',
    compression_ratio: 'Compression',
    size_change: 'Size Change',
    download_format: 'Download Format',
    batch_mode: 'Batch Processing',
    batch_results: 'Batch Results',
    completed: 'Completed',
    upload_hint_batch: 'Multiple images can be selected',
    download_all: 'Download All',
    batch_preview_title: 'Batch Processing Preview',
    batch_file_count: '{count} / {limit} files selected',
    confirm_batch: 'Confirm and Start',
    cancel_batch: 'Cancel',
    batch_limit_exceeded: 'Batch limit exceeded ({limit} files)',
    some_files_skipped: 'Some files were skipped ({count})',
    add_more_files: 'Add More Files',
    batch_add_limit_exceeded: 'Cannot add! Currently {current}, limit {limit}, can only add {allowed} more',
    duplicate_files_skipped: 'Duplicate files skipped ({count})',
    files_added: 'Successfully added {count} files',
    remove_file: 'Remove file',
    file_removed: 'Removed {name}'
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

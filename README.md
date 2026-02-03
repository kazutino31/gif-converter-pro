# GIF Converter Pro

高品質圖片轉 GIF 動畫工具，使用 Vue 3 開發的現代化 Web 應用程式。

## 專案簡介

GIF Converter Pro 是一個瀏覽器端的圖片轉換工具，能將 PNG 和 JPEG 格式的靜態圖片轉換成高品質的動畫 GIF。所有處理都在客戶端完成，確保隱私安全。

## 主要功能

- **多種轉換模式**
  - 照片/漸層模式：啟用 Floyd-Steinberg 抖動演算法，適合處理照片或複雜色彩
  - 插圖/文字模式：停用抖動效果，適合平塗色彩和文字圖片

- **品質調整**
  - 10 個品質等級可選擇
  - 即時預覽轉換結果
  - 顯示原始檔案大小與 GIF 大小對比

- **多語言支援**
  - 日本語 (Japanese)
  - 繁體中文 (Traditional Chinese)
  - English

- **使用者體驗**
  - 拖放上傳支援
  - 鍵盤導航與無障礙支援
  - 響應式設計，支援各種螢幕尺寸
  - 即時轉換進度顯示

## 技術棧

- **框架**: Vue 3 (Composition API + Script Setup)
- **語言**: TypeScript
- **建構工具**: Vite
- **國際化**: Vue I18n
- **GIF 處理**: gif.js
- **樣式**: CSS Variables + 原生 CSS

## 專案結構

```
gif-converter-pro/
├── public/                 # 靜態資源
├── src/
│   ├── assets/            # 樣式和資源
│   │   └── style.css      # 全域樣式
│   ├── components/        # Vue 組件
│   │   ├── ConversionResult.vue    # 轉換結果顯示
│   │   ├── FileDropzone.vue        # 檔案上傳區域
│   │   ├── LangSelector.vue        # 語言選擇器
│   │   ├── ModeCard.vue            # 轉換模式卡片
│   │   └── SettingsPanel.vue       # 品質設定面板
│   ├── composables/       # 組合式函數
│   │   └── useGif.ts              # GIF 生成邏輯(CDN/本地 worker)
│   │   
│   ├── App.vue           # 主應用組件
│   └── main.ts           # 應用入口點
├── index.html            # HTML 模板
├── package.json          # 依賴配置
└── vite.config.ts        # Vite 配置
```

## 安裝與執行

### 前置需求

- Node.js 16.0 或更高版本
- npm 或 yarn 套件管理器

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用程式將在 `http://localhost:5173` 啟動。

### 建構生產版本

```bash
npm run build
```

建構完成的檔案將輸出到 `dist` 目錄。

### 預覽生產版本

```bash
npm run preview
```

## 使用說明

1. **選擇轉換模式**
   - 照片模式：適合照片、漸層等複雜色彩
   - 插圖模式：適合插畫、文字、平塗色彩

2. **調整品質設定**（可選）
   - 展開品質設定面板
   - 拖動滑桿選擇 1-10 的品質等級
   - 品質越高，處理時間越長，檔案可能越大

3. **上傳圖片**
   - 拖放圖片到上傳區域，或
   - 點擊上傳區域選擇檔案
   - 支援 PNG 和 JPEG 格式

4. **等待轉換**
   - 系統會自動開始轉換
   - 顯示處理進度訊息

5. **下載結果**
   - 查看轉換後的 GIF 預覽
   - 比對原始檔案與 GIF 檔案大小
   - 點擊「下載」按鈕儲存
   - 可選擇「重新轉換」嘗試不同設定

## 瀏覽器支援

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 需要支援 ES2015+ 和 Web Workers

## 效能考量

- GIF 轉換在瀏覽器端執行，使用 Web Workers 避免阻塞 UI
- Worker 數量會根據 CPU 核心數自動調整
- 大尺寸圖片可能需要較長處理時間
- 建議圖片尺寸控制在 2000x2000 像素以內以獲得最佳體驗

## 隱私保護

所有圖片處理完全在本地瀏覽器中完成，不會上傳至任何伺服器。圖片資料安全。

## 授權

本專案採用 MIT 授權條款。

## 開發者

如需自訂或擴展功能，請參考以下文件：

- [Vue 3 文檔](https://vuejs.org/)
- [Vite 文檔](https://vitejs.dev/)
- [Vue I18n 文檔](https://vue-i18n.intlify.dev/)
- [gif.js GitHub](https://github.com/jnordberg/gif.js)

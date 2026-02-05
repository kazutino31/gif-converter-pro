// 統一管理顏色定義

export interface Colors {
  // 主色系
  snow: string;
  ice: string;
  mist: string;
  bark: string;
  sky: string;
  deep: string;

  // 背景漸層
  bgGradientStart: string;
  bgGradientEnd: string;

  // 主要顏色系統
  primaryColor: string;
  primaryHover: string;
  
  // 新色系
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryLighter: string;
  colorSecondary: string;
  colorAccent: string;

  // 文字顏色
  textMain: string;
  textMuted: string;
  textSecondary: string;

  // 面板與邊框
  panelBg: string;
  borderColor: string;

  // 其他常用顏色
  white: string;
  black: string;
  
  // 背景與灰階
  gray50: string;
  gray100: string;
  gray200: string;
  gray300: string;
  gray400: string;
  gray500: string;
  
  // 背景色
  bgLight: string;
  bgLighter: string;
  bgBlue: string;
  bgBlueLighter: string;
  bgDark: string;
  
  // 邊框
  borderLight: string;
  borderMedium: string;
  borderDark: string;

  // 狀態顏色
  success: string;
  successLight: string;
  error: string;
  errorDark: string;
  errorDarker: string;
  warning: string;
  info: string;
  
  // 透明度相關
  overlayLight: string;
  overlayMedium: string;
  shadowLight: string;
  shadowMedium: string;
  shadowDark: string;
  
  // 陰影相關
  shadowMain: string;
  shadowHover: string;
  shadowButton: string;
  shadowButtonHover: string;
  
  // 漸層相關
  gradientQuality: string;
  gradientProgress: string;
  gradientUpload: string;
  gradientUploadHover: string;
  gradientAccordion: string;
  
  // 背景圖案 (棋盤格)
  checkerboard: string;
}

export const colors: Colors = {
  // 主色系
  snow: '#f2f2e9',
  ice: '#dce8f4',
  mist: '#a9b8c0',
  bark: '#8a827b',
  sky: '#7082a6',
  deep: '#485767',

  // 背景漸層
  bgGradientStart: '#eef2f6',
  bgGradientEnd: '#dbe4ef',

  // 主要顏色系統
  primaryColor: '#7082a6',      // var(--color-sky)
  primaryHover: '#485767',      // var(--color-deep)
  
  // 新色系
  colorPrimary: '#223A53',           // 深夜藍
  colorPrimaryLight: '#5A6B8C',      // 霧藍
  colorPrimaryLighter: '#8EC3C7',    // 淡青藍
  colorSecondary: '#F6CFC3',         // 柔粉紅
  colorAccent: '#F6E3C3',            // 柔和米黃

  // 文字顏色
  textMain: '#485767',          // var(--color-deep)
  textMuted: '#8a827b',         // var(--color-bark)
  textSecondary: '#8a827b',     // var(--color-bark)

  // 面板與邊框
  panelBg: '#ffffff',
  borderColor: '#cbd5e1',

  // 其他常用顏色
  white: '#ffffff',
  black: '#000000',
  
  // 背景與灰階
  gray50: '#f8fafc',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  
  // 背景色
  bgLight: '#fcfcfc',
  bgLighter: '#f8fafc',
  bgBlue: '#f0f7ff',
  bgBlueLighter: '#e6f2ff',
  bgDark: '#f8fafc',
  
  // 邊框
  borderLight: '#edeff2',
  borderMedium: '#e2e8f0',
  borderDark: '#cbd5e1',

  // 狀態顏色
  success: '#10b981',
  successLight: '#f0fdf4',
  error: '#ef4444',
  errorDark: '#e74c3c',
  errorDarker: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // 透明度相關
  overlayLight: 'rgba(112, 130, 166, 0.08)',
  overlayMedium: 'rgba(112, 130, 166, 0.15)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // 陰影相關
  shadowMain: 'rgba(72, 87, 103, 0.05)',
  shadowHover: 'rgba(72, 87, 103, 0.3)',
  shadowButton: 'rgba(112, 130, 166, 0.4)',
  shadowButtonHover: 'rgba(112, 130, 166, 0.2)',
  
  // 漸層相關
  gradientQuality: 'linear-gradient(to right, #8fc7a6 0%, #a6c0da 50%, #e8b89f 100%)',
  gradientProgress: 'linear-gradient(90deg, #7082a6, #223A53)',
  gradientUpload: 'linear-gradient(135deg, #fcfcfc 0%, #f8fafc 100%)',
  gradientUploadHover: 'linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%)',
  gradientAccordion: 'linear-gradient(90deg, rgba(240, 247, 255, 0.6), transparent)',
  
  // 背景圖案 (棋盤格)
  checkerboard: '#eee',
};

// 輔助函數：將顏色轉換為 rgba
export const toRgba = (color: string, opacity: number): string => {
  // 簡單的實作，如需更複雜的轉換可以使用 color 庫
  if (color.startsWith('rgba')) return color;
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  // hex 轉 rgba (簡化版本)
  return color; // 實際使用時可以加入完整的 hex to rgba 轉換
};

// CSS 變數對應表（用於需要動態設置 CSS 變數的場景）
export const cssVariables: Record<string, string> = {
  '--color-snow': colors.snow,
  '--color-ice': colors.ice,
  '--color-mist': colors.mist,
  '--color-bark': colors.bark,
  '--color-sky': colors.sky,
  '--color-deep': colors.deep,
  
  '--bg-gradient-start': colors.bgGradientStart,
  '--bg-gradient-end': colors.bgGradientEnd,
  
  '--primary-color': colors.primaryColor,
  '--primary-hover': colors.primaryHover,
  '--text-main': colors.textMain,
  '--text-muted': colors.textMuted,
  
  '--panel-bg': colors.panelBg,
  '--border-color': colors.borderColor,
  
  '--color-primary': colors.colorPrimary,
  '--color-primary-light': colors.colorPrimaryLight,
  '--color-primary-lighter': colors.colorPrimaryLighter,
  '--color-secondary': colors.colorSecondary,
  '--color-accent': colors.colorAccent,
};

export default colors;

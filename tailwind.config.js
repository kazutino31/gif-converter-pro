/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色系
        snow: '#f2f2e9',
        ice: '#dce8f4',
        mist: '#a9b8c0',
        bark: '#8a827b',
        sky: '#7082a6',
        deep: '#485767',
        
        // 新色系
        primary: {
          DEFAULT: '#223A53',
          light: '#5A6B8C',
          lighter: '#8EC3C7',
        },
        secondary: '#F6CFC3',
        accent: '#F6E3C3',
        
        // 狀態顏色
        success: {
          DEFAULT: '#10b981',
          light: '#f0fdf4',
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#e74c3c',
          darker: '#dc2626',
        },
      },
      borderRadius: {
        'panel-lg': '24px',
        'panel-md': '12px',
        'panel-sm': '8px',
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(72, 87, 103, 0.05), 0 10px 15px -3px rgba(72, 87, 103, 0.05)',
        'button': '0 4px 6px -1px rgba(112, 130, 166, 0.4)',
      },
    },
  },
}

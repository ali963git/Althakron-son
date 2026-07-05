import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';

export default defineConfig({
  base: '/Althakron-son/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'الذاكرون',
        short_name: 'الذاكرون',
        description: 'منصة إسلامية شاملة - صدقة جارية',
        theme_color: '#02130F',
        background_color: '#02130F',
        display: 'standalone',
        lang: 'ar',
        dir: 'rtl',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    }),
    compression()
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'quran-data': ['./src/data/surahs.ts', './src/data/surahPages.ts'],
          'azkar-data': ['./src/data/azkar.ts', './src/data/hisn.ts'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});

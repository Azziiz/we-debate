import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Firebase is large and rarely changes: keep it in its own cached file
        manualChunks: (id) => (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase') ? 'firebase' : undefined),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'We Debate Club',
        short_name: 'We Debate',
        description: 'For the thinkers, the challengers, the loud minds.',
        theme_color: '#04140b',
        background_color: '#04140b',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/logo192.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,png,jpg,ico,svg}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
    }),
  ],
})

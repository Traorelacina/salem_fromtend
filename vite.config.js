import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige /api/* → Laravel (ajustez le port si besoin)
      '/api': {
        target: 'https://shocked-sharla-freelence-c2692768.koyeb.app/',
        changeOrigin: true,
        secure: false,
      },
      // Redirige /storage/* → fichiers publics Laravel
      '/storage': {
        target: 'https://shocked-sharla-freelence-c2692768.koyeb.app/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
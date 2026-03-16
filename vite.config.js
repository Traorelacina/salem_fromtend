import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const target =
    mode === 'production'
      ? 'https://shocked-sharla-freelence-c2692768.koyeb.app'
      : 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/storage': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
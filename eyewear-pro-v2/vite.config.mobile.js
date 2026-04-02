import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permet l'accès depuis d'autres appareils sur le réseau
    port: 5173,
    strictPort: true,
    open: false
  },
  define: {
    'process.env': {}
  }
})

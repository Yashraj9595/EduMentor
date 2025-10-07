import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  define: {
    // Define environment variables at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api/v1'),
  },
})

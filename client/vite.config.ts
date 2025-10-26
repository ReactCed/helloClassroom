import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Optional: for allowing access from the network
    port: 3000,
    open: true, // Optional: open the browser automatically
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
})
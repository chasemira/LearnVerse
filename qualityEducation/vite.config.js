import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/LearnVerse", // Updated base path for LearnVerse
  // Helps on Windows + OneDrive / cloud-synced folders where file reads fail with UNKNOWN errors
  server: {
    watch: {
      usePolling: true,
      interval: 200,
    },
  },
})

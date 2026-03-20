import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Helps on mapped/network drives where files can be briefly locked during save.
      usePolling: true,
      interval: 120,
      awaitWriteFinish: {
        stabilityThreshold: 250,
        pollInterval: 120,
      },
    },
  },
})

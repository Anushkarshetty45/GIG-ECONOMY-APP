import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base path for GitHub Pages
  base: '/GIG-ECONOMY-APP/',
  server: {
    port: 3008,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})

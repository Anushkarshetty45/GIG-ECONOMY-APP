import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  base: '/',
  server: {
    port: 3008,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  esbuild: {
    jsx: 'automatic'
  }
})

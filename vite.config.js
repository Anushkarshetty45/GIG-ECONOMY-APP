import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  // Use different base path for dev vs production
  const base = command === 'build' ? '/GIG-ECONOMY-APP/' : '/'

  return {
    plugins: [react({
      jsxRuntime: 'automatic'
    })],
    base: base,
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
  }
})

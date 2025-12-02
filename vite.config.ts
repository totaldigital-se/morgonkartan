import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/morgonkartan/',
  plugins: [react()],
  optimizeDeps: {
    include: ['x-ray'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})

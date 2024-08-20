import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import instance from './env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: '5173'
  },
  
  preview: {
    port: 5173
  },
  base: '/soul',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: true
      },
    },
    outDir: '../dist/frontend',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Set the limit in KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendors';
            }
            if (id.includes('lodash')) {
              return 'lodash';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['node_modules', 'dist', 'build'], // Exclude directories from being watched
  },
})

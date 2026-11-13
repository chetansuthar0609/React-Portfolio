import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works on GitHub Pages under /Portfolio/ and on any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  base: '/React-Portfolio/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Keep Three.js in its own chunk so it only downloads when the hero canvas mounts.
        manualChunks(id) {
          if (id.includes('preload-helper') || id.includes('commonjsHelpers')) return 'vendor'
          if (!id.includes('node_modules')) return
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'vendor'
          if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return 'motion'
          return 'three'
        },
      },
    },
  },
})

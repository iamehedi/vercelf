import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import seoPlugin from './vite-plugin-seo.js'

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks → long-lived HTTP cache, smaller main bundle
        manualChunks(id) {
          // react-easy-crop is only used by the lazy-loaded Admin — keep it out
          // of the eagerly loaded 'react' chunk (its path starts with 'react-').
          if (id.includes('node_modules/react-easy-crop')) return 'admin'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-router')) {
            return 'react'
          }
          if (id.includes('node_modules/@supabase')) return 'supabase'
        },
      },
    },
  },
})

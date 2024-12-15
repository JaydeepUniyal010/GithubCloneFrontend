import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@primer/react/drafts': '/node_modules/@primer/react/drafts',
    },
  },
})


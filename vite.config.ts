import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/commands',
      '@codemirror/lang-python',
      '@codemirror/theme-one-dark',
      '@codemirror/autocomplete',
      '@codemirror/matchbrackets',
    ],
  },
  optimizeDeps: {
    include: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/commands',
      '@codemirror/lang-python',
      '@codemirror/theme-one-dark',
      '@codemirror/autocomplete',
      '@codemirror/matchbrackets',
    ],
  },
})


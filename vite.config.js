/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // 👈 exposes to local network
    port: 5173       // optional (default)
  },
  test: {
    environment: 'node',
  },
})

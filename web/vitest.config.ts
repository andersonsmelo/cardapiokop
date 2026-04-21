import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    alias: {
      '@': resolve(__dirname, './src')
    },
    env: {
      JWT_SECRET: 'test-secret-that-is-at-least-32-chars-long-for-testing-auth-utilities'
    }
  }
})

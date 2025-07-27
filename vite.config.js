import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This is config for thr client app

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
}
})


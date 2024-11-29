import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react']
  },
  server: {
    port: process.env.PORT,
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true
      }
    }
  }
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    proxy: {
      '/api': 'http://192.168.100.145:8080', // Spring Boot backend
      '/ws': {
        target: 'http://192.168.100.145:8080',
        ws: true,
      },
    },
  },
});

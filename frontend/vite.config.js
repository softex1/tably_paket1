import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output folder for the production build
    emptyOutDir: true,
  },
  server: {
    host: true, // Only relevant for dev
    port: 5173,  // Dev server port, won't affect production build
  },
});

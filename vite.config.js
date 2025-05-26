import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), glsl(), tailwindcss(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          react: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          gsap: ['gsap'],
        },
      },
    },
  },
  server: {
    host: mode === 'lan' ? '192.168.15.8' : 'localhost',
  },
}));

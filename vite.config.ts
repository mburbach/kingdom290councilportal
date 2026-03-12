import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '@config': resolve(__dirname, 'config')
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        wiki: resolve(__dirname, 'src/wiki.html')
      }
    }
  },
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  },
  test: {
    root: '.',
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      statements: 0.9,
      branches: 0.9,
      functions: 0.9,
      lines: 0.9
    }
  }
});

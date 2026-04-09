import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/vue') || id.includes('/node_modules/vue-router') || id.includes('/node_modules/vuex')) {
            return 'vendor';
          }
          if (id.includes('/node_modules/buefy') || id.includes('/node_modules/@ntohq')) {
            return 'buefy';
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'if-function', 'legacy-js-api', 'color-functions', 'global-builtin'],
      },
    },
  },
});

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  /* Relative base so the build works at any URL — github.io/<repo>/,
     a custom domain, or opened straight off disk — with no config. */
  base: './',
  plugins: [vue()],
  build: {
    /* One CSS file for the whole app instead of a chunk per lazy route.
       Async CSS chunks are the thing most likely to arrive stale or not
       at all on a static host, and when component CSS is missing while
       global CSS isn't, scoped styles fail silently. */
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

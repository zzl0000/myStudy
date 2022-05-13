import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://csxcxapi.myzx.cn/', // 目标服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/mpapi': {
        target: 'https://cs.myzx.cn/', // 目标服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mpapi/, ''),
      },
      '/wzapi': {
        target: 'https://cswzapi.myzx.cn', // 目标服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wzapi/, ''),
      },
    },
  },
})

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl' // ① 引入插件

export default defineConfig({
  plugins: [vue(), basicSsl()],             // ② 注册插件
  server: {
    https: true,                            // ③ 启用 https
    port: 5173,
    host: 'localhost',
    proxy: {                                // ④ 原代理规则不动
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#1677ff',
          '@border-radius-base': '6px',
          '@font-size-base': '14px',
        },
      },
    },
  },
  server: {
    // 端口配置：优先从 VITE_PORT 读取，如果未配置则使用默认端口 3000
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 3000,
    // 代理配置说明：
    // 1. 如果 VITE_API_BASE_URL 是相对路径（如 '/api'），需要配置 VITE_PROXY_TARGET
    //    例如：VITE_API_BASE_URL=/api, VITE_PROXY_TARGET=http://localhost:8500
    // 2. 如果 VITE_API_BASE_URL 是完整URL（如 'http://localhost:8500/api'），则不需要代理
    //    例如：VITE_API_BASE_URL=http://localhost:8500/api
    proxy: process.env.VITE_PROXY_TARGET ? {
      '/api': {
        target: process.env.VITE_PROXY_TARGET,
        changeOrigin: true,
        // 不重写路径，保持 /api 前缀
      }
    } : undefined
  }
})
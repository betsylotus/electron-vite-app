import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 主进程的构建
  main: {
    build: {
      // 是否压缩代码
      minify: true,
      // 是否生成源码映射
      sourcemap: true,
      // 是否报告压缩大小
      reportCompressedSize: true
    },
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@src': resolve('src')
      }
    },
    // 使用 externalizeDepsPlugin() 将 Node.js 依赖外部化，避免打包到最终文件中
    plugins: [externalizeDepsPlugin()]
  },
  // 预加载脚本的构建
  preload: {
    resolve: {
      alias: {
        '@preload': resolve('src/preload'),
        '@src': resolve('src')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  // 渲染进程的构建
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@src': resolve('src')
      }
    },
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      cors: true
    }
  }
})

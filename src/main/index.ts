import { createMainLogger } from '@utils/index'
import { app } from 'electron'
import { initializeApp, getAppInitState } from './app'
import { is } from '@electron-toolkit/utils'

// 应用程序的入口文件

const logger = createMainLogger({
  // 日志文件大小限制（MB）
  maxSize: 20,
  // 日志文件数量限制
  maxFiles: 5
})

logger.info('主进程启动', {
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  isDev: is.dev
})

/**
 * 应用程序入口点
 * 初始化 Electron 应用
 */
async function startApplication(): Promise<void> {
  try {
    logger.info('开始启动应用程序')

    // 初始化应用
    await initializeApp()

    logger.info('应用程序启动成功', {
      state: getAppInitState(),
      pid: process.pid
    })
  } catch (error) {
    logger.error('应用程序启动失败', error as Error)

    // 确保应用程序退出
    if (app.isReady()) {
      app.quit()
    } else {
      process.exit(1)
    }
  }
}

// 启动应用程序
startApplication().catch((error) => {
  // 最后的错误处理
  logger.error('应用程序启动过程中发生未处理的错误:', error)
  process.exit(1)
})

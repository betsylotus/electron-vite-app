import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow } from './window'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

// 管理应用的初始化和生命周期事件

/**
 * 应用初始化状态
 */
enum AppInitState {
  // 未初始化
  NOT_INITIALIZED = 'not_initialized',
  // 初始化中
  INITIALIZING = 'initializing',
  // 已就绪
  READY = 'ready',
  // 初始化失败
  FAILED = 'failed'
}

/**
 * 应用状态跟踪
 */
let appInitState: AppInitState = AppInitState.NOT_INITIALIZED

/**
 * 应用配置接口
 */
interface AppConfig {
  appUserModelId?: string
}

/**
 * 默认应用配置
 */
const DEFAULT_APP_CONFIG: AppConfig = {
  appUserModelId: import.meta.env.VITE_APP_MODULE_ID
}

/**
 * 设置应用基础配置
 * @param config 应用配置
 */
function setupApp(config: AppConfig): void {
  // 设置应用用户模型 ID（用于 Windows 任务栏分组）
  if (config.appUserModelId) {
    electronApp.setAppUserModelId(config.appUserModelId)
    logger.info('设置应用用户模型 ID', config.appUserModelId)
  }
}

/**
 * 设置应用启动相关事件
 */
function setupAppStartupEvents(): void {
  // 应用即将完成启动 (在ready之前)
  app.on('will-finish-launching', () => {
    logger.info('应用即将完成启动 (will-finish-launching)')
  })

  // 应用已准备就绪
  app.on('ready', () => {
    logger.info('应用已准备就绪 (ready)')
  })
}

/**
 * 设置应用事件监听器
 */
function setupAppEvents(): void {
  // 监听窗口创建事件，启用快捷键优化
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
    logger.info('新窗口创建，启用快捷键监听')
  })

  // 窗口获得焦点
  app.on('browser-window-focus', (_, window) => {
    logger.info('窗口获得焦点', { windowId: window.id })
  })

  // 窗口失去焦点
  app.on('browser-window-blur', (_, window) => {
    logger.info('窗口失去焦点', { windowId: window.id })
  })

  // 创建新的webContents
  app.on('web-contents-created', (_, webContents) => {
    logger.info('创建新的webContents', { webContentsId: webContents.id })
  })

  // macOS 特殊处理：点击 Dock 图标时重新创建窗口
  app.on('activate', (_, hasVisibleWindows) => {
    logger.info('应用激活事件触发', { hasVisibleWindows })
    if (BrowserWindow.getAllWindows().length === 0) {
      logger.info('没有打开的窗口，重新创建主窗口')
      createMainWindow()
    }
  })

  // macOS: 打开文件事件
  app.on('open-file', (event, path) => {
    logger.info('打开文件事件', { path })
    event.preventDefault()
    // 处理文件打开逻辑
  })

  // macOS: 打开URL事件
  app.on('open-url', (event, url) => {
    logger.info('打开URL事件', { url })
    event.preventDefault()
    // 处理URL打开逻辑
  })

  // macOS: 继续活动事件 (Handoff)
  app.on('continue-activity', (_, type, userInfo) => {
    logger.info('继续活动事件', { type, userInfo })
  })

  // macOS: 新标签页事件
  app.on('new-window-for-tab', () => {
    logger.info('新标签页事件触发')
    createMainWindow()
  })
}

/**
 * 设置应用安全相关事件
 */
function setupSecurityEvents(): void {
  // 证书错误处理
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    logger.warn('证书错误', { url, error })
    // 在生产环境中，应该有更严格的证书验证逻辑
    callback(false) // 拒绝不信任的证书
  })

  // 客户端证书选择
  app.on('select-client-certificate', (event, webContents, url, list, callback) => {
    logger.info('客户端证书选择', { url, certificateCount: list.length })
    event.preventDefault()
    if (list.length > 0) {
      callback(list[0]) // 选择第一个证书
    }
  })
}

/**
 * 设置应用系统事件
 */
function setupSystemEvents(): void {
  // 无障碍支持变化 (macOS/Windows)
  if (process.platform === 'darwin' || process.platform === 'win32') {
    app.on('accessibility-support-changed', (_, accessibilitySupportEnabled) => {
      logger.info('无障碍支持状态变化', { accessibilitySupportEnabled })
    })
  }
}

/**
 * 设置应用生命周期管理
 */
function setupAppLifecycle(): void {
  // 所有窗口关闭时的处理
  app.on('window-all-closed', () => {
    logger.info('所有窗口已关闭，应用退出')
    // macOS 应用通常不会在所有窗口关闭时退出
    if (process.platform !== 'darwin') {
      logger.info('非macOS平台，退出应用')
      app.quit()
    }
  })

  // 应用即将退出
  app.on('before-quit', () => {
    logger.info('应用即将退出')
    // 可以在这里执行清理工作或阻止退出
    // event.preventDefault() // 阻止退出
  })

  // 应用退出中
  app.on('will-quit', () => {
    logger.info('应用退出中')
    // 最后的清理机会
    // event.preventDefault() // 阻止退出
  })

  // 应用已退出
  app.on('quit', (_, exitCode) => {
    logger.info('应用已退出', { exitCode })
  })
}

function setProcessEvents(): void {
  // 全局错误处理
  process.on('uncaughtException', (error) => {
    logger.error('主进程未捕获异常', error)
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('主进程未处理的Promise拒绝', { reason, promise })
  })
}

/**
 * 初始化应用
 * @param config 应用配置选项
 */
async function initializeApp(config: AppConfig = {}): Promise<void> {
  // 防止重复初始化
  if (appInitState !== AppInitState.NOT_INITIALIZED) {
    logger.warn('应用已经初始化或正在初始化中', {
      currentState: appInitState
    })
    return
  }

  const appConfig = { ...DEFAULT_APP_CONFIG, ...config }

  try {
    appInitState = AppInitState.INITIALIZING

    logger.info('开始初始化Electron应用', { config: appConfig })

    // ========== 阶段1: 应用启动前的事件设置 ==========
    // 这些事件必须在 app.whenReady() 之前设置

    // 设置启动相关事件
    setupAppStartupEvents()

    // 设置应用生命周期管理事件（退出相关）
    setupAppLifecycle()

    // 设置进程级别的错误处理
    setProcessEvents()

    // 设置安全相关事件
    setupSecurityEvents()

    // 设置系统相关事件
    setupSystemEvents()

    logger.info('应用启动前事件监听器设置完成')

    // ========== 阶段2: 等待应用就绪 ==========
    logger.info('等待Electron应用就绪...')
    await app.whenReady()

    logger.info('Electron应用已就绪，开始初始化应用配置')

    // 设置应用基础配置
    setupApp(appConfig)

    // 设置窗口相关事件监听器
    setupAppEvents()

    // 创建主窗口
    createMainWindow()

    appInitState = AppInitState.READY

    logger.info('应用初始化完成')
  } catch (error) {
    appInitState = AppInitState.FAILED
    logger.error('应用初始化过程中发生异常', error as Error)

    // 如果应用已经就绪，优雅退出
    if (app.isReady()) {
      app.quit()
    } else {
      // 如果应用还未就绪，直接退出进程
      process.exit(1)
    }

    // 重新抛出错误，让调用者知道初始化失败
    throw error
  }
}

/**
 * 获取当前应用初始化状态
 */
function getAppInitState(): AppInitState {
  return appInitState
}

export { initializeApp, getAppInitState, AppInitState }

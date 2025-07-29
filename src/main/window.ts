import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

// 负责窗口的创建、配置和事件处理

/**
 * 窗口配置接口
 */
interface WindowConfig {
  width?: number
  height?: number
  show?: boolean
  autoHideMenuBar?: boolean
}

/**
 * 默认窗口配置
 */
const DEFAULT_WINDOW_CONFIG: WindowConfig = {
  width: 900,
  height: 670,
  show: false,
  autoHideMenuBar: true
}

/**
 * 创建主窗口
 * @param config 窗口配置选项
 * @returns BrowserWindow 实例
 */
function createMainWindow(config: WindowConfig = {}): BrowserWindow {
  const windowConfig = { ...DEFAULT_WINDOW_CONFIG, ...config }

  const mainWindow = new BrowserWindow({
    ...windowConfig,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 设置窗口事件监听器
  setupWindowEvents(mainWindow)

  // 加载窗口内容
  loadWindowContent(mainWindow)

  return mainWindow
}

/**
 * 设置窗口事件监听器
 * @param window BrowserWindow 实例
 */
function setupWindowEvents(window: BrowserWindow): void {
  // 窗口准备显示时才显示，避免闪烁
  window.on('ready-to-show', () => {
    logger.info('主窗口准备就绪，开始显示')
    window.show()
  })

  window.on('closed', () => {
    logger.debug('主窗口已关闭')
  })

  window.webContents.on('did-finish-load', () => {
    logger.debug('渲染进程加载完成')
  })

  window.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logger.error('渲染进程加载失败', {
      errorCode,
      errorDescription
    })
  })

  // 处理外部链接打开
  window.webContents.setWindowOpenHandler((details) => {
    logger.debug('拦截外部链接', { url: details.url })
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

/**
 * 加载窗口内容
 * @param window BrowserWindow 实例
 */
function loadWindowContent(window: BrowserWindow): void {
  const startTime = Date.now()

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    logger.debug('开发模式：加载开发服务器页面', { url: process.env['ELECTRON_RENDERER_URL'] })
    // 开发环境：加载开发服务器
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 生产环境：加载本地文件
    const htmlPath = join(__dirname, '../renderer/index.html')
    logger.debug('生产模式：加载本地HTML文件', {
      path: htmlPath
    })
    window.loadFile(htmlPath)
  }

  window.webContents.once('did-finish-load', () => {
    logger.performance('窗口创建和页面加载', startTime)
  })
}

export { createMainWindow }

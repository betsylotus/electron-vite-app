import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

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
    window.show()
  })

  // 处理外部链接打开
  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

/**
 * 加载窗口内容
 * @param window BrowserWindow 实例
 */
function loadWindowContent(window: BrowserWindow): void {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // 开发环境：加载开发服务器
    window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // 生产环境：加载本地文件
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

export { createMainWindow }

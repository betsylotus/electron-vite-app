import { ipcMain, app } from 'electron'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

// 版本IPC
function versionIPC() {
  // 获取当前版本
  // 只要 ipcRenderer.invoke 使用的通道名称和 ipcMain.handle 监听的通道名称完全一致，通信就能成功
  ipcMain.handle('version:get', async () => {
    const appVersion = app.getVersion()
    logger.info('===== [version:get] ====== [version]', appVersion)
    return appVersion
  })
}

export { versionIPC }

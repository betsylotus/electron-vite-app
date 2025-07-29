import { ipcMain, Notification } from 'electron'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

// 通知IPC
function notificationIPC() {
  // 发送通知
  ipcMain.handle('notification:show', async (_, options: { title: string; body: string }) => {
    logger.info('===== [notification:show] ====== [options]', options)
    new Notification(options).show()
    return {
      success: true
    }
  })
}

export { notificationIPC }

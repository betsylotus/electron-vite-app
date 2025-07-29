import { ipcMain, dialog } from 'electron'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

// 文件IPC
function fileIPC() {
  // 打开文件
  ipcMain.handle('file:open', async () => {
    logger.info('===== [file:open] ====== start')

    const result = await dialog.showOpenDialog({
      // 对话框标题
      title: '选择文件',

      // 确认按钮文本
      buttonLabel: '选择',

      // 文件类型过滤器
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md', 'json'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      // 对话框属性
      properties: [
        // 允许选择文件
        'openFile'
      ],
      // macOS 上显示的消息
      message: '请选择要打开的文件'
    })

    logger.info('===== [file:open] ====== [result]', result)

    // 用户取消选择
    if (result.canceled || result.filePaths.length === 0) {
      logger.info('===== [file:open] ====== canceled')
      return {
        success: false,
        message: '用户取消选择文件'
      }
    }

    // 用户选择文件
    const filePath = result.filePaths[0]

    logger.info('===== [file:open] ====== [filePath]', filePath)

    return {
      success: true,
      filePath
    }
  })
}

export { fileIPC }

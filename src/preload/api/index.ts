import { ipcRenderer } from 'electron'

const api = {
  file: {
    /**
     * 打开文件
     */
    open: () => {
      return ipcRenderer.invoke('file:open')
    }
  },
  notification: {
    /**
     * 显示通知
     */
    show: (options: { title: string; body: string }) => {
      return ipcRenderer.invoke('notification:show', options)
    }
  },
  version: {
    /**
     * 获取版本信息
     */
    get: () => {
      // 只要 ipcRenderer.invoke 使用的通道名称和 ipcMain.handle 监听的通道名称完全一致，通信就能成功
      return ipcRenderer.invoke('version:get')
    }
  }
}

export { api }

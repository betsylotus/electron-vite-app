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
  },
  memory: {
    /**
     * 获取当前内存使用情况
     */
    getCurrentUsage: () => {
      return ipcRenderer.invoke('memory:getCurrentUsage')
    },

    /**
     * 获取内存统计信息
     */
    getStats: () => {
      return ipcRenderer.invoke('memory:getStats')
    },

    /**
     * 获取内存使用历史
     */
    getHistory: () => {
      return ipcRenderer.invoke('memory:getHistory')
    },

    /**
     * 获取垃圾回收统计
     */
    getGCStats: () => {
      return ipcRenderer.invoke('memory:getGCStats')
    },

    /**
     * 强制执行垃圾回收
     */
    forceGC: () => {
      return ipcRenderer.invoke('memory:forceGC')
    },

    /**
     * 更新内存监控配置
     */
    updateConfig: (config: any) => {
      return ipcRenderer.invoke('memory:updateConfig', config)
    },

    /**
     * 开始内存监控
     */
    startMonitoring: () => {
      return ipcRenderer.invoke('memory:startMonitoring')
    },

    /**
     * 停止内存监控
     */
    stopMonitoring: () => {
      return ipcRenderer.invoke('memory:stopMonitoring')
    }
  }
}

export { api }

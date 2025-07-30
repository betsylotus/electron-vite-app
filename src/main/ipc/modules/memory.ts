import { ipcMain } from 'electron'
import { createMainLogger } from '@utils/index'
import { getMemoryManager, getCurrentMemoryUsage, forceGC } from '@main/service/modules'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

/**
 * 内存管理相关的IPC处理程序
 */

function memoryIPC() {
  // 获取当前内存使用情况
  ipcMain.handle('memory:getCurrentUsage', async () => {
    try {
      logger.debug('IPC: 获取当前内存使用情况')
      return getCurrentMemoryUsage()
    } catch (error) {
      logger.error('IPC: 获取内存使用情况失败', error as Error)
      throw error
    }
  })

  // 获取内存统计信息
  ipcMain.handle('memory:getStats', async () => {
    try {
      logger.debug('IPC: 获取内存统计信息')
      const memoryManager = getMemoryManager()
      return memoryManager.getMemoryStats()
    } catch (error) {
      logger.error('IPC: 获取内存统计信息失败', error as Error)
      throw error
    }
  })

  // 获取内存使用历史
  ipcMain.handle('memory:getHistory', async () => {
    try {
      logger.debug('IPC: 获取内存使用历史')
      const memoryManager = getMemoryManager()
      return memoryManager.getUsageHistory()
    } catch (error) {
      logger.error('IPC: 获取内存使用历史失败', error as Error)
      throw error
    }
  })

  // 获取垃圾回收统计
  ipcMain.handle('memory:getGCStats', async () => {
    try {
      logger.debug('IPC: 获取垃圾回收统计')
      const memoryManager = getMemoryManager()
      return memoryManager.getGCStats()
    } catch (error) {
      logger.error('IPC: 获取垃圾回收统计失败', error as Error)
      throw error
    }
  })

  // 强制执行垃圾回收
  ipcMain.handle('memory:forceGC', async () => {
    try {
      logger.info('IPC: 强制执行垃圾回收')
      forceGC()
      return { success: true, message: '垃圾回收已执行' }
    } catch (error) {
      logger.error('IPC: 强制垃圾回收失败', error as Error)
      throw error
    }
  })

  // 更新内存监控配置
  ipcMain.handle('memory:updateConfig', async (_, config) => {
    try {
      logger.info('IPC: 更新内存监控配置', config)
      const memoryManager = getMemoryManager()

      // 停止当前监控
      memoryManager.stopMonitoring()

      // 使用新配置重新开始监控
      const newMemoryManager = getMemoryManager(config)
      newMemoryManager.startMonitoring()

      return { success: true, message: '内存监控配置已更新' }
    } catch (error) {
      logger.error('IPC: 更新内存监控配置失败', error as Error)
      throw error
    }
  })

  // 开始内存监控
  ipcMain.handle('memory:startMonitoring', async () => {
    try {
      logger.info('IPC: 开始内存监控')
      const memoryManager = getMemoryManager()
      memoryManager.startMonitoring()
      return { success: true, message: '内存监控已开始' }
    } catch (error) {
      logger.error('IPC: 开始内存监控失败', error as Error)
      throw error
    }
  })

  // 停止内存监控
  ipcMain.handle('memory:stopMonitoring', async () => {
    try {
      logger.info('IPC: 停止内存监控')
      const memoryManager = getMemoryManager()
      memoryManager.stopMonitoring()
      return { success: true, message: '内存监控已停止' }
    } catch (error) {
      logger.error('IPC: 停止内存监控失败', error as Error)
      throw error
    }
  })

  logger.info('内存管理IPC模块已加载')
}

export { memoryIPC }

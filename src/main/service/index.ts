import { createMainLogger } from '@utils/index'
import {
  getMemoryManager,
  startMemoryMonitoring,
  stopMemoryMonitoring,
  MemoryEventType
} from './modules'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

/**
 * 服务管理器
 * 统一管理应用的各种服务模块
 */
class ServiceManager {
  private isInitialized = false

  /**
   * 初始化所有服务
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn('服务管理器已经初始化')
      return
    }

    try {
      logger.info('开始初始化服务管理器')

      // 初始化内存管理服务
      await this.initializeMemoryService()

      this.isInitialized = true
      logger.info('服务管理器初始化完成')
    } catch (error) {
      logger.error('服务管理器初始化失败', error as Error)
      throw error
    }
  }

  /**
   * 初始化内存管理服务
   */
  private async initializeMemoryService(): Promise<void> {
    logger.info('初始化内存管理服务')

    const memoryManager = getMemoryManager({
      interval: 30000, // 30秒监控间隔
      warningThreshold: 80, // 80%告警
      criticalThreshold: 90, // 90%危险
      autoGC: true, // 启用自动垃圾回收
      autoGCThreshold: 85, // 85%时自动GC
      historyLimit: 100 // 保存100条历史记录
    })

    // 监听内存事件
    memoryManager.on(MemoryEventType.WARNING, (alert) => {
      logger.warn('内存使用告警', alert)
    })

    memoryManager.on(MemoryEventType.CRITICAL, (alert) => {
      logger.error('内存使用危险', alert)
    })

    memoryManager.on(MemoryEventType.LEAK_DETECTED, (leakInfo) => {
      logger.error('检测到内存泄漏', leakInfo)
    })

    memoryManager.on(MemoryEventType.GC_EXECUTED, (gcInfo) => {
      logger.info('垃圾回收执行', gcInfo)
    })

    // 开始内存监控
    startMemoryMonitoring()

    logger.info('内存管理服务初始化完成')
  }

  /**
   * 清理所有服务
   */
  public async cleanup(): Promise<void> {
    if (!this.isInitialized) {
      return
    }

    logger.info('开始清理服务管理器')

    try {
      // 停止内存监控
      stopMemoryMonitoring()

      this.isInitialized = false
      logger.info('服务管理器清理完成')
    } catch (error) {
      logger.error('服务管理器清理失败', error as Error)
    }
  }

  /**
   * 获取服务状态
   */
  public getStatus(): {
    initialized: boolean
    memoryStats: any
  } {
    const memoryManager = getMemoryManager()

    return {
      initialized: this.isInitialized,
      memoryStats: memoryManager.getMemoryStats()
    }
  }
}

// 全局服务管理器实例
let serviceManagerInstance: ServiceManager | null = null

/**
 * 获取服务管理器实例（单例模式）
 */
function getServiceManager(): ServiceManager {
  if (!serviceManagerInstance) {
    serviceManagerInstance = new ServiceManager()
  }
  return serviceManagerInstance
}

/**
 * 初始化服务
 */
async function initializeServices(): Promise<void> {
  const serviceManager = getServiceManager()
  await serviceManager.initialize()
}

/**
 * 清理服务
 */
async function cleanupServices(): Promise<void> {
  if (serviceManagerInstance) {
    await serviceManagerInstance.cleanup()
    serviceManagerInstance = null
  }
}

export {
  // 服务管理器类
  ServiceManager,
  // 获取服务管理器实例
  getServiceManager,
  // 初始化服务
  initializeServices,
  // 清理服务
  cleanupServices
}

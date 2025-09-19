import { createMainLogger } from '@utils/index'

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

      // 可以在此处初始化其他服务模块

      this.isInitialized = true
      logger.info('服务管理器初始化完成')
    } catch (error) {
      logger.error('服务管理器初始化失败', error as Error)
      throw error
    }
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
      // 可以在此处清理其他服务模块

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
  } {
    return {
      initialized: this.isInitialized
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

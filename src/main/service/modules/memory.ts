import { EventEmitter } from 'events'
import { createMainLogger } from '@utils/index'

const logger = createMainLogger({
  maxSize: 20,
  maxFiles: 5
})

/**
 * 内存使用情况接口
 */
interface MemoryUsage {
  /** RSS (Resident Set Size) - 物理内存使用量 */
  rss: number
  /** 堆总大小 */
  heapTotal: number
  /** 堆已使用大小 */
  heapUsed: number
  /** 外部内存使用量 */
  external: number
  /** 数组缓冲区大小 */
  arrayBuffers: number
  /** 内存使用百分比 */
  heapUsedPercent: number
  /** 时间戳 */
  timestamp: number
}

/**
 * 内存监控配置
 */
interface MemoryMonitorConfig {
  /** 监控间隔（毫秒），默认 30000 (30秒) */
  interval?: number
  /** 内存使用告警阈值（百分比），默认 80 */
  warningThreshold?: number
  /** 内存使用危险阈值（百分比），默认 90 */
  criticalThreshold?: number
  /** 是否启用自动垃圾回收，默认 true */
  autoGC?: boolean
  /** 自动垃圾回收阈值（百分比），默认 85 */
  autoGCThreshold?: number
  /** 历史记录保存数量，默认 100 */
  historyLimit?: number
}

/**
 * 内存事件类型
 */
enum MemoryEventType {
  /** 内存使用更新 */
  USAGE_UPDATE = 'usage-update',
  /** 内存告警 */
  WARNING = 'warning',
  /** 内存危险 */
  CRITICAL = 'critical',
  /** 垃圾回收执行 */
  GC_EXECUTED = 'gc-executed',
  /** 内存泄漏检测 */
  LEAK_DETECTED = 'leak-detected'
}

/**
 * 内存告警信息
 */
interface MemoryAlert {
  type: 'warning' | 'critical'
  usage: MemoryUsage
  threshold: number
  message: string
  timestamp: number
}

/**
 * 内存泄漏检测结果
 */
interface MemoryLeakInfo {
  /** 是否检测到泄漏 */
  detected: boolean
  /** 连续增长次数 */
  consecutiveGrowth: number
  /** 增长率（每秒MB） */
  growthRate: number
  /** 检测时间范围（毫秒） */
  timeSpan: number
  /** 内存增长量（字节） */
  memoryGrowth: number
}

/**
 * 垃圾回收统计
 */
interface GCStats {
  /** 执行次数 */
  count: number
  /** 总耗时（毫秒） */
  totalTime: number
  /** 平均耗时（毫秒） */
  averageTime: number
  /** 最后执行时间 */
  lastExecuted: number
  /** 释放的内存量（字节） */
  memoryFreed: number
}

/**
 * 内存管理器类
 */
class MemoryManager extends EventEmitter {
  private config: Required<MemoryMonitorConfig>
  private monitorTimer: NodeJS.Timeout | null = null
  private isMonitoring = false
  private usageHistory: MemoryUsage[] = []
  private gcStats: GCStats = {
    count: 0,
    totalTime: 0,
    averageTime: 0,
    lastExecuted: 0,
    memoryFreed: 0
  }
  private leakDetectionBuffer: MemoryUsage[] = []
  private readonly LEAK_DETECTION_SAMPLES = 10 // 用于泄漏检测的样本数量

  constructor(config: MemoryMonitorConfig = {}) {
    super()

    // 合并默认配置
    this.config = {
      interval: 30000,
      warningThreshold: 80,
      criticalThreshold: 90,
      autoGC: true,
      autoGCThreshold: 85,
      historyLimit: 100,
      ...config
    }

    logger.info('内存管理器初始化', { config: this.config })
  }

  /**
   * 获取当前内存使用情况
   */
  public getCurrentMemoryUsage(): MemoryUsage {
    const memUsage = process.memoryUsage()
    const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100

    return {
      rss: memUsage.rss,
      heapTotal: memUsage.heapTotal,
      heapUsed: memUsage.heapUsed,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
      heapUsedPercent,
      timestamp: Date.now()
    }
  }

  /**
   * 开始内存监控
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      logger.warn('内存监控已经在运行中')
      return
    }

    logger.info('开始内存监控', { interval: this.config.interval })
    this.isMonitoring = true

    // 立即执行一次监控
    this.performMonitoringCheck()

    // 设置定时监控
    this.monitorTimer = setInterval(() => {
      this.performMonitoringCheck()
    }, this.config.interval)
  }

  /**
   * 停止内存监控
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      logger.warn('内存监控未在运行')
      return
    }

    logger.info('停止内存监控')
    this.isMonitoring = false

    if (this.monitorTimer) {
      clearInterval(this.monitorTimer)
      this.monitorTimer = null
    }
  }

  /**
   * 执行监控检查
   */
  private performMonitoringCheck(): void {
    const usage = this.getCurrentMemoryUsage()

    // 添加到历史记录
    this.addToHistory(usage)

    // 添加到泄漏检测缓冲区
    this.addToLeakDetectionBuffer(usage)

    // 发出使用情况更新事件
    this.emit(MemoryEventType.USAGE_UPDATE, usage)

    // 检查告警阈值
    this.checkThresholds(usage)

    // 检查内存泄漏
    this.checkMemoryLeak()

    // 自动垃圾回收
    if (this.config.autoGC && usage.heapUsedPercent >= this.config.autoGCThreshold) {
      this.forceGarbageCollection()
    }

    logger.debug('内存监控检查完成', {
      heapUsed: this.formatBytes(usage.heapUsed),
      heapTotal: this.formatBytes(usage.heapTotal),
      heapUsedPercent: usage.heapUsedPercent.toFixed(2) + '%',
      rss: this.formatBytes(usage.rss)
    })
  }

  /**
   * 添加到历史记录
   */
  private addToHistory(usage: MemoryUsage): void {
    this.usageHistory.push(usage)

    // 限制历史记录数量
    if (this.usageHistory.length > this.config.historyLimit) {
      this.usageHistory = this.usageHistory.slice(-this.config.historyLimit)
    }
  }

  /**
   * 添加到泄漏检测缓冲区
   */
  private addToLeakDetectionBuffer(usage: MemoryUsage): void {
    this.leakDetectionBuffer.push(usage)

    // 限制缓冲区大小
    if (this.leakDetectionBuffer.length > this.LEAK_DETECTION_SAMPLES) {
      this.leakDetectionBuffer = this.leakDetectionBuffer.slice(-this.LEAK_DETECTION_SAMPLES)
    }
  }

  /**
   * 检查阈值告警
   */
  private checkThresholds(usage: MemoryUsage): void {
    if (usage.heapUsedPercent >= this.config.criticalThreshold) {
      const alert: MemoryAlert = {
        type: 'critical',
        usage,
        threshold: this.config.criticalThreshold,
        message: `内存使用率达到危险水平: ${usage.heapUsedPercent.toFixed(2)}%`,
        timestamp: Date.now()
      }

      logger.error('内存使用危险告警', alert)
      this.emit(MemoryEventType.CRITICAL, alert)
    } else if (usage.heapUsedPercent >= this.config.warningThreshold) {
      const alert: MemoryAlert = {
        type: 'warning',
        usage,
        threshold: this.config.warningThreshold,
        message: `内存使用率较高: ${usage.heapUsedPercent.toFixed(2)}%`,
        timestamp: Date.now()
      }

      logger.warn('内存使用告警', alert)
      this.emit(MemoryEventType.WARNING, alert)
    }
  }

  /**
   * 检查内存泄漏
   */
  private checkMemoryLeak(): void {
    if (this.leakDetectionBuffer.length < this.LEAK_DETECTION_SAMPLES) {
      return // 样本不足
    }

    const samples = this.leakDetectionBuffer
    const oldestSample = samples[0]
    const newestSample = samples[samples.length - 1]

    const timeSpan = newestSample.timestamp - oldestSample.timestamp
    const memoryGrowth = newestSample.heapUsed - oldestSample.heapUsed
    const growthRate = memoryGrowth / (timeSpan / 1000) / (1024 * 1024) // MB/s

    // 检查是否连续增长
    let consecutiveGrowth = 0
    for (let i = 1; i < samples.length; i++) {
      if (samples[i].heapUsed > samples[i - 1].heapUsed) {
        consecutiveGrowth++
      } else {
        consecutiveGrowth = 0
      }
    }

    // 泄漏检测条件：连续增长超过70%的样本且增长率大于1MB/s
    const detected = consecutiveGrowth >= this.LEAK_DETECTION_SAMPLES * 0.7 && growthRate > 1

    const leakInfo: MemoryLeakInfo = {
      detected,
      consecutiveGrowth,
      growthRate,
      timeSpan,
      memoryGrowth
    }

    if (detected) {
      logger.error('检测到可能的内存泄漏', leakInfo)
      this.emit(MemoryEventType.LEAK_DETECTED, leakInfo)
    }
  }

  /**
   * 强制执行垃圾回收
   */
  public forceGarbageCollection(): void {
    if (!global.gc) {
      logger.warn('垃圾回收功能不可用，请使用 --expose-gc 参数启动应用')
      return
    }

    const beforeUsage = this.getCurrentMemoryUsage()
    const startTime = Date.now()

    try {
      global.gc()

      const endTime = Date.now()
      const afterUsage = this.getCurrentMemoryUsage()
      const executionTime = endTime - startTime
      const memoryFreed = beforeUsage.heapUsed - afterUsage.heapUsed

      // 更新GC统计
      this.gcStats.count++
      this.gcStats.totalTime += executionTime
      this.gcStats.averageTime = this.gcStats.totalTime / this.gcStats.count
      this.gcStats.lastExecuted = endTime
      this.gcStats.memoryFreed += memoryFreed

      logger.info('垃圾回收执行完成', {
        executionTime: `${executionTime}ms`,
        memoryFreed: this.formatBytes(memoryFreed),
        beforeHeapUsed: this.formatBytes(beforeUsage.heapUsed),
        afterHeapUsed: this.formatBytes(afterUsage.heapUsed)
      })

      this.emit(MemoryEventType.GC_EXECUTED, {
        executionTime,
        memoryFreed,
        beforeUsage,
        afterUsage
      })
    } catch (error) {
      logger.error('垃圾回收执行失败', error as Error)
    }
  }

  /**
   * 获取内存使用历史
   */
  public getUsageHistory(): MemoryUsage[] {
    return [...this.usageHistory]
  }

  /**
   * 获取垃圾回收统计
   */
  public getGCStats(): GCStats {
    return { ...this.gcStats }
  }

  /**
   * 获取内存统计摘要
   */
  public getMemoryStats(): {
    current: MemoryUsage
    peak: MemoryUsage | null
    average: Partial<MemoryUsage> | null
    gcStats: GCStats
  } {
    const current = this.getCurrentMemoryUsage()

    let peak: MemoryUsage | null = null
    let average: Partial<MemoryUsage> | null = null

    if (this.usageHistory.length > 0) {
      // 找到峰值
      peak = this.usageHistory.reduce((max, usage) => (usage.heapUsed > max.heapUsed ? usage : max))

      // 计算平均值
      const sum = this.usageHistory.reduce(
        (acc, usage) => ({
          rss: acc.rss + usage.rss,
          heapTotal: acc.heapTotal + usage.heapTotal,
          heapUsed: acc.heapUsed + usage.heapUsed,
          external: acc.external + usage.external,
          arrayBuffers: acc.arrayBuffers + usage.arrayBuffers,
          heapUsedPercent: acc.heapUsedPercent + usage.heapUsedPercent
        }),
        {
          rss: 0,
          heapTotal: 0,
          heapUsed: 0,
          external: 0,
          arrayBuffers: 0,
          heapUsedPercent: 0
        }
      )

      const count = this.usageHistory.length
      average = {
        rss: Math.round(sum.rss / count),
        heapTotal: Math.round(sum.heapTotal / count),
        heapUsed: Math.round(sum.heapUsed / count),
        external: Math.round(sum.external / count),
        arrayBuffers: Math.round(sum.arrayBuffers / count),
        heapUsedPercent: sum.heapUsedPercent / count
      }
    }

    return {
      current,
      peak,
      average,
      gcStats: this.getGCStats()
    }
  }

  /**
   * 清理内存管理器资源
   */
  public cleanup(): void {
    logger.info('清理内存管理器资源')

    this.stopMonitoring()
    this.usageHistory = []
    this.leakDetectionBuffer = []
    this.removeAllListeners()
  }

  /**
   * 格式化字节数
   */
  private formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'

    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }
}

/**
 * 全局内存管理器实例
 */
let memoryManagerInstance: MemoryManager | null = null

/**
 * 获取内存管理器实例（单例模式）
 */
function getMemoryManager(config?: MemoryMonitorConfig): MemoryManager {
  if (!memoryManagerInstance) {
    memoryManagerInstance = new MemoryManager(config)
  }
  return memoryManagerInstance
}

/**
 * 销毁内存管理器实例
 */
function destroyMemoryManager(): void {
  if (memoryManagerInstance) {
    memoryManagerInstance.cleanup()
    memoryManagerInstance = null
  }
}

/**
 * 便捷函数：获取当前内存使用情况
 */
function getCurrentMemoryUsage(): MemoryUsage {
  return getMemoryManager().getCurrentMemoryUsage()
}

/**
 * 便捷函数：强制垃圾回收
 */
function forceGC(): void {
  getMemoryManager().forceGarbageCollection()
}

/**
 * 便捷函数：开始内存监控
 */
function startMemoryMonitoring(config?: MemoryMonitorConfig): void {
  getMemoryManager(config).startMonitoring()
}

/**
 * 便捷函数：停止内存监控
 */
function stopMemoryMonitoring(): void {
  if (memoryManagerInstance) {
    memoryManagerInstance.stopMonitoring()
  }
}

export {
  // 内存管理器类
  MemoryManager,
  // 内存事件类型
  MemoryEventType,
  // 获取内存管理器实例
  getMemoryManager,
  // 销毁内存管理器实例
  destroyMemoryManager,
  // 获取当前内存使用情况
  getCurrentMemoryUsage,
  // 强制垃圾回收
  forceGC,
  // 开始内存监控
  startMemoryMonitoring,
  // 停止内存监控
  stopMemoryMonitoring
}

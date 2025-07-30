import { ref, reactive, onMounted, onUnmounted } from 'vue'

/**
 * 内存使用情况接口
 */
interface MemoryUsage {
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  arrayBuffers: number
  heapUsedPercent: number
  timestamp: number
}

/**
 * 垃圾回收统计接口
 */
interface GCStats {
  count: number
  totalTime: number
  averageTime: number
  lastExecuted: number
  memoryFreed: number
}

/**
 * 内存统计接口
 */
interface MemoryStats {
  current: MemoryUsage
  peak: MemoryUsage | null
  average: Partial<MemoryUsage> | null
  gcStats: GCStats
}

/**
 * 内存监控配置接口
 */
interface MemoryMonitorConfig {
  interval?: number
  warningThreshold?: number
  criticalThreshold?: number
  autoGC?: boolean
  autoGCThreshold?: number
  historyLimit?: number
}

/**
 * 内存管理组合式函数
 */
function useMemory() {
  // 响应式数据
  const currentUsage = ref<MemoryUsage | null>(null)
  const memoryStats = ref<MemoryStats | null>(null)
  const usageHistory = ref<MemoryUsage[]>([])
  const gcStats = ref<GCStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 监控状态
  const monitoringState = reactive({
    isMonitoring: false,
    config: {
      interval: 30000,
      warningThreshold: 80,
      criticalThreshold: 90,
      autoGC: true,
      autoGCThreshold: 85,
      historyLimit: 100
    } as MemoryMonitorConfig
  })

  /**
   * 格式化字节数
   */
  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'

    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * 格式化百分比
   */
  const formatPercent = (percent: number): string => {
    return percent.toFixed(2) + '%'
  }

  /**
   * 获取当前内存使用情况
   */
  const getCurrentUsage = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const usage = await window.api.memory.getCurrentUsage()
      currentUsage.value = usage
    } catch (err) {
      error.value = `获取内存使用情况失败: ${err}`
      console.error('获取内存使用情况失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取内存统计信息
   */
  const getMemoryStats = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const stats = await window.api.memory.getStats()
      memoryStats.value = stats
    } catch (err) {
      error.value = `获取内存统计失败: ${err}`
      console.error('获取内存统计失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取内存使用历史
   */
  const getUsageHistory = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const history = await window.api.memory.getHistory()
      usageHistory.value = history
    } catch (err) {
      error.value = `获取内存历史失败: ${err}`
      console.error('获取内存历史失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取垃圾回收统计
   */
  const getGCStats = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const stats = await window.api.memory.getGCStats()
      gcStats.value = stats
    } catch (err) {
      error.value = `获取GC统计失败: ${err}`
      console.error('获取GC统计失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 强制执行垃圾回收
   */
  const forceGarbageCollection = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const result = await window.api.memory.forceGC()

      // 执行GC后刷新数据
      await Promise.all([getCurrentUsage(), getMemoryStats(), getGCStats()])

      return result.success
    } catch (err) {
      error.value = `执行垃圾回收失败: ${err}`
      console.error('执行垃圾回收失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 开始内存监控
   */
  const startMonitoring = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const result = await window.api.memory.startMonitoring()
      if (result.success) {
        monitoringState.isMonitoring = true
      }

      return result.success
    } catch (err) {
      error.value = `开始监控失败: ${err}`
      console.error('开始监控失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 停止内存监控
   */
  const stopMonitoring = async (): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const result = await window.api.memory.stopMonitoring()
      if (result.success) {
        monitoringState.isMonitoring = false
      }

      return result.success
    } catch (err) {
      error.value = `停止监控失败: ${err}`
      console.error('停止监控失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新监控配置
   */
  const updateMonitoringConfig = async (config: Partial<MemoryMonitorConfig>): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null

      const newConfig = { ...monitoringState.config, ...config }
      const result = await window.api.memory.updateConfig(newConfig)

      if (result.success) {
        Object.assign(monitoringState.config, newConfig)
      }

      return result.success
    } catch (err) {
      error.value = `更新配置失败: ${err}`
      console.error('更新配置失败:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 刷新所有数据
   */
  const refreshAllData = async (): Promise<void> => {
    await Promise.all([getCurrentUsage(), getMemoryStats(), getUsageHistory(), getGCStats()])
  }

  /**
   * 定时刷新数据
   */
  let refreshTimer: NodeJS.Timeout | null = null

  const startAutoRefresh = (interval: number = 5000): void => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }

    refreshTimer = setInterval(() => {
      refreshAllData()
    }, interval)
  }

  const stopAutoRefresh = (): void => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  // 组件挂载时初始化数据
  onMounted(async () => {
    await refreshAllData()
    startAutoRefresh() // 开始自动刷新
  })

  // 组件卸载时清理定时器
  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    // 响应式数据
    currentUsage,
    memoryStats,
    usageHistory,
    gcStats,
    isLoading,
    error,
    monitoringState,

    // 方法
    getCurrentUsage,
    getMemoryStats,
    getUsageHistory,
    getGCStats,
    forceGarbageCollection,
    startMonitoring,
    stopMonitoring,
    updateMonitoringConfig,
    refreshAllData,
    startAutoRefresh,
    stopAutoRefresh,

    // 工具函数
    formatBytes,
    formatPercent
  }
}

export { useMemory }

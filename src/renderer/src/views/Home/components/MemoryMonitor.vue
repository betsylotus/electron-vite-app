<template>
  <div class="card memory-monitor-card">
    <div class="card-title">
      <span>内存监控</span>
      <div class="memory-actions">
        <button
          :disabled="isLoading"
          class="btn"
          :class="monitoringState.isMonitoring ? 'btn-danger' : 'btn-primary'"
          @click="toggleMonitoring"
        >
          {{ monitoringState.isMonitoring ? '停止监控' : '开始监控' }}
        </button>
        <button :disabled="isLoading" class="btn btn-secondary" @click="handleForceGC">
          强制GC
        </button>
        <button :disabled="isLoading" class="btn btn-info" @click="refreshAllData">刷新数据</button>
      </div>
    </div>

    <div class="memory-monitor-content">
      <div v-if="error" class="error-message">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        {{ error }}
      </div>

      <div v-if="isLoading" class="loading">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        数据加载中...
      </div>

      <!-- 当前内存使用情况 -->
      <div v-if="currentUsage" class="memory-section">
        <h4>当前内存使用</h4>
        <div class="memory-grid">
          <div class="memory-item">
            <span class="label">RSS (物理内存):</span>
            <span class="value">{{ formatBytes(currentUsage.rss) }}</span>
          </div>
          <div class="memory-item">
            <span class="label">堆总大小:</span>
            <span class="value">{{ formatBytes(currentUsage.heapTotal) }}</span>
          </div>
          <div class="memory-item">
            <span class="label">堆已使用:</span>
            <span class="value">{{ formatBytes(currentUsage.heapUsed) }}</span>
          </div>
          <div class="memory-item">
            <span class="label">堆使用率:</span>
            <span class="value" :class="getUsageClass(currentUsage.heapUsedPercent)">
              {{ formatPercent(currentUsage.heapUsedPercent) }}
            </span>
          </div>
          <div class="memory-item">
            <span class="label">外部内存:</span>
            <span class="value">{{ formatBytes(currentUsage.external) }}</span>
          </div>
          <div class="memory-item">
            <span class="label">数组缓冲区:</span>
            <span class="value">{{ formatBytes(currentUsage.arrayBuffers) }}</span>
          </div>
        </div>
      </div>

      <!-- 内存统计 -->
      <div v-if="memoryStats" class="memory-section">
        <h4>内存统计</h4>
        <div class="stats-grid">
          <!-- 峰值使用 -->
          <div v-if="memoryStats.peak" class="stat-item">
            <h5>峰值使用</h5>
            <div class="stat-details">
              <div>堆使用: {{ formatBytes(memoryStats.peak.heapUsed) }}</div>
              <div>使用率: {{ formatPercent(memoryStats.peak.heapUsedPercent) }}</div>
              <div>时间: {{ formatTimestamp(memoryStats.peak.timestamp) }}</div>
            </div>
          </div>

          <!-- 平均使用 -->
          <div v-if="memoryStats.average" class="stat-item">
            <h5>平均使用</h5>
            <div class="stat-details">
              <div>堆使用: {{ formatBytes(memoryStats.average.heapUsed || 0) }}</div>
              <div>使用率: {{ formatPercent(memoryStats.average.heapUsedPercent || 0) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 垃圾回收统计 -->
      <div v-if="gcStats" class="memory-section">
        <h4>垃圾回收统计</h4>
        <div class="gc-stats">
          <div class="gc-item">
            <span class="label">执行次数:</span>
            <span class="value">{{ gcStats.count }}</span>
          </div>
          <div class="gc-item">
            <span class="label">总耗时:</span>
            <span class="value">{{ gcStats.totalTime }}ms</span>
          </div>
          <div class="gc-item">
            <span class="label">平均耗时:</span>
            <span class="value">{{ gcStats.averageTime.toFixed(2) }}ms</span>
          </div>
          <div class="gc-item">
            <span class="label">释放内存:</span>
            <span class="value">{{ formatBytes(gcStats.memoryFreed) }}</span>
          </div>
          <div v-if="gcStats.lastExecuted" class="gc-item">
            <span class="label">最后执行:</span>
            <span class="value">{{ formatTimestamp(gcStats.lastExecuted) }}</span>
          </div>
        </div>
      </div>

      <!-- 内存使用历史图表（简化版） -->
      <div v-if="usageHistory.length > 0" class="memory-section">
        <h4>内存使用历史 (最近{{ usageHistory.length }}条记录)</h4>
        <div class="history-chart">
          <div
            v-for="(usage, index) in usageHistory.slice(-20)"
            :key="index"
            class="history-bar"
            :style="{ height: `${usage.heapUsedPercent}%` }"
            :title="`${formatPercent(usage.heapUsedPercent)} - ${formatTimestamp(usage.timestamp)}`"
          />
        </div>
      </div>

      <!-- 监控配置 -->
      <div class="memory-section">
        <h4>监控配置</h4>
        <div class="config-grid">
          <div class="config-item">
            <label>监控间隔 (秒):</label>
            <input
              v-model.number="configForm.interval"
              type="number"
              min="5"
              max="300"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>告警阈值 (%):</label>
            <input
              v-model.number="configForm.warningThreshold"
              type="number"
              min="50"
              max="95"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>危险阈值 (%):</label>
            <input
              v-model.number="configForm.criticalThreshold"
              type="number"
              min="70"
              max="99"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>自动GC阈值 (%):</label>
            <input
              v-model.number="configForm.autoGCThreshold"
              type="number"
              min="70"
              max="95"
              @change="updateConfig"
            />
          </div>
          <div class="config-item">
            <label>
              <input v-model="configForm.autoGC" type="checkbox" @change="updateConfig" />
              启用自动GC
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useMemory } from '@renderer/composable'

const {
  currentUsage,
  memoryStats,
  usageHistory,
  gcStats,
  isLoading,
  error,
  monitoringState,
  forceGarbageCollection,
  startMonitoring,
  stopMonitoring,
  updateMonitoringConfig,
  refreshAllData,
  formatBytes,
  formatPercent
} = useMemory()

// 配置表单
const configForm = reactive({
  interval: 30,
  warningThreshold: 80,
  criticalThreshold: 90,
  autoGC: true,
  autoGCThreshold: 85
})

// 初始化配置表单
const initConfigForm = () => {
  configForm.interval = Math.round(monitoringState.config.interval! / 1000)
  configForm.warningThreshold = monitoringState.config.warningThreshold!
  configForm.criticalThreshold = monitoringState.config.criticalThreshold!
  configForm.autoGC = monitoringState.config.autoGC!
  configForm.autoGCThreshold = monitoringState.config.autoGCThreshold!
}

// 监听配置变化并初始化
initConfigForm()

/**
 * 切换监控状态
 */
const toggleMonitoring = async () => {
  if (monitoringState.isMonitoring) {
    await stopMonitoring()
  } else {
    await startMonitoring()
  }
}

/**
 * 强制垃圾回收
 */
const handleForceGC = async () => {
  const success = await forceGarbageCollection()
  if (success) {
    console.log('垃圾回收执行成功')
  }
}

/**
 * 更新配置
 */
const updateConfig = async () => {
  const config = {
    interval: configForm.interval * 1000, // 转换为毫秒
    warningThreshold: configForm.warningThreshold,
    criticalThreshold: configForm.criticalThreshold,
    autoGC: configForm.autoGC,
    autoGCThreshold: configForm.autoGCThreshold
  }

  await updateMonitoringConfig(config)
}

/**
 * 格式化时间戳
 */
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString()
}

/**
 * 获取使用率的CSS类
 */
const getUsageClass = (percent: number): string => {
  if (percent >= 90) return 'usage-critical'
  if (percent >= 80) return 'usage-warning'
  return 'usage-normal'
}
</script>

<style lang="less" scoped>
.memory-monitor-card {
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .memory-actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  .memory-monitor-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
    margin-top: var(--spacing-base);
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-base);
    background: rgba(245, 108, 108, 0.1);
    color: var(--danger-color);
    border: 1px solid rgba(245, 108, 108, 0.2);
    border-radius: var(--border-radius-small);
    font-size: var(--font-size-small);

    svg {
      flex-shrink: 0;
      animation: spin 1s linear infinite;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    color: var(--text-secondary);
    font-size: var(--font-size-small);

    svg {
      animation: spin 1s linear infinite;
    }
  }

  .memory-section {
    margin-bottom: var(--spacing-lg);
    background: var(--bg-color-page);
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-base);
    border: 1px solid var(--border-color-lighter);

    h4 {
      margin: 0 0 var(--spacing-base) 0;
      color: var(--text-primary);
      font-size: var(--font-size-medium);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: var(--primary-color);
        border-radius: 2px;
      }
    }
  }

  .memory-grid,
  .gc-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-base);
  }

  .memory-item,
  .gc-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-base);
    background: var(--bg-color);
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-color-lighter);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--shadow-light);
      transform: translateY(-1px);
    }

    .label {
      font-weight: 500;
      color: var(--text-secondary);
      font-size: var(--font-size-small);
    }

    .value {
      font-weight: 600;
      color: var(--text-primary);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: var(--font-size-base);
    }
  }

  .usage-normal {
    color: var(--success-color);
  }

  .usage-warning {
    color: var(--warning-color);
  }

  .usage-critical {
    color: var(--danger-color);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
  }

  .stat-item {
    background: var(--bg-color);
    padding: var(--spacing-base);
    border-radius: var(--border-radius-base);
    border: 1px solid var(--border-color-lighter);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: var(--shadow-light);
      transform: translateY(-1px);
    }

    h5 {
      margin: 0 0 var(--spacing-sm) 0;
      color: var(--text-primary);
      font-size: var(--font-size-base);
      font-weight: 600;
    }

    .stat-details div {
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-small);
      color: var(--text-secondary);
    }
  }

  .history-chart {
    display: flex;
    align-items: end;
    height: 100px;
    gap: 2px;
    background: var(--bg-color);
    padding: var(--spacing-base);
    border-radius: var(--border-radius-small);
    border: 1px solid var(--border-color-lighter);

    .history-bar {
      flex: 1;
      background: linear-gradient(
        to top,
        var(--success-color),
        var(--warning-color),
        var(--danger-color)
      );
      min-height: 2px;
      border-radius: 2px 2px 0 0;
      transition: opacity 0.3s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-base);
  }

  .config-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);

    label {
      font-weight: 500;
      color: var(--text-regular);
      font-size: var(--font-size-small);
    }

    input[type='number'] {
      padding: var(--spacing-sm) var(--spacing-base);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-small);
      font-size: var(--font-size-base);
      color: var(--text-primary);
      background: var(--bg-color);
      transition: all 0.3s ease;
      outline: none;

      &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    input[type='checkbox'] {
      margin-right: var(--spacing-sm);
    }

    label:has(input[type='checkbox']) {
      flex-direction: row;
      align-items: center;
    }
  }
}

// 动画效果
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

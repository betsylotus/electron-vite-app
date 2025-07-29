<template>
  <div class="card app-version-card">
    <div class="card-title">
      <span>应用版本</span>
    </div>

    <div class="app-version-content">
      <div class="info-item">
        <span class="info-label">当前版本</span>
        <span class="info-value">{{ displayVersion }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useVersion } from '@renderer/composable'

const { version, getVersion } = useVersion()

const displayVersion = computed(() => {
  return version.value || '获取中...'
})

// 组件挂载时获取版本信息
onMounted(() => {
  getVersion()
})
</script>

<style lang="less" scoped>
.app-version-card {
  .app-version-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }
}
</style>

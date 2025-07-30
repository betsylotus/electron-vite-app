<template>
  <div class="home-container">
    <div class="page-header">
      <h1 class="page-title">Electron 应用控制台</h1>
      <p class="page-description">管理您的文件和应用信息</p>
    </div>

    <div class="content-grid">
      <div class="grid-item">
        <!-- 主进程 渲染进程 双向通信 -->
        <OpenFile></OpenFile>
      </div>
      <div class="grid-item">
        <!-- 主进程 渲染进程 双向通信 -->
        <AppVersion></AppVersion>
      </div>
      <div class="grid-item full-width">
        <!-- 内存管理监控 -->
        <MemoryMonitor></MemoryMonitor>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import OpenFile from './components/OpenFile.vue'
import AppVersion from './components/AppVersion.vue'
import MemoryMonitor from './components/MemoryMonitor.vue'
</script>

<style lang="less" scoped>
@import './index.less';
</style>

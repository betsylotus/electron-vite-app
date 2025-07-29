<template>
  <div class="card open-file-card">
    <div class="card-title">
      <span>文件操作</span>
    </div>

    <div class="open-file-content">
      <div class="file-input-group">
        <label class="input-label">选择文件</label>
        <div class="input-with-button">
          <input
            v-model="filePath"
            type="text"
            class="input"
            placeholder="请选择文件或输入文件路径..."
            readonly
          />
          <button class="btn btn-primary" :disabled="isLoading" @click="handleOpenFile">
            <svg
              v-if="!isLoading"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            <svg
              v-else
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            {{ isLoading ? '处理中...' : '选择文件' }}
          </button>
        </div>
      </div>

      <div v-if="filePath" class="file-info">
        <div class="info-item">
          <span class="info-label">文件路径：</span>
          <span class="info-value">{{ filePath }}</span>
        </div>
        <div v-if="fileInfo" class="info-item">
          <span class="info-label">文件大小：</span>
          <span class="info-value">{{ formatFileSize(fileInfo.size) }}</span>
        </div>
        <div v-if="fileInfo" class="info-item">
          <span class="info-label">修改时间：</span>
          <span class="info-value">{{ formatDate(fileInfo.mtime) }}</span>
        </div>
      </div>

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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useFile } from '@renderer/composable'

const filePath = ref('')
const fileInfo = ref<any>(null)
const error = ref('')
const isLoading = ref(false)

const { openFile } = useFile()

const handleOpenFile = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const result = await openFile()

    if (result) {
      filePath.value = result
    }
  } catch (err) {
    error.value = '文件打开失败，请重试'
    console.error('打开文件时出错:', err)
  } finally {
    isLoading.value = false
  }
}

const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style lang="less" scoped>
.open-file-card {
  .open-file-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }

  .file-input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);

    .input-label {
      font-size: var(--font-size-small);
      font-weight: 500;
      color: var(--text-regular);
    }

    .input-with-button {
      display: flex;
      gap: var(--spacing-sm);

      .input {
        flex: 1;
        background: var(--bg-color-page);
        cursor: default;
      }

      .btn {
        flex-shrink: 0;
        white-space: nowrap;

        svg {
          animation: spin 1s linear infinite;
        }

        &:not(:disabled) svg {
          animation: none;
        }
      }
    }
  }

  .file-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);

    .info-item {
      .info-value {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
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
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

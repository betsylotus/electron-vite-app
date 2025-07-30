import OSS from 'ali-oss'
import { ref } from 'vue'

// ==========常量定义==========
const OSS_CONFIG = {
  // 120秒, 上传超时时间
  TIMEOUT: 1000 * 60 * 2,
  // 50分钟, 阿里云STS Token 有效期为1小时，这里设置为50分钟，避免频繁刷新
  REFRESH_INTERVAL: 50 * 60 * 1000,
  // 1MB, 分片大小
  CHUNK_SIZE: 1024 * 1024,
  // 默认并发数, 并发上传分片数
  DEFAULT_PARALLEL: 4,
  // 2分钟, 上传超时时间
  UPLOAD_TIMEOUT: 1000 * 60 * 2
} as const

// ==========类型定义==========
interface IOSSCredentials {
  aliyunAccessKeyId: string
  aliyunAccessKeySecret: string
  region: string
  aliyunBucketName: string
  aliyunSecurityToken: string
}

interface ISTSTokenResponse {
  accessKeyId: string
  accessKeySecret: string
  stsToken: string
}

interface IUploadPart {
  number: number
  etag: string
}

interface IUploadOptions {
  parallel?: number
  partSize?: number
  timeout?: number
  checkpoint?: any
  progress?: (p: number, checkpoint: any) => void
  headers?: Record<string, string>
}

interface IUploadResult {
  name: string
  url: string
  [key: string]: any
}

// ==========useOss==========
function useOss() {
  // 创建oss客户端
  const client = ref<OSS | null>(null)
  const loading = ref(false)
  const error = ref<string>('')
  const ossConfig = ref<{ bucket: string; region: string } | null>(null)

  // 统一错误处理
  const handleError = (operation: string, e: any): never => {
    const errorMessage = `${operation}失败: ${e.message || '未知错误'}`
    error.value = errorMessage
    console.error(`[OSS] ${errorMessage}`, e)
    throw new Error(errorMessage)
  }

  const getOssStsToken = (
    params?: any
  ): Promise<{ code: number; data: IOSSCredentials; message?: string }> => {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        try {
          // 模拟成功响应的数据
          const mockCredentials: IOSSCredentials = {
            aliyunAccessKeyId: 'STS.NTxxxxxxxxxxxxxxxxxxxxxxx',
            aliyunAccessKeySecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            region: 'oss-cn-hangzhou',
            aliyunBucketName: 'my-test-bucket',
            aliyunSecurityToken: 'CAISxxxxxxxxxxxxxxxxxx'
          }

          // 模拟API响应格式
          const response = {
            code: 0,
            data: mockCredentials,
            message: 'success'
          }

          resolve(response)
        } catch (error) {
          // 模拟错误情况
          reject({
            code: -1,
            message: '获取STS Token失败',
            error
          })
        }
      }, 1000)
    })
  }

  // 获取 STS Token
  const getStsToken = async (params?: any): Promise<IOSSCredentials> => {
    try {
      const { code, data } = await getOssStsToken(params || {})

      if (code === 0 && data) {
        return data
      }
      throw new Error('获取 STS Token 失败')
    } catch (e: any) {
      return handleError('获取 STS Token', e)
    }
  }

  // 刷新 STS Token
  const refreshSTSToken = async (): Promise<ISTSTokenResponse> => {
    try {
      const data = await getStsToken()
      return {
        accessKeyId: data.aliyunAccessKeyId,
        accessKeySecret: data.aliyunAccessKeySecret,
        stsToken: data.aliyunSecurityToken
      }
    } catch (e: any) {
      console.error('[OSS] 刷新 STS Token 失败:', e)
      throw e
    }
  }

  // 初始化 OSS 客户端
  const initOSS = async (stsParams?: any): Promise<void> => {
    try {
      loading.value = true
      error.value = ''

      const credentials = await getStsToken(stsParams)

      const {
        aliyunAccessKeyId,
        aliyunAccessKeySecret,
        region,
        aliyunBucketName,
        aliyunSecurityToken
      } = credentials

      // 保存配置信息
      ossConfig.value = {
        bucket: aliyunBucketName,
        region
      }

      client.value = new OSS({
        region,
        secure: true,
        accessKeyId: aliyunAccessKeyId,
        accessKeySecret: aliyunAccessKeySecret,
        bucket: aliyunBucketName,
        stsToken: aliyunSecurityToken,
        timeout: OSS_CONFIG.TIMEOUT,
        refreshSTSToken,
        refreshSTSTokenInterval: OSS_CONFIG.REFRESH_INTERVAL
      })

      console.log('[OSS] 客户端初始化成功')
    } catch (e: any) {
      return handleError('初始化OSS', e)
    } finally {
      loading.value = false
    }
  }

  // 检查客户端是否已初始化
  const ensureClientInitialized = (): void => {
    if (!client.value) {
      throw new Error('[OSS] 客户端未初始化，请先调用 initOSS()')
    }
  }

  // 初始化分片上传
  const initMultipartUpload = async (objectName: string): Promise<string> => {
    ensureClientInitialized()
    try {
      const result = await client.value!.initMultipartUpload(objectName)
      console.log(`[OSS] 初始化分片上传成功: ${objectName}`)
      return result.uploadId
    } catch (e: any) {
      return handleError('初始化分片上传', e)
    }
  }

  // 上传分片
  const uploadPart = async (
    objectName: string,
    uploadId: string,
    partNumber: number,
    chunk: Blob
  ): Promise<IUploadPart> => {
    // 检查客户端是否已初始化
    ensureClientInitialized()
    try {
      const result = await client.value!.uploadPart(
        // 文件名
        objectName,
        // 上传ID
        uploadId,
        // 分片号
        partNumber,
        // 分片
        chunk,
        // 分片起始位置
        0,
        // 分片大小
        chunk.size
      )
      console.log(`[OSS] 分片 ${partNumber} 上传成功`)
      return {
        number: partNumber,
        etag: result.etag
      }
    } catch (e: any) {
      return handleError(`上传分片${partNumber}`, e)
    }
  }

  // 完成分片上传
  const completeMultipartUpload = async (
    objectName: string,
    uploadId: string,
    parts: IUploadPart[]
  ): Promise<any> => {
    ensureClientInitialized()
    try {
      const formattedParts = parts
        .sort((a, b) => a.number - b.number)
        .map((part) => ({
          number: part.number,
          etag: part.etag
        }))

      console.log('[OSS] 完成分片上传，分片信息:', JSON.stringify(formattedParts, null, 2))

      const result = await client.value!.completeMultipartUpload(
        objectName,
        uploadId,
        formattedParts
      )

      console.log('[OSS] 分片上传完成')
      return result
    } catch (e: any) {
      console.error('[OSS] Complete multipart upload error:', e)
      handleError('完成分片上传', e)
    }
  }

  // 上传大文件（手动分片），阿里云 OSS SDK 的 内置 multipartUpload 方法，不支持断点续传
  const uploadLargeFile = async (file: File, objectName: string): Promise<any> => {
    try {
      console.log(`[OSS] 开始上传大文件: ${objectName}, 大小: ${file.size} bytes`)

      // 1. 初始化分片上传
      const uploadId = await initMultipartUpload(objectName)
      console.log('uploadLargeFile-uploadId', uploadId)

      // 2. 将文件分片
      const chunkSize = OSS_CONFIG.CHUNK_SIZE
      const chunks = Math.ceil(file.size / chunkSize)
      const parts: IUploadPart[] = []

      console.log(`[OSS] 文件将被分为 ${chunks} 个分片`)

      // 3. 上传所有分片
      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize
        const end = Math.min(file.size, start + chunkSize)
        const chunk = file.slice(start, end)

        const result = await uploadPart(objectName, uploadId, i + 1, chunk)
        console.log('uploadLargeFile-result', result)

        parts.push(result)
      }

      // 4. 完成分片上传
      const completeResult = await completeMultipartUpload(objectName, uploadId, parts)
      console.log('[OSS] 大文件上传完成:', completeResult)

      return completeResult
    } catch (e: any) {
      handleError('上传大文件', e)
    }
  }

  // 获取分片列表
  const listParts = async (objectName: string, uploadId: string): Promise<any[]> => {
    // 检查客户端是否已初始化
    ensureClientInitialized()
    try {
      const result = await client.value!.listParts(objectName, uploadId)
      return result.parts || []
    } catch (e: any) {
      return handleError('获取分片列表', e)
    }
  }

  // 简单文件上传
  const uploadFile = async (filename: string, fileData: File): Promise<any> => {
    // 检查客户端是否已初始化
    ensureClientInitialized()
    try {
      console.log(`[OSS] 开始上传文件: ${filename}`)
      const result = await client.value!.put(filename, fileData)
      console.log('[OSS] 文件上传成功:', result)
      return result
    } catch (e: any) {
      handleError('上传文件', e)
    }
  }

  // 断点续传上传，使用阿里云 OSS SDK 的 内置 multipartUpload 方法
  const resumableUploadFile = async (
    fileName: string,
    file: File,
    chunkSize: number = OSS_CONFIG.CHUNK_SIZE,
    options: Partial<IUploadOptions> = {}
  ): Promise<IUploadResult> => {
    // 检查客户端是否已初始化
    ensureClientInitialized()

    loading.value = true
    error.value = ''

    const objectName = `${import.meta.env.VITE_APP_NAME}/${fileName}`

    // 生成文件唯一标识（基于文件名、大小、最后修改时间）
    const fileKey = `${objectName}_${file.size}_${file.lastModified}`
    const checkpointKey = `oss_checkpoint_${fileKey}`

    try {
      console.log(`[OSS] 开始断点续传: ${objectName}`)

      // 尝试从本地存储恢复 checkpoint
      const savedCheckpoint = localStorage.getItem(checkpointKey)

      let checkpoint = null

      if (savedCheckpoint) {
        try {
          checkpoint = JSON.parse(savedCheckpoint)
          console.log(`[OSS] 发现保存的断点信息，尝试恢复上传`, checkpoint)
        } catch (parseError) {
          console.warn(`[OSS] 解析断点信息失败，将重新开始上传`, parseError)
          localStorage.removeItem(checkpointKey)
        }
      }

      // 保存用户的进度回调函数
      const userProgressCallback = options.progress

      const uploadOptions: IUploadOptions = {
        // 合并其他选项（除了progress）
        ...options,
        // 并发上传分片数
        parallel: options.parallel || OSS_CONFIG.DEFAULT_PARALLEL,
        // 分片大小
        partSize: chunkSize,
        // 上传超时时间
        timeout: options.timeout || OSS_CONFIG.UPLOAD_TIMEOUT,
        // 恢复断点（如果存在）
        checkpoint: checkpoint,
        // 上传进度回调（确保不会被覆盖）
        progress: (p: number, checkpoint: any) => {
          console.log('[OSS] resumableUploadFile:', p)

          const progressPercent = (p * 100).toFixed(2)

          console.log(`[OSS] 上传进度: ${progressPercent}%`)

          // 保存当前进度到本地存储
          if (checkpoint) {
            try {
              localStorage.setItem(checkpointKey, JSON.stringify(checkpoint))
              console.log(`[OSS] 已保存断点信息 - 进度: ${progressPercent}%`)
            } catch (saveError) {
              console.warn(`[OSS] 保存断点信息失败`, saveError)
            }
          }

          // 调用用户自定义的进度回调
          if (userProgressCallback) {
            userProgressCallback(p, checkpoint)
          }
        },
        // 请求头
        headers: {
          'Content-Type': file.type,
          ...(options.headers || {})
        }
      }

      console.log(`[OSS] 上传配置:`, {
        parallel: uploadOptions.parallel,
        partSize: uploadOptions.partSize,
        timeout: uploadOptions.timeout,
        hasCheckpoint: !!checkpoint,
        fileSize: file.size,
        fileName: objectName
      })

      const result = await client.value!.multipartUpload(objectName, file, uploadOptions)

      // 上传成功后清除保存的 checkpoint
      localStorage.removeItem(checkpointKey)
      console.log(`[OSS] 上传成功，已清除断点信息`)

      // 构造文件 URL
      const fileUrl = ossConfig.value
        ? `https://${ossConfig.value.bucket}.${ossConfig.value.region}.aliyuncs.com/${objectName}`
        : ''

      const uploadResult: IUploadResult = {
        ...result,
        url: fileUrl,
        name: objectName
      }

      console.log('[OSS] 断点续传完成:', uploadResult)

      return uploadResult
    } catch (e: any) {
      console.error('[OSS] 断点续传失败:', e)

      // 根据错误类型处理
      if (e.code === 'ConnectionTimeoutError') {
        error.value = '网络连接超时，请检查网络后重试'
        console.log(`[OSS] 网络超时，断点信息已保存，可重新上传恢复`)
      } else if (e.code === 'NetworkError' || e.message?.includes('network')) {
        error.value = '网络连接失败，请检查网络后重试'
        console.log(`[OSS] 网络错误，断点信息已保存，可重新上传恢复`)
      } else if (e.code === 'RequestTimeout') {
        error.value = '请求超时，请重试'
        console.log(`[OSS] 请求超时，断点信息已保存，可重新上传恢复`)
      } else {
        // 其他错误（如权限、文件格式等）清除断点信息
        error.value = '上传失败：' + (e.message || '未知错误')
        localStorage.removeItem(checkpointKey)
        console.log(`[OSS] 上传失败，已清除断点信息:`, e.message)
      }

      throw e
    } finally {
      loading.value = false
    }
  }

  // 清除指定文件的断点信息
  const clearCheckpoint = (objectName: string, file: File): void => {
    const fileKey = `${objectName}_${file.size}_${file.lastModified}`
    const checkpointKey = `oss_checkpoint_${fileKey}`
    localStorage.removeItem(checkpointKey)
    console.log(`[OSS] 已清除文件断点信息: ${objectName}`)
  }

  // 检查是否存在断点信息
  const hasCheckpoint = (objectName: string, file: File): boolean => {
    const fileKey = `${objectName}_${file.size}_${file.lastModified}`
    const checkpointKey = `oss_checkpoint_${fileKey}`
    return localStorage.getItem(checkpointKey) !== null
  }

  // 获取断点信息
  const getCheckpoint = (objectName: string, file: File): any => {
    const fileKey = `${objectName}_${file.size}_${file.lastModified}`
    const checkpointKey = `oss_checkpoint_${fileKey}`
    const savedCheckpoint = localStorage.getItem(checkpointKey)

    if (savedCheckpoint) {
      try {
        return JSON.parse(savedCheckpoint)
      } catch (parseError) {
        console.warn(`[OSS] 解析断点信息失败`, parseError)
        localStorage.removeItem(checkpointKey)
      }
    }
    return null
  }

  return {
    client,
    loading,
    error,
    initOSS,
    // 简单文件上传
    uploadFile,
    // 大文件上传
    uploadLargeFile,
    // 断点续传上传
    resumableUploadFile,
    // 清除断点
    clearCheckpoint,
    // 检查断点
    hasCheckpoint,
    // 获取断点
    getCheckpoint
  }
}

export { useOss }

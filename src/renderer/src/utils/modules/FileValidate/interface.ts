import type { FileValidationError } from './enum'

/**
 * 文件验证选项接口
 */
export interface ValidateOptions {
  // 最大文件大小（MB）
  maxSize?: number
  // 是否检查文件大小
  checkSize?: boolean
  // 是否启用严格模式（魔数验证）
  strictMode?: boolean
  // 是否检查文件扩展名
  checkExtension?: boolean
  // 图片最大宽度
  imageMaxWidth?: number
  // 图片最大高度
  imageMaxHeight?: number
  // 是否检查图片尺寸
  checkImageDimension?: boolean
  // 允许的文件类型
  allowedTypes?: string[]
  // 允许的文件分类
  allowedCategories?: string[]
  // 自定义验证函数
  customValidator?: (file: File) => Promise<ValidateResult>
  // 是否验证 MIME 类型
  validateMimeType?: boolean
  // 允许的文件扩展名
  allowedExtensions?: string[]
}

/**
 * 验证结果接口
 */
export interface ValidateResult {
  valid: boolean
  message?: string
  error?: Error
  errorType?: FileValidationError
  details?: Record<string, any>
}

/**
 * 文件类型分类接口
 */
export interface FileTypeCategory {
  name: string
  types: string[]
  maxSize?: number
  description?: string
  allowedExtensions?: string[]
  imageMaxWidth?: number
  imageMaxHeight?: number
}

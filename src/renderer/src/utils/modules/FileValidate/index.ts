import { MIME_ALIASES, FILE_SIGNATURES, FILE_CATEGORIES, EXTENSION_MAP } from './fileTypes'
import type { ValidateOptions, ValidateResult } from './interface'
import { FileValidationError } from './enum'

/**
 * 标准化 MIME 类型
 */
const normalizeMimeType = (type: string): string => {
  return MIME_ALIASES[type.toLowerCase()] || type.toLowerCase()
}

/**
 * 获取文件扩展名
 */
const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

/**
 * 获取文件分类下的所有允许类型
 */
const getCategoryTypes = (categories: string[]): string[] => {
  return categories.map((category) => FILE_CATEGORIES[category]?.types || []).flat()
}

/**
 * 验证文件类型（使用魔数）
 */
const validateFileType = async (
  file: File,
  allowedTypes: string[],
  strictMode = true
): Promise<ValidateResult> => {
  const normalizedAllowedTypes = allowedTypes.map((type) => normalizeMimeType(type))

  if (!strictMode) {
    const normalizedFileType = normalizeMimeType(file.type)
    if (normalizedAllowedTypes.includes(normalizedFileType)) {
      return { valid: true }
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onloadend = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) {
        resolve({
          valid: false,
          message: '文件读取失败',
          errorType: FileValidationError.CORRUPTED_FILE
        })
        return
      }

      const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(0, 32)
      let header = ''
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0')
      }

      const isValid = normalizedAllowedTypes.some((type) => {
        const signatures = FILE_SIGNATURES[type]
        return signatures?.some((sig) => header.startsWith(sig.toLowerCase()))
      })

      resolve({
        valid: isValid,
        message: isValid ? undefined : '文件类型验证失败',
        errorType: isValid ? undefined : FileValidationError.MAGIC_NUMBER_MISMATCH
      })
    }

    reader.onerror = () =>
      resolve({
        valid: false,
        message: '文件读取失败',
        errorType: FileValidationError.CORRUPTED_FILE
      })

    try {
      reader.readAsArrayBuffer(file.slice(0, 32))
    } catch (error) {
      resolve({
        valid: false,
        message: '文件读取失败',
        error: error as Error,
        errorType: FileValidationError.CORRUPTED_FILE
      })
    }
  })
}

/**
 * 主验证函数
 */
const fileValidate = async (file: File, options: ValidateOptions = {}): Promise<ValidateResult> => {
  try {
    const {
      maxSize = 10,
      checkSize = true,
      strictMode = true,
      checkExtension = true,
      // 接受 MIME 类型字符串数组 'image/jpeg' 'application/pdf'
      allowedTypes = [],
      // 文件分类字符串数组 'document' 'image'
      allowedCategories = [],
      validateMimeType = true
    } = options

    // 合并文件类型
    const finalAllowedTypes = [...allowedTypes, ...getCategoryTypes(allowedCategories)]

    // MIME 类型验证
    if (validateMimeType) {
      const normalizedFileType = normalizeMimeType(file.type)
      if (!finalAllowedTypes.includes(normalizedFileType)) {
        return {
          valid: false,
          message: '不支持的文件类型',
          errorType: FileValidationError.INVALID_TYPE
        }
      }
    }

    // 文件扩展名验证
    if (checkExtension) {
      const extension = getFileExtension(file.name)
      const isValidExtension = finalAllowedTypes.some((type) => {
        const extensions = EXTENSION_MAP[type]
        return extensions?.includes(`.${extension}`)
      })

      if (!isValidExtension) {
        const extensions = finalAllowedTypes
          .map((type) => EXTENSION_MAP[type])
          .flat()
          .filter(Boolean)
          .join('、')

        return {
          valid: false,
          message: `不支持的文件格式，仅支持：${extensions}`,
          errorType: FileValidationError.INVALID_EXTENSION
        }
      }
    }

    // 魔数验证
    if (strictMode) {
      const magicNumberResult = await validateFileType(file, finalAllowedTypes, true)
      if (!magicNumberResult.valid) {
        return magicNumberResult
      }
    }

    // 文件大小验证
    if (checkSize) {
      const fileSizeMB = file.size / 1024 / 1024

      if (fileSizeMB > maxSize) {
        return {
          valid: false,
          message: `文件大小不能超过 ${maxSize}MB`,
          errorType: FileValidationError.SIZE_TOO_LARGE
        }
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      message: '文件验证过程出错',
      error: error as Error,
      errorType: FileValidationError.CUSTOM_ERROR
    }
  }
}

export { fileValidate }

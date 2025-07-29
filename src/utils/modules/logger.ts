import log, { LogLevel } from 'electron-log'
import { app } from 'electron'
import { join, resolve, parse } from 'path'
import fs from 'fs'

// 日志配置接口
interface LoggerConfig {
  /** 日志级别 */
  level?: LogLevel
  /** 是否启用文件日志 */
  enableFile?: boolean
  /** 是否启用控制台日志 */
  enableConsole?: boolean
  /** 日志文件最大大小(MB) */
  maxSize?: number
  /** 最大日志文件数量 */
  maxFiles?: number
  /** 自定义日志目录 */
  logDir?: string
  /** 日志文件名前缀 */
  filePrefix?: string
}

// 日志上下文接口
interface LogContext {
  [key: string]: string | number | boolean | object | null | undefined
}

// 日志消息类型
type LogMessage = string | number | boolean | object | Error | null | undefined

// 日志参数类型
type LogArgs = (string | number | boolean | object | Error | null | undefined)[]

// 获取应用名称
const appName = import.meta.env.VITE_APP_NAME

// 获取日志目录
const logDir = app?.getPath('logs')

// Logger类 - electron-log的二次封装
class Logger {
  // 日志配置
  private config: Required<LoggerConfig>
  // 日志上下文
  private context: LogContext = {}

  // 初始化日志配置
  constructor(config: LoggerConfig) {
    // 默认配置
    this.config = {
      // 日志级别
      level: 'info',
      // 是否启用文件日志
      enableFile: true,
      // 是否启用控制台日志
      enableConsole: true,
      // 日志文件最大大小(MB)
      maxSize: 10,
      // 最大日志文件数量
      maxFiles: 5,
      // 自定义日志目录
      logDir: '',
      // 日志文件名前缀
      filePrefix: 'app',
      ...config
    }

    this.initialize()
  }

  // 初始化日志配置
  initialize() {
    try {
      // 设置日志级别
      log.transports.file.level = this.config.level
      log.transports.console.level = this.config.level

      // 配置文件输出
      if (this.config.enableFile) {
        this.setupFileTransport()
      } else {
        log.transports.file.level = false
      }

      // 配置控制台输出
      if (!this.config.enableConsole) {
        log.transports.console.level = false
      }

      // 设置日志格式
      this.setupLogFormat()

      // 设置错误处理
      this.setupErrorHandling()

      this.info('Logger initialized successfully', {
        config: this.config,
        logPath: log.transports.file.getFile()?.path
      })
    } catch (error) {
      console.error('Failed to initialize logger:', error)
    }
  }

  // 配置文件传输
  setupFileTransport() {
    // 设置日志目录
    if (this.config.logDir) {
      const logDir = resolve(this.config.logDir)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
      log.transports.file.resolvePathFn = () => join(logDir, `${this.config.filePrefix}.log`)
    } else {
      // 使用默认路径，但自定义文件名
      log.transports.file.fileName = `${this.config.filePrefix}.log`
    }

    // 设置文件大小和数量限制
    log.transports.file.maxSize = this.config.maxSize * 1024 * 1024 // 转换为字节

    // 设置文件归档函数
    log.transports.file.archiveLogFn = (file) => {
      const info = parse(file.path)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      return join(info.dir, `${info.name}-${timestamp}${info.ext}`)
    }
  }

  // 设置日志格式
  private setupLogFormat(): void {
    // 文件日志格式
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

    // 控制台日志格式
    log.transports.console.format = '[{h}:{i}:{s}.{ms}] [{level}] {text}'
  }

  // 设置错误处理
  private setupErrorHandling(): void {
    // 捕获未处理的异常
    process.on('uncaughtException', (error) => {
      this.error('Uncaught Exception:', error)
    })

    // 捕获未处理的Promise拒绝
    process.on('unhandledRejection', (reason, promise) => {
      this.error('Unhandled Rejection at:', promise, 'reason:', reason as LogMessage)
    })
  }

  // 格式化日志消息
  private formatMessage(message: LogMessage, ...args: LogArgs): string {
    const contextStr =
      Object.keys(this.context).length > 0 ? `[${JSON.stringify(this.context)}] ` : ''

    let formattedMessage = contextStr + String(message)

    if (args.length > 0) {
      const additionalInfo = args
        .map((arg) => {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2)
          }
          return String(arg)
        })
        .join(' ')
      formattedMessage += ' ' + additionalInfo
    }

    return formattedMessage
  }

  //  Debug级别日志
  debug(message: LogMessage, ...args: LogArgs): void {
    log.debug(this.formatMessage(message, ...args))
  }

  //  Verbose级别日志
  verbose(message: LogMessage, ...args: LogArgs): void {
    log.verbose(this.formatMessage(message, ...args))
  }

  //  Info级别日志
  info(message: LogMessage, ...args: LogArgs): void {
    log.info(this.formatMessage(message, ...args))
  }

  //  Warn级别日志
  warn(message: LogMessage, ...args: LogArgs): void {
    log.warn(this.formatMessage(message, ...args))
  }

  //  Error级别日志
  error(message: LogMessage, ...args: LogArgs): void {
    log.error(this.formatMessage(message, ...args))
  }

  //  Fatal级别日志
  fatal(message: LogMessage, ...args: LogArgs): void {
    // electron-log 没有 fatal 级别，使用 error
    log.error('[FATAL]', this.formatMessage(message, ...args))
  }

  //  记录性能指标
  performance(label: string, startTime: number): void {
    const duration = Date.now() - startTime
    this.info(`Performance [${label}]: ${duration}ms`)
  }
}

// 为主进程和渲染进程和预加载脚本提供不同的配置
const createMainLogger = (config?: LoggerConfig): Logger => {
  return new Logger({
    filePrefix: `${appName}-main`,
    logDir: logDir,
    enableConsole: true,
    enableFile: true,
    ...config
  })
}

const createPreloadLogger = (config?: LoggerConfig): Logger => {
  return new Logger({
    filePrefix: `${appName}-preload`,
    logDir: logDir,
    enableFile: true,
    enableConsole: true,
    ...config
  })
}

export { createMainLogger, createPreloadLogger }

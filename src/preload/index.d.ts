import { ElectronAPI } from '@electron-toolkit/preload'

interface Api {
  file: {
    open: () => Promise<{ success: boolean; filePath?: string }>
  }
  notification: {
    show: (options: { title: string; body: string }) => Promise<{ success: boolean }>
  }
  version: {
    get: () => Promise<string>
  }
  memory: {
    getCurrentUsage: () => Promise<any>
    getStats: () => Promise<any>
    getHistory: () => Promise<any>
    getGCStats: () => Promise<any>
    forceGC: () => Promise<{ success: boolean; message: string }>
    updateConfig: (config: any) => Promise<{ success: boolean; message: string }>
    startMonitoring: () => Promise<{ success: boolean; message: string }>
    stopMonitoring: () => Promise<{ success: boolean; message: string }>
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}

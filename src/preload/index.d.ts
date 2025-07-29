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
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}

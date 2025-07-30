import { fileIPC } from './modules/file'
import { notificationIPC } from './modules/notification'
import { versionIPC } from './modules/version'
import { memoryIPC } from './modules/memory'

function setupIPC() {
  fileIPC()
  notificationIPC()
  versionIPC()
  memoryIPC()
}

export { setupIPC }

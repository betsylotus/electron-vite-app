import { fileIPC } from './modules/file'
import { notificationIPC } from './modules/notification'
import { versionIPC } from './modules/version'

function setupIPC() {
  fileIPC()
  notificationIPC()
  versionIPC()
}

export { setupIPC }

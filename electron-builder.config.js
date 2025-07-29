export default {
  // 用程序的唯一标识符
  appId: 'com.electron.app',
  // 应用程序的产品名称
  productName: 'electron-vite-app',
  // 构建资源目录
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!{electron.vite.config.mjs,electron-builder.config.js}',
    '!{.eslintcache,eslint.config.mjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  ],
  asarUnpack: ['resources/**'],

  // Windows 平台配置
  win: {
    // Windows 可执行文件名
    executableName: 'electron-vite-app'
  },
  // NSIS 安装器配置
  nsis: {
    // 安装包文件名模板
    artifactName: '${name}-${version}-setup.${ext}',
    // 快捷方式名称
    shortcutName: '${productName}',
    // 卸载程序显示名称
    uninstallDisplayName: '${productName}',
    // 总是创建桌面快捷方式
    createDesktopShortcut: 'always',
    // 是否一键安装，默认为true
    oneClick: false,
    // 安装语言，2052对应中文
    language: '2052',
    // 是否为当前系统的所有用户安装该应用程序
    perMachine: false,
    // 是否允许用户选择安装目录
    allowToChangeInstallationDirectory: true
  },

  // macOS 平台配置
  mac: {
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: [
      { NSCameraUsageDescription: "Application requests access to the device's camera." },
      { NSMicrophoneUsageDescription: "Application requests access to the device's microphone." },
      {
        NSDocumentsFolderUsageDescription:
          "Application requests access to the user's Documents folder."
      },
      {
        NSDownloadsFolderUsageDescription:
          "Application requests access to the user's Downloads folder."
      }
    ],
    artifactName: '${name}-${version}.${ext}'
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: 'electronjs.org',
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}'
  },
  npmRebuild: false,
  // 生产环境自动更新配置
  publish: {
    provider: 'generic',
    url: 'https://example.com/auto-updates'
  },
  electronDownload: {
    mirror: 'https://npmmirror.com/mirrors/electron/'
  }
}

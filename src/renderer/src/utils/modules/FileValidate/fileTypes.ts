import type { FileTypeCategory } from './interface'

/**
 * 文件魔数签名映射表
 * 魔数是位于文件开头的一段二进制数，用于标识文件类型
 * 以十六进制表示，例如：JPEG 文件以 FF D8 FF 开头
 */
export const FILE_SIGNATURES: Record<string, string[]> = {
  // 图片格式
  'image/jpeg': ['ffd8ff'], // JPEG/JPG - FF D8 FF
  'image/png': ['89504e47'], // PNG - 89 50 4E 47 (.PNG)
  'image/gif': [
    '474946383761', // GIF87a - 47 49 46 38 37 61
    '474946383961' // GIF89a - 47 49 46 38 39 61
  ],
  'image/webp': ['52494646'], // WEBP - 52 49 46 46 (RIFF)
  'image/bmp': ['424d'], // BMP - 42 4D (BM)
  'image/tiff': [
    '492049', // TIFF - 49 20 49
    '49492a00' // TIFF - 49 49 2A 00
  ],
  'image/svg+xml': ['3c737667'], // SVG - 3C 73 76 67 (<svg)
  'image/x-icon': ['00000100'], // ICO - 00 00 01 00

  // 文档格式
  'application/pdf': ['255044462d'], // PDF - 25 50 44 46 2D (%PDF-)
  'application/msword': ['d0cf11e0'], // DOC - D0 CF 11 E0 (Microsoft Office)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '504b0304' // DOCX - 50 4B 03 04 (ZIP格式)
  ],
  'application/vnd.ms-excel': ['d0cf11e0'], // XLS - D0 CF 11 E0 (Microsoft Office)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '504b0304' // XLSX - 50 4B 03 04 (ZIP格式)
  ],
  'application/vnd.ms-powerpoint': ['d0cf11e0'], // PPT - D0 CF 11 E0 (Microsoft Office)
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '504b0304' // PPTX - 50 4B 03 04 (ZIP格式)
  ],

  // 压缩文件
  'application/zip': [
    '504b0304', // ZIP - 50 4B 03 04 (PK..)
    '504b0506', // ZIP - 50 4B 05 06 (空ZIP档案)
    '504b0708' // ZIP - 50 4B 07 08 (跨区ZIP档案)
  ],
  'application/x-rar-compressed': ['526172211a07'], // RAR - 52 61 72 21 1A 07 (Rar!)
  'application/x-7z-compressed': ['377abcaf271c'], // 7Z - 37 7A BC AF 27 1C
  'application/gzip': ['1f8b08'], // GZIP - 1F 8B 08
  'application/x-tar': ['7573746172'], // TAR - 75 73 74 61 72 (ustar)

  // 音频格式
  'audio/mpeg': [
    '494433', // MP3 - 49 44 33 (ID3)
    'fffb', // MP3 - FF FB (MPEG-1 Layer 3)
    'fff3', // MP3 - FF F3 (MPEG-1 Layer 3)
    'fff2' // MP3 - FF F2 (MPEG-1 Layer 3)
  ],
  'audio/wav': ['52494646'], // WAV - 52 49 46 46 (RIFF)
  'audio/ogg': ['4f676753'], // OGG - 4F 67 67 53 (OggS)
  'audio/midi': ['4d546864'], // MIDI - 4D 54 68 64 (MThd)
  'audio/aac': [
    'fff1', // AAC - FF F1
    'fff9' // AAC - FF F9
  ],
  'audio/flac': ['664c6143'], // FLAC - 66 4C 61 43 (fLaC)

  // 视频格式
  'video/mp4': [
    '000000', // MP4 - 00 00 00
    'ftypmp4' // MP4 - 66 74 79 70 (ftyp)
  ],
  'video/webm': ['1a45dfa3'], // WEBM - 1A 45 DF A3
  'video/x-matroska': ['1a45dfa3'], // MKV - 1A 45 DF A3 (与WEBM相同)
  'video/quicktime': ['6674797071742020'], // MOV - 66 74 79 70 (ftyp)
  'video/x-msvideo': ['52494646'], // AVI - 52 49 46 46 (RIFF)
  'video/mpeg': [
    '000001ba', // MPEG - 00 00 01 BA (视频流)
    '000001b3' // MPEG - 00 00 01 B3 (视频流)
  ],

  // 其他常见格式
  'application/x-shockwave-flash': [
    '435753', // SWF - 43 57 53 (CWS, 压缩)
    '465753' // SWF - 46 57 53 (FWS, 未压缩)
  ],
  'application/xml': ['3c3f786d6c'], // XML - 3C 3F 78 6D 6C (<?xml)
  'application/x-sqlite3': ['53514c6974'], // SQLite - 53 51 4C 69 74 (SQLit)
  'text/rtf': ['7b5c72746631'], // RTF - 7B 5C 72 74 66 31 ({\rtf1)
  'application/x-photoshop': ['38425053'] // PSD - 38 42 50 53 (8BPS)
}

/**
 * 文件类型分类定义
 * 包含各种文件类型的分类、限制和描述信息
 */
export const FILE_CATEGORIES: Record<string, FileTypeCategory> = {
  // 图片文件类型
  image: {
    name: '图片',
    types: [
      'image/jpeg', // JPG/JPEG 图片
      'image/png', // PNG 图片
      'image/gif', // GIF 动图
      'image/webp', // WebP 图片
      'image/svg+xml', // SVG 矢量图
      'image/bmp', // BMP 位图
      'image/tiff', // TIFF 图片
      'image/x-icon' // ICO 图标
    ],
    description: '支持 JPG、PNG、GIF、WebP、SVG、BMP、TIFF 格式',
    imageMaxWidth: 4096, // 最大宽度 4096px
    imageMaxHeight: 4096, // 最大高度 4096px
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.ico']
  },

  // 文档文件类型
  document: {
    name: '文档',
    types: [
      // PDF 文档
      'application/pdf',
      // DOC 文档
      'application/msword',
      // DOCX 文档
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // XLS 表格
      'application/vnd.ms-excel',
      // XLSX 表格
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // PPT 演示文稿
      'application/vnd.ms-powerpoint',
      // PPTX 演示文稿
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    description: '支持 PDF、DOC、DOCX、XLS、XLSX、PPT、PPTX 格式',
    allowedExtensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']
  },

  // 压缩文件类型
  archive: {
    name: '压缩包',
    types: [
      'application/zip', // ZIP 压缩包
      'application/x-rar-compressed', // RAR 压缩包
      'application/x-7z-compressed', // 7Z 压缩包
      'application/gzip', // GZIP 压缩包
      'application/x-tar' // TAR 归档文件
    ],
    description: '支持 ZIP、RAR、7Z、GZ、TAR 格式',
    allowedExtensions: ['.zip', '.rar', '.7z', '.gz', '.tar']
  },

  // 视频文件类型
  video: {
    name: '视频',
    types: [
      'video/mp4', // MP4 视频
      'video/webm', // WebM 视频
      'video/x-matroska', // MKV 视频
      'video/quicktime', // MOV 视频
      'video/x-msvideo', // AVI 视频
      'video/mpeg' // MPEG 视频
    ],
    description: '支持 MP4、WebM、MKV、MOV、AVI、MPEG 格式',
    allowedExtensions: ['.mp4', '.webm', '.mkv', '.mov', '.avi', '.mpeg', '.mpg']
  },

  // 音频文件类型
  audio: {
    name: '音频',
    types: [
      'audio/mpeg', // MP3 音频
      'audio/wav', // WAV 音频
      'audio/ogg', // OGG 音频
      'audio/midi', // MIDI 音频
      'audio/aac', // AAC 音频
      'audio/flac' // FLAC 音频
    ],
    description: '支持 MP3、WAV、OGG、MIDI、AAC、FLAC 格式',
    allowedExtensions: ['.mp3', '.wav', '.ogg', '.mid', '.midi', '.aac', '.flac']
  },

  // 设计文件类型
  design: {
    name: '设计文件',
    types: [
      'application/x-photoshop', // PSD 文件
      'image/vnd.adobe.photoshop' // PSD 文件 (替代 MIME 类型)
    ],
    description: '支持 PSD 格式',
    allowedExtensions: ['.psd']
  },

  // 文本文件类型
  text: {
    name: '文本文件',
    types: [
      'text/plain', // TXT 文本
      'text/html', // HTML 文件
      'text/css', // CSS 样式表
      'text/javascript', // JS 脚本
      'application/json', // JSON 文件
      'text/xml', // XML 文件
      'text/rtf' // RTF 富文本
    ],
    description: '支持 TXT、HTML、CSS、JS、JSON、XML、RTF 格式',
    allowedExtensions: ['.txt', '.html', '.htm', '.css', '.js', '.json', '.xml', '.rtf']
  },

  // 字体文件类型
  font: {
    name: '字体文件',
    types: [
      'font/ttf', // TTF 字体
      'font/otf', // OTF 字体
      'font/woff', // WOFF 字体
      'font/woff2' // WOFF2 字体
    ],
    description: '支持 TTF、OTF、WOFF、WOFF2 格式',
    allowedExtensions: ['.ttf', '.otf', '.woff', '.woff2']
  },

  // 3D 模型文件类型
  model: {
    name: '3D模型',
    types: [
      'model/gltf-binary', // GLB 模型
      'model/gltf+json', // GLTF 模型
      'application/octet-stream' // FBX、OBJ 等通用二进制
    ],
    description: '支持 GLTF、GLB、FBX、OBJ 格式',
    allowedExtensions: ['.glb', '.gltf', '.fbx', '.obj']
  },

  // 数据库文件类型
  database: {
    name: '数据库文件',
    types: [
      'application/x-sqlite3', // SQLite 数据库
      'application/x-msaccess' // Access 数据库
    ],
    maxSize: 200, // 最大 200MB
    description: '支持 SQLite、Access 格式',
    allowedExtensions: ['.db', '.sqlite', '.mdb']
  }
}

/**
 * MIME 类型别名映射表
 * 用于标准化不同系统返回的相同类型但不同 MIME 的文件
 */
export const MIME_ALIASES: Record<string, string> = {
  // 图片格式别名
  'image/jpg': 'image/jpeg',
  'image/jpe': 'image/jpeg',
  'image/jfif': 'image/jpeg',
  'image/pjpeg': 'image/jpeg',
  'image/x-png': 'image/png',
  'image/vnd.adobe.photoshop': 'application/x-photoshop',
  'image/ico': 'image/x-icon',
  'image/vnd.microsoft.icon': 'image/x-icon',

  // 文档格式别名
  'application/x-pdf': 'application/pdf',
  'application/acrobat': 'application/pdf',
  'applications/vnd.pdf': 'application/pdf',
  'application/msword-doc': 'application/msword',
  'application/excel': 'application/vnd.ms-excel',
  'application/x-excel': 'application/vnd.ms-excel',
  'application/powerpoint': 'application/vnd.ms-powerpoint',

  // 压缩文件别名
  'application/x-zip': 'application/zip',
  'application/x-zip-compressed': 'application/zip',
  'application/x-compressed': 'application/zip',
  'application/x-rar': 'application/x-rar-compressed',
  'application/octet-stream': 'application/x-rar-compressed', // 针对某些 RAR 文件

  // 音频格式别名
  'audio/mp3': 'audio/mpeg',
  'audio/x-mp3': 'audio/mpeg',
  'audio/mpeg3': 'audio/mpeg',
  'audio/x-mpeg': 'audio/mpeg',
  'audio/x-wav': 'audio/wav',
  'audio/wave': 'audio/wav',
  'audio/x-aac': 'audio/aac',

  // 视频格式别名
  'video/quicktime': 'video/mp4',
  'video/x-quicktime': 'video/mp4',
  'video/mpeg4': 'video/mp4',
  'video/x-mpeg': 'video/mpeg',
  'video/avi': 'video/x-msvideo',
  'video/msvideo': 'video/x-msvideo',

  // 文本格式别名
  'text/javascript': 'application/javascript',
  'application/x-javascript': 'application/javascript',
  'text/json': 'application/json',
  'application/x-json': 'application/json',
  'text/x-html': 'text/html',
  'text/plain-text': 'text/plain',

  // 字体格式别名
  'application/x-font-ttf': 'font/ttf',
  'application/x-font-otf': 'font/otf',
  'application/font-woff': 'font/woff',
  'application/font-woff2': 'font/woff2',

  // 3D模型格式别名
  'model/gltf.binary': 'model/gltf-binary',
  'application/gltf.binary': 'model/gltf-binary',
  'model/gltf.json': 'model/gltf+json',

  // 数据库文件别名
  'application/sqlite': 'application/x-sqlite3',
  'application/x-sqlite': 'application/x-sqlite3',
  'application/msaccess': 'application/x-msaccess',
  'application/vnd.ms-access': 'application/x-msaccess'
}

/**
 * 文件扩展名映射表
 */
export const EXTENSION_MAP: Record<string, string[]> = {
  // 图片格式
  'image/jpeg': ['.jpg', '.jpeg', '.jpe', '.jfif'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/bmp': ['.bmp'],
  'image/tiff': ['.tif', '.tiff'],
  'image/x-icon': ['.ico'],

  // 文档格式
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],

  // 压缩文件
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z'],
  'application/gzip': ['.gz'],
  'application/x-tar': ['.tar'],

  // 音频格式
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/ogg': ['.ogg'],
  'audio/midi': ['.mid', '.midi'],
  'audio/aac': ['.aac'],
  'audio/flac': ['.flac'],

  // 视频格式
  'video/mp4': ['.mp4', '.m4v'],
  'video/webm': ['.webm'],
  'video/x-matroska': ['.mkv'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/mpeg': ['.mpeg', '.mpg'],

  // 设计文件
  'application/x-photoshop': ['.psd'],
  'image/vnd.adobe.photoshop': ['.psd'],

  // 其他常见格式
  'text/plain': ['.txt'],
  'text/html': ['.html', '.htm'],
  'text/css': ['.css'],
  'text/javascript': ['.js'],
  'application/json': ['.json'],
  'text/xml': ['.xml'],
  'text/rtf': ['.rtf']
}

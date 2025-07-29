function useFile() {
  const openFile = async () => {
    const result = await window.api.file.open()
    console.log('===== [useFile] ====== [result]', result)
    if (result.success) {
      return result.filePath
    }
    return null
  }

  return {
    openFile
  }
}

export { useFile }

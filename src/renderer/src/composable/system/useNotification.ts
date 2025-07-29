function useNotification() {
  const showNotification = async (options: { title: string; body: string }) => {
    const result = await window.api.notification.show(options)
    console.log('===== [useNotification] ====== [result]', result)
  }

  return {
    showNotification
  }
}

export { useNotification }

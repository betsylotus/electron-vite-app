import { ref } from 'vue'

function useVersion() {
  const version = ref<string | null>(null)

  const getVersion = async () => {
    const result = await window.api.version.get()
    console.log('===== [useVersion] ====== [result]', result)
    version.value = result
  }

  return {
    version,
    getVersion
  }
}

export { useVersion }

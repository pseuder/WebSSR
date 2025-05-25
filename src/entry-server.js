import { createApp } from './main.js'

export async function render(url, manifest) {
  const { app, router } = createApp()

  // 設置服務器端路由器的位置
  await router.push(url)
  await router.isReady()

  // 這裡可以進行一些服務端特定的邏輯
  // 比如預取數據等

  return {
    app
  }
}

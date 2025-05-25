import { createApp } from './main.js'

const { app, router } = createApp()

// 等待路由器準備好後再掛載應用
router.isReady().then(() => {
  app.mount('#app')
})

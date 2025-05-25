import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // 在開發模式下創建 Vite 服務器
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的 connect 實例作為中間件
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. 讀取 index.html
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      )

      // 2. 應用 Vite HTML 轉換。這將注入 Vite HMR 客戶端，
      //    同時也會從 Vite 插件應用 HTML 轉換。
      //    例如：@vitejs/plugin-react 中的 global preambles
      template = await vite.transformIndexHtml(url, template)

      // 3. 加載服務器入口。vite.ssrLoadModule 自動轉換
      //    你的 ESM 源碼使其在 Node.js 中可運行！無需打包。
      const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      // 4. 渲染應用的 HTML。這假設 entry-server.js 導出的 `render`
      //    函數調用了適當的 SSR 框架 API。
      //    例如 ReactDOMServer.renderToString()
      const { app: vueApp } = await render(url)
      
      // 使用 Vue 的 renderToString
      const { renderToString } = await vite.ssrLoadModule('vue/server-renderer')
      const appHtml = await renderToString(vueApp)

      // 5. 注入渲染後的應用程序 HTML 到模板中。
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      // 6. 返回渲染後的 HTML。
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // 如果捕獲到了一個錯誤，讓 Vite 來修復該堆棧，這樣它就可以映射回
      // 你的實際源碼中。
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  return { app, vite }
}

const port = process.env.PORT || 3001

createServer().then(({ app }) =>
  app.listen(port, () => {
    console.log(`SSR 服務器運行在 http://localhost:${port}`)
  })
)

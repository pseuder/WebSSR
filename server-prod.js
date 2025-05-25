import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()

  if (isProduction) {
    // 在生產環境中，使用壓縮中間件
    app.use(compression())
    
    // 提供靜態文件
    app.use('/', sirv(path.resolve(__dirname, 'dist/client'), {
      gzip: true
    }))
  }

  // 讀取生產環境的模板和服務器渲染模組
  const template = isProduction
    ? fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
    : ''
  
  const ssrManifest = isProduction
    ? fs.readFileSync(path.resolve(__dirname, 'dist/client/ssr-manifest.json'), 'utf-8')
    : undefined

  const { render } = isProduction
    ? await import('./dist/server/entry-server.js')
    : {}

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let html = template
      
      if (isProduction) {
        // 在生產環境中使用預建的模板和渲染函數
        const { app: vueApp } = await render(url, ssrManifest)
        
        // 動態導入 Vue 的 renderToString
        const { renderToString } = await import('vue/server-renderer')
        const appHtml = await renderToString(vueApp)
        
        html = template.replace(`<!--ssr-outlet-->`, appHtml)
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.error(e)
      res.status(500).end(e.message)
    }
  })

  return { app }
}

const port = process.env.PORT || 3000

createServer().then(({ app }) =>
  app.listen(port, () => {
    console.log(`服務器運行在 http://localhost:${port}`)
  })
)

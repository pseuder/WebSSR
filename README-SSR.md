# Vue 3 + Vite SSR 架構說明

## 概述

此專案已成功轉換為 Server-Side Rendering (SSR) 架構，使用 Vue 3 + Vite + Express。

## 專案結構

```
Web/
├── src/
│   ├── entry-client.js    # 客戶端入口檔案
│   ├── entry-server.js    # 服務端入口檔案
│   ├── main.js            # 共用應用程式設定
│   ├── router.js          # 路由設定 (支援 SSR)
│   └── utils/
│       └── axios.js       # HTTP 客戶端 (SSR 友好)
├── server.js              # 開發環境 SSR 服務器
├── server-prod.js         # 生產環境 SSR 服務器
├── index.html             # HTML 模板 (含 SSR 佔位符)
└── vite.config.js         # Vite 設定 (支援 SSR)
```

## 可用指令

### 開發模式
```bash
# 啟動 SSR 開發服務器 (推薦)
yarn dev

# 啟動傳統 SPA 開發服務器
yarn dev:spa
```

### 建構
```bash
# 建構客戶端和服務端程式碼
yarn build

# 僅建構客戶端
yarn build:client

# 僅建構服務端
yarn build:server
```

### 生產環境
```bash
# 啟動生產環境 SSR 服務器
yarn serve
# 或
yarn start
```

## SSR 特性

### 1. 服務端渲染
- 首次載入時在服務端渲染 HTML
- 改善 SEO 和首屏載入速度
- 支援社交媒體分享預覽

### 2. 客戶端水合 (Hydration)
- 服務端渲染後，客戶端接管互動功能
- 保持完整的 Vue 應用程式功能

### 3. SSR 友好的組件
- `localStorage` 檢查：只在客戶端使用
- Google Login：僅在客戶端渲染
- Element Plus：正確的 SSR 設定

### 4. 路由支援
- 服務端使用 Memory History
- 客戶端使用 Web History
- 支援動態路由和參數

## 技術細節

### Element Plus SSR 支援
```javascript
// 在 main.js 中提供必要的注入
app.provide(ID_INJECTION_KEY, {
  prefix: Math.floor(Math.random() * 10000),
  current: 0,
});
app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
```

### 客戶端檢查
```javascript
// 在需要瀏覽器 API 的地方使用
const isClient = typeof window !== 'undefined';

if (isClient) {
  // 僅在客戶端執行的程式碼
  localStorage.setItem('key', 'value');
}
```

### 條件渲染
```vue
<template>
  <!-- 僅在客戶端渲染的組件 -->
  <GoogleLogin v-if="isClient" :callback="callback" />
  <!-- 服務端顯示的替代內容 -->
  <div v-else class="placeholder">登入</div>
</template>
```

## 部署注意事項

### 開發環境
- 使用 `yarn dev` 啟動開發服務器
- 預設運行在 `http://localhost:3001`
- 支援 HMR (Hot Module Replacement)

### 生產環境
1. 建構應用程式：`yarn build`
2. 啟動生產服務器：`yarn serve`
3. 確保設定正確的環境變數

### 環境變數
```bash
NODE_ENV=production  # 生產環境
PORT=3000           # 服務器端口 (可選)
```

## 效能優化

### 1. 程式碼分割
- 路由層級的程式碼分割
- 動態導入組件

### 2. 靜態資源
- Vite 自動處理資源優化
- 支援 Tree Shaking

### 3. 快取策略
- 靜態資源快取
- 服務端渲染快取 (可擴展)

## 故障排除

### 常見問題

1. **localStorage 錯誤**
   - 確保在使用前檢查 `typeof window !== 'undefined'`

2. **組件渲染錯誤**
   - 檢查組件是否支援 SSR
   - 使用條件渲染處理客戶端專用組件

3. **路由問題**
   - 確保路由設定正確
   - 檢查服務端和客戶端路由一致性

### 除錯模式
```bash
# 啟用詳細日誌
DEBUG=vite:* yarn dev
```

## 升級指南

從 SPA 到 SSR 的主要變更：

1. **入口檔案分離**：`main.js` → `entry-client.js` + `entry-server.js`
2. **路由器工廠函數**：`createRouter()` 而非單例
3. **應用程式工廠函數**：`createApp()` 而非直接掛載
4. **SSR 友好的程式碼**：條件檢查瀏覽器環境

## 相關資源

- [Vue SSR 指南](https://vuejs.org/guide/scaling-up/ssr.html)
- [Vite SSR 文檔](https://vitejs.dev/guide/ssr.html)
- [Element Plus SSR](https://element-plus.org/en-US/guide/ssr.html)

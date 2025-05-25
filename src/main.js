import { createApp as createVueApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import { createRouter } from "./router";
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from "element-plus";
import "element-plus/dist/index.css";
import { createManager } from "@vue-youtube/core";
import vue3GoogleLogin from "vue3-google-login";
import "./style.css";

import TW from "./locales/TW.json";
import CN from "./locales/CN.json";
import HK from "./locales/HK.json";
import EN from "./locales/EN.json";
import MY from "./locales/MY.json";
import VN from "./locales/VN.json";

// SSR 友好的語系偵測
function getDefaultLocale() {
  // 在服務端返回預設語系
  if (typeof window === 'undefined') {
    return "TW";
  }
  
  // 客戶端語系偵測
  const browserLanguage = navigator.language || navigator.userLanguage;
  const languageMap = {
    tw: "TW",
    "zh-tw": "TW",
    "zh-hant": "TW",
    cn: "CN",
    "zh-cn": "CN",
    "zh-hans": "CN",
    hk: "HK",
    "zh-hk": "HK",
    en: "EN",
    "en-us": "EN",
    "en-gb": "EN",
    my: "MY",
    ms: "MY",
    "ms-my": "MY",
    vn: "VN",
    "vi-vn": "VN",
    vi: "VN",
  };
  
  return languageMap[browserLanguage.toLowerCase()] || "TW";
}

export function createApp() {
  const router = createRouter();
  
  const i18n = createI18n({
    locale: getDefaultLocale(),
    fallbackLocale: "TW",
    messages: {
      TW,
      CN,
      HK,
      EN,
      MY,
      VN,
    },
  });

  const app = createVueApp(App);
  
  app.use(i18n);
  app.use(router);
  app.use(ElementPlus);
  
  // Element Plus SSR 支援
  app.provide(ID_INJECTION_KEY, {
    prefix: Math.floor(Math.random() * 10000),
    current: 0,
  });
  
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
  
  // 只在客戶端使用這些插件
  if (typeof window !== 'undefined') {
    app.use(createManager());
    app.use(vue3GoogleLogin, {
      clientId: "314080941126-4t3fosnf64q4jcqe3lltftq1melsguq8.apps.googleusercontent.com",
    });
  }

  return { app, router };
}

import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
// const baseURL = "http://127.0.0.1:5001/";
// const baseURL = "https://pseuder.xyz/srv_mygojuon/";

const instance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 檢查是否在瀏覽器環境
const isClient = typeof window !== 'undefined';

// 儲存 token
export function storeToken(token) {
  if (isClient) {
    localStorage.setItem("jwtToken", token);
  }
}

export function storeUserInfo(userinfo) {
  if (isClient) {
    localStorage.setItem("userinfo", JSON.stringify(userinfo));
  }
}

// 從儲存中獲取 token
export function getToken() {
  if (isClient) {
    return localStorage.getItem("jwtToken");
  }
  return null;
}

export function getUserInfo() {
  if (isClient) {
    const userinfo = localStorage.getItem("userinfo");
    return userinfo ? JSON.parse(userinfo) : null;
  }
  return null;
}

// 檢查 token 是否過期
export function isTokenExpired() {
  try {
    const token = getToken();
    if (!token) {
      return true;
    }
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return false;
  }
}

// 登出功能
export function logout() {
  if (isClient) {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userinfo");
  }
}

// 請求攔截器
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token 無效或過期
          logout();
          // 重定向到登錄頁面
          // window.location.href = '/login';
          break;
        case 404:
          // 處理 404 錯誤
          console.error("Resource not found");
          break;
        // 可以添加其他狀態碼的處理
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from 'axios'; // Импортируем axios

// Устанавливаем базовый URL для всех запросов axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const app = createApp(App);

app.use(router);

// Делаем axios доступным глобально (хотя в Composition API мы будем импортировать его напрямую)
app.config.globalProperties.$axios = axios;

// --- НОВОЕ: Перехватчик запросов Axios для добавления JWT-токена ---
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); // Получаем токен из localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --- КОНЕЦ НОВОГО БЛОКА ---

app.mount("#app");


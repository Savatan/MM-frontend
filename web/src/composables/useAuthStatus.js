// src/composables/useAuthStatus.js
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { jwtDecode } from 'jwt-decode'; // Используем именованный импорт для jwt-decode v4+

// Реактивные состояния для статуса аутентификации и данных пользователя
const isAuthenticated = ref(false);
const user = ref(null);

/**
 * Проверяет статус аутентификации пользователя на основе JWT токена в localStorage.
 * Обновляет isAuthenticated и user.
 */
const checkAuthStatus = () => {
  const token = localStorage.getItem('userToken');
  const userData = localStorage.getItem('userData'); // Также получаем userData из localStorage

  if (token && userData) {
    try {
      const decodedToken = jwtDecode(token);
      const parsedUserData = JSON.parse(userData);

      // Проверяем срок действия токена
      const currentTime = Date.now() / 1000; // Текущее время в секундах
      if (decodedToken.exp > currentTime) {
        isAuthenticated.value = true;
        user.value = parsedUserData; // Используем данные из localStorage
        console.log('[useAuthStatus] Пользователь аутентифицирован:', user.value.email);
      } else {
        // Токен просрочен
        console.log('[useAuthStatus] Токен просрочен.');
        logout(); // Выходим из системы
      }
    } catch (e) {
      console.error("[useAuthStatus] Ошибка декодирования токена или парсинга данных:", e);
      logout(); // Выходим из системы при ошибке
    }
  } else {
    // Токена или данных нет
    logout(); // Убеждаемся, что состояние сброшено
  }
};

/**
 * Возвращает текущий JWT токен из localStorage.
 */
const getToken = () => {
  return localStorage.getItem('userToken');
};

/**
 * Выполняет выход пользователя из системы.
 */
const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  isAuthenticated.value = false;
  user.value = null;
  console.log('[useAuthStatus] Пользователь вышел из системы.');
};

/**
 * Композиционная функция для управления статусом аутентификации.
 * @returns {Object} Объект с реактивными состояниями и функциями.
 */
export function useAuthStatus() {
  onMounted(() => {
    // Проверяем статус при монтировании компонента, использующего этот композит
    checkAuthStatus();
    // Добавляем слушатель для изменений localStorage (для синхронизации между вкладками)
    window.addEventListener('storage', checkAuthStatus);
  });

  onBeforeUnmount(() => {
    // Удаляем слушатель при размонтировании
    window.removeEventListener('storage', checkAuthStatus);
  });

  return {
    isAuthenticated, // ref (нужно .value для доступа к значению)
    user,            // ref (нужно .value для доступа к значению)
    getToken,        // функция
    checkAuthStatus, // функция (для ручного обновления статуса)
    logout           // функция (для ручного выхода)
  };
}

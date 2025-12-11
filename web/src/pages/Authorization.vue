<template>
  <div class="background-gradient text-white min-h-screen flex flex-col">
    <div
      ref="mainContentSection"
      data-section-id="login-content"
      class="flex-grow flex items-center justify-center
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('login-content') }"
    >
      <div class="w-full max-w-md text-center">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-4">Авторизация</h1>
          <p class="text-gray-400">Добро пожаловать! Войдите в свой аккаунт.</p>
        </div>
        <form @submit.prevent="handleLogin" class="px-8">
          <div class="mb-4">
            <input
              type="email"
              placeholder="Эл. почта"
              v-model="email"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
              required>
          </div>
          <div class="mb-6">
            <input
              type="password"
              placeholder="Пароль"
              v-model="password"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"
              required>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            Войти
          </button>
        </form>
        <!-- Сообщение об ошибке или успехе -->
        <div v-if="message" :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4">
          {{ message }}
        </div>
        <p class="mt-8 text-center text-gray-400">
          Впервые у нас?
          <router-link
            to="/Register"
            class="text-blue-400 hover:text-blue-300 font-bold transition duration-300">
            Создать учетную запись
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStatus } from '../composables/useAuthStatus'; // Импорт composable

const email = ref('');
const password = ref('');
const router = useRouter();
const { checkAuthStatus } = useAuthStatus(); // Получаем функцию для обновления статуса

const message = ref('');
const messageType = ref('');

const mainContentSection = ref(null);
const visibleSectionIds = ref(new Set());
let sectionObserver = null;

onMounted(() => {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSectionIds.value.add(entry.target.dataset.sectionId);
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    }
  );

  if (mainContentSection.value) {
    sectionObserver.observe(mainContentSection.value);
  }
});

onBeforeUnmount(() => {
  if (sectionObserver) {
    sectionObserver.disconnect();
  }
});

const handleLogin = async () => {
  message.value = '';
  messageType.value = '';

  try {
    const response = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    console.log('Вход успешен:', response.data);
    message.value = response.data.message || 'Вход выполнен успешно!';
    messageType.value = 'success';

    localStorage.setItem('userToken', response.data.token);
    localStorage.setItem('userData', JSON.stringify(response.data.user));

    checkAuthStatus(); // Обновляем статус авторизации после успешного входа

    email.value = '';
    password.value = '';

    // Логика перенаправления в зависимости от статуса is_admin
    if (response.data.user && response.data.user.is_admin) {
      console.log('Пользователь - администратор. Перенаправление в админ-панель.');
      router.push('/admin');
    } else {
      console.log('Пользователь - обычный. Перенаправление в личный кабинет.');
      router.push('/cabinet');
    }

  } catch (error) {
    console.error('Ошибка входа:', error);
    if (error.response && error.response.data && error.response.data.message) {
      message.value = error.response.data.message;
    } else {
      message.value = 'Произошла ошибка при входе. Проверьте учетные данные.';
    }
    messageType.value = 'error';
  }
};
</script>

<style scoped>
.background-gradient {
  background: linear-gradient(to bottom right,
    rgb(37, 37, 37) 0%,
    rgb(38, 40, 74) 33%,
    rgb(32, 29, 29) 100%);
}
</style>

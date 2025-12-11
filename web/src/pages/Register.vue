<template>
  <div class="background-gradient text-white min-h-screen flex flex-col">
    <div
      ref="mainContentSection"
      data-section-id="register-content"
      class="flex-grow flex items-center justify-center
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('register-content') }"
    >
      <div class="w-full max-w-md text-center">
        <div class="mb-8">
          <h1 class="text-3xl font-bold mb-4">Регистрация</h1>
          <p class="text-gray-400">Добро пожаловать в клуб!</p>
        </div>
        <form @submit.prevent="handleRegister" class="px-8">
          <div class="mb-4">
            <input
              type="text"
              placeholder="Имя"
              v-model="name"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !nameError, 'border-red-500': nameError, 'focus:border-blue-500': !nameError}"
              required>
            <p v-if="nameError" class="text-red-400 text-sm mt-1">{{ nameError }}</p>
          </div>
          <div class="mb-4">
            <input
              type="email"
              placeholder="Эл. почта"
              v-model="email"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !emailError, 'border-red-500': emailError, 'focus:border-blue-500': !emailError}"
              required>
            <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
          </div>
          <div class="mb-4">
            <input
              type="tel"
              placeholder="Номер телефона"
              v-model="phone"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !phoneError, 'border-red-500': phoneError, 'focus:border-blue-500': !phoneError}"
              required>
            <p v-if="phoneError" class="text-red-400 text-sm mt-1">{{ phoneError }}</p>
          </div>
          <div class="mb-6">
            <input
              type="password"
              placeholder="Пароль"
              v-model="password"
              class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !passwordError, 'border-red-500': passwordError, 'focus:border-blue-500': !passwordError}"
              required>
            <p v-if="passwordError" class="text-red-400 text-sm mt-1">{{ passwordError }}</p>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
            Зарегистрироваться
          </button>
        </form>
        <!-- Сообщение об ошибке или успехе -->
        <div v-if="message" :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4">
          {{ message }}
        </div>
        <p class="mt-8 text-center text-gray-400">
          Уже есть аккаунт?
          <router-link
            to="/authorization"
            class="text-gray-400 hover:text-gray-100 font-bold transition duration-300">
            Войти
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

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const router = useRouter();

const message = ref('');
const messageType = ref('');

const nameError = ref('');
const emailError = ref('');
const phoneError = ref('');
const passwordError = ref('');

const mainContentSection = ref(null);
const visibleSectionIds = ref(new Set());
let sectionObserver = null;

const validatePhone = () => {
  const phoneRegex = /^\+7\d{10}$/;
  if (!phone.value) {
    phoneError.value = 'Номер телефона обязателен.';
    return false;
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = 'Неверный формат номера. Используйте +7ХХХХХХХХХХ.';
    return false;
  }
  phoneError.value = '';
  return true;
};

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Эл. почта обязательна.';
    return false;
  }
  emailError.value = '';
  return true;
};

const validateName = () => {
  if (!name.value) {
    nameError.value = 'Имя обязательно.';
    return false;
  }
  nameError.value = '';
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Пароль обязателен.';
    return false;
  } else if (password.value.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов.';
    return false;
  }
  passwordError.value = '';
  return true;
};

const validateForm = () => {
  let isValid = true;
  isValid = validateName() && isValid;
  isValid = validateEmail() && isValid;
  isValid = validatePhone() && isValid;
  isValid = validatePassword() && isValid;
  return isValid;
};

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

const handleRegister = async () => {
  message.value = '';
  messageType.value = '';

  if (!validateForm()) {
    message.value = 'Пожалуйста, исправьте ошибки в форме.';
    messageType.value = 'error';
    return;
  }

  try {
    const response = await axios.post('/api/auth/register', {
      name: name.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
    });

    console.log('Регистрация успешна:', response.data);
    message.value = response.data.message || 'Регистрация прошла успешно!';
    messageType.value = 'success';

    name.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    
    nameError.value = '';
    emailError.value = '';
    phoneError.value = '';
    passwordError.value = '';

    //Перенаправляем пользователя на страницу авторизации после успешной регистрации
    router.push('/authorization');

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    if (error.response && error.response.data && error.response.data.message) {
      message.value = error.response.data.message;
    } else {
      message.value = 'Произошла ошибка при регистрации. Попробуйте снова.';
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

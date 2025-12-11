<template>
  <div class="min-h-screen text-white font-sans">
    <section
    ref="heroSection"
    data-section-id="hero"
    class="flex flex-col md:flex-row items-center px-4 sm:px-6 lg:px-8 py-16 md:py-20 md:gap-x-16
           opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
    :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('hero') }"
  >
    <div class="max-w-xl space-y-6 text-center md:text-left md:flex-shrink-0 md:pl-10">
      <h1 class="text-6xl sm:text-7xl font-bold leading-tight">MODESTIUM<br />MOTORS</h1>
      <p class="text-base sm:text-3xl text-gray-300">
        Воплощение вашей <br />мечты об идеальном <br />автомобиле
      </p>
    </div>
    <img
      src="/maincar.png"
      alt="Main Car"
      class="w-full md:w-[700px] mt-10 md:mt-0 object-contain md:ml-auto md:translate-x-10"
      onerror="this.onerror=null;this.src='https://placehold.co/600x400/374151/D1D5DB?text=Main+Car';"
    />
  </section>



    <section
      ref="aboutSection"
      data-section-id="about"
      class="px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('about') }"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <img
          src="/orangecar.png"
          alt="Car"
          class="rounded-xl w-full sm:w-1/2 object-cover h-48 sm:h-64"
          onerror="this.onerror=null;this.src='https://placehold.co/300x200/374151/D1D5DB?text=Car+Image';"
        />
        <img
          src="/whitecar (1).png"
          alt="Car Engine"
          class="rounded-xl w-full sm:w-1/2 object-cover h-48 sm:h-64"
          onerror="this.onerror=null;this.src='https://placehold.co/300x200/374151/D1D5DB?text=Car+Engine';"
        />
      </div>
      <div class="p-6 sm:p-8 bg-white/10 rounded-xl shadow-lg border border-gray-700">
        <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-white">О нас</h2>
        <p class="text-sm" style="color: rgba(212, 212, 212, 1);">
          Добро пожаловать в наш премиальный автосалон. Мы предлагаем широкий ассортимент
          эксклюзивных автомобилей от ведущих производителей, которые отличаются высоким качеством,
          передовыми технологиями и элегантным дизайном. Наша команда профессионалов гарантирует
          индивидуальный подход и высококлассное обслуживание на всех этапах покупки. Откройте для себя мир
          роскоши и престижа — ваш идеальный автомобиль уже ждёт вас.
        </p>
      </div>
    </section>

    <section
      ref="contactSection"
      data-section-id="contact"
      class="px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('contact') }"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <h2 class="text-2xl sm:text-3xl font-semibold mb-6 text-white">Связь</h2>
        <input
          type="text"
          placeholder="Имя"
          v-model="form.name"
          :class="{'border-red-500 border': errors.name}"
          class="w-full p-3 bg-white/10 rounded-md placeholder-gray-400 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>

        <input
          type="text"
          placeholder="Номер телефона"
          v-model="form.phone"
          :class="{'border-red-500 border': errors.phone}"
          class="w-full p-3 bg-white/10 rounded-md placeholder-gray-400 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>

        <input
          type="email"
          placeholder="Email"
          v-model="form.email"
          :class="{'border-red-500 border': errors.email}"
          class="w-full p-3 bg-white/10 rounded-md placeholder-gray-400 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>

        <input
          type="text"
          placeholder="Тема"
          v-model="form.subject"
          :class="{'border-red-500 border': errors.subject}"
          class="w-full p-3 bg-white/10 rounded-md placeholder-gray-400 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <p v-if="errors.subject" class="text-red-500 text-xs mt-1">{{ errors.subject }}</p>

        <textarea
          placeholder="Сообщение"
          v-model="form.message"
          :class="{'border-red-500 border': errors.message}"
          rows="4"
          class="w-full p-3 bg-white/10 rounded-md placeholder-gray-400 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        ></textarea>
        <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-4 px-6 py-3 bg-[rgba(37,37,43,1)] text-white font-bold rounded-md transition-all duration-300 ease-in-out shadow-lg
          hover:bg-gray-700 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!loading">ОТПРАВИТЬ EMAIL →</span>
          <span v-else class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </span>
        </button>
      </form>
      <div class="flex flex-col items-center md:items-end">
        <img
          src="/contacts.png"
          alt="Contact Image"
          class="rounded-xl object-cover w-[800px] mt-10 md:mt-0"
          onerror="this.onerror=null;this.src='https://placehold.co/400x300/374151/D1D5DB?text=Contact+Image';"
        />
      </div>
    </section>

    <transition name="fade">
      <div
        v-if="notification.message"
        :class="['fixed bottom-5 right-5 p-4 rounded-md shadow-lg z-50 transition-all duration-300 ease-in-out',
                 notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white']"
      >
        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios'; 

const form = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
});

const errors = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
});


const loading = ref(false);


const notification = reactive({
  message: '',
  type: '', 
});

const showNotification = (message, type, duration = 3000) => {
  notification.message = message;
  notification.type = type;
  setTimeout(() => {
    notification.message = '';
  }, duration);
};

const validateForm = () => {
  let valid = true;

  Object.keys(errors).forEach(key => (errors[key] = ''));

  if (!form.name.trim()) {
    errors.name = 'Имя обязательно для заполнения.';
    valid = false;
  }


  if (form.phone.trim()) {
    if (!/^\+7\d{10}$/.test(form.phone.trim())) {
      errors.phone = 'Введите корректный номер телефона в формате +7ХХХХХХХХХХ.';
      valid = false;
    }
  } else {
    errors.phone = 'Номер телефона обязателен для заполнения.';
    valid = false;
  }

  if (!form.email.trim()) {
    errors.email = 'Email обязателен для заполнения.';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный Email.';
    valid = false;
  }

  if (!form.subject.trim()) {
    errors.subject = 'Тема обязательна для заполнения.';
    valid = false;
  }

  if (!form.message.trim()) {
    errors.message = 'Сообщение обязательно для заполнения.';
    valid = false;
  }

  return valid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    showNotification('Пожалуйста, заполните все обязательные поля корректно.', 'error');
    return;
  }

  loading.value = true;
  try {
    // Отправляем данные на бэкенд
    const response = await axios.post('/api/feedback', form);

    if (response.status === 201) { // Проверяем успешный статус создания
      showNotification('Сообщение успешно отправлено!', 'success');
      // Очищаем поля формы
      form.name = '';
      form.phone = '';
      form.email = '';
      form.subject = '';
      form.message = '';
    } else {
      // Если статус не 201, но запрос успешен, обрабатываем как ошибку
      showNotification(response.data.message || 'Произошла ошибка при отправке сообщения.', 'error');
    }
  } catch (error) {
    console.error('Произошла ошибка при отправке формы:', error);
    if (error.response && error.response.data && error.response.data.message) {
      showNotification(error.response.data.message, 'error');
    } else {
      showNotification('Произошла непредвиденная ошибка. Пожалуйста, попробуйте еще раз.', 'error');
    }
  } finally {
    loading.value = false;
  }
};


const heroSection = ref(null);
const aboutSection = ref(null);
const contactSection = ref(null);
const visibleSectionIds = ref(new Set());
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSectionIds.value.add(entry.target.dataset.sectionId);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.2, 
    }
  );


  if (heroSection.value) observer.observe(heroSection.value);
  if (aboutSection.value) observer.observe(aboutSection.value);
  if (contactSection.value) observer.observe(contactSection.value);
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

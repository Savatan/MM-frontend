<template>
  <div
    class="min-h-screen w-full text-white flex items-center justify-start font-sans"
    style="background: linear-gradient(to bottom, rgb(37, 37, 37) 0%, rgb(38, 40, 74) 33%, rgb(32, 29, 29) 100%);"
  >
    <div
      ref="mainContentSection"
      data-section-id="cabinet-content"
      class="w-full max-w-2xl p-8 flex flex-col gap-8 ml-8
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('cabinet-content') }"
    >
      <div class="flex flex-col gap-3">
        <h1 class="text-5xl font-bold">Личный кабинет</h1>
        <!-- Отображаем имя пользователя из данных профиля -->
        <p v-if="userProfile.name" class="text-xl text-gray-300">Рады снова вас видеть, {{ userProfile.name }}!</p>
        <p v-else class="text-xl text-gray-300">Загрузка профиля...</p>
      </div>

      <!-- Плашка с данными пользователя -->
      <div v-if="userProfile.email" class="bg-white/10 bg-opacity-60 p-6 rounded-lg shadow-lg">
        <h2 class="text-3xl font-bold mb-4">Ваши данные</h2>

        <!-- Режим просмотра -->
        <div v-if="!isEditing">
          <p class="text-lg mb-1"><strong>Email:</strong> {{ userProfile.email }}</p>
          <p class="text-lg mb-1"><strong>Имя:</strong> {{ userProfile.name }}</p>
          <p v-if="userProfile.phone" class="text-lg mb-1"><strong>Телефон:</strong> {{ userProfile.phone }}</p>
          <p v-else class="text-lg mb-1 text-gray-400"><strong>Телефон:</strong> Не указан</p>
          <p class="text-lg mb-1"><strong>Роль:</strong> {{ userProfile.is_admin ? 'Администратор' : 'Пользователь' }}</p>
          <p class="text-lg"><strong>Дата регистрации:</strong> {{ formatDate(userProfile.created_at) }}</p>
          <button
            @click="handleEdit"
            class="mt-6 bg-white/10 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
            Редактировать
          </button>
        </div>

        <!-- Режим редактирования -->
        <form v-else @submit.prevent="handleSave">
          <div class="mb-4">
            <label for="editName" class="block text-gray-300 text-sm font-bold mb-2">Имя:</label>
            <input
              type="text"
              id="editName"
              v-model="editableProfile.name"
              class="w-full px-4 py-3 bg-white/10 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !nameError, 'border-red-500': nameError, 'focus:border-gray-500': !nameError}"
              required>
            <p v-if="nameError" class="text-red-400 text-sm mt-1">{{ nameError }}</p>
          </div>
          <div class="mb-4">
            <label for="editEmail" class="block text-gray-300 text-sm font-bold mb-2">Эл. почта:</label>
            <input
              type="email"
              id="editEmail"
              v-model="editableProfile.email"
              class="w-full px-4 py-3 bg-white/10 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !emailError, 'border-red-500': emailError, 'focus:border-gray-500': !emailError}"
              required>
            <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
          </div>
          <div class="mb-4">
            <label for="editPhone" class="block text-gray-300 text-sm font-bold mb-2">Номер телефона (+7ХХХХХХХХХХ):</label>
            <input
              type="tel"
              id="editPhone"
              placeholder="+7ХХХХХХХХХХ"
              v-model="editableProfile.phone"
              class="w-full px-4 py-3 bg-white/10 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
              :class="{'border-gray-700': !phoneError, 'border-red-500': phoneError, 'focus:border-gray-500': !phoneError}">
            <p v-if="phoneError" class="text-red-400 text-sm mt-1">{{ phoneError }}</p>
          </div>
          <div class="mt-6 flex gap-4">
            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Сохранить
            </button>
            <button
              type="button"
              @click="handleCancel"
              class="bg-white/10 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Отмена
            </button>
          </div>
        </form>
        <!-- Сообщение об ошибке/успехе редактирования -->
        <div v-if="editMessage" :class="editMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4">
          {{ editMessage }}
        </div>
      </div>
      <div v-else-if="loadingError" class="text-red-400 text-lg">
        Не удалось загрузить данные профиля. Пожалуйста, войдите снова.
      </div>

      <!-- НОВЫЙ БЛОК: Заявки пользователя -->
     <div class="bg-dark-card p-6 rounded-lg shadow-lg border border-dark-border">
        <h2 class="text-3xl font-bold mb-4">Ваши заявки ({{ userRequests.length }})</h2>

        <div v-if="loadingRequests" class="text-gray-400">Загрузка заявок...</div>
        <div v-else-if="userRequests.length === 0" class="text-gray-400">У вас пока нет активных заявок.</div>
        
        <!-- Сообщение о статусе заявки (Success/Error) -->
        <div v-if="requestMessage" 
             :class="{'bg-green-500/50 border-green-200': requestMessageType === 'success', 'bg-red-700/50 border-red-400': requestMessageType === 'error'}"
             class="p-3 mb-4 rounded-lg border text-sm transition-all duration-300"
        >
          {{ requestMessage }}
        </div>
        
        <div v-else class="flex flex-col gap-6 max-h-96 overflow-y-auto custom-scrollbar cabinet-requests-section">
          <div
            v-for="request in userRequests"
            :key="request.id"
            class="p-4 rounded-lg bg-white/5 border border-indigo-500/30 shadow-md"
          >
            <div class="flex justify-between items-start mb-2 pb-2 border-b border-white/20">
              <span class="text-xl font-semibold">Заявка №{{ request.id }}</span>
              <div class="flex items-center gap-3">
                <!-- Статус -->
                <div 
                    :class="getRequestStatusClass(request.status)"
                    class="px-2 py-0.5 rounded text-sm font-semibold"
                >
                  {{ formatRequestStatus(request.status) }}
                </div>
                <!-- КНОПКА УДАЛИТЬ (ОТМЕНИТЬ) -->
                <button
                    v-if="request.status === 'new'"
                    @click="promptDeleteRequest(request.id)"
                    class="px-3 py-1 bg-red-500 hover:bg-red-700 rounded-lg transition duration-200 text-sm font-semibold"
                    title="Отменить заявку"
                >
                    Отменить
                </button>
              </div>
            </div>

            <p class="text-sm text-gray-300 mb-3">
              Дата: {{ formatDate(request.created_at) }}
            </p>

            <!-- Список автомобилей в заявке  -->
            <div class="flex flex-col gap-2 mb-4">
              <div 
                v-for="car in request.cars"
                :key="car.id"
                class="flex items-center text-md py-1 border-b border-white/10 last:border-b-0"
              >
                <!-- Название и Цена -->
                <div class="flex justify-between flex-1 pl-4"> <!-- Добавлен небольшой отступ слева вместо картинки -->
                    <!-- Название -->
                    <span class="font-medium text-white">{{ car.make }} {{ car.model }}</span>
                    <!-- Цена -->
                    <span class="text-indigo-300 font-mono">{{ formatPrice(car.price) }}</span>
                </div>
              </div>
            </div>

            <!-- ИТОГОВАЯ СТОИМОСТЬ ЗАЯВКИ -->
            <div class="mt-3 pt-3 border-t-2 border-indigo-500 flex justify-between items-center">
              <span class="text-lg font-bold">ИТОГОВАЯ СТОИМОСТЬ:</span>
              <span class="text-2xl font-extrabold text-orange-400">{{ formatPrice(request.total_price) }}</span>
            </div>

          </div>
        </div>

      </div>
      <!-- КОНЕЦ НОВОГО БЛОКА: Заявки пользователя -->


      <div class="flex flex-col items-start gap-4">
        <!-- Кнопки, которые будут скрыты для админов -->
        <button
          v-if="!userProfile.is_admin"
          @click="openLeasingModal"
          class="bg-gray-600 bg-white/10 hover:bg-gray-700 hover:bg-opacity-80 text-lg text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 backdrop-blur-sm">
          Лизинг
        </button>
        <button
          v-if="!userProfile.is_admin"
          @click="openPrivilegesModal"
          class="bg-gray-600 bg-white/10 hover:bg-gray-700 hover:bg-opacity-80 text-lg text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 backdrop-blur-sm">
          Персональные привелегии
        </button>
        <!-- Кнопка для перехода в Админ-панель (только для админов) -->
        <button
          v-if="userProfile.is_admin"
          @click="router.push('/admin')"
          class="bg-red-900 bg-opacity-60 hover:bg-red-700 hover:bg-opacity-80 text-lg text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 backdrop-blur-sm">
          Режим администрирования
        </button>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="handleLogout"
          class="bg-gray-800 bg-opacity-70 hover:bg-slate-700 hover:bg-opacity-90 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
          Выйти
        </button>
        <button
          @click="openSupportModal"
          class="bg-blue-900 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
          Поддержка
        </button>
      </div>

      <div>
        <button @click="confirmDeleteProfile" class="text-gray-400 hover:text-red-500 transition-colors duration-300">
          Удалить профиль
        </button>
      </div>
    </div>

    <!-- Модальное окно "Ваши автомобили" -->
    <Transition name="modal-fade-apple">
      <div
        v-if="isCarsModalOpen"
        @click.self="isCarsModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-3xl p-6 text-white">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Ваши автомобили</h2>
            <button @click="isCarsModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center gap-4">
              <img src="https://via.placeholder.com/100" alt="Car" class="rounded-md w-24 h-24 object-cover">
              <div>
                <h3 class="font-bold text-lg">Modestium Model S</h3>
                <p class="text-sm text-gray-300">VIN: XXXXXXXXXXXXXXX</p>
              </div>
            </div>

            <div class="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex items-center gap-4">
              <img src="https://via.placeholder.com/100" alt="Car" class="rounded-md w-24 h-24 object-cover">
              <div>
                <h3 class="font-bold text-lg">Modestium Model X</h3>
                <p class="text-sm text-gray-300">VIN: YYYYYYYYYYYYYYY</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="isCarsModalOpen = false"
                    class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Модальное окно "Лизинг" -->
    <Transition name="modal-fade-apple">
      <div
        v-if="isLeasingModalOpen"
        @click.self="isLeasingModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-md p-6 text-white text-center">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Лизинг</h2>
            <button @click="isLeasingModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <p class="mb-6 text-gray-300">Информация о ваших лизинговых договорах будет доступна здесь.</p>
          <div class="mt-6 flex justify-end">
            <button @click="isLeasingModalOpen = false"
                    class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Вернуться
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Модальное окно "Персональные привелегии" -->
    <Transition name="modal-fade-apple">
      <div
        v-if="isPrivilegesModalOpen"
        @click.self="isPrivilegesModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-md p-6 text-white text-center">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Персональные привелегии</h2>
            <button @click="isPrivilegesModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <p class="mb-6 text-gray-300">Здесь будут отображаться ваши эксклюзивные предложения и бонусы.</p>
          <div class="mt-6 flex justify-end">
            <button @click="isPrivilegesModalOpen = false"
                    class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Вернуться
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Модальное окно подтверждения удаления профиля -->
    <Transition name="modal-fade-apple">
      <div
        v-if="isDeleteConfirmModalOpen"
        @click.self="isDeleteConfirmModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-white text-center">
          <h2 class="text-2xl font-bold mb-4">Подтвердите отказ от членства в клубе</h2>
          <p class="mb-6 text-gray-300">Вы уверены, что хотите удалить свой профиль? Все ваши привелегии, записи о членстве и информация будут безвозвратно удалены.</p>
          <div class="flex justify-center gap-4">
            <button
              @click="handleDeleteProfile"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Удалить
            </button>
            <button
              @click="isDeleteConfirmModalOpen = false"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Отмена
            </button>
          </div>
          <div v-if="deleteMessage" :class="deleteMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4">
            {{ deleteMessage }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- Модальное окно "Поддержка" -->
    <Transition name="modal-fade-apple">
      <div
        v-if="isSupportModalOpen"
        @click.self="isSupportModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-md p-6 text-white">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Служба поддержки</h2>
            <button @click="isSupportModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>

          <div class="space-y-4 text-left">
            <div>
              <h3 class="font-bold text-lg mb-1">Администратор</h3>
              <p class="text-gray-300">Email: admin@modestium.com</p>
              <p class="text-gray-300">Телефон: +7 (495) 123-45-67 (8:00 - 21:00)</p>
            </div>
            <div>
              <h3 class="font-bold text-lg mb-1">Техническое обслуживание</h3>
              <p class="text-gray-300">Email: support@modestium.com</p>
              <p class="text-gray-300">Телефон: +7 (495) 987-65-43 (круглосуточно)</p>
            </div>
            <div>
              <h3 class="font-bold text-lg mb-1">Отдел продаж</h3>
              <p class="text-gray-300">Email: sales@modestium.com</p>
              <p class="text-gray-300">Телефон: +7 (495) 555-11-22 (10:00 - 20:00)</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="isSupportModalOpen = false"
                    class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
              Вернуться
            </button>
          </div>
        </div>
      </div>
    </Transition>
  
<!-- МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ ЗАЯВКИ -->
<transition name="modal-fade-apple">
    <div v-if="isRequestDeleteConfirmModalOpen" 
         class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
         @click.self="isRequestDeleteConfirmModalOpen = false" 
    >
        <div class="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-sm mx-4 border border-dark-border z-20">
            <h3 class="text-2xl font-bold mb-4 text-red-400">Отменить заявку?</h3>
            <p class="mb-6 text-gray-300">
                Вы уверены, что хотите отменить заявку №{{ requestToDeleteId }}? Отмена возможна только для новых заявок.
            </p>
            <div class="flex justify-between gap-4">
                <button
                    @click="handleRequestDeletion"
                    class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-200 font-semibold z-10"
                >
                    Отменить
                </button>
                <button
                    @click="isRequestDeleteConfirmModalOpen = false"
                    class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-200 z-10"
                >
                    Нет, оставить
                </button>
            </div>
        </div>
    </div>
</transition>


    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStatus } from '../composables/useAuthStatus';


const isCarsModalOpen = ref(false);
const isLeasingModalOpen = ref(false);
const isPrivilegesModalOpen = ref(false);
const isDeleteConfirmModalOpen = ref(false);
const isSupportModalOpen = ref(false);
const authStatus = useAuthStatus(); 
const currentUser = authStatus.currentUser;
const { user, getToken } = useAuthStatus(); 


const userProfile = ref({});
const editableProfile = ref({});
const isEditing = ref(false);
const loadingError = ref(false);
const editMessage = ref('');
const editMessageType = ref('');
const deleteMessage = ref('');
const deleteMessageType = ref('');

// --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ЗАЯВОК ---
const userRequests = ref([]);
const loadingRequests = ref(false);
// --- КОНЕЦ НОВЫХ ПЕРЕМЕННЫХ ---

const nameError = ref('');
const emailError = ref('');
const phoneError = ref('');

const router = useRouter();
const { checkAuthStatus } = useAuthStatus();

const mainContentSection = ref(null);
const visibleSectionIds = ref(new Set());
let sectionObserver = null;

// --- НОВЫЕ ФУНКЦИИ ДЛЯ ЗАЯВОК И ФОРМАТИРОВАНИЯ ---

const formatPrice = (price) => {
    if (typeof price !== 'number') return 'Цена не указана';
    // Используем `maximumFractionDigits: 2` для более точного отображения, если нужно
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
};

const formatRequestStatus = (status) => {
    switch (status) {
        case 'new': return 'Новая';
        case 'in_process': return 'В обработке';
        case 'completed': return 'Выполнена';
        case 'cancelled': return 'Отменена';
        default: return status;
    }
};

const getRequestStatusClass = (status) => {
    switch (status) {
        case 'new': return 'bg-yellow-600 text-black'; // Скорректировано для лучшей видимости текста на желтом фоне
        case 'in_process': return 'bg-indigo-600 text-white';
        case 'completed': return 'bg-green-600 text-white';
        case 'cancelled': return 'bg-red-600 text-white';
        default: return 'bg-gray-600 text-gray-100';
    }
};

const fetchUserRequests = async () => {
  loadingRequests.value = true;
  try {
    const token = localStorage.getItem('userToken');
    // Предполагаем, что этот маршрут существует и возвращает заявки только текущего пользователя
    const response = await axios.get('/api/user/requests', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // При получении, если total_price не рассчитан на сервере, 
    // его следует рассчитать здесь (но мы предполагаем, что сервер это делает)
    userRequests.value = response.data;
    console.log('[Cabinet] Заявки пользователя загружены:', userRequests.value);
  } catch (error) {
    console.error('[Cabinet] Ошибка загрузки заявок пользователя:', error);
  } finally {
    loadingRequests.value = false;
  }
};

// МЕТОД: Удаление (Отмена) заявки - ВОССТАНОВЛЕНО
// --- НОВОЕ СОСТОЯНИЕ для сообщений и удаления ---
const requestMessage = ref('');
const requestMessageType = ref(''); // 'success', 'error', 'info'

// Переменные, которые вы уже добавили, но на всякий случай:
const isRequestDeleteConfirmModalOpen = ref(false); 
const requestToDeleteId = ref(null);

// --- НОВЫЕ ФУНКЦИИ ---

// 1. Открывает модальное окно для удаления заявки 
// (Эта функция вызывается из шаблона по @click)
const promptDeleteRequest = (id) => {
    requestToDeleteId.value = id;
    // Предполагается, что у вас есть модальное окно для подтверждения, которое
    // управляется этой переменной. Если модального окна нет, можете сразу вызывать handleRequestDeletion.
    isRequestDeleteConfirmModalOpen.value = true; // <-- ИСПРАВЛЕНО
    requestMessage.value = ''; 
};

// 2. Подтверждает удаление, отправляет DELETE-запрос (РЕАЛИЗАЦИЯ handleRequestDeletion)
const handleRequestDeletion = async () => {
    const idToDelete = requestToDeleteId.value;
    const token = getToken();
    
    // ПРОВЕРКА: проверяем наличие ID и токена
    if (!idToDelete || !token) {
      console.error('Ошибка авторизации или ID заявки отсутствует.');
      isRequestDeleteConfirmModalOpen.value = false;
      const email = user.value ? user.value.email : 'неавторизован';
      requestMessage.value = `Ошибка: Заявка не найдена или пользователь (${email}) не авторизован.`;
      requestMessageType.value = 'error';
      return;
    }
    
    // Закрываем модальное окно сразу
    isRequestDeleteConfirmModalOpen.value = false;
    requestMessage.value = `Отмена заявки №${idToDelete}...`;
    requestMessageType.value = 'info';

    try {
        await axios.delete(`/api/requests/${idToDelete}`, {
            headers: { Authorization: `Bearer ${token}` } 
        });
        
        // --- АВТООБНОВЛЕНИЕ: Удаляем заявку из массива userRequests ---
        userRequests.value = userRequests.value.filter(req => req.id !== idToDelete);
        
        // Устанавливаем сообщение об успешном удалении
        requestMessage.value = `Заявка №${idToDelete} успешно отменена.`;
        requestMessageType.value = 'success';
        
        // --- НОВОЕ: Автоматически скрываем уведомление через 3 секунды ---
        setTimeout(() => {
            requestMessage.value = '';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка при удалении заявки:', error);
        const message = error.response?.data?.message || 'Ошибка при отмене заявки. Попробуйте позже.';
        requestMessage.value = message;
        requestMessageType.value = 'error';
        
        // Автоматически скрываем ошибку
        setTimeout(() => {
            requestMessage.value = '';
        }, 5000);

    } finally {
        requestToDeleteId.value = null; // Сброс ID
    }
};
// --- КОНЕЦ НОВЫХ ФУНКЦИЙ ---


const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const validatePhone = () => {
  if (editableProfile.value.phone) {
    // В вашем коде используется +7, поэтому оставляем проверку на +7
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(editableProfile.value.phone)) {
      phoneError.value = 'Неверный формат номера. Используйте +7ХХХХХХХХХХ.';
      return false;
    }
  }
  phoneError.value = '';
  return true;
};

const validateEmail = () => {
  if (!editableProfile.value.email) {
    emailError.value = 'Эл. почта обязательна.';
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editableProfile.value.email)) {
    emailError.value = 'Неверный формат эл. почты.';
    return false;
  }
  emailError.value = '';
  return true;
};

const validateName = () => {
  if (!editableProfile.value.name) {
    nameError.value = 'Имя обязательно.';
    return false;
  }
  nameError.value = '';
  return true;
};

const validateEditForm = () => {
  let isValid = true;
  isValid = validateName() && isValid;
  isValid = validateEmail() && isValid;
  isValid = validatePhone() && isValid;
  return isValid;
};

const fetchUserProfile = async () => {
  loadingError.value = false;
  try {
    const token = localStorage.getItem('userToken'); // Получаем токен для запроса
    const response = await axios.get('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    userProfile.value = response.data;
    editableProfile.value = { ...response.data };
    console.log('[Cabinet] Данные профиля загружены:', userProfile.value);
    console.log('[Cabinet] is_admin из загруженного профиля:', userProfile.value.is_admin); // ЛОГИРОВАНИЕ
  } catch (error) {
    console.error('[Cabinet] Ошибка загрузки профиля:', error);
    loadingError.value = true;
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      handleLogout(); // Разлогиниваем, если токен недействителен
    }
  }
};

const handleLogout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
  userProfile.value = {};
  checkAuthStatus(); // Обновляем глобальный статус авторизации
  router.push('/authorization');
};

const handleEdit = () => {
  isEditing.value = true;
  editMessage.value = '';
  editMessageType.value = '';
  nameError.value = '';
  emailError.value = '';
  phoneError.value = '';
};

const handleSave = async () => {
  editMessage.value = '';
  editMessageType.value = '';

  if (!validateEditForm()) {
    editMessage.value = 'Пожалуйста, исправьте ошибки в форме.';
    editMessageType.value = 'error';
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.put('/api/user/profile', editableProfile.value, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    userProfile.value = response.data;
    localStorage.setItem('userData', JSON.stringify(response.data)); // Обновляем localStorage
    isEditing.value = false;
    editMessage.value = 'Профиль успешно обновлен!';
    editMessageType.value = 'success';
    console.log('Профиль обновлен:', response.data);
  } catch (error) {
    console.error('Ошибка сохранения профиля:', error);
    if (error.response && error.response.data && error.response.data.message) {
      editMessage.value = error.response.data.message;
    } else {
      editMessage.value = 'Произошла ошибка при сохранении профиля.';
    }
    editMessageType.value = 'error';
  }
};

const handleCancel = () => {
  isEditing.value = false;
  editableProfile.value = { ...userProfile.value };
  editMessage.value = '';
  editMessageType.value = '';
  nameError.value = '';
  emailError.value = '';
  phoneError.value = '';
};

const confirmDeleteProfile = () => {
  deleteMessage.value = '';
  deleteMessageType.value = '';
  isDeleteConfirmModalOpen.value = true;
};

const handleDeleteProfile = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Профиль успешно удален:', response.data);
    deleteMessage.value = response.data.message || 'Профиль успешно удален!';
    deleteMessageType.value = 'success';
    isDeleteConfirmModalOpen.value = false;

    handleLogout();
  } catch (error) {
    console.error('Ошибка удаления профиля:', error);
    if (error.response && error.response.data && error.response.data.message) {
      deleteMessage.value = error.response.data.message;
    } else {
      deleteMessage.value = 'Произошла ошибка при удалении профиля.';
    }
    deleteMessageType.value = 'error';
  }
};

const openSupportModal = () => {
  isSupportModalOpen.value = true;
};

const openCarsModal = () => {
  isCarsModalOpen.value = true;
};

const openLeasingModal = () => {
  isLeasingModalOpen.value = true;
};

const openPrivilegesModal = () => {
  isPrivilegesModalOpen.value = true;
};


onMounted(() => {
  fetchUserProfile(); // Загружаем профиль
  fetchUserRequests(); // Загружаем заявки

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
</script>

<style scoped>
/* Добавлен стиль для кастомного скроллбара, чтобы он был темным и выглядел в стиле приложения */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 30, 30, 0.5);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(80, 80, 80, 0.8);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 1);
}

.bg-dark-card {
  background-color: rgba(37, 37, 43, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.border-dark-border {
  border-color: rgba(60, 60, 70, 0.7);
}


.modal-fade-apple-enter-active,
.modal-fade-apple-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.modal-fade-apple-enter-from,
.modal-fade-apple-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>

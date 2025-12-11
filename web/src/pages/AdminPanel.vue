<template>
  <div class="background-gradient text-white min-h-screen flex flex-col items-center pt-24 pb-8 font-sans">
    <div
      ref="mainContentSection"
      data-section-id="admin-panel-content"
      class="w-full max-w-5xl p-8 flex flex-col gap-8
             opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
      :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('admin-panel-content') }"
    >
      <h1 class="text-5xl font-bold text-center mb-6">Админ-панель</h1>

      <nav class="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          @click="currentTab = 'applications'"
          :class="{'bg-blue-800': currentTab === 'applications', 'bg-white/10 hover:bg-gray-600': currentTab !== 'applications'}"
          class="py-3 px-6 rounded-lg font-semibold transition-colors duration-300 text-lg"
        >
          Заявки
        </button>
        <button
          @click="currentTab = 'collection'"
          :class="{'bg-blue-800': currentTab === 'collection', 'bg-white/10 hover:bg-gray-600': currentTab !== 'collection'}"
          class="py-3 px-6 rounded-lg font-semibold transition-colors duration-300 text-lg"
        >
          Изменение коллекции
        </button>
        <button
          @click="currentTab = 'users'"
          :class="{'bg-blue-800': currentTab === 'users', 'bg-white/10 hover:bg-gray-600': currentTab !== 'users'}"
          class="py-3 px-6 rounded-lg font-semibold transition-colors duration-300 text-lg"
        >
          Пользователи
        </button>
        <button
          @click="currentTab = 'feedback'"
          :class="{'bg-blue-800': currentTab === 'feedback', 'bg-white/10 hover:bg-gray-600': currentTab !== 'feedback'}"
          class="py-3 px-6 rounded-lg font-semibold transition-colors duration-300 text-lg"
        >
          Обратная связь
        </button>
      </nav>

      <div class="bg-white/4 bg-opacity-90 p-8 rounded-lg shadow-lg min-h-[400px]">
         <!-- ЗАЯВКИ -->
        <div v-if="currentTab === 'applications'">
          <h2 class="text-4xl font-bold mb-6 text-left">Заявки пользователей</h2>
          <div v-if="loadingApplications" class="text-center text-gray-400">Загрузка заявок...</div>
          <div v-else-if="applicationsError" class="text-center text-red-400">{{ applicationsError }}</div>
          <div v-else-if="applications.length === 0" class="text-center text-gray-400">Заявки не найдены.</div>
          <div v-else class="overflow-x-auto rounded-lg shadow-md">
            <table class="min-w-full bg-white/10 bg-opacity-50 rounded-lg">
              <thead>
                <tr class="bg-white/10">
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">ID</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Пользователь</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Email</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Телефон</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Автомобили</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Дата</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in applications" :key="app.id" class="border-t border-gray-600 hover:bg-white/10 transition-colors duration-200">
                  <td class="py-3 px-4 text-sm">{{ app.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ app.user_name || 'Не указано' }}</td>
                  <td class="py-3 px-4 text-sm">{{ app.email }}</td>
                  <td class="py-3 px-4 text-sm">{{ app.phone || '—' }}</td>
                  <td class="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {{ formatCars(app.cars) }}
                  </td>
                  <td class="py-3 px-4 text-sm">{{ formatDate(app.created_at) }}</td>
                  <td class="py-3 px-4 text-sm">
                    <button
                      @click="confirmDeleteApplication(app)"
                      class="bg-red-900 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="currentTab === 'collection'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-4xl font-bold text-left">Изменение коллекции</h2>
            <button
              @click="openCarModal(null)"
              class="bg-white/10 hover:bg-white/20 text-white font-semibold p-2 rounded-full transition-colors duration-300 flex items-center justify-center w-10 h-10"
              title="Добавить автомобиль"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div v-if="loadingCars" class="text-center text-gray-400">Загрузка автомобилей...</div>
          <div v-else-if="carsError" class="text-center text-red-400">{{ carsError }}</div>
          <div v-else-if="cars.length === 0" class="text-center text-gray-400">Автомобили не найдены.</div>
          <div v-else class="overflow-x-auto rounded-lg shadow-md">
            <table class="min-w-full bg-white/10 bg-opacity-50 rounded-lg">
              <thead>
                <tr class="bg-white/10">
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">ID</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Изображение</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Марка</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Модель</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Год</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Цена</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="car in cars" :key="car.id" class="border-t border-gray-600 hover:bg-white/10 transition-colors duration-200">
                  <td class="py-3 px-4 text-sm">{{ car.id }}</td>
                  <td class="py-3 px-4 text-sm">
                    <img v-if="car.thumbnail_url" :src="`${backendBaseUrl}${car.thumbnail_url}`" alt="Car Thumbnail" class="w-16 h-12 object-cover rounded-md">
                    <div v-else class="w-16 h-12 bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">Нет фото</div>
                  </td>
                  <td class="py-3 px-4 text-sm">{{ car.make }}</td>
                  <td class="py-3 px-4 text-sm">{{ car.model }}</td>
                  <td class="py-3 px-4 text-sm">{{ car.year }}</td>
                  <td class="py-3 px-4 text-sm">{{ car.price }}</td>
                  <td class="py-3 px-4 text-sm flex gap-2">
                    <button
                      @click="openCarModal(car)"
                      class="bg-blue-900 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="confirmDeleteCar(car)"
                      class="bg-red-900 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="currentTab === 'users'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-4xl font-bold text-left">Управление пользователями</h2>
            <button
              @click="openUserModal(null)"
              class="bg-white/10 hover:bg-white/20 text-white font-semibold p-2 rounded-full transition-colors duration-300 flex items-center justify-center w-10 h-10"
              title="Добавить пользователя"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <div v-if="loadingUsers" class="text-center text-gray-400">Загрузка пользователей...</div>
          <div v-else-if="usersError" class="text-center text-red-400">{{ usersError }}</div>
          <div v-else-if="users.length === 0" class="text-center text-gray-400">Пользователи не найдены.</div>
          <div v-else class="overflow-x-auto rounded-lg shadow-md">
            <table class="min-w-full bg-white/10 bg-opacity-50 rounded-lg">
              <thead>
                <tr class="bg-white/10">
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">ID</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Email</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Имя</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Телефон</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Админ</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id" class="border-t border-gray-600 hover:bg-white/10 transition-colors duration-200">
                  <td class="py-3 px-4 text-sm">{{ user.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ user.email }}</td>
                  <td class="py-3 px-4 text-sm">{{ user.name || 'Не указано' }}</td>
                  <td class="py-3 px-4 text-sm">{{ user.phone || 'Не указано' }}</td>
                  <td class="py-3 px-4 text-sm">{{ user.is_admin ? 'Да' : 'Нет' }}</td>
                  <td class="py-3 px-4 text-sm flex gap-2">
                    <button
                      @click="openUserModal(user)"
                      class="bg-blue-900 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="confirmDeleteUser(user)"
                      class="bg-red-900 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else-if="currentTab === 'feedback'">
          <h2 class="text-4xl font-bold mb-6 text-left">Обратная связь</h2>
          <div v-if="loadingFeedback" class="text-center text-gray-400">Загрузка сообщений...</div>
          <div v-else-if="feedbackError" class="text-center text-red-400">{{ feedbackError }}</div>
          <div v-else-if="feedbackMessages.length === 0" class="text-center text-gray-400">Сообщения обратной связи не найдены.</div>
          <div v-else class="overflow-x-auto rounded-lg shadow-md">
            <table class="min-w-full bg-white/10 bg-opacity-50 rounded-lg">
              <thead>
                <tr class="bg-white/10">
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">ID</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Имя</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Email</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Сообщение</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Дата</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-gray-200">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="message in feedbackMessages" :key="message.id" class="border-t border-gray-600 hover:bg-white/10 transition-colors duration-200">
                  <td class="py-3 px-4 text-sm">{{ message.id }}</td>
                  <td class="py-3 px-4 text-sm">{{ message.name }}</td>
                  <td class="py-3 px-4 text-sm">{{ message.email }}</td>
                  <td class="py-3 px-4 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{{ message.message }}</td>
                  <td class="py-3 px-4 text-sm">{{ formatDate(message.created_at) }}</td>
                  <td class="py-3 px-4 text-sm">
                    <button
                      @click="confirmDeleteFeedback(message)"
                      class="bg-red-900 hover:bg-red-700 text-white py-1 px-3 rounded-md text-xs transition-colors duration-300"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <Transition name="modal-fade-apple">
      <div
        v-if="isConfirmDeleteApplicationModalOpen"
        @click.self="isConfirmDeleteApplicationModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-white text-center my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Удалить заявку?</h2>
          <p class="mb-6 text-gray-300">Вы уверены, что хотите удалить заявку <strong>#{{ currentApplication.id }}</strong>?</p>
          <div v-if="deleteApplicationMessageText" :class="deleteApplicationMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
            {{ deleteApplicationMessageText }}
          </div>
          <div class="flex justify-center gap-4 mt-auto">
            <button
              @click="handleDeleteApplicationConfirm"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Удалить
            </button>
            <button
              @click="isConfirmDeleteApplicationModalOpen = false"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade-apple">
      <div
        v-if="isCarModalOpen"
        @click.self="isCarModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-2xl p-6 text-white my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ isEditingCar ? 'Редактировать автомобиль' : 'Добавить новый автомобиль' }}</h2>
            <button @click="isCarModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <form @submit.prevent="handleSaveCar" class="flex-grow flex flex-col">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="carMake" class="block text-gray-300 text-sm font-bold mb-2">Марка:</label>
                <input type="text" id="carMake" v-model="currentCar.make" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" required>
              </div>
              <div>
                <label for="carModel" class="block text-gray-300 text-sm font-bold mb-2">Модель:</label>
                <input type="text" id="carModel" v-model="currentCar.model" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" required>
              </div>
              <div>
                <label for="carYear" class="block text-gray-300 text-sm font-bold mb-2">Год:</label>
                <input type="number" id="carYear" v-model="currentCar.year" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" required min="1900" :max="new Date().getFullYear() + 1">
              </div>
              <div>
                <label for="carPrice" class="block text-gray-300 text-sm font-bold mb-2">Цена:</label>
                <input type="number" id="carPrice" v-model="currentCar.price" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" required min="0" step="0.01">
              </div>
              <div>
                <label for="carEngineType" class="block text-gray-300 text-sm font-bold mb-2">Тип двигателя:</label>
                <input type="text" id="carEngineType" v-model="currentCar.engine_type" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carHorsepower" class="block text-gray-300 text-sm font-bold mb-2">Мощность (л.с.):</label>
                <input type="text" id="carHorsepower" v-model="currentCar.horsepower" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carAcceleration" class="block text-gray-300 text-sm font-bold mb-2">Разгон 0-100:</label>
                <input type="text" id="carAcceleration" v-model="currentCar.acceleration_0_100" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carRange" class="block text-gray-300 text-sm font-bold mb-2">Запас хода:</label>
                <input type="text" id="carRange" v-model="currentCar.range" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carDriveType" class="block text-gray-300 text-sm font-bold mb-2">Привод:</label>
                <input type="text" id="carDriveType" v-model="currentCar.drive_type" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carColor" class="block text-gray-300 text-sm font-bold mb-2">Цвет:</label>
                <input type="text" id="carColor" v-model="currentCar.color" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carEngineVolume" class="block text-gray-300 text-sm font-bold mb-2">Объем двигателя (л):</label>
                <input type="number" id="carEngineVolume" v-model="currentCar.engine_volume" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" step="0.1">
              </div>
              <div>
                <label for="carBodyType" class="block text-gray-300 text-sm font-bold mb-2">Тип кузова:</label>
                <input type="text" id="carBodyType" v-model="currentCar.body_type" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carTransmission" class="block text-gray-300 text-sm font-bold mb-2">Трансмиссия:</label>
                <input type="text" id="carTransmission" v-model="currentCar.transmission" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              </div>
              <div>
                <label for="carMileage" class="block text-gray-300 text-sm font-bold mb-2">Пробег (км):</label>
                <input type="number" id="carMileage" v-model="currentCar.mileage" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" min="0">
              </div>
              <div>
                <label for="carStockQuantity" class="block text-gray-300 text-sm font-bold mb-2">Количество на складе:</label>
                <input type="number" id="carStockQuantity" v-model="currentCar.stock_quantity" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300" min="0">
              </div>
              <div class="md:col-span-2">
                <label for="carDescription" class="block text-gray-300 text-sm font-bold mb-2">Описание:</label>
                <textarea id="carDescription" v-model="currentCar.description" rows="3" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300"></textarea>
              </div>
            </div>

            <div class="mb-6" v-if="isEditingCar">
              <h3 class="text-xl font-bold mb-4">Фотографии автомобиля</h3>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                <div v-for="photo in currentCarPhotos" :key="photo.id" class="relative group">
                  <img :src="`${backendBaseUrl}${photo.url}`" class="w-full h-32 object-cover rounded-lg border border-gray-700" :class="{'border-blue-500 border-2': photo.is_main}">
                  <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <button
                      @click="setMainPhoto(photo.id)"
                      class="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full text-xs mb-1"
                      title="Сделать главной"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button
                      @click="deletePhoto(photo.id)"
                      class="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs"
                      title="Удалить"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <span v-if="photo.is_main" class="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Главная</span>
                </div>
              </div>

              <label for="carImages" class="block text-gray-300 text-sm font-bold mb-2">Загрузить новые изображения:</label>
              <input type="file" id="carImages" ref="carImageFiles" multiple @change="handleCarImageUpload" accept="image/*" class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-300">
              <div v-if="carImageUploadMessage" :class="carImageUploadMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-2 text-sm">
                {{ carImageUploadMessage }}
              </div>
            </div>
             <div class="mb-6" v-else>
              <label for="carImagesNew" class="block text-gray-300 text-sm font-bold mb-2">Загрузить изображения (после добавления автомобиля):</label>
              <p class="text-gray-400 text-sm">Изображения можно будет загрузить после того, как автомобиль будет добавлен в коллекцию.</p>
            </div>


            <div v-if="carFormMessage" :class="carFormMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
              {{ carFormMessage }}
            </div>
            <div class="flex justify-end gap-4 mt-auto">
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                {{ isEditingCar ? 'Сохранить изменения' : 'Добавить автомобиль' }}
              </button>
              <button
                type="button"
                @click="isCarModalOpen = false"
                class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
    <Transition name="modal-fade-apple">
      <div
        v-if="isConfirmDeleteCarModalOpen"
        @click.self="isConfirmDeleteCarModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-white text-center my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Подтвердите удаление автомобиля</h2>
          <p class="mb-6 text-gray-300">Вы уверены, что хотите удалить автомобиль <strong>{{ currentCar.make }} {{ currentCar.model }}</strong>?</p>
          <div v-if="deleteCarMessage" :class="deleteCarMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
            {{ deleteCarMessage }}
          </div>
          <div class="flex justify-center gap-4 mt-auto">
            <button
              @click="handleDeleteCarConfirm"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Удалить
            </button>
            <button
              @click="isConfirmDeleteCarModalOpen = false"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal-fade-apple">
      <div
        v-if="isUserModalOpen"
        @click.self="isUserModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-lg p-6 text-white my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">{{ isEditingUser ? 'Редактировать пользователя' : 'Добавить нового пользователя' }}</h2>
            <button @click="isUserModalOpen = false" class="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          <form @submit.prevent="handleSaveUser" class="flex-grow flex flex-col">
            <div class="mb-4">
              <label for="userEmail" class="block text-gray-300 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="userEmail"
                v-model="currentUser.email"
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
                :class="{'border-gray-700': !emailError, 'border-red-500': emailError, 'focus:border-gray-500': !emailError}"
                required
                :disabled="isEditingUser"
              >
              <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
            </div>
            <div class="mb-4" v-if="!isEditingUser">
              <label for="userPassword" class="block text-gray-300 text-sm font-bold mb-2">Пароль:</label>
              <input
                type="password"
                id="userPassword"
                v-model="currentUser.password"
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
                :class="{'border-gray-700': !passwordError, 'border-red-500': passwordError, 'focus:border-gray-500': !passwordError}"
                required
              >
              <p v-if="passwordError" class="text-red-400 text-sm mt-1">{{ passwordError }}</p>
            </div>
            <div class="mb-4">
              <label for="userName" class="block text-gray-300 text-sm font-bold mb-2">Имя:</label>
              <input
                type="text"
                id="userName"
                v-model="currentUser.name"
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
                :class="{'border-gray-700': !nameError, 'border-red-500': nameError, 'focus:border-gray-500': !nameError}"
              >
              <p v-if="nameError" class="text-red-400 text-sm mt-1">{{ nameError }}</p>
            </div>
            <div class="mb-4">
              <label for="userPhone" class="block text-gray-300 text-sm font-bold mb-2">Телефон (+7ХХХХХХХХХХ):</label>
              <input
                type="tel"
                id="userPhone"
                v-model="currentUser.phone"
                class="w-full px-4 py-3 bg-gray-800 bg-opacity-50 border rounded-lg focus:outline-none transition duration-300"
                :class="{'border-gray-700': !phoneError, 'border-red-500': phoneError, 'focus:border-gray-500': !phoneError}"
              >
              <p v-if="phoneError" class="text-red-400 text-sm mt-1">{{ phoneError }}</p>
            </div>
            <div class="mb-6 flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                v-model="currentUser.is_admin"
                class="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              >
              <label for="isAdmin" class="ml-2 block text-gray-300 text-sm">Администратор</label>
            </div>
            <div v-if="userFormMessage" :class="userFormMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
              {{ userFormMessage }}
            </div>
            <div class="flex justify-end gap-4 mt-auto">
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                {{ isEditingUser ? 'Сохранить изменения' : 'Добавить пользователя' }}
              </button>
              <button
                type="button"
                @click="isUserModalOpen = false"
                class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade-apple">
      <div
        v-if="isConfirmDeleteUserModalOpen"
        @click.self="isConfirmDeleteUserModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-white text-center my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Подтвердите удаление пользователя</h2>
          <p class="mb-6 text-gray-300">Вы уверены, что хотите удалить пользователя <strong>{{ currentUser.email }}</strong>?</p>
          <div v-if="deleteUserMessage" :class="deleteUserMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
            {{ deleteUserMessage }}
          </div>
          <div class="flex justify-center gap-4 mt-auto">
            <button
              @click="handleDeleteUserConfirm"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Удалить
            </button>
            <button
              @click="isConfirmDeleteUserModalOpen = false"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade-apple">
      <div
        v-if="isConfirmDeleteFeedbackModalOpen"
        @click.self="isConfirmDeleteFeedbackModalOpen = false"
        class="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white/10 backdrop-blur-md border border-dark-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-white text-center my-8 flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Удалить сообщение?</h2>
          <p class="mb-6 text-gray-300">Вы уверены, что хотите удалить сообщение от <strong>{{ currentFeedback.email }}</strong>?</p>
          <div v-if="deleteFeedbackMessageText" :class="deleteFeedbackMessageType === 'success' ? 'text-green-400' : 'text-red-400'" class="mt-4 mb-4">
            {{ deleteFeedbackMessageText }}
          </div>
          <div class="flex justify-center gap-4 mt-auto">
            <button
              @click="handleDeleteFeedbackConfirm"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Удалить
            </button>
            <button
              @click="isConfirmDeleteFeedbackModalOpen = false"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const backendBaseUrl = 'http://localhost:3000';

// --- ОБЩЕЕ СОСТОЯНИЕ ---
const isLoggedIn = ref(!!localStorage.getItem('userToken'));
const visibleSectionIds = ref(new Set());
const currentTab = ref('users'); // теперь открываем заявки по умолчанию

// --- ЗАЯВКИ ---
const applications = ref([]);
const loadingApplications = ref(false);
const applicationsError = ref('');

const isConfirmDeleteApplicationModalOpen = ref(false);
const currentApplication = ref({});
const deleteApplicationMessageText = ref('');
const deleteApplicationMessageType = ref('');

// helper: склеить список авто
const formatCars = (carsArr) => {
  if (!carsArr || carsArr.length === 0) return '—';
  return carsArr.map((c) => `${c.make} ${c.model}`).join(', ');
};

const fetchApplications = async () => {
  loadingApplications.value = true;
  applicationsError.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get('/api/admin/requests', {
      headers: { Authorization: `Bearer ${token}` }
    });
    applications.value = response.data;
    console.log('Заявки загружены:', applications.value);
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
    applicationsError.value = 'Не удалось загрузить список заявок.';
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      router.push('/authorization');
    }
  } finally {
    loadingApplications.value = false;
  }
};

const confirmDeleteApplication = (app) => {
  currentApplication.value = { ...app };
  deleteApplicationMessageText.value = '';
  deleteApplicationMessageType.value = '';
  isConfirmDeleteApplicationModalOpen.value = true;
};

const handleDeleteApplicationConfirm = async () => {
  deleteApplicationMessageText.value = '';
  deleteApplicationMessageType.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`/api/admin/requests/${currentApplication.value.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    deleteApplicationMessageText.value = response.data.message || 'Заявка успешно удалена!';
    deleteApplicationMessageType.value = 'success';
    await fetchApplications();
    setTimeout(() => {
      isConfirmDeleteApplicationModalOpen.value = false;
    }, 1500);
  } catch (error) {
    console.error('Ошибка удаления заявки:', error);
    if (error.response && error.response.data && error.response.data.message) {
      deleteApplicationMessageText.value = error.response.data.message;
    } else {
      deleteApplicationMessageText.value = 'Произошла ошибка при удалении заявки.';
    }
    deleteApplicationMessageType.value = 'error';
  }
};

// Инициализация роутера для навигации


// Инициализация роутера для навигации


// --- Состояние для общей авторизации и видимости секций ---
// const isLoggedIn = ref(!!localStorage.getItem('userToken'));
// const visibleSectionIds = ref(new Set()); // Для Intersection Observer

// --- Состояние для управления автомобилями ---
const cars = ref([]);
const loadingCars = ref(false);
const carsError = ref('');

const isCarModalOpen = ref(false);
const currentCar = ref({});
const isEditingCar = ref(false);

const isConfirmDeleteCarModalOpen = ref(false);
const deleteCarMessage = ref('');
const deleteCarMessageType = ref('');

const carFormMessage = ref('');
const carFormMessageType = ref('');

const carImageFiles = ref(null); // Ref для input type="file"
const currentCarPhotos = ref([]); // Для отображения загруженных фото в режиме редактирования
const carImageUploadMessage = ref('');
const carImageUploadMessageType = ref('');


// --- Состояние для управления пользователями ---
const users = ref([]);
const loadingUsers = ref(false);
const usersError = ref('');

const isUserModalOpen = ref(false); // Модальное окно для добавления/редактирования
const currentUser = ref({}); // Текущий редактируемый/добавляемый пользователь
const isEditingUser = ref(false); // Флаг: true - редактирование, false - добавление

const isConfirmDeleteUserModalOpen = ref(false); // Модальное окно подтверждения удаления пользователя
const deleteUserMessage = ref('');
const deleteUserMessageType = ref('');

const userFormMessage = ref('');
const userFormMessageType = ref('');

// Валидация формы пользователя
const nameError = ref('');
const emailError = ref('');
const phoneError = ref('');
const passwordError = ref('');

// --- Состояние для управления сообщениями обратной связи ---
const feedbackMessages = ref([]);
const loadingFeedback = ref(false);
const feedbackError = ref('');

const isConfirmDeleteFeedbackModalOpen = ref(false); // Модальное окно подтверждения удаления сообщения
const currentFeedback = ref({}); // Текущее удаляемое сообщение
const deleteFeedbackMessageText = ref('');
const deleteFeedbackMessageType = ref('');


// --- Вспомогательные функции ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

// --- Функции для управления автомобилями---
const fetchCars = async () => {
  loadingCars.value = true;
  carsError.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get('/api/cars', { // Используем публичный маршрут, но админ всё равно авторизован
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    cars.value = response.data;
    console.log('Автомобили загружены:', cars.value);
  } catch (error) {
    console.error('Ошибка загрузки автомобилей:', error);
    carsError.value = 'Не удалось загрузить список автомобилей.';
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      router.push('/authorization'); // Перенаправление, если нет прав
    }
  } finally {
    loadingCars.value = false;
  }
};

const fetchCarPhotos = async (carId) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get(`/api/cars/${carId}/photos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    currentCarPhotos.value = response.data.sort((a, b) => a.order_index - b.order_index); // Сортируем по order_index
  } catch (error) {
    console.error(`Ошибка загрузки фотографий для автомобиля ${carId}:`, error);
    carImageUploadMessage.value = 'Не удалось загрузить фотографии.';
    carImageUploadMessageType.value = 'error';
    currentCarPhotos.value = [];
  }
};


const openCarModal = async (car) => {
  carFormMessage.value = '';
  carFormMessageType.value = '';
  carImageUploadMessage.value = '';
  carImageUploadMessageType.value = '';
  currentCarPhotos.value = [];
  if (carImageFiles.value) {
    carImageFiles.value.value = ''; // Очистка выбранных файлов
  }

  if (car) {
    isEditingCar.value = true;
    currentCar.value = { ...car };
    await fetchCarPhotos(car.id); // Загружаем фотографии для редактируемого авто
  } else {
    isEditingCar.value = false;
    currentCar.value = {
      make: '',
      model: '',
      engine_type: '',
      horsepower: '',
      acceleration_0_100: '',
      range: '',
      drive_type: '',
      color: '',
      year: null,
      engine_volume: null,
      body_type: '',
      transmission: '',
      mileage: null,
      price: null,
      description: '',
      stock_quantity: 1,
    };
  }
  isCarModalOpen.value = true;
};

const handleSaveCar = async () => {
  carFormMessage.value = '';
  carFormMessageType.value = '';

  // Простейшая валидация
  if (!currentCar.value.make || !currentCar.value.model || !currentCar.value.year || !currentCar.value.price) {
    carFormMessage.value = 'Поля "Марка", "Модель", "Год" и "Цена" обязательны.';
    carFormMessageType.value = 'error';
    return;
  }
  if (currentCar.value.year && (currentCar.value.year < 1900 || currentCar.value.year > new Date().getFullYear() + 1)) {
    carFormMessage.value = 'Год должен быть в разумных пределах.';
    carFormMessageType.value = 'error';
    return;
  }
  if (currentCar.value.price !== null && currentCar.value.price < 0) {
    carFormMessage.value = 'Цена не может быть отрицательной.';
    carFormMessageType.value = 'error';
    return;
  }
   if (currentCar.value.mileage !== null && currentCar.value.mileage < 0) {
    carFormMessage.value = 'Пробег не может быть отрицательным.';
    carFormMessageType.value = 'error';
    return;
  }
   if (currentCar.value.stock_quantity !== null && currentCar.value.stock_quantity < 0) {
    carFormMessage.value = 'Количество на складе не может быть отрицательным.';
    carFormMessageType.value = 'error';
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    let response;

    // Подготавливаем данные для отправки, удаляя пустые строки, чтобы COALESCE на бэкенде работал корректно
    const payload = {};
    for (const key in currentCar.value) {
      if (currentCar.value[key] !== '' && currentCar.value[key] !== null) {
        payload[key] = currentCar.value[key];
      }
    }

    if (isEditingCar.value) {
      response = await axios.put(`/api/admin/cars/${currentCar.value.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      carFormMessage.value = response.data.message || 'Автомобиль успешно обновлен!';
    } else {
      response = await axios.post('/api/admin/cars', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      carFormMessage.value = response.data.message || 'Автомобиль успешно добавлен!';
      // Если это добавление, сохраняем ID нового автомобиля, чтобы сразу загрузить фото
      currentCar.value.id = response.data.car.id;
      isEditingCar.value = true; // Переходим в режим редактирования после добавления
    }
    carFormMessageType.value = 'success';
    await fetchCars(); // Перезагружаем список автомобилей в таблице

    // Если есть выбранные файлы для загрузки, загружаем их
    if (isEditingCar.value && carImageFiles.value && carImageFiles.value.files.length > 0) {
      await uploadCarImages(currentCar.value.id, carImageFiles.value.files);
    } else if (!isEditingCar.value) {
         // Если только что добавили, и не было файла, но нужно обновить статус модалки
         // Закрываем модальное окно через короткое время, если нет файлов для загрузки
        setTimeout(() => {
            isCarModalOpen.value = false;
        }, 1500);
    }


  } catch (error) {
    console.error('Ошибка сохранения автомобиля:', error);
    if (error.response && error.response.data && error.response.data.message) {
      carFormMessage.value = error.response.data.message;
    } else {
      carFormMessage.value = 'Произошла ошибка при сохранении автомобиля.';
    }
    carFormMessageType.value = 'error';
  }
};

const handleCarImageUpload = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  // Очищаем предыдущие сообщения
  carImageUploadMessage.value = '';
  carImageUploadMessageType.value = '';

  if (currentCar.value.id) { // Убеждаемся, что carId существует 
    await uploadCarImages(currentCar.value.id, files);
  } else {
    carImageUploadMessage.value = 'Сначала добавьте автомобиль, затем загрузите изображения.';
    carImageUploadMessageType.value = 'error';
    if (carImageFiles.value) {
      carImageFiles.value.value = ''; // Сбросить выбранные файлы
    }
  }
};

const uploadCarImages = async (carId, files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }

    try {
        const token = localStorage.getItem('userToken');
        const response = await axios.post(`/api/admin/cars/${carId}/photos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
        carImageUploadMessage.value = response.data.message || 'Изображения успешно загружены!';
        carImageUploadMessageType.value = 'success';
        await fetchCarPhotos(carId); // Обновляем список фотографий в модальном окне
        await fetchCars(); // Обновляем список автомобилей в таблице (для thumbnail)
         // Очищаем поле выбора файлов после успешной загрузки
        if (carImageFiles.value) {
            carImageFiles.value.value = '';
        }
    } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
        if (error.response && error.response.data && error.response.data.message) {
            carImageUploadMessage.value = error.response.data.message;
        } else {
            carImageUploadMessage.value = 'Произошла ошибка при загрузке изображений.';
        }
        carImageUploadMessageType.value = 'error';
    }
};

const setMainPhoto = async (photoId) => {
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.put(`/api/admin/photos/${photoId}/set_main`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data.message);
    await fetchCarPhotos(currentCar.value.id); // Обновляем список фотографий
    await fetchCars(); // Обновляем список автомобилей 
  } catch (error) {
    console.error('Ошибка установки главной фотографии:', error);
    carImageUploadMessage.value = 'Не удалось установить фотографию главной.';
    carImageUploadMessageType.value = 'error';
  }
};

const deletePhoto = async (photoId) => {
  if (!confirm('Вы уверены, что хотите удалить эту фотографию?')) {
    return;
  }
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`/api/admin/car_photos/${photoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(response.data.message);
    await fetchCarPhotos(currentCar.value.id); // Обновляем список фотографий
    await fetchCars(); // Обновляем список автомобилей 
  } catch (error) {
    console.error('Ошибка удаления фотографии:', error);
    carImageUploadMessage.value = 'Не удалось удалить фотографию.';
    carImageUploadMessageType.value = 'error';
  }
};


const confirmDeleteCar = (car) => {
  currentCar.value = { ...car };
  deleteCarMessage.value = '';
  deleteCarMessageType.value = '';
  isConfirmDeleteCarModalOpen.value = true;
};

const handleDeleteCarConfirm = async () => {
  deleteCarMessage.value = '';
  deleteCarMessageType.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`/api/admin/cars/${currentCar.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    deleteCarMessage.value = response.data.message || 'Автомобиль успешно удален!';
    deleteCarMessageType.value = 'success';
    await fetchCars(); // Перезагружаем список автомобилей
    setTimeout(() => {
      isConfirmDeleteCarModalOpen.value = false;
    }, 1500);
  } catch (error) {
    console.error('Ошибка удаления автомобиля:', error);
    if (error.response && error.response.data && error.response.data.message) {
      deleteCarMessage.value = error.response.data.message;
    } else {
      deleteCarMessage.value = 'Произошла ошибка при удалении автомобиля.';
    }
    deleteCarMessageType.value = 'error';
  }
};

// --- Функции для управления пользователями---

const validateEmail = (email) => {
  if (!email) {
    emailError.value = 'Email обязателен.';
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailError.value = 'Неверный формат email.';
    return false;
  }
  emailError.value = '';
  return true;
};

const validatePassword = (password) => {
  if (!password && !isEditingUser.value) { // Пароль обязателен только при добавлении
    passwordError.value = 'Пароль обязателен.';
    return false;
  }
  if (password && password.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов.';
    return false;
  }
  passwordError.value = '';
  return true;
};

const validateName = (name) => {
  if (!name) {
    nameError.value = 'Имя обязательно.';
    return false;
  }
  nameError.value = '';
  return true;
};

const validatePhone = (phone) => {
  if (phone) {
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone)) {
      phoneError.value = 'Неверный формат номера. Используйте +7ХХХХХХХХХХ.';
      return false;
    }
  }
  phoneError.value = '';
  return true;
};

const validateUserForm = () => {
  let isValid = true;
  isValid = validateEmail(currentUser.value.email) && isValid;
  isValid = validatePassword(currentUser.value.password) && isValid;
  isValid = validateName(currentUser.value.name) && isValid;
  isValid = validatePhone(currentUser.value.phone) && isValid;
  return isValid;
};

const fetchUsers = async () => {
  loadingUsers.value = true;
  usersError.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get('/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    users.value = response.data;
    console.log('Пользователи загружены:', users.value);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    usersError.value = 'Не удалось загрузить список пользователей.';
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      router.push('/authorization'); // Перенаправление, если нет прав
    }
  } finally {
    loadingUsers.value = false;
  }
};

const openUserModal = (user) => {
  userFormMessage.value = '';
  userFormMessageType.value = '';
  emailError.value = '';
  passwordError.value = '';
  nameError.value = '';
  phoneError.value = '';

  if (user) {
    isEditingUser.value = true;
    currentUser.value = { ...user };
    delete currentUser.value.password_hash;
    currentUser.value.password = '';
  } else {
    isEditingUser.value = false;
    currentUser.value = {
      email: '',
      password: '',
      name: '',
      phone: '',
      is_admin: false
    };
  }
  isUserModalOpen.value = true;
};

const handleSaveUser = async () => {
  userFormMessage.value = '';
  userFormMessageType.value = '';

  if (!validateUserForm()) {
    userFormMessage.value = 'Пожалуйста, исправьте ошибки в форме.';
    userFormMessageType.value = 'error';
    return;
  }

  try {
    const token = localStorage.getItem('userToken');
    if (isEditingUser.value) {
      const payload = { ...currentUser.value };
      if (!payload.password) {
        delete payload.password;
      }
      const response = await axios.put(`/api/admin/users/${currentUser.value.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      userFormMessage.value = response.data.message || 'Пользователь успешно обновлен!';
      userFormMessageType.value = 'success';
    } else {
      const response = await axios.post('/api/admin/users', currentUser.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      userFormMessage.value = response.data.message || 'Пользователь успешно добавлен!';
      userFormMessageType.value = 'success';
    }
    await fetchUsers();
    setTimeout(() => {
      isUserModalOpen.value = false;
    }, 1500);
  } catch (error) {
    console.error('Ошибка сохранения пользователя:', error);
    if (error.response && error.response.data && error.response.data.message) {
      userFormMessage.value = error.response.data.message;
    } else {
      userFormMessage.value = 'Произошла ошибка при сохранении пользователя.';
    }
    userFormMessageType.value = 'error';
  }
};

const confirmDeleteUser = (user) => {
  currentUser.value = { ...user };
  deleteUserMessage.value = '';
  deleteUserMessageType.value = '';
  isConfirmDeleteUserModalOpen.value = true;
};

const handleDeleteUserConfirm = async () => {
  deleteUserMessage.value = '';
  deleteUserMessageType.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`/api/admin/users/${currentUser.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    deleteUserMessage.value = response.data.message || 'Пользователь успешно удален!';
    deleteUserMessageType.value = 'success';
    await fetchUsers();
    setTimeout(() => {
      isConfirmDeleteUserModalOpen.value = false;
    }, 1500);
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    if (error.response && error.response.data && error.response.data.message) {
      deleteUserMessage.value = error.response.data.message;
    } else {
      deleteUserMessage.value = 'Произошла ошибка при удалении пользователя.';
    }
    deleteUserMessageType.value = 'error';
  }
};

// --- Функции для управления сообщениями обратной связи (ваш существующий код) ---
const fetchFeedbackMessages = async () => {
  loadingFeedback.value = true;
  feedbackError.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.get('/api/admin/feedback', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    feedbackMessages.value = response.data;
    console.log('Сообщения обратной связи загружены:', feedbackMessages.value);
  } catch (error) {
    console.error('Ошибка загрузки сообщений обратной связи:', error);
    feedbackError.value = 'Не удалось загрузить сообщения обратной связи.';
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      router.push('/authorization');
    }
  } finally {
    loadingFeedback.value = false;
  }
};

const confirmDeleteFeedback = (message) => {
  currentFeedback.value = { ...message };
  deleteFeedbackMessageText.value = '';
  deleteFeedbackMessageType.value = '';
  isConfirmDeleteFeedbackModalOpen.value = true;
};

const handleDeleteFeedbackConfirm = async () => {
  deleteFeedbackMessageText.value = '';
  deleteFeedbackMessageType.value = '';
  try {
    const token = localStorage.getItem('userToken');
    const response = await axios.delete(`/api/admin/feedback/${currentFeedback.value.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    deleteFeedbackMessageText.value = response.data.message || 'Сообщение успешно удалено!';
    deleteFeedbackMessageType.value = 'success';
    await fetchFeedbackMessages();
    setTimeout(() => {
      isConfirmDeleteFeedbackModalOpen.value = false;
    }, 1500);
  } catch (error) {
    console.error('Ошибка удаления сообщения обратной связи:', error);
    if (error.response && error.response.data && error.response.data.message) {
      deleteFeedbackMessageText.value = error.response.data.message;
    } else {
      deleteFeedbackMessageText.value = 'Произошла ошибка при удалении сообщения.';
    }
    deleteFeedbackMessageType.value = 'error';
  }
};


// --- Intersection Observer и другие общие части ---
const mainContentSection = ref(null);
let sectionObserver = null;

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!isLoggedIn.value || !userData || !userData.is_admin) {
    router.push('/');
  } else {
    if (currentTab.value === 'collection') {
      fetchCars();
    } else if (currentTab.value === 'users') {
      fetchUsers();
    } else if (currentTab.value === 'feedback') {
      fetchFeedbackMessages();
    }
    if (currentTab.value === 'applications') {
      fetchApplications();
    }
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSectionIds.value.add(entry.target.dataset.sectionId);
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 0.2 }
  );
  if (mainContentSection.value) sectionObserver.observe(mainContentSection.value);
});

onBeforeUnmount(() => {
  if (sectionObserver) sectionObserver.disconnect();
});

onBeforeUnmount(() => {
  if (sectionObserver) {
    sectionObserver.disconnect();
  }
});

// Отслеживаем изменение вкладки, чтобы загружать данные, когда вкладка становится активной
watch(currentTab, (newTab) => {
  if (newTab === 'applications') fetchApplications();
  if (newTab === 'users') {
    fetchUsers();
  } else if (newTab === 'feedback') {
    fetchFeedbackMessages();
  } else if (newTab === 'collection') { // НОВОЕ: Загрузка автомобилей при переключении
    fetchCars();
  }
});
</script>

<style scoped>
.background-gradient {
  background: linear-gradient(to bottom right,
    rgb(37, 37, 37) 0%,
    rgb(38, 40, 74) 33%,
    rgb(32, 29, 29) 100%);
}

/* Стили для модальных окон */
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
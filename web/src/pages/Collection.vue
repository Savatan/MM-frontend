<template>
  <div class="min-h-screen text-white font-sans pt-24 pb-20">
    <div
      class="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
      <h1 class="text-4xl font-bold mb-8 text-center md:text-left">Коллекция</h1>

      <div class="mb-12 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
        <div class="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Поиск по названию"
            class="w-full pl-10 pr-4 py-3 rounded-full bg-dark-card border border-dark-border text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
            v-model="searchQuery"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <div class="flex gap-4">
          <button
            @click="openFilterModal"
            class="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200 ease-in-out shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707V19a1 1 0 01-1 1H4a1 1 0 01-1-1v-12.586a1 1 0 01.293-.707L3 4z"></path>
            </svg>
            Фильтр
            <span v-if="activeFilterCount > 0" class="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{{ activeFilterCount }}</span>
          </button>

          <button
            @click="openFavorites"
            class="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-colors duration-200 ease-in-out shadow-lg hover:shadow-xl flex items-center gap-2 relative"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clip-rule="evenodd"></path>
            </svg>
            Избранное
            <span v-if="favoriteItems.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{{ favoriteItems.length }}</span>
          </button>
        </div>
      </div>

      <div v-if="loadingCars" class="text-center text-gray-400 text-xl mt-10">
        Загрузка автомобилей...
      </div>
      <div v-else-if="carsError" class="text-center text-red-400 text-xl mt-10">
        {{ carsError }}
      </div>
      <div v-else-if="filteredCars.length === 0 && (searchQuery || activeFilterCount > 0)" class="text-center text-gray-500 mt-10 text-lg">
        Автомобилей, соответствующих выбранным характеристикам, нет.
      </div>
      <div v-else-if="filteredCars.length === 0 && !searchQuery && activeFilterCount === 0" class="text-center text-gray-500 mt-10 text-lg">
        Скоро в продаже! Пока нет автомобилей в коллекции.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        <div
          v-for="(car, index) in filteredCars"
          :key="car.id"
          :ref="setCarElementRef"
          :data-car-id="car.id"
          class="bg-dark-card rounded-lg shadow-lg overflow-hidden flex flex-col items-center p-6 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-dark-border
                 opacity-0 translate-y-10 transition-all duration-700 ease-out"
          :class="{ 'opacity-100 translate-y-0': visibleCarIds.has(car.id) }"
          :style="visibleCarIds.has(car.id) ? { transitionDelay: (index * 80) + 'ms' } : { transitionDelay: '0ms' }"
        >
          <div class="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 mb-4 rounded-md overflow-hidden border border-dark-border cursor-pointer" @click="openCarDetails(car)">
            <img
              :src="car.thumbnail_url || 'https://placehold.co/600x400/374151/D1D5DB?text=Car+Image'"
              :alt="car.make + ' ' + car.model"
              class="w-full h-full object-cover rounded-md"
              onerror="this.onerror=null;this.src='https://placehold.co/600x400/374151/D1D5DB?text=Car+Image';"
            />
          </div>

          <div class="text-center w-full mb-4 cursor-pointer" @click="openCarDetails(car)">
            <h2 class="text-xl sm:text-2xl font-semibold text-white mb-2">{{ car.make }} {{ car.model }}</h2>
            <p class="text-lg sm:text-xl font-bold text-blue-400">{{ formatPrice(car.price) }} ₽</p>
          </div>

          <div
            @click="toggleFavorite(car)"
            class="w-full py-2 px-4 rounded-full font-semibold transition-colors duration-300 ease-in-out flex items-center justify-center cursor-pointer"
            :class="{
              'bg-gray-700 hover:bg-gray-600 text-white': !isCarFavorited(car.id),
              'bg-pink-600 hover:bg-pink-700 text-white': isCarFavorited(car.id),
              'animate-pulse-heart': animatedHeartId === car.id
            }"
            @animationend="animatedHeartId = null"
          >
            <svg
              class="w-6 h-6"
              :class="{ 'fill-current': isCarFavorited(car.id), 'fill-none stroke-current': !isCarFavorited(car.id) }"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                :fill-rule="isCarFavorited(car.id) ? 'evenodd' : ''"
                :d="isCarFavorited(car.id) ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'"
                :clip-rule="isCarFavorited(car.id) ? 'evenodd' : ''"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></path>
            </svg>
            <span class="ml-2">{{ isCarFavorited(car.id) ? 'В избранном' : 'Добавить в избранное' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Car Details Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showCarDetailsModal && selectedCar"
        class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        @click.self="closeCarDetails"
      >
        <div class="bg-dark-card rounded-lg shadow-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row relative border border-dark-border">
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold z-10"
            @click="closeCarDetails"
          >
            &times;
          </button>

          <div class="w-full md:w-1/2 p-4 flex flex-col">
            <div class="w-full h-[400px] mb-4 rounded-md overflow-hidden border border-dark-border">
              <img
                :src="selectedCar.images && selectedCar.images.length > currentImageIndex ? selectedCar.images[currentImageIndex].image_url : 'https://placehold.co/600x400/374151/D1D5DB?text=Car+Image'"
                :alt="selectedCar.make + ' ' + selectedCar.model"
                class="w-full h-full object-cover rounded-md"
                onerror="this.onerror=null;this.src='https://placehold.co/600x400/374151/D1D5DB?text=Car+Image';"
              />
            </div>
            <div class="grid grid-cols-5 gap-2">
              <img
                v-for="(image, index) in selectedCar.images"
                :key="image.id || index"
                :src="image.image_url"
                :alt="selectedCar.make + ' ' + selectedCar.model"
                class="w-full h-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200"
                :class="{'border-blue-500': currentImageIndex === index, 'border-dark-border hover:border-gray-500': currentImageIndex !== index}"
                @click="currentImageIndex = index"
                onerror="this.onerror=null;this.src='https://placehold.co/100x60/374151/D1D5DB?text=Img';"
              />
            </div>
          </div>

          <div class="w-full md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 class="text-3xl font-bold text-white mb-4">{{ selectedCar.make }} {{ selectedCar.model }}</h2>
              <p class="text-2xl font-bold text-blue-400 mb-6">{{ formatPrice(selectedCar.price) }} ₽</p>

              <h3 class="text-xl font-semibold text-white mb-3">Характеристики:</h3>
              <ul class="space-y-2 text-gray-300 text-base">
                <li><span class="font-semibold">Марка:</span> {{ selectedCar.make }}</li>
                <li><span class="font-semibold">Модель:</span> {{ selectedCar.model }}</li>
                <li v-if="selectedCar.engine_type"><span class="font-semibold">Двигатель:</span> {{ selectedCar.engine_type }}</li>
                <li v-if="selectedCar.horsepower"><span class="font-semibold">Мощность:</span> {{ selectedCar.horsepower }}</li>
                <li v-if="selectedCar.acceleration_0_100"><span class="font-semibold">Разгон 0-100 км/ч:</span> {{ selectedCar.acceleration_0_100 }}</li>
                <li v-if="selectedCar.range"><span class="font-semibold">Запас хода/Макс. скорость:</span> {{ selectedCar.range }}</li>
                <li v-if="selectedCar.drive_type"><span class="font-semibold">Тип привода:</span> {{ selectedCar.drive_type }}</li>
                <li v-if="selectedCar.color"><span class="font-semibold">Цвет:</span> {{ selectedCar.color }}</li>
                <li v-if="selectedCar.year"><span class="font-semibold">Год:</span> {{ selectedCar.year }}</li>
                <li v-if="selectedCar.engine_volume"><span class="font-semibold">Объём двигателя:</span> {{ selectedCar.engine_volume }} л</li>
                <li v-if="selectedCar.body_type"><span class="font-semibold">Кузов:</span> {{ selectedCar.body_type }}</li>
                <li v-if="selectedCar.transmission"><span class="font-semibold">Коробка:</span> {{ selectedCar.transmission }}</li>
                <li v-if="selectedCar.mileage"><span class="font-semibold">Пробег:</span> {{ selectedCar.mileage }} км</li>
                <li v-if="selectedCar.generation"><span class="font-semibold">Поколение:</span> {{ selectedCar.generation }}</li>
              </ul>
            </div>

            <div class="mt-6">
              <button
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 ease-in-out shadow-lg hover:shadow-xl"
                @click="handleContactClick"
              >
                Связаться
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Filter Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showFilterModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        @click.self="closeFilterModal"
      >
        <div class="bg-dark-card rounded-lg shadow-2xl max-w-2xl w-full p-6 relative border border-dark-border max-h-[90vh] overflow-y-auto">
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold z-10"
            @click="closeFilterModal"
          >
            &times;
          </button>
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Фильтры</h2>

          <div class="space-y-6">
            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Марка:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['make']"
                  @change="tempFilterCriteria['model'] = null"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="make in availableFilters.make" :key="make" :value="make">{{ make }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div v-if="tempFilterCriteria['make']">
              <label class="block text-gray-300 text-lg font-semibold mb-2">Модель:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['model']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="model in availableModels" :key="model" :value="model">{{ model }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Поколение:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['generation']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="gen in availableFilters.generation" :key="gen" :value="gen">{{ gen }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Кузов:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['body_type']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="body in availableFilters.body_type" :key="body" :value="body">{{ body }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Коробка:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['transmission']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="trans in availableFilters.transmission" :key="trans" :value="trans">{{ trans }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Двигатель:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['engine_type']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="engine in availableFilters.engine_type" :key="engine" :value="engine">{{ engine }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Привод:</label>
              <div class="relative">
                <select
                  v-model="tempFilterCriteria['drive_type']"
                  class="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="null">Все</option>
                  <option v-for="drive in availableFilters.drive_type" :key="drive" :value="drive">{{ drive }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Объём двигателя (л):</label>
              <div class="flex gap-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="От"
                  v-model.number="tempFilterCriteria.min_engine_volume"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="До"
                  v-model.number="tempFilterCriteria.max_engine_volume"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Год:</label>
              <div class="flex gap-4">
                <input
                  type="number"
                  placeholder="От"
                  v-model.number="tempFilterCriteria.min_year"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="До"
                  v-model.number="tempFilterCriteria.max_year"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Пробег (км):</label>
              <div class="flex gap-4">
                <input
                  type="number"
                  placeholder="От"
                  v-model.number="tempFilterCriteria.min_mileage"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="До"
                  v-model.number="tempFilterCriteria.max_mileage"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-gray-300 text-lg font-semibold mb-2">Цена (₽):</label>
              <div class="flex gap-4">
                <input
                  type="number"
                  placeholder="От"
                  v-model.number="tempFilterCriteria.min_price"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="До"
                  v-model.number="tempFilterCriteria.max_price"
                  class="w-1/2 px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="applyFilters"
              class="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors duration-300 ease-in-out shadow-lg"
            >
              Применить фильтры
            </button>
            <button
              @click="resetAllFilters"
              class="px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors duration-300 ease-in-out shadow-lg"
            >
              Сбросить все
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Favorites Modal -->
    <Transition name="slide-right">
      <div
        v-if="showFavoriteModal"
        class="fixed inset-0 flex justify-end z-50"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-md" @click.self="closeFavorites"></div>
        <div class="bg-dark-card w-full md:w-[30%] h-full p-6 relative shadow-2xl overflow-y-auto border-l border-dark-border">
          <button
            class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold z-10"
            @click="closeFavorites"
          >
            &times;
          </button>
          <h2 class="text-2xl font-bold text-white mb-6 text-center">Ваше избранное</h2>

          <div v-if="favoriteItems.length === 0" class="text-center text-gray-500 text-lg">
            Список избранного пуст.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="car in favoriteItems"
              :key="car.id"
              class="flex items-center bg-gray-800 rounded-lg p-3 shadow-md"
            >
              <img
                :src="car.thumbnail_url || 'https://placehold.co/100x60/374151/D1D5DB?text=Img'"
                :alt="car.make + ' ' + car.model"
                class="w-16 h-16 object-cover rounded-md mr-4 border border-gray-700"
              />
              <div class="flex-grow">
                <h3 class="text-lg font-semibold text-white">{{ car.make }} {{ car.model }}</h3>
                <p class="text-blue-400">{{ formatPrice(car.price) }} ₽</p>
              </div>
              <button
                @click="removeFavorite(car.id)"
                class="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
            <div class="border-t border-gray-700 pt-4 mt-4">
              <p class="text-xl font-bold text-white flex justify-between">
                Итого:
                <span class="text-blue-400">{{ formatPrice(favoriteTotal) }} ₽</span>
              </p>
            </div>
            <button
              @click="sendFavoriteCars"
              class="w-full mt-6 py-3 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors duration-300 ease-in-out shadow-lg"
            >
              Отправить выбранные автомобили
            </button>
          </div>
        </div>
      </div>
    </Transition>

  
    <Transition name="modal-fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        @click.self="showSuccessModal = false"
      >
        <div class="bg-dark-card rounded-lg shadow-2xl w-full max-w-md p-6 relative border border-dark-border text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Ура!</h2>
          <p class="text-gray-300 mb-6">{{ successMessage }}</p>
          <button
            @click="showSuccessModal = false"
            class="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors duration-300 ease-in-out shadow-lg"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Transition>

    <!-- Error Modal (для ошибок, которые не обрабатываются alert) -->
    <Transition name="modal-fade">
      <div
        v-if="showErrorModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
        @click.self="showErrorModal = false"
      >
        <div class="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6 relative border border-gray-700 text-center">
          <h2 class="text-2xl font-bold text-white mb-4">Ошибка!</h2>
          <p class="text-gray-200 mb-6">{{ errorMessage }}</p>
          <button
            @click="showErrorModal = false"
            class="px-6 py-3 rounded-full bg-red-800 hover:bg-red-600 text-white font-bold transition-colors duration-300 ease-in-out shadow-lg"
          >
            Закрыть
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import axios from 'axios';
import { useAuthStatus } from '../composables/useAuthStatus';
const goToContact = () => {
  // Выполняем переход на корневой путь (который ведет на Home.vue)
  location.href = '/'; 
};

const searchQuery = ref('');

const showCarDetailsModal = ref(false);
const selectedCar = ref(null);
const currentImageIndex = ref(0);

const showFilterModal = ref(false);
const filterCriteria = ref({});
const tempFilterCriteria = ref({});

const favoriteItems = ref([]);
const showFavoriteModal = ref(false);
const animatedHeartId = ref(null);

const carElements = ref({});
const visibleCarIds = ref(new Set());
let carObserver = null;

const allCars = ref([]);
const loadingCars = ref(true);
const carsError = ref('');

// Состояния для нового модального окна успеха/ошибки
const showSuccessModal = ref(false);
const successMessage = ref('');
const showErrorModal = ref(false);
const errorMessage = ref('');

// Используем useAuthStatus, чтобы получить доступ к isAuthenticated и getToken
const { isAuthenticated, getToken } = useAuthStatus();

const setCarElementRef = (el) => {
  if (el && el.dataset.carId) {
    carElements.value[el.dataset.carId] = el;
  }
};

const fetchCars = async () => {
  loadingCars.value = true;
  carsError.value = '';
  try {
    const response = await axios.get('http://localhost:3000/api/cars'); 
    allCars.value = response.data;
    console.log('[Collection] Автомобили загружены из БД:', allCars.value);
  } catch (error) {
    console.error('[Collection] Ошибка загрузки автомобилей:', error);
    carsError.value = 'Не удалось загрузить автомобили. Пожалуйста, попробуйте позже.';
  } finally {
    loadingCars.value = false;
  }
};

const fetchCarPhotos = async (carId) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/cars/${carId}/photos`); 
    console.log(`[Collection] Фотографии для car ID ${carId} загружены:`, response.data);
    return response.data; // Возвращает массив объектов { id, car_id, image_url, is_main, order_index }
  } catch (error) {
    console.error(`[Collection] Ошибка загрузки фотографий для автомобиля ID ${carId}:`, error);
    return [];
  }
};

onMounted(() => {
  fetchCars();
  loadFavorites(); // Загружаем избранное при монтировании компонента

  carObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const carId = parseInt(entry.target.dataset.carId);
        if (entry.isIntersecting) {
          visibleCarIds.value.add(carId);
          carObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  watch(allCars, async (newCars) => {
    if (carObserver) {
      carObserver.disconnect();
    }
    visibleCarIds.value.clear();

    await nextTick();

    newCars.forEach(car => {
      const el = document.querySelector(`[data-car-id="${car.id}"]`);
      if (el) {
        carObserver.observe(el);
      }
    });
  }, { immediate: true, flush: 'post' });
});

onBeforeUnmount(() => {
  if (carObserver) {
    carObserver.disconnect();
  }
});

const filteredCars = computed(() => {
  let filtered = allCars.value;

  if (searchQuery.value) {
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(car =>
      (car.make && car.make.toLowerCase().includes(lowerCaseQuery)) ||
      (car.model && car.model.toLowerCase().includes(lowerCaseQuery))
    );
  }

  const dropdownFilterKeys = ['make', 'model', 'body_type', 'transmission', 'engine_type', 'drive_type', 'generation', 'color'];
  dropdownFilterKeys.forEach(key => {
    const filterValue = filterCriteria.value[key];
    if (filterValue) {
      filtered = filtered.filter(car => car[key] === filterValue);
    }
  });

  if (filterCriteria.value.min_engine_volume !== null && filterCriteria.value.min_engine_volume !== undefined) {
    filtered = filtered.filter(car => parseFloat(car.engine_volume) >= filterCriteria.value.min_engine_volume);
  }
  if (filterCriteria.value.max_engine_volume !== null && filterCriteria.value.max_engine_volume !== undefined) {
    filtered = filtered.filter(car => parseFloat(car.engine_volume) <= filterCriteria.value.max_engine_volume);
  }

  if (filterCriteria.value.min_year !== null && filterCriteria.value.min_year !== undefined) {
    filtered = filtered.filter(car => car.year >= filterCriteria.value.min_year);
  }
  if (filterCriteria.value.max_year !== null && filterCriteria.value.max_year !== undefined) {
    filtered = filtered.filter(car => car.year <= filterCriteria.value.max_year);
  }

  if (filterCriteria.value.min_mileage !== null && filterCriteria.value.min_mileage !== undefined) {
    filtered = filtered.filter(car => car.mileage >= filterCriteria.value.min_mileage);
  }
  if (filterCriteria.value.max_mileage !== null && filterCriteria.value.max_mileage !== undefined) {
    filtered = filtered.filter(car => car.mileage <= filterCriteria.value.max_mileage);
  }

  if (filterCriteria.value.min_price !== null && filterCriteria.value.min_price !== undefined) {
    filtered = filtered.filter(car => car.price >= filterCriteria.value.min_price);
  }
  if (filterCriteria.value.max_price !== null && filterCriteria.value.max_price !== undefined) {
    filtered = filtered.filter(car => car.price <= filterCriteria.value.max_price);
  }

  return filtered;
});

const availableFilters = computed(() => {
  const filters = {};
  const filterableDropdownKeys = ['make', 'model', 'body_type', 'transmission', 'engine_type', 'drive_type', 'generation', 'color'];

  filterableDropdownKeys.forEach(key => {
    filters[key] = new Set();
  });

  allCars.value.forEach(car => {
    filterableDropdownKeys.forEach(key => {
      if (car[key]) {
        filters[key].add(car[key]);
      }
    });
  });

  for (const key in filters) {
    filters[key] = Array.from(filters[key]).sort();
  }

  filters['year'] = Array.from(new Set(allCars.value.map(car => car.year))).sort((a, b) => b - a);

  return filters;
});

const availableModels = computed(() => {
  const selectedMake = tempFilterCriteria.value['make'];
  if (!selectedMake) {
    return [];
  }
  const models = new Set();
  allCars.value.forEach(car => {
    if (car.make === selectedMake && car.model) {
      models.add(car.model);
    }
  });
  return Array.from(models).sort();
});

const activeFilterCount = computed(() => {
  let count = 0;
  const filterKeys = ['make', 'model', 'body_type', 'transmission', 'engine_type', 'drive_type', 'generation', 'color'];
  const rangeKeys = ['engine_volume', 'year', 'mileage', 'price'];

  filterKeys.forEach(key => {
    if (filterCriteria.value[key] !== null && filterCriteria.value[key] !== undefined && filterCriteria.value[key] !== '') {
      count++;
    }
  });

  rangeKeys.forEach(key => {
    const minKey = `min_${key}`;
    const maxKey = `max_${key}`;
    if (
      (filterCriteria.value[minKey] !== null && filterCriteria.value[minKey] !== undefined) ||
      (filterCriteria.value[maxKey] !== null && filterCriteria.value[maxKey] !== undefined)
    ) {
      count++;
    }
  });

  return count;
});

const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
  return parseFloat(price).toLocaleString('ru-RU') + '';
};

const openCarDetails = async (car) => {
  selectedCar.value = { ...car };
  selectedCar.value.images = await fetchCarPhotos(car.id);
  console.log('[Collection] selectedCar.images после загрузки фото:', selectedCar.value.images);
  currentImageIndex.value = 0;
  showCarDetailsModal.value = true;
};

const closeCarDetails = () => {
  showCarDetailsModal.value = false;
  selectedCar.value = null;
};

const handleContactClick = () => {
  console.log(`Contact button clicked for ${selectedCar.value.make} ${selectedCar.value.model}`);
  // Используем новое модальное окно для сообщений
  errorMessage.value = 'Функция связи пока не реализована.';
  showErrorModal.value = true;
  closeCarDetails();
};

const openFilterModal = () => {
  tempFilterCriteria.value = { ...filterCriteria.value };
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

const applyFilters = () => {
  filterCriteria.value = { ...tempFilterCriteria.value };
  closeFilterModal();
};

const resetAllFilters = () => {
  filterCriteria.value = {};
  tempFilterCriteria.value = {};
  searchQuery.value = '';
};

const isCarFavorited = (carId) => {
  return favoriteItems.value.some(item => item.id === carId);
};

const toggleFavorite = (car) => {
  if (isCarFavorited(car.id)) {
    removeFavorite(car.id);
  } else {
    addFavorite(car);
  }
};

const addFavorite = (car) => {
  favoriteItems.value.push(car);
  animatedHeartId.value = car.id;
  saveFavorites();
};

const removeFavorite = (carId) => {
  favoriteItems.value = favoriteItems.value.filter(item => item.id !== carId);
  saveFavorites();
};

const saveFavorites = () => {
  localStorage.setItem('favoriteCars', JSON.stringify(favoriteItems.value));
};

const loadFavorites = () => {
  const savedFavorites = localStorage.getItem('favoriteCars');
  if (savedFavorites) {
    favoriteItems.value = JSON.parse(savedFavorites);
  }
};

const favoriteTotal = computed(() => {
  return favoriteItems.value.reduce((sum, car) => sum + parseFloat(car.price), 0);
});

const openFavorites = () => {
  showFavoriteModal.value = true;
};

const closeFavorites = () => {
  showFavoriteModal.value = false;
};

const sendFavoriteCars = async () => {
  // Сбрасываем сообщения перед новой попыткой
  successMessage.value = '';
  errorMessage.value = '';
  showSuccessModal.value = false;
  showErrorModal.value = false;

  if (!isAuthenticated.value) {
    errorMessage.value = 'Вам нужно авторизоваться в системе, чтобы отправить заявку.';
    showErrorModal.value = true;
    return;
  }
  if (favoriteItems.value.length === 0) {
    errorMessage.value = 'Список избранного пуст. Добавьте автомобили, чтобы отправить заявку.';
    showErrorModal.value = true;
    return;
  }

  
  const carIds = favoriteItems.value.map(car => car.id);
  const token = getToken();

  try {
    const response = await axios.post(
      'http://localhost:3000/api/requests',
      { carIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Ответ сервера на отправку заявки:', response.data);
    successMessage.value = 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
    showSuccessModal.value = true; // Показываем модальное окно успеха

    favoriteItems.value = []; // Очищаем избранное после успешной отправки
    saveFavorites(); // Сохраняем пустое избранное в localStorage
    closeFavorites(); // Закрываем модальное окно избранного
  } catch (error) {
    console.error('Ошибка при отправке заявки:', error);
    let msg = 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.';
    if (error.response && error.response.data && error.response.data.message) {
      msg = error.response.data.message;
    } else if (error.message === 'Network Error') {
      msg = 'Ошибка сети. Убедитесь, что сервер запущен.';
    }
    errorMessage.value = msg;
    showErrorModal.value = true; // Показываем модальное окно ошибки
  }
};
</script>

<style scoped>
.bg-dark-card {
  background-color: rgba(37, 37, 43, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.border-dark-border {
  border-color: rgba(60, 60, 70, 0.7);
}

@keyframes pulse-heart {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.animate-pulse-heart {
  animation: pulse-heart 0.3s ease-in-out;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

<template>
  <div class="text-white font-sans min-h-screen flex flex-col">
    
    <header
      class="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 py-3 header-background"
    >

      <img src="/logo.png" alt="Logo" class="h-12 mb-4 sm:mb-0" onerror="this.onerror=null;this.src='https://placehold.co/150x48/374151/D1D5DB?text=Logo';" />


      <button
        @click="toggleMobileMenu"
        class="sm:hidden text-gray-300 hover:text-white focus:outline-none absolute right-4 top-4"
        aria-label="Открыть мобильное меню"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <nav class="hidden sm:flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-300 uppercase text-sm tracking-widest font-bold">
        <router-link to="/" class="hover:text-white cursor-pointer" aria-label="Перейти на главную">Главная</router-link>
        <router-link to="/collection" class="hover:text-white cursor-pointer" aria-label="Перейти в коллекцию">Коллекция</router-link>
        <router-link to="/contacts" class="hover:text-white cursor-pointer" aria-label="Перейти к услугам">Услуги</router-link>
        <router-link to="/authorization" class="hover:text-white cursor-pointer" aria-label="Перейти в личный кабинет">Личный кабинет</router-link>
      </nav>

    
      <transition name="fade-slide">
        <nav
          v-if="isMobileMenuOpen"
          class="sm:hidden absolute top-full left-0 w-full dropdown-header-background border-b border-gray-700 py-4 flex flex-col items-center gap-4 text-gray-300 uppercase text-sm tracking-widest font-bold"
        >
          <router-link @click="closeMobileMenu" to="/" class="hover:text-white cursor-pointer py-2">Главная</router-link>
          <router-link @click="closeMobileMenu" to="/collection" class="hover:text-white cursor-pointer py-2">Коллекция</router-link>
          <router-link @click="closeMobileMenu" to="/contacts" class="hover:text-white cursor-pointer py-2">Услуги</router-link>
          <router-link @click="closeMobileMenu" to="/authorization" class="hover:text-white cursor-pointer py-2">Личный кабинет</router-link>
        </nav>
      </transition>
    </header>


    <main class="flex-grow pt-20"> 
      <RouterView />
    </main>

    <footer class="header-background py-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-400 text-center">

      <div class="flex flex-col items-center">
        <h3 class="text-white font-semibold mb-3">Информация</h3>
        <ul class="space-y-2">
          <li>Главная</li>
          <li>Коллекция</li>
          <li>Услуги</li>
          <li>Профиль</li>
        </ul>
      </div>

     
      <div class="flex flex-col items-center">
        <h3 class="text-white font-semibold mb-3">Услуги</h3>
        <ul class="space-y-2">
          <li>Университетский проспект, д. 39,<br />о. Русский, Владивосток, Приморский край, 690090</li>
          <li>8 800 243 94 22</li>
          <li>sales@modestium.com</li>
        </ul>
      </div>

     
      <div class="flex flex-col items-center">
        <h3 class="text-white font-semibold mb-3">Мы в соцсетях</h3>
        <div class="flex justify-center gap-4">
          <a href="#" aria-label="Twitter">
            <svg class="w-5 h-5 fill-gray-400 hover:fill-white transition-colorsduration-200" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 1a4.48 4.48 0 0 0-4.48 4.48c0 .35.04.7.11 1.03A12.85 12.85 0 0 1 3.11 2.16a4.48 4.48 0 0 0 1.39 5.98A4.46 4.46 0 0 1 2.8 7.1v.05a4.48 4.48 0 0 0 3.6 4.39 4.52 4.52 0 0 1-2.02.08 4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 2 18.58a12.72 12.72 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84l-.01-.58A9.22 9.22 0 0 0 23 3z"/></svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg class="w-5 h-5 fill-gray-400 hover:fill-white transition-colors duration-200" viewBox="0 0 24 24"><path d="M22.68 0H1.32C.59 0 0 .6 0 1.32v21.36C0 23.4.6 24 1.32 24h11.5v-9.33H9.69v-3.64h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.23h-1.91c-1.5 0-1.79.71-1.79 1.76v2.31h3.58l-.47 3.64h-3.11V24h6.09c.73 0 1.32-.6 1.32-1.32V1.32C24 .59 23.4 0 22.68 0z"/></svg>
          </a>
        </div>
      </div>
    </footer>


    <div class="header-background text-center py-6 text-xs text-gray-500">
      © 2025 Все права защищены
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.header-background {
  background-color: rgba(37, 37, 43, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.dropdown-header-background {
  background-color: rgba(37, 37, 43, 0.9); 
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}


main {
  padding-top: 4rem;
}


.min-h-screen {
  min-height: 100vh;
}

.flex-grow {
  flex-grow: 1;
}


.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
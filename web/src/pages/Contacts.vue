<template>
    <div class="main-background min-h-screen text-white font-sans pt-20 pb-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl sm:text-5xl font-bold mb-12 text-center">Услуги салона</h1>
        <section
          ref="section1"
          data-section-id="service-1"
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16
                 opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
          :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('service-1') }"
        >
          <div class="bg-white/10 p-6 sm:p-8 rounded-xl shadow-lg border border-dark-border">
            <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-white">Подбор и продажа автомобилей</h2>
            <p class="text-base text-gray-300 leading-relaxed">
              Мы предлагаем широкий выбор эксклюзивных автомобилей от ведущих мировых производителей.
              Наша команда экспертов поможет вам подобрать идеальный автомобиль, соответствующий
              вашим требованиям и стилю жизни. Каждый автомобиль проходит тщательную проверку
              качества и юридическую чистоту.
            </p>
          </div>
          <div class="relative overflow-hidden rounded-xl shadow-lg border border-dark-border">
            <img
              src="/buy.png"
              alt="Image of Car Selection"
              class="w-full h-auto object-cover rounded-xl"
              onerror="this.onerror=null;this.src='https://placehold.co/800x500/374151/D1D5DB?text=Car+Selection';"
            />
          </div>
        </section>
        <section
          ref="section2"
          data-section-id="service-2"
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16
                 opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
          :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('service-2') }"
        >
          <div class="relative overflow-hidden rounded-xl shadow-lg border border-dark-border md:order-2">
            <img
              src="/remont.png"
              alt="Image of Car Maintenance"
              class="w-full h-auto object-cover rounded-xl"
              onerror="this.onerror=null;this.src='https://placehold.co/800x500/374151/D1D5DB?text=Car+Maintenance';"
            />
          </div>
          <div class="bg-white/10 p-6 sm:p-8 rounded-xl shadow-lg border border-dark-border md:order-1">
            <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-white">Обслуживание и ремонт</h2>
            <p class="text-base text-gray-300 leading-relaxed">
              Наш сервисный центр оснащен современным оборудованием и укомплектован высококвалифицированными
              специалистами. Мы предлагаем полный спектр услуг по техническому обслуживанию и ремонту
              вашего автомобиля, используя только оригинальные запчасти и материалы.
            </p>
          </div>
        </section>
        <section
          ref="section3"
          data-section-id="service-3"
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-16
                 opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
          :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('service-3') }"
>
          <div class="bg-white/10 p-6 sm:p-8 rounded-xl shadow-lg border border-dark-border">
            <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-white">Финансовые услуги</h2>
            <p class="text-base text-gray-300 leading-relaxed">
              Мы сотрудничаем с ведущими банками и страховыми компаниями, чтобы предложить вам
              выгодные условия кредитования, лизинга и страхования. Наши финансовые консультанты
              помогут вам выбрать оптимальное решение, соответствующее вашим потребностям.
            </p>
          </div>
          <div class="relative overflow-hidden rounded-xl shadow-lg border border-dark-border">
            <img
              src="/finans.png"
              alt="Image of Financial Services"
              class="w-full h-auto object-cover rounded-xl"
              onerror="this.onerror=null;this.src='https://placehold.co/800x500/374151/D1D5DB?text=Financial+Services';"
            />
          </div>
        </section>
        <section
          ref="section4"
          data-section-id="service-4"
          class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center
                 opacity-0 -translate-y-10 scale-95 transition-all duration-1500 ease-out"
          :class="{ 'opacity-100 translate-y-0 scale-100': visibleSectionIds.has('service-4') }"
        >
          <div class="relative overflow-hidden rounded-xl shadow-lg border border-dark-border md:order-2">
            <img
              src="/trade.png"
              alt="Image of Trade-in Service"
              class="w-full h-auto object-cover rounded-xl"
              onerror="this.onerror=null;this.src='https://placehold.co/800x500/374151/D1D5DB?text=Trade-in';"
            />
          </div>
          <div class="bg-white/10 p-6 sm:p-8 rounded-xl shadow-lg border border-dark-border md:order-1">
            <h2 class="text-2xl sm:text-3xl font-semibold mb-4 text-white">Трейд-ин</h2>
            <p class="text-base text-gray-300 leading-relaxed">
              Воспользуйтесь нашей программой трейд-ин, чтобы обменять ваш текущий автомобиль
              на новый с доплатой. Мы оценим ваш автомобиль по рыночной стоимости и предложим
              выгодные условия сделки, экономя ваше время и усилия.
            </p>
          </div>
        </section>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  const section1 = ref(null);
  const section2 = ref(null);
  const section3 = ref(null);
  const section4 = ref(null);
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
    if (section1.value) observer.observe(section1.value);
    if (section2.value) observer.observe(section2.value);
    if (section3.value) observer.observe(section3.value);
    if (section4.value) observer.observe(section4.value);
  });
  
  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });
  </script>
  
  <style scoped>
  .main-background {
    background: linear-gradient(
      to bottom,
      rgb(37, 37, 37) 0%,
      rgb(38, 40, 74) 33%,
      rgb(32, 29, 29) 100%
    );
  }
  
  .bg-dark-card {
    background-color: rgba(37, 37, 43, 1);
  }
  
  .border-dark-border {
    border-color: rgba(60, 60, 70, 0.7);
  }
  
  .text-gray-300 {
    color: rgba(212, 212, 212, 1);
  }
  
  .text-white {
    color: #ffffff;
  }
  
  @media (min-width: 768px) {
    .md\:order-1 {
      order: 1;
    }
    .md\:order-2 {
      order: 2;
    }
  }
  </style>
  
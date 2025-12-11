import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Collection from "../pages/Collection.vue";
import Contacts from "../pages/Contacts.vue";
import Authorization from "../pages/Authorization.vue";
import Register from "../pages/Register.vue";
import Cabinet from "../pages/Cabinet.vue";
import AdminPanel from "../pages/AdminPanel.vue"; 

const routes = [
  { path: "/", component: Home },
  { path: "/collection", component: Collection },
  { path: "/contacts", component: Contacts },
  { path: "/authorization", component: Authorization },
  { path: "/register", component: Register },
  { path: "/cabinet", component: Cabinet, meta: { requiresAuth: true } },
  { path: "/admin", component: AdminPanel, meta: { requiresAuth: true, requiresAdmin: true }, name: "AdminPanel" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Глобальный навигационный охранник
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("userToken");

  // Если маршрут требует авторизации, а токена нет — перенаправляем на страницу входа
  if (to.meta.requiresAuth && !token) {
    next("/authorization");

  // Если пользователь уже авторизован, не пускаем его на /authorization и /register
  } else if ((to.path === "/authorization" || to.path === "/register") && token) {
    next("/cabinet");

  // Во всех остальных случаях — пускаем
  } else {
    next();
  }
});

export default router;

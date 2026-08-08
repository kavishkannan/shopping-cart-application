import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const Routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/auth/LoginView.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/auth/RegisterView.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/dashboard/DashboardView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const Router = createRouter({
  history: createWebHistory(),
  routes: Routes,
});

Router.beforeEach((To) => {
  const Token = localStorage.getItem("access_token");

  const IsAuthenticated = !!Token;

  if (To.meta.requiresAuth && !IsAuthenticated) {
    return {
      name: "Login",
    };
  }

  if (To.meta.requiresGuest && IsAuthenticated) {
    return {
      name: "Dashboard",
    };
  }

  return true;
});

export default Router;

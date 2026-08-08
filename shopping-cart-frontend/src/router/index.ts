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
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/dashboard/DashboardView.vue"),
      },
      {
        path: "products",
        name: "Products",
        component: () => import("../views/products/ProductView.vue"),
      },
      {
        path: "cart",
        name: "Cart",
        component: () => import("../views/cart/CartView.vue"),
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("../views/orders/OrdersView.vue"),
      },
    ],
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

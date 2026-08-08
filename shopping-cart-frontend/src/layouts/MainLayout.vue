<template>
  <v-app>
    <v-layout class="AppLayout">
      <!-- Header -->
      <v-app-bar color="primary" elevation="3" height="72" class="AppHeader">
        <div class="AppBrand">
          <img
            :src="ShoppingCartImage"
            alt="Shopping Cart"
            class="BrandImage"
          />

          <span class="BrandTitle"> Shopping Cart </span>
        </div>

        <v-spacer />

        <!-- User Menu -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="UserButton">
              <v-avatar size="36" color="white" class="mr-2">
                <v-icon color="primary"> mdi-account </v-icon>
              </v-avatar>

              <span class="UserName">
                {{ Store.user?.name }}
              </span>

              <v-icon class="ml-1"> mdi-chevron-down </v-icon>
            </v-btn>
          </template>

          <v-list min-width="240" rounded="lg" elevation="4">
            <v-list-item class="ProfileItem">
              <template #prepend>
                <v-avatar color="primary" size="42">
                  <v-icon color="white"> mdi-account </v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ Store.user?.name }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ Store.user?.email }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-divider />

            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              @click="handleLogout"
            />
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Navigation -->
      <v-navigation-drawer
        v-model="IsDrawerOpen"
        :temporary="IsMobile"
        :permanent="!IsMobile"
        width="250"
        elevation="1"
        class="NavigationDrawer"
      >
        <div class="NavigationHeader">
          <span> Navigation </span>
        </div>

        <v-list nav class="NavigationList">
          <v-list-item
            prepend-icon="mdi-view-dashboard-outline"
            title="Dashboard"
            to="/dashboard"
            rounded="lg"
          />

          <v-list-item
            prepend-icon="mdi-package-variant-closed"
            title="Products"
            to="/products"
            rounded="lg"
          />

          <v-list-item
            v-if="Store.isCustomer"
            prepend-icon="mdi-cart-outline"
            title="My Cart"
            to="/cart"
            rounded="lg"
          />

          <v-list-item
            v-if="Store.isCustomer"
            prepend-icon="mdi-receipt-text-outline"
            title="My Orders"
            to="/orders"
            rounded="lg"
          />

          <v-list-item
            v-if="Store.isAdmin"
            prepend-icon="mdi-clipboard-list-outline"
            title="All Orders"
            to="/orders"
            rounded="lg"
          />
        </v-list>
      </v-navigation-drawer>

      <!-- Page Content -->
      <v-main class="MainBackground">
        <v-container fluid class="MainContent">
          <router-view />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useRouter } from "vue-router";

import ShoppingCartImage from "../assets/Logo.png";
import { useStore } from "../stores/store";

const Router = useRouter();
const Store = useStore();

const { mobile: IsMobile } = useDisplay();

const IsDrawerOpen = ref(true);

const toggleDrawer = (): void => {
  IsDrawerOpen.value = !IsDrawerOpen.value;
};

const handleLogout = (): void => {
  Store.clearAuth();

  Router.push("/login");
};
</script>

<style scoped>
.AppLayout {
  min-height: 100vh;
  background: #f8fafc;
}

.AppHeader {
  z-index: 1000;
}

.AppBrand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 16px;
}

.BrandImage {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.BrandTitle {
  color: white;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
}

.UserButton {
  color: white !important;
  text-transform: none;
  font-size: 15px;
  font-weight: 500;
}

.UserName {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ProfileItem {
  min-height: 72px;
}

.NavigationDrawer {
  z-index: 900;
}

.NavigationHeader {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;

  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.NavigationList {
  padding: 8px 12px;
}

.NavigationList :deep(.v-list-item) {
  margin-bottom: 6px;
}

.NavigationList :deep(.v-list-item--active) {
  background: #e3f2fd;
  color: #1976d2;
}

.MainBackground {
  background: #f8fafc;
  height: 100vh;
  overflow: hidden;
}

.MainContent {
  height: 100%;
  max-width: 100%;
  padding: 28px 32px;

  overflow-y: auto;
  overflow-x: hidden;
}

@media (max-width: 960px) {
  .MainContent {
    padding: 24px 20px;
  }

  .BrandTitle {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  .AppBrand {
    margin-left: 4px;
  }

  .BrandImage {
    width: 34px;
    height: 34px;
  }

  .BrandTitle {
    font-size: 18px;
  }

  .UserName {
    display: none;
  }

  .MainContent {
    padding: 20px 12px;
  }
}
</style>

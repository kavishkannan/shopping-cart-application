import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import type { User } from '../types/auth';

export const useStore = defineStore('app', () => {

  const token = ref<string | null>(
    localStorage.getItem('access_token')
  );

  const storedUser = localStorage.getItem('user');

  const user = ref<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );

  const isAuthenticated = computed(() => {
    return !!token.value;
  });

  const isAdmin = computed(() => {
    return user.value?.role === 'ADMIN';
  });

  const isCustomer = computed(() => {
    return user.value?.role === 'CUSTOMER';
  });

  const setAuth = (
    accessToken: string,
    userData: User
  ): void => {
    token.value = accessToken;
    user.value = userData;

    localStorage.setItem(
      'access_token',
      accessToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );
  };

  const clearAuth = (): void => {
    token.value = null;
    user.value = null;

    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };


  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isCustomer,
    setAuth,
    clearAuth,
  };
});
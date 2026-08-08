<template>
  <UserOrderDetails v-if="Store.isCustomer" />
  <AdminOrderDetails v-else-if="Store.isAdmin" />
</template>

<script setup lang="ts">
import { useStore } from "../../stores/store";

import UserOrderDetails from "../../components/orders/UserOrderDetails.vue";

import AdminOrderDetails from "../../components/orders/AdminOrderDetails.vue";

const Store = useStore();
</script>

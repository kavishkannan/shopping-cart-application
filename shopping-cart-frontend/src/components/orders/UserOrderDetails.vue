<template>
  <div class="OrdersPage">
    <div class="PageHeader">
      <div>
        <h1>My Orders</h1>

        <p>View the products you have ordered.</p>
      </div>
    </div>

    <v-alert
      v-if="ErrorMessage"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-5"
    >
      {{ ErrorMessage }}
    </v-alert>

    <v-card rounded="xl" elevation="2" class="OrdersCard">
      <div v-if="IsLoading" class="LoadingContainer">
        <v-progress-circular indeterminate color="primary" />

        <span> Loading orders... </span>
      </div>

      <div v-else-if="Orders.length === 0" class="EmptyState">
        <v-icon size="60" color="primary"> mdi-receipt-text-outline </v-icon>

        <h2>No orders yet</h2>

        <p>Your ordered products will appear here.</p>

        <v-btn color="primary" to="/products" rounded="lg">
          Browse Products
        </v-btn>
      </div>

      <v-table v-else class="OrdersTable">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Order Date</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="Order in Orders"
            :key="`${Order.product_id}-${Order.order_date}`"
          >
            <td class="ProductName">
              {{ Order.product_name }}
            </td>

            <td>
              {{ Order.quantity }}
            </td>

            <td>₹{{ formatPrice(Order.unit_price) }}</td>

            <td class="TotalPrice">₹{{ formatPrice(Order.total_price) }}</td>

            <td>
              {{ formatDate(Order.order_date) }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import ApiService from "../../services/api.service";

interface Order {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_date: string;
}

interface OrderResponse {
  success: boolean;
  statusCode: number;
  data: Order[];
}

const Orders = ref<Order[]>([]);

const IsLoading = ref(false);

const ErrorMessage = ref("");

const getOrders = async (): Promise<void> => {
  IsLoading.value = true;

  ErrorMessage.value = "";

  try {
    const Response = await ApiService.get<OrderResponse>("/orders");

    Orders.value = Response.data || [];
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error ? Error.message : "Unable to load orders.";
  } finally {
    IsLoading.value = false;
  }
};

const formatPrice = (Price: number): string => {
  return Number(Price).toLocaleString("en-IN");
};

const formatDate = (DateValue: string): string => {
  return new Date(DateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  getOrders();
});
</script>

<style scoped>
.OrdersPage {
  width: 100%;
}

.PageHeader {
  margin-bottom: 24px;
}

.PageHeader h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
  font-weight: 700;
}

.PageHeader p {
  margin-top: 8px;
  color: #6b7280;
}

.OrdersCard {
  overflow: hidden;
}

.LoadingContainer,
.EmptyState {
  min-height: 350px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 14px;

  text-align: center;
}

.EmptyState h2 {
  margin: 0;
}

.EmptyState p {
  margin: 0 0 10px;
  color: #6b7280;
}

.OrdersTable th {
  font-weight: 600;
  white-space: nowrap;
}

.ProductName {
  font-weight: 600;
}

.TotalPrice {
  font-weight: 600;
}
</style>

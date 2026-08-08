<template>
  <div class="OrdersPage">
    <div class="PageHeader">
      <div>
        <h1>All Orders</h1>

        <p>View products ordered by all customers.</p>
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
        <v-progress-circular indeterminate color="primary" size="45" />

        <span> Loading orders... </span>
      </div>

      <div v-else-if="Orders.length === 0" class="EmptyState">
        <v-icon size="60" color="primary"> mdi-receipt-text-outline </v-icon>

        <h2>No orders found</h2>

        <p>Customer orders will appear here.</p>
      </div>

      <v-table v-else class="OrdersTable">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
            <th>Order Date</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="Order in Orders" :key="Order.id">
            <td>
              <div class="CustomerDetails">
                <v-avatar size="36" color="primary">
                  <v-icon color="white"> mdi-account </v-icon>
                </v-avatar>

                <div>
                  <div class="CustomerName">
                    {{ Order.customer_name }}
                  </div>

                  <div class="CustomerEmail">
                    {{ Order.email }}
                  </div>
                </div>
              </div>
            </td>

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

interface AdminOrder {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_date: string;
  customer_name: string;
  email: string;
}

interface AdminOrderResponse {
  success: boolean;
  statusCode: number;
  data: AdminOrder[];
}

const Orders = ref<AdminOrder[]>([]);

const IsLoading = ref(false);

const ErrorMessage = ref("");

const getOrders = async (): Promise<void> => {
  IsLoading.value = true;

  ErrorMessage.value = "";

  try {
    const Response = await ApiService.get<AdminOrderResponse>("/orders/all");

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
  margin: 0;
  color: #6b7280;
}

.OrdersTable {
  width: 100%;
}

.OrdersTable th {
  font-weight: 600;
  white-space: nowrap;
}

.CustomerDetails {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}

.CustomerName {
  color: #111827;
  font-weight: 600;
}

.CustomerEmail {
  margin-top: 2px;
  color: #6b7280;
  font-size: 12px;
}

.ProductName {
  color: #111827;
  font-weight: 600;
}

.TotalPrice {
  color: #111827;
  font-weight: 700;
}

@media (max-width: 900px) {
  .OrdersCard {
    overflow-x: auto;
  }

  .OrdersTable {
    min-width: 850px;
  }
}

@media (max-width: 600px) {
  .PageHeader h1 {
    font-size: 28px;
  }
}
</style>

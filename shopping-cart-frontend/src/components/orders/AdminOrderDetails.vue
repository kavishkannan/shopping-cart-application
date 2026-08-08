<template>
  <div class="OrdersPage">
    <div class="PageHeader">
      <div>
        <div class="PageTitle">
          <v-icon color="primary" size="32" class="mr-2">
            mdi-clipboard-list-outline
          </v-icon>

          <h1>All Orders</h1>
        </div>

        <p class="PageSubtitle">View products ordered by all customers.</p>
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

    <v-card class="SearchCard" elevation="1" rounded="xl">
      <v-text-field
        v-model="SearchText"
        placeholder="Search your orders..."
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        flat
        hide-details
        clearable
        density="comfortable"
        :disabled="IsLoading"
        @update:model-value="handleSearch"
        @click:clear="handleClearSearch"
      />
    </v-card>

    <v-card class="OrdersCard" elevation="2" rounded="xl">
      <div v-if="IsLoading" class="LoadingContainer">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
          width="4"
        />

        <span> Loading all orders... </span>
      </div>

      <div v-else-if="Orders.length === 0" class="EmptyState">
        <div class="EmptyIcon">
          <v-icon size="60" color="primary"> mdi-receipt-text-outline </v-icon>
        </div>

        <h2>No orders found</h2>

        <p>Customer orders will appear here.</p>
      </div>

      <template v-else>
        <div class="TableWrapper">
          <v-table class="OrdersTable">
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
              <tr
                v-for="Order in Orders"
                :key="`${Order.product_id}-${Order.customer_name}-${Order.order_date}`"
              >
                <td>
                  <div class="CustomerDetails">
                    <v-avatar size="38" color="primary">
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

                <td class="TotalPrice">
                  ₹{{ formatPrice(Order.total_price) }}
                </td>

                <td>
                  {{ formatDate(Order.order_date) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>

        <div v-if="TotalPages > 1" class="PaginationContainer">
          <div class="RecordCount">
            {{ TotalRecords }} order{{ TotalRecords === 1 ? "" : "s" }}
          </div>

          <v-pagination
            v-model="CurrentPage"
            :length="TotalPages"
            :total-visible="6"
            rounded="circle"
            :disabled="IsLoading"
            @update:model-value="handlePageChange"
          />
        </div>
      </template>
    </v-card>

    <v-snackbar
      v-model="ShowSnackbar"
      :color="SnackbarColor"
      :timeout="3000"
      location="bottom right"
      rounded="lg"
    >
      {{ SnackbarMessage }}

      <template #actions>
        <v-btn variant="text" @click="ShowSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import ApiService from "../../services/api.service";

interface AdminOrder {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_date: string;
  customer_name: string;
  email: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AdminOrderResponse {
  success: boolean;
  statusCode: number;
  data: AdminOrder[];
  pagination: Pagination;
}

const Orders = ref<AdminOrder[]>([]);

const SearchText = ref("");

const CurrentPage = ref(1);

const TotalPages = ref(1);

const TotalRecords = ref(0);

const IsLoading = ref(false);

const ErrorMessage = ref("");

const ShowSnackbar = ref(false);

const SnackbarMessage = ref("");

const SnackbarColor = ref("success");

let SearchTimer: ReturnType<typeof setTimeout> | null = null;

const getOrders = async (Page: number = CurrentPage.value): Promise<void> => {
  IsLoading.value = true;

  ErrorMessage.value = "";

  try {
    const Response = await ApiService.get<AdminOrderResponse>(
      `/orders/all?page=${Page}&limit=10&search=${encodeURIComponent(
        SearchText.value.trim(),
      )}`,
    );

    Orders.value = Response.data || [];

    CurrentPage.value = Response.pagination?.page || Page;

    TotalPages.value = Response.pagination?.totalPages || 1;

    TotalRecords.value = Response.pagination?.total || 0;
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error ? Error.message : "Unable to load orders.";

    Orders.value = [];
  } finally {
    IsLoading.value = false;
  }
};

const handleSearch = (): void => {
  if (SearchTimer) {
    clearTimeout(SearchTimer);
  }

  SearchTimer = setTimeout(() => {
    CurrentPage.value = 1;

    getOrders(1);
  }, 1000);
};

const handlePageChange = (Page: number): void => {
  CurrentPage.value = Page;

  getOrders(Page);
};

const handleClearSearch = (): void => {
  if (SearchTimer) {
    clearTimeout(SearchTimer);
    SearchTimer = null;
  }

  SearchText.value = "";
  CurrentPage.value = 1;

  getOrders(1);
};

const formatPrice = (Price: number): string => {
  return Number(Price).toLocaleString("en-IN");
};

const formatDate = (DateValue: string): string => {
  if (!DateValue) {
    return "-";
  }

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
  padding-bottom: 40px;
}

.PageHeader {
  margin-bottom: 24px;
}

.PageTitle {
  display: flex;
  align-items: center;
}

.PageTitle h1 {
  margin: 0;
  color: #111827;
  font-size: 32px;
  font-weight: 700;
}

.PageSubtitle {
  margin: 8px 0 0 38px;
  color: #6b7280;
  font-size: 15px;
}

.SearchCard {
  margin-bottom: 20px;
  overflow: hidden;
}

.OrdersCard {
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.TableWrapper {
  width: 100%;
  overflow-x: auto;
}

.OrdersTable {
  width: 100%;
  min-width: 900px;
}

.OrdersTable th {
  height: 58px;
  color: #374151;
  font-weight: 600;
  white-space: nowrap;
  background: #f8fafc;
}

.OrdersTable td {
  height: 68px;
  white-space: nowrap;
}

.CustomerDetails {
  display: flex;
  align-items: center;
  min-width: 200px;
  gap: 10px;
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

.PaginationContainer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 22px;
  border-top: 1px solid #e5e7eb;
}

.RecordCount {
  color: #6b7280;
  font-size: 14px;
}

.LoadingContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
  gap: 16px;
  color: #6b7280;
}

.EmptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
}

.EmptyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  margin-bottom: 18px;
  border-radius: 50%;
  background: #eaf3ff;
}

.EmptyState h2 {
  margin: 0;
  color: #111827;
}

.EmptyState p {
  margin: 8px 0 24px;
  color: #6b7280;
}

@media (max-width: 600px) {
  .PageTitle h1 {
    font-size: 28px;
  }

  .PageSubtitle {
    margin-left: 0;
  }

  .PaginationContainer {
    flex-direction: column;
    align-items: center;
  }
}
</style>

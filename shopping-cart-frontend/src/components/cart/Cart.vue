<template>
  <div class="CartPage">
    <div class="PageHeader">
      <div>
        <div class="PageTitle">
          <v-icon color="primary" size="32" class="mr-2"> mdi-cart </v-icon>

          <h1>My Cart</h1>
        </div>

        <p class="PageSubtitle">Review your items before placing your order.</p>
      </div>
    </div>

    <v-alert
      v-if="ErrorMessage"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mb-5"
      closable
      @click:close="ErrorMessage = ''"
    >
      {{ ErrorMessage }}
    </v-alert>

    <div v-if="IsLoading" class="LoadingContainer">
      <v-progress-circular indeterminate color="primary" size="48" width="4" />

      <span> Loading your cart... </span>
    </div>

    <div v-else-if="CartItems.length === 0" class="EmptyCart">
      <div class="EmptyIcon">
        <v-icon size="55" color="primary"> mdi-cart-outline </v-icon>
      </div>

      <h2>Your cart is empty</h2>

      <p>Add some products to your cart to get started.</p>

      <v-btn
        color="primary"
        rounded="lg"
        size="large"
        prepend-icon="mdi-package-variant"
        to="/products"
      >
        Browse Products
      </v-btn>
    </div>

    <v-row v-else align="start" class="CartGrid">
      <!-- Cart Items -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="xl" class="CartItemsCard">
          <div class="SectionHeader">
            <div>
              <div class="SectionTitle">Cart Items</div>

              <div class="SectionSubtitle">
                {{ TotalItems }} item{{ TotalItems === 1 ? "" : "s" }}
              </div>
            </div>

            <v-chip color="primary" variant="tonal" rounded="lg">
              {{ CartItems.length }}
            </v-chip>
          </div>

          <v-divider />

          <div class="CartItems">
            <div
              v-for="(CartItem, Index) in CartItems"
              :key="CartItem.product_id"
              class="CartItem"
            >
              <div class="ProductImage">
                <v-img
                  :src="CartItem.image_url || DefaultProductImage"
                  :alt="CartItem.name"
                  width="110"
                  height="110"
                  cover
                  rounded="lg"
                >
                  <template #error>
                    <div class="ImageError">
                      <v-icon size="35"> mdi-image-off-outline </v-icon>
                    </div>
                  </template>
                </v-img>
              </div>

              <div class="ProductDetails">
                <div class="ProductName">
                  {{ CartItem.name }}
                </div>

                <div class="UnitPrice">
                  ₹{{ Number(CartItem.unit_price).toLocaleString("en-IN") }}
                  / unit
                </div>

                <div class="QuantitySection">
                  <span class="QuantityLabel"> Quantity </span>

                  <div class="QuantityControls">
                    <v-btn
                      icon="mdi-minus"
                      size="32"
                      variant="outlined"
                      rounded="circle"
                      :disabled="
                        CartItem.quantity <= 1 ||
                        IsUpdatingProduct === CartItem.id
                      "
                      @click="decreaseQuantity(CartItem)"
                    />

                    <span class="Quantity">
                      {{ CartItem.quantity }}
                    </span>

                    <v-btn
                      icon="mdi-plus"
                      size="32"
                      variant="outlined"
                      rounded="circle"
                      :loading="IsUpdatingProduct === CartItem.id"
                      @click="increaseQuantity(CartItem)"
                    />
                  </div>
                </div>

                <div class="ItemTotal">
                  ₹{{ Number(CartItem.total_price).toLocaleString("en-IN") }}
                </div>
              </div>

              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                :loading="IsRemovingProduct === CartItem.id"
                @click="removeItem(CartItem.id)"
              />

              <v-divider
                v-if="Index < CartItems.length - 1"
                class="ItemDivider"
              />
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Order Summary -->
      <v-col cols="12" md="6">
        <v-card elevation="2" rounded="xl" class="SummaryCard">
          <div class="SectionHeader">
            <div>
              <div class="SectionTitle">Order Summary</div>

              <div class="SectionSubtitle">Review your order</div>
            </div>

            <v-icon color="primary" size="28">
              mdi-receipt-text-outline
            </v-icon>
          </div>

          <v-divider />

          <div class="SummaryContent">
            <div class="SummaryRow">
              <span> Subtotal </span>

              <strong> ₹{{ Subtotal.toLocaleString("en-IN") }} </strong>
            </div>

            <div class="SummaryRow">
              <span> Total Items </span>

              <strong>
                {{ TotalItems }}
              </strong>
            </div>

            <v-divider class="SummaryDivider" />

            <div class="TotalRow">
              <span> Total </span>

              <strong> ₹{{ Subtotal.toLocaleString("en-IN") }} </strong>
            </div>

            <v-btn
              color="primary"
              size="large"
              block
              rounded="lg"
              class="PlaceOrderButton"
              prepend-icon="mdi-cart-check"
              :disabled="CartItems.length === 0"
              @click="placeOrder"
            >
              Place Your Order
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

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
import { computed, onMounted, ref } from "vue";

import ApiService from "../../services/api.service";

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface CartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CartItem[];
}

const CartItems = ref<CartItem[]>([]);

const IsLoading = ref(false);

const IsUpdatingProduct = ref<number | null>(null);

const IsRemovingProduct = ref<number | null>(null);

const ErrorMessage = ref("");

const ShowSnackbar = ref(false);

const SnackbarMessage = ref("");

const SnackbarColor = ref("success");

const DefaultProductImage = "https://via.placeholder.com/300x300?text=Product";

const TotalItems = computed(() => {
  return CartItems.value.reduce((Total: number, Item: CartItem) => {
    return Total + Item.quantity;
  }, 0);
});

const Subtotal = computed(() => {
  return CartItems.value.reduce((Total: number, Item: CartItem) => {
    return Total + Number(Item.total_price);
  }, 0);
});

const getCart = async (): Promise<void> => {
  IsLoading.value = true;

  ErrorMessage.value = "";

  try {
    const Response = await ApiService.get<CartResponse>("/cart");

    CartItems.value = Response.data || [];
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error ? Error.message : "Unable to load cart.";
  } finally {
    IsLoading.value = false;
  }
};

const updateQuantity = async (
  ProductId: number,
  Quantity: number,
): Promise<void> => {
  if (Quantity < 1) {
    return;
  }

  IsUpdatingProduct.value = ProductId;

  try {
    await ApiService.put(`/cart/items/${ProductId}`, {
      quantity: Quantity,
    });

    await getCart();

    showMessage("Cart updated successfully.", "success");
  } catch (Error: any) {
    showMessage(
      Error instanceof Error ? Error.message : "Unable to update quantity.",
      "error",
    );
  } finally {
    IsUpdatingProduct.value = null;
  }
};

const increaseQuantity = async (CartItem: CartItem): Promise<void> => {
  await updateQuantity(CartItem.id, CartItem.quantity + 1);
};

const decreaseQuantity = async (CartItem: CartItem): Promise<void> => {
  if (CartItem.quantity <= 1) {
    return;
  }

  await updateQuantity(CartItem.id, CartItem.quantity - 1);
};

const removeItem = async (ProductId: number): Promise<void> => {
  IsRemovingProduct.value = ProductId;

  try {
    await ApiService.delete(`/cart/items/${ProductId}`);

    await getCart();

    showMessage("Product removed from cart.", "success");
  } catch (Error: any) {
    showMessage(
      Error instanceof Error ? Error.message : "Unable to remove product.",
      "error",
    );
  } finally {
    IsRemovingProduct.value = null;
  }
};

const placeOrder = async (): Promise<void> => {
  try {
    await ApiService.post("/cart/place-order", {});

    showMessage("Order placed successfully.", "success");

    await getCart();
  } catch (Error: any) {
    showMessage(
      Error instanceof Error ? Error.message : "Unable to place order.",
      "error",
    );
  }
};

const showMessage = (Message: string, Color: string): void => {
  SnackbarMessage.value = Message;

  SnackbarColor.value = Color;

  ShowSnackbar.value = true;
};

onMounted(() => {
  getCart();
});
</script>

<style scoped>
.CartPage {
  width: 100%;
  padding-bottom: 40px;
}

.PageHeader {
  margin-bottom: 25px;
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

.CartGrid {
  align-items: flex-start;
}

.CartItemsCard,
.SummaryCard {
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.SectionHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
}

.SectionTitle {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.SectionSubtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.CartItems {
  padding: 4px 20px;
}

.CartItem {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
}

.ProductImage {
  flex-shrink: 0;
}

.ProductDetails {
  min-width: 0;
  flex: 1;
}

.ProductName {
  overflow: hidden;
  color: #111827;
  font-size: 17px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.UnitPrice {
  margin-top: 5px;
  color: #6b7280;
  font-size: 13px;
}

.QuantitySection {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.QuantityLabel {
  color: #6b7280;
  font-size: 13px;
}

.QuantityControls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.Quantity {
  min-width: 28px;
  text-align: center;
  color: #111827;
  font-weight: 600;
}

.ItemTotal {
  margin-top: 10px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.ItemDivider {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
}

.SummaryContent {
  padding: 24px;
}

.SummaryRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  color: #6b7280;
  font-size: 15px;
}

.SummaryRow strong {
  color: #111827;
}

.SummaryDivider {
  margin: 22px 0;
}

.TotalRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111827;
  font-size: 21px;
  font-weight: 700;
}

.PlaceOrderButton {
  margin-top: 28px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.LoadingContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #6b7280;
}

.EmptyCart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  text-align: center;
}

.EmptyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #eaf3ff;
}

.EmptyCart h2 {
  margin-top: 20px;
  color: #111827;
}

.EmptyCart p {
  margin: 8px 0 24px;
  color: #6b7280;
}

.ImageError {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  color: #9ca3af;
}

@media (max-width: 600px) {
  .PageTitle h1 {
    font-size: 28px;
  }

  .PageSubtitle {
    margin-left: 0;
  }

  .CartItem {
    align-items: flex-start;
  }

  .ProductImage .v-img {
    width: 85px !important;
    height: 85px !important;
  }

  .ProductName {
    font-size: 15px;
  }

  .QuantitySection {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>

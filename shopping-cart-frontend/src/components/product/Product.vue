<template>
  <div class="ProductPage">
    <div class="PageHeader">
      <div>
        <div class="PageTitle">
          <v-icon size="32" color="primary" class="mr-2">
            mdi-package-variant
          </v-icon>

          <h1>Products</h1>
        </div>

        <p class="PageSubtitle">
          Discover products and add your favourites to the cart.
        </p>
      </div>

      <v-btn
        v-if="Store.isAdmin"
        color="primary"
        size="large"
        rounded="lg"
        prepend-icon="mdi-plus"
        elevation="2"
        @click="handleAddProduct"
      >
        Add Product
      </v-btn>
    </div>

    <div class="SearchAndCart">
      <v-card class="SearchCard" elevation="1" rounded="xl">
        <v-text-field
          v-model="SearchText"
          placeholder="Search products..."
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          flat
          hide-details
          clearable
          density="comfortable"
          :disabled="IsLoading"
          @update:model-value="handleSearch"
        />
      </v-card>

      <div class="CartNavigation">
        <v-btn
          color="primary"
          variant="tonal"
          size="large"
          rounded="lg"
          prepend-icon="mdi-cart-outline"
          to="/cart"
        >
          Go to Cart
        </v-btn>
      </div>
    </div>

    <v-alert
      v-if="ErrorMessage"
      type="error"
      variant="tonal"
      rounded="lg"
      class="mt-5"
      closable
      @click:close="ErrorMessage = ''"
    >
      {{ ErrorMessage }}
    </v-alert>

    <div v-if="IsLoading" class="LoadingContainer">
      <v-progress-circular indeterminate color="primary" size="48" width="4" />

      <span> Loading products... </span>
    </div>

    <div v-else-if="Products.length === 0" class="EmptyContainer">
      <div class="EmptyIcon">
        <v-icon size="48" color="primary"> mdi-package-variant-closed </v-icon>
      </div>

      <div class="EmptyTitle">No products found</div>

      <div class="EmptyText">Try searching with another product name.</div>
    </div>

    <v-row v-else class="ProductGrid">
      <v-col
        v-for="ProductItem in Products"
        :key="ProductItem.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="ProductCard" elevation="2" rounded="xl">
          <div class="ProductImageWrapper">
            <v-img
              :src="ProductItem.image_url || DefaultProductImage"
              :alt="ProductItem.name"
              height="220"
              cover
            >
              <template #placeholder>
                <div class="ImagePlaceholder">
                  <v-icon size="48" color="grey-lighten-1">
                    mdi-image-outline
                  </v-icon>
                </div>
              </template>

              <template #error>
                <div class="ImagePlaceholder">
                  <v-icon size="48" color="grey-lighten-1">
                    mdi-image-off-outline
                  </v-icon>
                </div>
              </template>
            </v-img>

            <div v-if="ProductItem.stock > 0" class="StockBadge">
              {{ ProductItem.stock }} left
            </div>

            <div v-else class="StockBadge OutOfStock">Out of stock</div>
          </div>

          <div class="ProductContent">
            <div class="ProductName">
              {{ ProductItem.name }}
            </div>

            <div class="ProductDescription">
              {{ ProductItem.description }}
            </div>

            <div class="ProductBottom">
              <div class="Price">
                ₹{{ Number(ProductItem.price).toLocaleString("en-IN") }}
              </div>
            </div>

            <div v-if="Store.isAdmin" class="AdminActions">
              <v-btn
                color="primary"
                variant="outlined"
                block
                size="large"
                rounded="lg"
                prepend-icon="mdi-pencil-outline"
                @click="handleEditProduct(ProductItem)"
              >
                Edit Product
              </v-btn>
            </div>

            <v-btn
              v-else
              :color="ProductItem.is_in_cart === 1 ? 'error' : 'primary'"
              block
              size="large"
              rounded="lg"
              class="CartButton"
              :prepend-icon="
                ProductItem.is_in_cart === 1
                  ? 'mdi-cart-remove'
                  : 'mdi-cart-plus'
              "
              :disabled="
                ProductItem.stock <= 0 || IsAddingToCart === ProductItem.id
              "
              :loading="IsAddingToCart === ProductItem.id"
              @click="handleCartAction(ProductItem)"
            >
              {{
                ProductItem.stock <= 0
                  ? "Out of Stock"
                  : ProductItem.is_in_cart === 1
                    ? "Remove from Cart"
                    : "Add to Cart"
              }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="TotalPages > 1" class="PaginationContainer">
      <v-pagination
        v-model="CurrentPage"
        :length="TotalPages"
        :total-visible="7"
        :disabled="IsLoading"
        rounded="circle"
        @update:model-value="handlePageChange"
      />
    </div>

    <CreateProductDialogue
      v-model="IsProductDialogueOpen"
      :product="SelectedProduct"
      @created="handleProductCreated"
      @updated="handleProductUpdated"
    />

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
import { onBeforeUnmount, onMounted, ref } from "vue";

import CreateProductDialogue from "../../dialogues/product/CreateProductDialogue.vue";
import ApiService from "../../services/api.service";
import { useStore } from "../../stores/store";

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string | null;
  is_in_cart: number;
}

interface ProductApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Product[];
  totalPages: number;
}

const Store = useStore();

const Products = ref<Product[]>([]);

const SearchText = ref("");

const CurrentPage = ref(1);

const ProductsPerPage = 10;

const TotalPages = ref(0);

const IsLoading = ref(false);

const IsAddingToCart = ref<number | null>(null);

const IsProductDialogueOpen = ref(false);

const SelectedProduct = ref<Product | null>(null);

const ErrorMessage = ref("");

const ShowSnackbar = ref(false);

const SnackbarMessage = ref("");

const SnackbarColor = ref("success");

let SearchTimer: ReturnType<typeof setTimeout> | null = null;

const DefaultProductImage = "https://via.placeholder.com/600x400?text=Product";

const getProducts = async (): Promise<void> => {
  IsLoading.value = true;

  ErrorMessage.value = "";

  try {
    const Response = await ApiService.get<ProductApiResponse>("/products", {
      params: {
        page: CurrentPage.value,

        limit: ProductsPerPage,

        search: SearchText.value.trim(),
      },
    });

    Products.value = Response.data;

    TotalPages.value = Response.totalPages;
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error ? Error.message : "Unable to load products.";
  } finally {
    IsLoading.value = false;
  }
};

const handleSearch = (): void => {
  CurrentPage.value = 1;

  if (SearchTimer) {
    clearTimeout(SearchTimer);
  }

  SearchTimer = setTimeout(() => {
    getProducts();
  }, 500);
};

const handlePageChange = (Page: number): void => {
  CurrentPage.value = Page;

  getProducts();
};

const handleCartAction = async (ProductItem: Product): Promise<void> => {
  IsAddingToCart.value = ProductItem.id;

  try {
    if (ProductItem.is_in_cart === 1) {
      await ApiService.delete(`/cart/remove-cart/${ProductItem.id}`);

      SnackbarColor.value = "success";

      SnackbarMessage.value = `${ProductItem.name} removed from cart.`;
    } else {
      await ApiService.post("/cart/items", {
        productId: ProductItem.id,

        quantity: 1,
      });

      SnackbarColor.value = "success";

      SnackbarMessage.value = `${ProductItem.name} added to cart.`;
    }

    ShowSnackbar.value = true;

    await getProducts();
  } catch (Error: any) {
    SnackbarColor.value = "error";

    SnackbarMessage.value =
      Error instanceof Error
        ? Error.message
        : ProductItem.is_in_cart === 1
          ? "Unable to remove product from cart."
          : "Unable to add product to cart.";

    ShowSnackbar.value = true;
  } finally {
    IsAddingToCart.value = null;
  }
};
const handleAddProduct = (): void => {
  SelectedProduct.value = null;

  IsProductDialogueOpen.value = true;
};

const handleEditProduct = (ProductItem: Product): void => {
  SelectedProduct.value = ProductItem;

  IsProductDialogueOpen.value = true;
};

const handleProductCreated = (): void => {
  CurrentPage.value = 1;

  getProducts();

  SnackbarColor.value = "success";

  SnackbarMessage.value = "Product created successfully.";

  ShowSnackbar.value = true;
};

const handleProductUpdated = (): void => {
  getProducts();

  SnackbarColor.value = "success";

  SnackbarMessage.value = "Product updated successfully.";

  ShowSnackbar.value = true;
};

onMounted(() => {
  getProducts();
});

onBeforeUnmount(() => {
  if (SearchTimer) {
    clearTimeout(SearchTimer);
  }
});
</script>

<style scoped>
.ProductPage {
  width: 100%;
  padding-bottom: 30px;
}

.PageHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.PageTitle {
  display: flex;
  align-items: center;
}

.PageTitle h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.PageSubtitle {
  margin: 8px 0 0 38px;
  color: #6b7280;
  font-size: 15px;
}

.SearchCard {
  padding: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.ProductGrid {
  margin-top: 20px;
}

.ProductCard {
  height: 100%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.ProductCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12) !important;
}

.ProductImageWrapper {
  position: relative;
  overflow: hidden;
  background: #f8fafc;
}

.ProductImageWrapper .v-img {
  transition: transform 0.3s ease;
}

.ProductCard:hover .ProductImageWrapper .v-img {
  transform: scale(1.04);
}

.ImagePlaceholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f8fafc;
}

.StockBadge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 600;
}

.StockBadge.OutOfStock {
  background: #ffebee;
  color: #c62828;
}

.ProductContent {
  display: flex;
  flex-direction: column;
  padding: 18px;
}

.ProductName {
  overflow: hidden;
  color: #111827;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ProductDescription {
  min-height: 42px;
  margin-top: 6px;
  overflow: hidden;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.ProductBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  margin-bottom: 14px;
}

.Price {
  color: #111827;
  font-size: 22px;
  font-weight: 700;
}

.AdminActions {
  margin-top: auto;
}

.CartButton {
  margin-top: auto;
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

.EmptyContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.EmptyIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #eef4ff;
}

.EmptyTitle {
  margin-top: 20px;
  color: #111827;
  font-size: 20px;
  font-weight: 600;
}

.EmptyText {
  margin-top: 6px;
  color: #6b7280;
  font-size: 14px;
}

.PaginationContainer {
  display: flex;
  justify-content: center;
  margin-top: 35px;
}
.SearchAndCart {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
}

.SearchCard {
  flex: 1 1 auto;
  width: auto !important;
  min-width: 0;
}

.CartNavigation {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}
@media (max-width: 600px) {
  .SearchAndCart {
    flex-direction: column;
    align-items: stretch;
  }

  .SearchCard {
    width: 100% !important;
  }

  .CartNavigation {
    width: 100%;
  }

  .CartNavigation .v-btn {
    width: 100%;
  }
}
@media (max-width: 960px) {
  .PageHeader {
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .PageHeader {
    flex-direction: column;
    align-items: stretch;
  }

  .PageTitle h1 {
    font-size: 28px;
  }

  .PageSubtitle {
    margin-left: 0;
  }

  .PageHeader .v-btn {
    width: 100%;
  }

  .ProductImageWrapper .v-img {
    height: 200px !important;
  }
}
</style>

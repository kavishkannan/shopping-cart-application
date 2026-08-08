<template>
  <v-dialog v-model="IsOpen" max-width="600" persistent>
    <v-card rounded="xl">
      <v-card-title class="DialogueHeader">
        <div>
          <div class="DialogueTitle">
            {{ IsEditMode ? "Edit Product" : "Add Product" }}
          </div>

          <div class="DialogueSubtitle">
            {{
              IsEditMode
                ? "Update product information"
                : "Add a new product to your store"
            }}
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          :disabled="IsLoading"
          @click="closeDialogue"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
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

        <v-form
          ref="ProductForm"
          v-model="IsFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="Name"
            label="Product Name"
            placeholder="Enter product name"
            variant="outlined"
            prepend-inner-icon="mdi-package-variant"
            :rules="NameRules"
            :disabled="IsLoading"
            class="mb-2"
          />

          <v-select
            v-model="Category"
            label="Product Category"
            placeholder="Select product category"
            :items="Categories"
            variant="outlined"
            prepend-inner-icon="mdi-shape-outline"
            :rules="CategoryRules"
            :disabled="IsLoading"
            class="mb-2"
          />

          <v-textarea
            v-model="Description"
            label="Description"
            placeholder="Enter product description"
            variant="outlined"
            prepend-inner-icon="mdi-text-box-outline"
            rows="3"
            auto-grow
            :rules="DescriptionRules"
            :disabled="IsLoading"
            class="mb-2"
          />

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="Price"
                label="Price"
                placeholder="Enter price"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-currency-inr"
                :rules="PriceRules"
                :disabled="IsLoading"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="Stock"
                label="Stock"
                placeholder="Enter stock quantity"
                type="number"
                variant="outlined"
                prepend-inner-icon="mdi-warehouse"
                :rules="StockRules"
                :disabled="IsLoading"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="ImageUrl"
            label="Product Image URL"
            placeholder="https://your-s3-bucket-url/product.jpg"
            variant="outlined"
            prepend-inner-icon="mdi-image-outline"
            :rules="ImageUrlRules"
            :disabled="IsLoading"
            class="mt-2"
          />

          <div v-if="ImageUrl" class="ImagePreviewContainer">
            <v-img :src="ImageUrl" height="180" rounded="lg" cover>
              <template #error>
                <div class="ImagePreviewError">
                  <v-icon size="40"> mdi-image-off-outline </v-icon>

                  <span> Unable to load image </span>
                </div>
              </template>
            </v-img>
          </div>

          <div class="FormNote">
            Product images are stored in S3. Enter the S3 image URL here.
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-5">
        <v-spacer />

        <v-btn
          variant="outlined"
          rounded="lg"
          :disabled="IsLoading"
          @click="closeDialogue"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          :loading="IsLoading"
          :disabled="!IsFormValid || IsLoading"
          @click="handleSubmit"
        >
          {{ IsEditMode ? "Update Product" : "Create Product" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import ApiService from "../../services/api.service";

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

interface ProductRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
}

interface ProductApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
}

interface FormReference {
  validate: () => Promise<{
    valid: boolean;
  }>;

  reset: () => void;
}

const Props = defineProps<{
  modelValue: boolean;
  product?: Product | null;
}>();

const Emit = defineEmits<{
  (Event: "update:modelValue", Value: boolean): void;

  (Event: "created"): void;

  (Event: "updated"): void;
}>();

const IsOpen = computed({
  get: () => Props.modelValue,

  set: (Value: boolean) => {
    Emit("update:modelValue", Value);
  },
});

const IsEditMode = computed(() => {
  return !!Props.product;
});

const ProductForm = ref<FormReference | null>(null);

const Name = ref("");

const Category = ref("");

const Description = ref("");

const Price = ref("");

const Stock = ref("");

const ImageUrl = ref("");

const IsFormValid = ref(false);

const IsLoading = ref(false);

const ErrorMessage = ref("");

const Categories = [
  "Electronics",
  "Gadgets",
  "Mobile Phones",
  "Laptops & Computers",
  "Home Appliances",
  "Grocery",
  "Fashion",
  "Footwear",
  "Beauty & Personal Care",
  "Sports & Fitness",
  "Books",
  "Toys & Games",
  "Furniture",
  "Kitchen & Dining",
  "Accessories",
];

const NameRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Product name is required";
    }

    if (Value.trim().length < 2) {
      return "Product name must be at least 2 characters";
    }

    return true;
  },
];

const CategoryRules = [
  (Value: string) => {
    if (!Value) {
      return "Product category is required";
    }

    return true;
  },
];

const DescriptionRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Description is required";
    }

    return true;
  },
];

const PriceRules = [
  (Value: string) => {
    if (!Value) {
      return "Price is required";
    }

    const PriceValue = Number(Value);

    if (Number.isNaN(PriceValue)) {
      return "Enter a valid price";
    }

    if (PriceValue <= 0) {
      return "Price must be greater than 0";
    }

    return true;
  },
];

const StockRules = [
  (Value: string) => {
    if (!Value) {
      return "Stock is required";
    }

    const StockValue = Number(Value);

    if (Number.isNaN(StockValue) || !Number.isInteger(StockValue)) {
      return "Stock must be a whole number";
    }

    if (StockValue < 0) {
      return "Stock cannot be negative";
    }

    return true;
  },
];

const ImageUrlRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Image URL is required";
    }

    try {
      new URL(Value.trim());

      return true;
    } catch {
      return "Enter a valid image URL";
    }
  },
];

const fillForm = (): void => {
  if (!Props.product) {
    return;
  }

  Name.value = Props.product.name;

  Category.value = Props.product.category;

  Description.value = Props.product.description;

  Price.value = String(Props.product.price);

  Stock.value = String(Props.product.stock);

  ImageUrl.value = Props.product.image_url || "";
};

const resetForm = (): void => {
  Name.value = "";

  Category.value = "";

  Description.value = "";

  Price.value = "";

  Stock.value = "";

  ImageUrl.value = "";

  ErrorMessage.value = "";

  IsFormValid.value = false;

  ProductForm.value?.reset();
};

const closeDialogue = (): void => {
  if (IsLoading.value) {
    return;
  }

  IsOpen.value = false;
};

const handleSubmit = async (): Promise<void> => {
  ErrorMessage.value = "";

  const ValidationResult = await ProductForm.value?.validate();

  if (!ValidationResult?.valid) {
    return;
  }

  const Payload: ProductRequest = {
    name: Name.value.trim(),

    description: Description.value.trim(),

    category: Category.value,

    price: Number(Price.value),

    stock: Number(Stock.value),

    image_url: ImageUrl.value.trim(),
  };

  IsLoading.value = true;

  try {
    if (IsEditMode.value && Props.product) {
      await ApiService.put<ProductApiResponse>(
        `/products/${Props.product.id}`,
        Payload,
      );

      Emit("updated");
    } else {
      await ApiService.post<ProductApiResponse>("/products", Payload);

      Emit("created");
    }

    IsOpen.value = false;

    resetForm();
  } catch (Error) {
    ErrorMessage.value =
      Error instanceof Error
        ? Error.message
        : IsEditMode.value
          ? "Unable to update product."
          : "Unable to create product.";
  } finally {
    IsLoading.value = false;
  }
};

watch(
  () => Props.modelValue,
  (Value) => {
    if (!Value) {
      if (!IsLoading.value) {
        resetForm();
      }

      return;
    }

    ErrorMessage.value = "";

    if (Props.product) {
      fillForm();
    } else {
      resetForm();
    }
  },
);

watch(
  () => Props.product,
  (ProductValue) => {
    if (Props.modelValue && ProductValue) {
      fillForm();
    }
  },
);
</script>

<style scoped>
.DialogueHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
}

.DialogueTitle {
  color: #111827;
  font-size: 21px;
  font-weight: 600;
}

.DialogueSubtitle {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.ImagePreviewContainer {
  margin-top: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.ImagePreviewError {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  gap: 8px;
  background: #f8fafc;
  color: #9ca3af;
}

.FormNote {
  margin-top: 8px;
  color: #6b7280;
  font-size: 12px;
}
</style>

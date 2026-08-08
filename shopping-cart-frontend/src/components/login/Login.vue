<template>
  <v-container fluid class="LoginPage fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <v-card class="LoginCard" elevation="8" rounded="lg">
          <!-- Header -->
          <v-card-item class="text-center pa-6">
            <v-card-title class="text-h4 font-weight-bold">
              Shopping Cart
            </v-card-title>

            <v-card-subtitle class="mt-2">
              Sign in to your account
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="px-6 pb-6">
            <!-- Error Message -->
            <v-alert
              v-if="ErrorMessage"
              type="error"
              variant="tonal"
              class="mb-5"
              closable
              @click:close="clearError"
            >
              {{ ErrorMessage }}
            </v-alert>

            <!-- Login Form -->
            <v-form
              ref="LoginForm"
              v-model="IsFormValid"
              @submit.prevent="handleLogin"
            >
              <!-- Email -->
              <v-text-field
                v-model="Email"
                label="Email"
                type="email"
                variant="outlined"
                prepend-inner-icon="mdi-email-outline"
                :rules="EmailRules"
                :disabled="IsLoading"
                autocomplete="email"
                class="mb-2"
              />

              <!-- Password -->
              <v-text-field
                v-model="Password"
                label="Password"
                :type="ShowPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="ShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="PasswordRules"
                :disabled="IsLoading"
                autocomplete="current-password"
                class="mb-2"
                @click:append-inner="togglePasswordVisibility"
              />

              <!-- Login Button -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mt-4"
                :loading="IsLoading"
                :disabled="!IsFormValid || IsLoading"
              >
                Login
              </v-btn>
            </v-form>

            <!-- Register -->
            <div class="text-center mt-6">
              <span class="text-body-2"> Don't have an account? </span>

              <v-btn
                variant="text"
                color="primary"
                to="/register"
                :disabled="IsLoading"
              >
                Register
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import ApiService from "../../services/api.service";
import { useStore } from "../../stores/store";

import type { ApiResponse } from "../../types/api";
import type { LoginRequest, LoginResponse } from "../../types/auth";

const Router = useRouter();
const Store = useStore();
const LoginForm = ref();
const Email = ref("");
const Password = ref("");
const IsFormValid = ref(false);
const IsLoading = ref(false);
const ShowPassword = ref(false);
const ErrorMessage = ref("");

const EmailRules = [
  (Value: string) => {
    if (!Value) {
      return "Email is required";
    }

    const EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EmailPattern.test(Value)) {
      return "Please enter a valid email address";
    }

    return true;
  },
];

const PasswordRules = [
  (Value: string) => {
    if (!Value) {
      return "Password is required";
    }

    if (Value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return true;
  },
];

const togglePasswordVisibility = (): void => {
  ShowPassword.value = !ShowPassword.value;
};

const clearError = (): void => {
  ErrorMessage.value = "";
};

const handleLogin = async (): Promise<void> => {
  ErrorMessage.value = "";

  const ValidationResult = await LoginForm.value?.validate();

  if (!ValidationResult?.valid) {
    return;
  }

  const Payload: LoginRequest = {
    email: Email.value.trim(),
    password: Password.value,
  };

  IsLoading.value = true;

  try {
    const Response = await ApiService.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      Payload,
    );

    Store.setAuth(Response.data.token, Response.data.user);

    await Router.push("/dashboard");
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error
        ? Error.message
        : "Unable to login. Please try again.";
  } finally {
    IsLoading.value = false;
  }
};
</script>

<style scoped>
.LoginPage {
  min-height: 100vh;
  background: #f5f7fa;
  width: 100%;
}

.LoginCard {
  width: 100%;
}
</style>

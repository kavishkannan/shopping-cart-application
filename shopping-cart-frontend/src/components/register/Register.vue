<template>
  <v-container fluid class="RegisterPage fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="RegisterCard" elevation="8" rounded="lg">
          <v-card-item class="text-center pa-6">
            <v-card-title class="text-h4 font-weight-bold">
              Create Account
            </v-card-title>

            <v-card-subtitle class="mt-2">
              Register for your shopping account
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="px-6 pb-6">
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

            <v-alert
              v-if="SuccessMessage"
              type="success"
              variant="tonal"
              class="mb-5"
            >
              {{ SuccessMessage }}
            </v-alert>

            <v-form
              ref="RegisterForm"
              v-model="IsFormValid"
              @submit.prevent="handleRegister"
            >
              <v-text-field
                v-model="Name"
                label="Name"
                variant="outlined"
                prepend-inner-icon="mdi-account-outline"
                :rules="NameRules"
                :disabled="IsLoading"
                autocomplete="name"
                class="mb-2"
              />

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

              <v-text-field
                v-model="Phone"
                label="Phone"
                type="tel"
                variant="outlined"
                prepend-inner-icon="mdi-phone-outline"
                :rules="PhoneRules"
                :disabled="IsLoading"
                autocomplete="tel"
                class="mb-2"
              />

              <v-text-field
                v-model="Password"
                label="Password"
                :type="ShowPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="ShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :rules="PasswordRules"
                :disabled="IsLoading"
                autocomplete="new-password"
                class="mb-2"
                @click:append-inner="togglePasswordVisibility"
              />

              <v-text-field
                v-model="ConfirmPassword"
                label="Confirm Password"
                :type="ShowConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                prepend-inner-icon="mdi-lock-check-outline"
                :append-inner-icon="
                  ShowConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                "
                :rules="ConfirmPasswordRules"
                :disabled="IsLoading"
                autocomplete="new-password"
                class="mb-2"
                @click:append-inner="toggleConfirmPasswordVisibility"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                class="mt-4"
                :loading="IsLoading"
                :disabled="!IsFormValid || IsLoading"
              >
                Register
              </v-btn>
            </v-form>

            <div class="text-center mt-6">
              <span class="text-body-2"> Already have an account? </span>

              <v-btn
                variant="text"
                color="primary"
                to="/login"
                :disabled="IsLoading"
              >
                Login
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

import type { ApiResponse } from "../../types/api";
import type { RegisterRequest } from "../../types/auth";

const Router = useRouter();

const RegisterForm = ref();

const Name = ref("");
const Email = ref("");
const Phone = ref("");
const Password = ref("");
const ConfirmPassword = ref("");

const IsFormValid = ref(false);
const IsLoading = ref(false);
const ShowPassword = ref(false);
const ShowConfirmPassword = ref(false);

const ErrorMessage = ref("");
const SuccessMessage = ref("");

const NameRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Name is required";
    }

    if (Value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }

    return true;
  },
];

const EmailRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Email is required";
    }

    const EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EmailPattern.test(Value.trim())) {
      return "Please enter a valid email address";
    }

    return true;
  },
];

const PhoneRules = [
  (Value: string) => {
    if (!Value.trim()) {
      return "Phone number is required";
    }

    const PhonePattern = /^[0-9]{10}$/;

    if (!PhonePattern.test(Value.trim())) {
      return "Enter a valid 10-digit phone number";
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

const ConfirmPasswordRules = [
  (Value: string) => {
    if (!Value) {
      return "Please confirm your password";
    }

    if (Value !== Password.value) {
      return "Passwords do not match";
    }

    return true;
  },
];

const togglePasswordVisibility = (): void => {
  ShowPassword.value = !ShowPassword.value;
};

const toggleConfirmPasswordVisibility = (): void => {
  ShowConfirmPassword.value = !ShowConfirmPassword.value;
};

const clearError = (): void => {
  ErrorMessage.value = "";
};

const handleRegister = async (): Promise<void> => {
  ErrorMessage.value = "";
  SuccessMessage.value = "";

  const ValidationResult = await RegisterForm.value?.validate();

  if (!ValidationResult?.valid) {
    return;
  }

  const Payload: RegisterRequest = {
    name: Name.value.trim(),
    email: Email.value.trim(),
    phone: Phone.value.trim(),
    password: Password.value,
  };

  IsLoading.value = true;

  try {
    await ApiService.post<ApiResponse<null>>("/auth/register", Payload);

    SuccessMessage.value = "Registration successfully. Redirecting to login...";

    setTimeout(() => {
      Router.push("/login");
    }, 1200);
  } catch (Error: any) {
    ErrorMessage.value =
      Error instanceof Error
        ? Error.message
        : "Unable to register. Please try again.";
  } finally {
    IsLoading.value = false;
  }
};
</script>

<style scoped>
.RegisterPage {
  min-height: 100vh;
  background: #f5f7fa;
}

.RegisterCard {
  width: 100%;
}
</style>

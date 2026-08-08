<template>
  <div class="DashboardPage">
    <div class="WelcomeSection">
      <div>
        <div class="WelcomeTitle">Welcome, {{ Store.user?.name }}</div>

        <div class="WelcomeSubtitle">
          Manage your shopping experience from here.
        </div>
      </div>
    </div>

    <v-row class="DashboardGrid">
      <v-col cols="12" sm="6" lg="4">
        <v-card
          class="DashboardCard"
          elevation="2"
          rounded="xl"
          @click="navigateTo('/products')"
        >
          <div class="CardIcon ProductIcon">
            <v-icon size="34"> mdi-package-variant </v-icon>
          </div>

          <div class="CardContent">
            <div class="CardTitle">Products</div>

            <div class="CardDescription">
              Browse available products and find what you need.
            </div>
          </div>

          <v-icon class="ArrowIcon"> mdi-arrow-right </v-icon>
        </v-card>
      </v-col>

      <v-col v-if="Store.isCustomer" cols="12" sm="6" lg="4">
        <v-card
          class="DashboardCard"
          elevation="2"
          rounded="xl"
          @click="navigateTo('/cart')"
        >
          <div class="CardIcon CartIcon">
            <v-icon size="34"> mdi-cart </v-icon>
          </div>

          <div class="CardContent">
            <div class="CardTitle">My Cart</div>

            <div class="CardDescription">
              View and manage products added to your cart.
            </div>
          </div>

          <v-icon class="ArrowIcon"> mdi-arrow-right </v-icon>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <v-card
          class="DashboardCard"
          elevation="2"
          rounded="xl"
          @click="navigateTo('/orders')"
        >
          <div class="CardIcon OrderIcon">
            <v-icon size="34"> mdi-receipt-text </v-icon>
          </div>

          <div class="CardContent">
            <div class="CardTitle">Orders</div>

            <div class="CardDescription">
              View your previous orders and order details.
            </div>
          </div>

          <v-icon class="ArrowIcon"> mdi-arrow-right </v-icon>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="QuickInfoCard" elevation="1" rounded="xl">
      <div class="QuickInfoContent">
        <div class="QuickInfoIcon">
          <v-icon size="28" color="primary"> mdi-information-outline </v-icon>
        </div>

        <div>
          <div class="QuickInfoTitle">Shopping made simple</div>

          <div class="QuickInfoText">
            Browse products, add them to your cart, and place your order in just
            a few clicks.
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useStore } from "../../stores/store";

const Router = useRouter();
const Store = useStore();

const navigateTo = (Path: string): void => {
  Router.push(Path);
};
</script>

<style scoped>
.DashboardPage {
  width: 100%;
  padding-bottom: 30px;
}

.WelcomeSection {
  margin-bottom: 30px;
}

.WelcomeTitle {
  color: #111827;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.8px;
}

.WelcomeSubtitle {
  margin-top: 10px;
  color: #6b7280;
  font-size: 16px;
}

.DashboardGrid {
  margin-top: 0;
}

.DashboardCard {
  position: relative;
  display: flex;
  align-items: flex-start;
  min-height: 190px;
  padding: 28px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.DashboardCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12) !important;
}

.CardIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 62px;
  height: 62px;
  border-radius: 16px;
}

.ProductIcon {
  background: #eef4ff;
  color: #1565c0;
}

.CartIcon {
  background: #eaf7ef;
  color: #2e7d32;
}

.OrderIcon {
  background: #fff4e5;
  color: #ef6c00;
}

.CardContent {
  margin-left: 20px;
  padding-right: 20px;
}

.CardTitle {
  color: #111827;
  font-size: 21px;
  font-weight: 600;
}

.CardDescription {
  margin-top: 8px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.ArrowIcon {
  position: absolute;
  right: 22px;
  bottom: 22px;
  color: #9ca3af;
}

.QuickInfoCard {
  margin-top: 24px;
  padding: 22px;
  border: 1px solid #e5e7eb;
}

.QuickInfoContent {
  display: flex;
  align-items: center;
  gap: 16px;
}

.QuickInfoIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #eef4ff;
}

.QuickInfoTitle {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
}

.QuickInfoText {
  margin-top: 4px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .WelcomeSection {
    margin-bottom: 22px;
  }

  .WelcomeSubtitle {
    font-size: 14px;
  }

  .DashboardCard {
    min-height: 165px;
    padding: 22px;
  }

  .CardIcon {
    width: 54px;
    height: 54px;
  }

  .CardContent {
    margin-left: 15px;
  }

  .CardTitle {
    font-size: 18px;
  }

  .CardDescription {
    font-size: 13px;
  }

  .QuickInfoContent {
    align-items: flex-start;
  }
}
</style>

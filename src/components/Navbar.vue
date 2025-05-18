<script setup>
import Brand from "./shared/Brand.vue";
import Spinner from "./shared/Spinner.vue";
import UserIcon from "@/components/icons/UserIcon.vue";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const isLoggingOut = ref(false);
const offcanvasRef = ref(null);

function handleLogout() {
  isLoggingOut.value = true;
  setTimeout(() => {
    authStore.logout();
    router.push("/login");
  }, 2000);
}

function goToAccount() {
  router.push("/account");
}

function closeOffcanvas() {
  if (offcanvasRef.value) {
    const instance = bootstrap.Offcanvas.getInstance(offcanvasRef.value);
    if (instance) {
      instance.hide();
    }
  }
}
</script>

<template>
  <div v-if="isLoggingOut">
    <Spinner message="Logging out..." size="md" />
  </div>

  <!-- Top Navbar -->
  <nav class="navbar navbar-light bg-light px-3 shadow-sm sticky-top">
    <div class="container-fluid justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <a class="navbar-brand m-0 p-0 pe-4" href="/">
          <Brand />
        </a>

        <!-- Bank App Dropdown -->
        <div class="dropdown d-none d-lg-block">
          <button
            class="btn btn-outline-primary dropdown-toggle me-2"
            type="button"
            id="bankDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Bank App
          </button>
          <ul class="dropdown-menu" aria-labelledby="bankDropdown">
            <li><router-link class="dropdown-item" to="/">Home</router-link></li>
            <li
              v-if="!authStore.isEmployee && authStore.user?.isApproved"
            >
              <router-link class="dropdown-item" to="/transfer">Transfer</router-link>
            </li>
            <li
              v-if="!authStore.isEmployee && authStore.user?.isApproved"
            >
              <router-link class="dropdown-item" to="/transactions">Transactions</router-link>
            </li>
            <li
              v-if="!authStore.isEmployee && authStore.user?.isApproved"
            >
              <router-link class="dropdown-item" to="/lookup">IBAN Lookup</router-link>
            </li>
            <li v-if="authStore.isEmployee">
              <router-link class="dropdown-item" to="/accounts">All Customer Accounts</router-link>
            </li>
            <li v-if="authStore.isEmployee">
              <router-link class="dropdown-item" to="">Customers Without Accounts</router-link>
            </li>
          </ul>
        </div>

        <!-- ATM Dropdown -->
        <div v-if="!authStore.isEmployee && authStore.user?.isApproved" class="dropdown d-none d-lg-block">
          <button
            class="btn btn-outline-primary dropdown-toggle"
            type="button"
            id="atmDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            ATM
          </button>
          <ul class="dropdown-menu" aria-labelledby="atmDropdown">
            <li><router-link class="dropdown-item" to="/atm/deposit">Deposit</router-link></li>
            <li><router-link class="dropdown-item" to="/atm/withdraw">Withdraw</router-link></li>
          </ul>
        </div>
      </div>

      <div
        v-if="authStore.isAuthenticated"
        class="d-flex align-items-center gap-3 d-none d-lg-flex"
      >
        <button
          class="btn btn-outline-primary d-flex align-items-center gap-2"
          @click="goToAccount"
        >
          <UserIcon :size="24" />
          <span class="fs-6">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
        </button>
        <button
          class="btn btn-danger d-none d-lg-block ms-3"
          @click="handleLogout"
        >
          Log out
        </button>
      </div>

      <router-link
        v-else
        to="/login"
        class="btn btn-md btn-outline-primary d-none d-lg-block"
      >
        Log in
      </router-link>

      <!-- Hamburger Menu Toggle -->
      <button
        class="navbar-toggler d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <!-- Offcanvas Menu for Small Screens -->
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasRight"
    ref="offcanvasRef"
    aria-labelledby="offcanvasRightLabel"
  >
    <div class="offcanvas-header">
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>

    <div
      class="offcanvas-body d-flex flex-column justify-content-between h-100 px-2 py-3"
    >
      <div>
        <div
          v-if="authStore.isAuthenticated"
          class="d-flex justify-content-center mb-3"
        >
          <button
            class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
            @click="goToAccount"
            data-bs-dismiss="offcanvas"
          >
            <UserIcon :size="30" />
            <span class="fs-6">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
          </button>
        </div>

        <div class="accordion" id="sidebarAccordion">
          <!-- Bank App -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingBank">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseBank"
                aria-expanded="false"
                aria-controls="collapseBank"
              >
                Bank App
              </button>
            </h2>
            <div
              id="collapseBank"
              class="accordion-collapse collapse"
              aria-labelledby="headingBank"
              data-bs-parent="#sidebarAccordion"
            >
              <div class="accordion-body p-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <router-link to="/" @click="closeOffcanvas">Home</router-link>
                  </li>
                  <li
                    v-if="!authStore.isEmployee && authStore.user?.isApproved"
                    class="list-group-item"
                  >
                    <router-link to="/transfer" @click="closeOffcanvas">Transfer</router-link>
                  </li>
                  <li
                    v-if="!authStore.isEmployee && authStore.user?.isApproved"
                    class="list-group-item"
                  >
                    <router-link to="/transactions" @click="closeOffcanvas">Transactions</router-link>
                  </li>
                  <li v-if="authStore.isEmployee" class="list-group-item">
                    <router-link to="/accounts" @click="closeOffcanvas">All Customer Accounts</router-link>
                  </li>
                  <li v-if="authStore.isEmployee" class="list-group-item">
                    <router-link to="" @click="closeOffcanvas">Customers Without Accounts</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- ATM -->
          <div v-if="!authStore.isEmployee && authStore.user?.isApproved" class="accordion-item">
            <h2 class="accordion-header" id="headingATM">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseATM"
                aria-expanded="false"
                aria-controls="collapseATM"
              >
                ATM
              </button>
            </h2>
            <div
              id="collapseATM"
              class="accordion-collapse collapse"
              aria-labelledby="headingATM"
              data-bs-parent="#sidebarAccordion"
            >
              <div class="accordion-body p-0">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <router-link to="/atm/deposit" @click="closeOffcanvas">Deposit</router-link>
                  </li>
                  <li class="list-group-item">
                    <router-link to="/atm/withdraw" @click="closeOffcanvas">Withdraw</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-100">
        <button
          v-if="authStore.isAuthenticated"
          class="btn btn-md btn-danger w-100 mt-3"
          @click="handleLogout"
          data-bs-dismiss="offcanvas"
        >
          Log out
        </button>
        <router-link
          v-else
          to="/login"
          class="btn btn-md btn-outline-primary w-100 mt-3"
        >
          Log in
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text {
  color: var(--color-primary);
}

.navbar-toggler {
  border-color: var(--color-primary);
}

nav.navbar {
  border-bottom: 2px solid var(--color-primary);
  background-color: white !important;
}

.logout-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.765);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

a.router-link-active,
a.router-link-exact-active,
a {
  text-decoration: none !important;
  font-weight: 500;
}
</style>

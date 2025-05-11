<script setup>
import Brand from "./shared/Brand.vue";
import Spinner from "./shared/Spinner.vue";

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
  router.push('/account')
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
  <nav class="navbar navbar-light bg-light px-3 shadow-sm">
    <div class="container-fluid justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <a class="navbar-brand m-0 p-0 pe-4" href="/">
          <Brand />
        </a>
        <div class="dropdown d-none d-lg-block">
          <button class="btn btn-outline-primary dropdown-toggle me-2" type="button" id="bankDropdown"
            data-bs-toggle="dropdown" aria-expanded="false">
            Bank App
          </button>
          <ul class="dropdown-menu" aria-labelledby="bankDropdown">
            <li><router-link class="dropdown-item" to="/">Welcome</router-link></li>
            <li><router-link class="dropdown-item" to="/transfer">Transfer</router-link></li>
            <li><router-link class="dropdown-item" to="/transactions">Transactions</router-link></li>
            <li><router-link class="dropdown-item" to="/account">Account</router-link></li>
          </ul>
        </div>

        <div class="dropdown d-none d-lg-block">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" id="atmDropdown"
            data-bs-toggle="dropdown" aria-expanded="false">
            ATM
          </button>
          <ul class="dropdown-menu" aria-labelledby="atmDropdown">
            <li><router-link class="dropdown-item" to="/atm/login">Deposit</router-link></li>
            <li><router-link class="dropdown-item" to="/atm/withdraw">Withdraw</router-link></li>
          </ul>
        </div>
      </div>

      <!-- User Info (Visible only if logged in) -->
      <div v-if="authStore.isAuthenticated" class="d-flex align-items-center gap-3 d-none d-lg-flex">
        <button class="btn btn-outline-primary d-flex align-items-center gap-2" @click="goToAccount">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--color-primary)"
            class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>

          <span class="fs-6">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
        </button>
        <button class="btn btn-danger d-none d-lg-block ms-3" @click="handleLogout">
          Log out
        </button>
      </div>

      <router-link v-else to="/login" class="btn btn-md btn-outline-primary d-none d-lg-block">
        Log in
      </router-link>

      <!-- Hamburger Menu Toggle -->
      <button class="navbar-toggler d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>

  <!-- Offcanvas Menu for Small Screens -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" ref="offcanvasRef" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div v-if="authStore.isAuthenticated" class="d-flex align-items-center gap-3 mb-3" @click="goToAccount" data-bs-dismiss="offcanvas">
      <div v-if="authStore.isAuthenticated" class="d-flex align-items-center gap-3 mb-3" @click="goToAccount" data-bs-dismiss="offcanvas">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="var(--color-primary)"
          class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
        <span class="text fs-6">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</span>
      </div>
      </div> 
      
<!-- Bank App Dropdown -->
  <div class="accordion" id="sidebarAccordion">
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingBank">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBank"
          aria-expanded="false" aria-controls="collapseBank">
          Bank App
        </button>
      </h2>
      <div id="collapseBank" class="accordion-collapse collapse" aria-labelledby="headingBank"
        data-bs-parent="#sidebarAccordion">
        <div class="accordion-body p-0">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><router-link to="/" @click="closeOffcanvas">Welcome</router-link></li>
            <li class="list-group-item"><router-link to="/transfer" @click="closeOffcanvas">Transfer</router-link></li>
            <li class="list-group-item"><router-link to="/transactions" @click="closeOffcanvas">Transactions</router-link></li>
            <li class="list-group-item"><router-link to="/account" @click="closeOffcanvas">Account</router-link></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ATM Dropdown -->
    <div class="accordion-item">
      <h2 class="accordion-header" id="headingATM">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseATM"
          aria-expanded="false" aria-controls="collapseATM">
          ATM
        </button>
      </h2>
      <div id="collapseATM" class="accordion-collapse collapse" aria-labelledby="headingATM"
        data-bs-parent="#sidebarAccordion">
        <div class="accordion-body p-0">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><router-link to="/atm/login" @click="closeOffcanvas">Deposit</router-link></li>
            <li class="list-group-item"><router-link to="/atm/withdraw" @click="closeOffcanvas">Withdraw</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>

      <button v-if="authStore.isAuthenticated" class="btn btn-sm btn-danger w-100 mt-3" @click="handleLogout"
        data-bs-dismiss="offcanvas">
        Log out
      </button>

      <router-link v-else to="/login" class="btn btn-sm btn-outline-primary w-100 mt-3">
        Log in
      </router-link>
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

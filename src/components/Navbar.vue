<script setup>
import Brand from "./Brand.vue";
import Spinner from "./shared/Spinner.vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const user = authStore.user;
const router = useRouter();
const isLoggingOut = ref(false);

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
</script>

<template>
  <div v-if="isLoggingOut">
    <Spinner message="Logging out..." size="md" />
  </div>

  <!-- Top Navbar -->
  <nav class="navbar navbar-light bg-light px-3 shadow-sm">
    <div class="container-fluid justify-content-between">
      
      <a class="navbar-brand m-0 p-0" href="#">
        <Brand />
      </a>

      <!-- User Info (Visible only if logged in) -->
      <div
          v-if="authStore.isAuthenticated"
          class="d-flex align-items-center gap-3 d-none d-lg-flex"
      >
        <button
            class="btn btn-outline-dark d-flex align-items-center gap-2"
            @click="goToAccount"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="var(--color-primary)"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
          <span class="fs-6">{{ user?.firstName }} {{ user?.lastName }}</span>
        </button>

        <button
            class="btn btn-sm btn-danger d-none d-lg-block ms-3"
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
    <div class="offcanvas-body">
      <div
        v-if="authStore.isAuthenticated"
        class="d-flex align-items-center gap-3 mb-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="var(--color-primary)"
          class="bi bi-person-circle"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
        <span class="text fs-6"
          >{{ user?.firstName }} {{ user?.lastName }}</span
        >
      </div>

      <button
        v-if="authStore.isAuthenticated"
        class="btn btn-sm btn-danger w-100 mt-3"
        @click="handleLogout"
        data-bs-dismiss="offcanvas"
      >
        Log out
      </button>

      <router-link
        v-else
        to="/login"
        class="btn btn-sm btn-outline-primary w-100 mt-3"
      >
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
}

</style>

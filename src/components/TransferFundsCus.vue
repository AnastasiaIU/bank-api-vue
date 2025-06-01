<script setup>
import { ref } from 'vue';
import TransferBetweenUsers from './TransferBetweenUsers.vue';
import TransferBetweenOwnAccounts from './TransferBetweenOwnAccounts.vue';
import Toast from './shared/Toast.vue';

const activeTab = ref('lookup');
const toastRef = ref(null);
</script>

<template>
  <section class="card col-md-6 col-lg-5 col-xl-4 p-0 m-4">
    <ul class="nav nav-tabs mb-0">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'lookup' }" @click="activeTab = 'lookup'">
          IBAN Lookup
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'transfer' }" @click="activeTab = 'transfer'">
          Transfer Funds
        </button>
      </li>
    </ul>
    <div class="tab-content bg-white border border-top-0 rounded-bottom p-4">
      <div v-if="activeTab === 'lookup'">
        <TransferBetweenUsers :toast="toastRef" />
      </div>
      <div v-else-if="activeTab === 'transfer'">
        <TransferBetweenOwnAccounts :toast="toastRef" />
      </div>
    </div>
    <Toast ref="toastRef" />
  </section>
</template>

<style scoped>
.nav-tabs {
  margin-bottom: 0;
}

.tab-content {
  margin-top: 0;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  background: #fff;
  border-radius: 0 0 0.375rem 0.375rem;
}

.nav-tabs .nav-link.active {
  font-weight: bold;
  background-color: #f8f9fa;
  border-color: #dee2e6 #dee2e6 #fff;
}

.nav-link {
  color: var(--color-primary);
}
</style>
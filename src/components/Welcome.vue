<template>
  <section v-if="authStore.isAuthenticated" class="text-center mt-5">
    <h1 class="display-4">Welcome, {{ authStore.user?.firstName }}!</h1>

    <!-- Employee -->
    <div v-if="authStore.isEmployee" class="mt-4">
      <div class="row row-cols-1 row-cols-md-2 g-4 mt-3 justify-content-center">
        <Card
          title="All Customer Bank Accounts"
          subtitle="View all customer bank accounts"
          route="/accounts"
        />
        <Card
          title="Customers Without Bank Accounts"
          subtitle="View and manage all customers who do not yet have bank accounts"
          route="/users/review"
        />

        <Card
            title="Active Customer Accounts"
            subtitle="View and manage all active custmer accounts"
            route="/users/active"
        />

        <Card
          title="Tranfer Funds"
          subtitle="Send money quickly and securely from one  customer account to another"
          route="/transfer"
        />

         <Card
          title="Transaction History"
          subtitle="View all transactions of all customers"
          route="/transactions/all"
        />
      </div>
    </div>

    <!-- Approved Customer -->
    <div v-else-if="authStore.isApproved" class="mt-3">
      <div class="row row-cols-1 row-cols-md-2 g-4 mt-3 justify-content-center">
        <Card
          title="Tranfer Funds"
          subtitle="Send money quickly and securely to other accounts"
          route="/transfer"
        />

        <Card
          title="Transaction History"
          subtitle="Review your past transactions and account activities"
          route="/transactions"
        />

        <Card
          title="IBAN Lookup"
          subtitle="Find other accounts by their IBAN"
          route="/lookup"
        />
      </div>
    </div>

    <!-- Not Approved Customer -->
    <div v-else class="mt-3">
      <p class="fw-semibold">
        You're not approved yet. Please wait for approval from an employee to
        access all banking features.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import Card from "@/components/shared/WelcomePageCard.vue";

const authStore = useAuthStore();
</script>

<style scoped>
section {
  max-width: 1500px;
  margin: auto;
  background: var(--color-background);
  color: var(--color-text);
  padding: 20px;
  border-radius: 10px;
}

h1,
h2,
p {
  color: var(--color-text);
}

h1 {
  text-align: center;
  word-break: break-word;
}
</style>

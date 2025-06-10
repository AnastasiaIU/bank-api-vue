<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { API_ENDPOINTS } from "@/utils/config.js"

const authStore = useAuthStore()
const token = authStore.token

const users = ref([])

const fetchPendingUsers = async () => {
  const res = await axios.get(API_ENDPOINTS.usersPending, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  users.value = res.data
}

onMounted(fetchPendingUsers)
</script>

<template>
  <div v-if="authStore.isAuthenticated && authStore.isEmployee" class="container my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 m-0">Pending User Approvals</h1>
    </div>

    <table class="table table-light table-bordered table-hover text-center align-middle">
      <thead class="table-success">
      <tr>
        <th></th>
        <th>Full Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>BSN</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="users.length === 0">
        <td colspan="6" class="text-center text-muted fw-semibold">No users to display</td>
      </tr>
      <tr v-for="(user, index) in users" :key="user.id">
        <td>{{ index + 1 }}</td>
        <td>{{ user.firstName }} {{ user.lastName }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.phoneNumber }}</td>
        <td>{{ user.bsn }}</td>
        <td>
          <router-link
              :to="`/users/approval/${user.id}`"
              class="btn btn-sm btn-primary"
          >
            Continue
          </router-link>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
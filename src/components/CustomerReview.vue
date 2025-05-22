<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import {API_ENDPOINTS} from "@/utils/config.js";

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

onMounted(() => {
  fetchPendingUsers()
})
</script>

<template>
  <div class="container py-5">
    <div class="card shadow-sm p-4 border-top border-primary" style="border-top-width: 5px;">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 text-center"> Pending User Approvals</h1>
      </div>

      <!-- Table with scrollable body -->
      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <table class="table table-bordered align-middle table-hover mb-0">
          <thead class="table-light sticky-top">
          <tr>
            <th> </th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>BSN</th>
            <th class="text-center">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="users.length === 0">
            <td colspan="6" class="text-center text-muted">No users to display</td>
          </tr>
          <tr v-for="(user, index) in users" :key="user.id">
            <td>{{ index + 1 }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phoneNumber }}</td>
            <td>{{ user.bsn }}</td>
            <td class="text-center">
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
    </div>
  </div>
</template>
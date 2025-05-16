<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const token = authStore.token

const users = ref([])

const fetchPendingUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8080/users/pending', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    users.value = res.data
  } catch (err) {
    console.error('Error fetching pending users:', err)
  }
}

const updateApproval = async (userId, status) => {
  try {
    await axios.put(`http://localhost:8080/users/${userId}/approval`,
        { approvalStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
    )
    users.value = users.value.filter(u => u.id !== userId)
  } catch (err) {
    console.error(`Error updating approval for user ${userId}:`, err)
  }
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
        <h3 class="mb-0">Pending User Approvals</h3>
      </div>

      <!-- Table with scrollable body -->
      <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
        <table class="table table-bordered align-middle table-hover mb-0">
          <thead class="table-light sticky-top">
          <tr>
            <th>#</th>
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
              <button
                  class="btn btn-sm btn-success me-2"
                  @click="updateApproval(user.id, 'APPROVED')"
              >
                Approve
              </button>
              <button
                  class="btn btn-sm btn-danger"
                  @click="updateApproval(user.id, 'REJECTED')"
              >
                Reject
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
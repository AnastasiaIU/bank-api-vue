<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import {API_ENDPOINTS} from "@/utils/config.js";

// Setup router and route
const router = useRouter()
const route = useRoute()
const userId = route.params.id

// Auth and token
const authStore = useAuthStore()
const token = authStore.token

// Reactive state
const user = ref({})
const accounts = ref([])

const fetchUser = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.usersById(userId), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user.value = res.data
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const fetchAccounts = async () => {
  try {
    const res = await axios.get(API_ENDPOINTS.accountsByIdReview(userId), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    accounts.value = res.data
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

const sendApproval = async (status) => {
  const formattedAccounts = accounts.value.map(account => ({
    iban: account.iban,
    type: account.type,
    balance: 0,
    dailyLimit: account.dailyLimit ?? 0,
    withdrawLimit: account.withdrawLimit ?? 0,
    absoluteLimit: account.absoluteLimit ?? 0,
    userId: parseInt(userId)
  }))

  try {
    await axios.put(API_ENDPOINTS.usersApproval(userId), {
      approvalStatus: status,
      accounts: formattedAccounts
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    await router.push('/users/review')
  } catch (error) {
    console.error('Error during approval:', error)
  }
}

onMounted(async () => {
  await Promise.all([fetchUser(), fetchAccounts()])
})
</script>

<template>
  <div class="container py-5">
    <div class="card shadow-sm p-4 border-top border-primary" style="border-top-width: 5px;">
      <h2 class="mb-4">User Account Review</h2>

      <div class="row">
        <div class="col-md-4 mb-4">
          <h5 class="mb-4">User Information</h5>
          <p><strong>Name:</strong> {{ user.firstName }} {{ user.lastName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
        </div>

        <div class="col-md-8">
          <h5 class="mb-3">Account Configuration</h5>
          <div class="table-responsive">
            <table class="table table-bordered align-middle table-hover">
              <thead class="table-light">
              <tr>
                <th></th>
                <th class="d-none">User ID</th>
                <th>IBAN</th>
                <th>Type</th>
                <th>Daily Limit (€)</th>
                <th>Withdraw Limit (€)</th>
                <th>Absolute Limit (€)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(account, index) in accounts" :key="account.iban">
                <td>{{ index + 1 }}</td>
                <td class="d-none">{{ userId }}</td>
                <td>{{ account.iban }}</td>
                <td>{{ account.type }}</td>
                <td>
                  <select v-model.number="account.dailyLimit" class="form-select form-select-sm">
                    <option :value="0">0</option>
                    <option :value="1000">1,000</option>
                    <option :value="2000">2,000</option>
                    <option :value="3000">3,000</option>
                    <option :value="5000">5,000</option>
                  </select>
                </td>
                <td>
                  <select v-model.number="account.withdrawLimit" class="form-select form-select-sm">
                    <option :value="0">0</option>
                    <option :value="500">500</option>
                    <option :value="1000">1,000</option>
                    <option :value="2000">2,000</option>
                    <option :value="3000">3,000</option>
                  </select>
                </td>
                <td>
                  <select v-model.number="account.absoluteLimit" class="form-select form-select-sm">
                    <option :value="0">0</option>
                    <option :value="-100">-100</option>
                    <option :value="-200">-200</option>
                    <option :value="-300">-300</option>
                  </select>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Approve / Reject Buttons -->
      <div class="mt-4 text-end">
        <button class="btn btn-success me-2" @click="sendApproval('APPROVED')">Approve</button>
        <button class="btn btn-danger" @click="sendApproval('REJECTED')">Reject</button>
      </div>
    </div>
  </div>
</template>
<script setup>

import Brand from './Brand.vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthFeedbackStore } from '@/stores/authFeedback'

const router = useRouter()

const authFeedbackStore = useAuthFeedbackStore()

const showToast = ref(false)

onMounted(() => {
    if (authFeedbackStore.wasRegistered) {
        displayToast()
        authFeedbackStore.setWasRegistered(false)
    }
})

function displayToast() {
    showToast.value = true

    setTimeout(() => {
        showToast.value = false
    }, 3000)
}
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2 needs-validation" ref="regForm" id="loginForm" method="post"
            @submit.prevent="handleSubmittion" novalidate>
            <Brand />
            <p class="h5 mb-3 medium-grey-text text-center">Log in to your account</p>
            <div class="form-group">
                <label for="loginEmail">Email address</label>
                <input type="email" name="email" class="form-control" aria-describedby="emailHelp"
                    placeholder="Enter email" required>
                <div class="invalid-feedback" id="loginEmailPrompt"></div>
            </div>
            <div class="form-group mb-2">
                <label for="loginPassword">Password</label>
                <input name="password" class="form-control" placeholder="Password" required>
                <div class="invalid-feedback" id="loginPasswordPrompt"></div>
            </div>
            <div class="d-flex align-items-center mb-4">
                <input class="checkbox me-2" type="checkbox" value="">
                <label class="" for="showPasswordCheck">Show password</label>
            </div>
            <button type="submit" class="btn btn-primary mb-3">Log in</button>
            <p>Don't have an account?
                <a class="link-opacity-75-hover">
                    <router-link to="/register" @click.prevent="router.push(`/register`)">
                        Sign up
                    </router-link>
                </a>.
            </p>
        </form>
        <div v-if="showToast" class="toast-message">Registration successful! You can now log in.</div>
    </section>
</template>

<style scoped>
.toast-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 12px 20px;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    opacity: 1;
    transition: opacity 0.5s ease-out;
    z-index: 1000;
}
</style>

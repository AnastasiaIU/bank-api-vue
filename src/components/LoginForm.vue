<script setup>
import LogoIcon from './icons/IconLogo.vue'
import AppNameIcon from './icons/IconAppName.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2 needs-validation" ref="regForm" id="loginForm" method="post"
            @submit.prevent="handleSubmittion" novalidate>
            <div class="d-flex align-items-center justify-content-center">
                <LogoIcon class="my-3 me-3" size="48" />
                <AppNameIcon height="48" />
            </div>
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
    </section>
</template>

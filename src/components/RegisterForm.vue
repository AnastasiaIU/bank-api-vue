<script setup>
import Spinner from "@/components/shared/Spinner.vue";
import Brand from '@/components/shared/Brand.vue'

import BaseInput from '@/components/shared/forms/BaseInput.vue'
import BasePasswordInput from '@/components/shared/forms/BasePasswordInput.vue'

import registerSchema from '@/schemas/registerSchema'

import { useAuthStore } from '@/stores/auth'

import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'

const router = useRouter()
const authStore = useAuthStore()

const formContext = useForm({
    validationSchema: registerSchema
})

const { handleSubmit } = formContext

const onSubmit = handleSubmit(async (values) => {
    await authStore.register(values)

    if (authStore.fieldErrors) {
        authStore.fieldErrors.forEach(({ key, messageText }) => formContext.setFieldError(key, messageText));
    }

    if (authStore.wasRegistered) {
        formContext.resetForm()
        authStore.clearUiState()
        router.push('/login')
    }
})
</script>

<template>
    <Spinner v-if="authStore.isLoading" size="md" message="Trying to register..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit">
            <Brand />
            <p class="h5 mb-3 medium-grey-text text-center">Create a new account</p>

            <div v-if="authStore.error" class="alert alert-danger" role="alert">{{ authStore.error }}</div>

            <BaseInput name="email" label="Email address" type="email" placeholder="Enter email" />
            <BaseInput name="firstName" label="First name" placeholder="Enter first name" />
            <BaseInput name="lastName" label="Last name" placeholder="Enter last name" />
            <BaseInput name="bsn" label="BSN" placeholder="Enter BSN" />
            <BaseInput name="phoneNumber" label="Phone number" placeholder="Enter phone number" />
            <BasePasswordInput name="password" label="Password" placeholder="Enter password" />
            <BasePasswordInput name="confirmPassword" label="Confirm Password" placeholder="Confirm password" />

            <button class="btn btn-primary my-3" :disabled="authStore.isLoading">Register</button>
            <p>
                Already have an account?
                <router-link to="/login" class="link-opacity-75-hover">Log in</router-link>.
            </p>
        </form>
    </section>
</template>

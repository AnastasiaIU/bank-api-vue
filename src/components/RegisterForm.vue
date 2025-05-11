<script setup>
import Spinner from "./shared/Spinner.vue";
import Brand from './shared/Brand.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'

import { useAuthStore } from '@/stores/auth'
import { useAuthFeedbackStore } from '@/stores/authFeedback'
import BaseInput from '@/components/shared/forms/BaseInput.vue'
import BasePasswordInput from '@/components/shared/forms/BasePasswordInput.vue'
import registerSchema from '@/schemas/registerSchema'

const router = useRouter()
const authStore = useAuthStore()
const authFeedbackStore = useAuthFeedbackStore()
const generalError = ref('')
const isLoading = ref(false);

const formContext = useForm({
    validationSchema: registerSchema
})

const { handleSubmit } = formContext

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true;
    setTimeout(async () => {
        try {
            generalError.value = ''
            await authStore.register(values)
            authFeedbackStore.setWasRegistered(true)
            router.push('/login')
        } catch (err) {
            const rawMessage = err?.response?.data?.message || 'An error occurred. Please try again.'
            const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage]

            let matched = false

            for (const msg of messages) {
                const [key, ...rest] = msg.split(': ')
                const messageText = rest.join(': ').trim()

                if (key && messageText) {
                    formContext.setFieldError(key, messageText)
                    matched = true
                }
            }

            if (!matched) {
                generalError.value = messages[0]
            }
        } finally {
            isLoading.value = false;
        }
    }, 3000)
})
</script>

<template>
    <Spinner v-if="isLoading" size="md" message="Trying to register..." />
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit">
            <Brand />
            <p class="h5 mb-3 medium-grey-text text-center">Create a new account</p>

            <div v-if="generalError" class="alert alert-danger" role="alert">{{ generalError }}</div>

            <BaseInput name="email" label="Email address" type="email" placeholder="Enter email" />
            <BaseInput name="firstName" label="First name" placeholder="Enter first name" />
            <BaseInput name="lastName" label="Last name" placeholder="Enter last name" />
            <BaseInput name="bsn" label="BSN" placeholder="Enter BSN" />
            <BaseInput name="phoneNumber" label="Phone number" placeholder="Enter phone number" />
            <BasePasswordInput name="password" label="Password" placeholder="Enter password" />
            <BasePasswordInput name="confirmPassword" label="Confirm Password" placeholder="Confirm password" />


            <button class="btn btn-primary my-3">Register</button>
            <p>
                Already have an account?
                <router-link to="/login" class="link-opacity-75-hover">Log in</router-link>.
            </p>
        </form>
    </section>
</template>

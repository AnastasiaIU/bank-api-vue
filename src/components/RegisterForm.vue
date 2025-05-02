<script setup>

import Brand from './Brand.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useAuthFeedbackStore } from '@/stores/authFeedback'

const router = useRouter()

const authStore = useAuthStore()
const authFeedbackStore = useAuthFeedbackStore()

// Input values
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const bsn = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

// Input prompts
const emailPrompt = ref('')
const firstNamePrompt = ref('')
const lastNamePrompt = ref('')
const bsnPrompt = ref('')
const phonePrompt = ref('')
const passwordPrompt = ref('')

// Input references
const emailInput = ref(null)
const firstNameInput = ref(null)
const lastNameInput = ref(null)
const bsnInput = ref(null)
const phoneInput = ref(null)
const passwordInput = ref(null)
const confirmPasswordInput = ref(null)

const regForm = ref(null)

const passwordType = ref('password')

const errorMap = {
    email: { input: emailInput, prompt: emailPrompt },
    bsn: { input: bsnInput, prompt: bsnPrompt },
    firstName: { input: firstNameInput, prompt: firstNamePrompt },
    lastName: { input: lastNameInput, prompt: lastNamePrompt },
    phoneNumber: { input: phoneInput, prompt: phonePrompt },
    password: { input: passwordInput, prompt: passwordPrompt },
    confirmPassword: { input: confirmPasswordInput, prompt: passwordPrompt }
}

function showPassword(event) {
    const type = event.target.checked ? 'text' : 'password'
    passwordType.value = type
}

function resetValidation() {
    Object.values(errorMap).forEach(({ input, prompt }) => {
        input.value.setCustomValidity('')
        prompt.value = 'Invalid input'
    })

    if (regForm.value.classList.contains('was-validated')) {
        regForm.value.classList.remove('was-validated')
    }
}

function setInputValidity(errorMapElement, message, validation) {
    errorMapElement.prompt.value = message
    errorMapElement.input.value.setCustomValidity(validation)
}

function validateForm() {
    regForm.value.classList.add('was-validated')
}

async function handleSubmit() {
    try {
        resetValidation()

        if (password.value !== confirmPassword.value) {
            setInputValidity(errorMap.password, 'Passwords do not match', 'error')
            setInputValidity(errorMap.confirmPassword, 'Passwords do not match', 'error')
        }

        validateForm()

        if (!regForm.value.checkValidity()) {
            return
        }

        const userData = {
            email: email.value,
            firstName: firstName.value,
            lastName: lastName.value,
            bsn: bsn.value,
            phoneNumber: phone.value,
            password: password.value
        }

        await authStore.register(userData)

        authFeedbackStore.setWasRegistered(true)

        router.push('/login')

    } catch (error) {
        console.error('An error occurred:', error)

        const rawMessage = error?.response?.data?.message || 'An error occurred'
        const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage]

        let matched = false

        for (const key in errorMap) {
            const matchingMessage = messages.find(msg => msg.startsWith(`${key}: `))
            if (matchingMessage) {
                const cleanedMessage = matchingMessage.replace(`${key}: `, '')
                setInputValidity(errorMap[key], cleanedMessage, 'error')
                matched = true
            }
        }

        if (!matched) {
            setInputValidity(errorMap.password, messages[0], 'error')
        }

        validateForm()
    }
}
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2 needs-validation" ref="regForm" method="post"
            @submit.prevent="handleSubmit" novalidate>
            <Brand />
            <p class="h5 mb-3 medium-grey-text text-center">Create a new account</p>
            <div class="d-flex flex-column gap-3 mb-2">
                <div class="form-group">
                    <label for="emailInput">Email address</label>
                    <input id="emailInput" ref="emailInput" v-model="email" type="email" name="email"
                        class="form-control" aria-describedby="emailHelp" placeholder="Enter email"
                        @keyup="resetValidation" autocomplete="off" required>
                    <div class="invalid-feedback">{{ emailPrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="firstNameInput">First name</label>
                    <input id="firstNameInput" ref="firstNameInput" v-model="firstName" type="text" name="firstName"
                        class="form-control" placeholder="Enter first name" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ firstNamePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="lastNameInput">Last name</label>
                    <input id="lastNameInput" ref="lastNameInput" v-model="lastName" type="text" name="lastName"
                        class="form-control" placeholder="Enter last name" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ lastNamePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="bsnInput">BSN</label>
                    <input id="bsnInput" ref="bsnInput" v-model="bsn" type="number" name="bsn" class="form-control"
                        placeholder="Enter BSN" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ bsnPrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="phoneInput">Phone</label>
                    <input id="phoneInput" ref="phoneInput" v-model="phone" type="tel" name="phone" class="form-control"
                        placeholder="Enter phone number" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ phonePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="passwordInput">Password</label>
                    <input id="passwordInput" ref="passwordInput" v-model="password" :type="passwordType"
                        name="password" class="form-control" placeholder="Enter password" @keyup="resetValidation"
                        required>
                </div>
                <div class="form-group">
                    <label for="confirmPasswordInput">Confirm password</label>
                    <input id="confirmPasswordInput" ref="confirmPasswordInput" v-model="confirmPassword"
                        :type="passwordType" name="confirmPassword" class="form-control" placeholder="Confirm password"
                        @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ passwordPrompt }}</div>
                </div>
            </div>
            <div class="d-flex align-items-center mb-4">
                <input id="showPasswordCheck" class="checkbox me-2" type="checkbox" value=""
                    @change="showPassword($event)">
                <label for="showPasswordCheck">Show passwords</label>
            </div>
            <button id="registerBtn" type="submit" class="btn btn-primary mb-3">Register</button>
            <p>
          Already have an account?
          <router-link to="/login" class="link-opacity-75-hover">Login</router-link>.
        </p>
        </form>
    </section>
</template>

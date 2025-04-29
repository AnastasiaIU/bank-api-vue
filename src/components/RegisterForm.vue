<script setup>

import Brand from './Brand.vue'

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const bsn = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')

const regForm = ref(null)

const emailPrompt = ref('Email cannot be empty.')
const firstNamePrompt = ref('First name cannot be empty.')
const lastNamePrompt = ref('Last name cannot be empty.')
const bsnPrompt = ref('BSN cannot be empty.')
const phonePrompt = ref('Phone number cannot be empty.')
const passwordPrompt = ref('Passwords cannot be empty.')

const passwordType = ref('password')

let emailInput = null
let firstNameInput = null
let lastNameInput = null
let bsnInput = null
let phoneInput = null
let passwordInput = null
let confirmPasswordInput = null

onMounted(() => {
    emailInput = document.getElementById('emailInput')
    firstNameInput = document.getElementById('firstNameInput')
    lastNameInput = document.getElementById('lastNameInput')
    bsnInput = document.getElementById('bsnInput')
    phoneInput = document.getElementById('phoneInput')
    passwordInput = document.getElementById('passwordInput')
    confirmPasswordInput = document.getElementById('confirmPasswordInput')
})

function showPassword(event) {
    const type = event.target.checked ? 'text' : 'password'
    passwordType.value = type
}

function resetValidation() {
    emailInput.setCustomValidity('')
    firstNameInput.setCustomValidity('')
    lastNameInput.setCustomValidity('')
    bsnInput.setCustomValidity('')
    phoneInput.setCustomValidity('')
    passwordInput.setCustomValidity('')
    confirmPasswordInput.setCustomValidity('')

    if (regForm.value.classList.contains('was-validated')) {
        regForm.value.classList.remove('was-validated')
    }
}

function setInputValidity(input, prompt, message, validation) {
    prompt.value = message
    input.setCustomValidity(validation)
}

function validateForm() {
    regForm.value.classList.add('was-validated')
}

async function handleSubmittion() {
    try {
        resetValidation()

        if (email.value === '') {
            setInputValidity(emailInput, emailPrompt, 'Email cannot be empty.', 'error')
            validateForm()
            return
        } else {
            setInputValidity(emailInput, emailPrompt, 'Invalid email.', '')
        }

        if (password.value === '') {
            setInputValidity(passwordInput, passwordPrompt, 'Passwords cannot be empty.', 'error')
            setInputValidity(confirmPasswordInput, passwordPrompt, 'Passwords cannot be empty.', 'error')
            validateForm()
            return
        }

        if (password.value !== confirmPassword.value) {
            setInputValidity(passwordInput, passwordPrompt, 'Passwords do not match.', 'error')
            setInputValidity(confirmPasswordInput, passwordPrompt, 'Passwords do not match.', 'error')
            validateForm()
            return
        }

        validateForm()

        if (!regForm.value.checkValidity()) {
            return
        }

        //await authStore.register({ email: email.value, password: password.value })

        router.push('/login')
    } catch (error) {
        console.error('An error occurred:', error)

        const errorMessage = error?.response?.data?.error || 'An error occurred.'
        setInputValidity(confirmPasswordInput, passwordPrompt, errorMessage, 'error')
        validateForm()
    }
}
</script>

<template>
    <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
        <form class="d-flex flex-column gap-2 needs-validation" ref="regForm" method="post"
            @submit.prevent="handleSubmittion" novalidate>
            <Brand />
            <p class="h5 mb-3 medium-grey-text text-center">Create a new account</p>
            <div class="d-flex flex-column gap-3 mb-2">
                <div class="form-group">
                    <label for="emailInput">Email address</label>
                    <input id="emailInput" v-model="email" type="email" name="email" class="form-control"
                        aria-describedby="emailHelp" placeholder="Enter email" @keyup="resetValidation"
                        @blur="email = email.trim()" autocomplete="off" required>
                    <div class="invalid-feedback">{{ emailPrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="firstNameInput">First name</label>
                    <input id="firstNameInput" v-model="firstName" type="text" name="firstName" class="form-control"
                        placeholder="Enter first name" @blur="firstName = firstName.trim()" @keyup="resetValidation"
                        required>
                    <div class="invalid-feedback">{{ firstNamePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="lastNameInput">Last name</label>
                    <input id="lastNameInput" v-model="lastName" type="text" name="lastName" class="form-control"
                        placeholder="Enter last name" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ lastNamePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="bsnInput">BSN</label>
                    <input id="bsnInput" v-model="bsn" type="number" name="bsn" class="form-control"
                        placeholder="Enter BSN" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ bsnPrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="phoneInput">Phone</label>
                    <input id="phoneInput" v-model="phone" type="tel" name="phone" class="form-control"
                        placeholder="Enter phone number" @keyup="resetValidation" required>
                    <div class="invalid-feedback">{{ phonePrompt }}</div>
                </div>
                <div class="form-group">
                    <label for="passwordInput">Password</label>
                    <input id="passwordInput" v-model="password" :type="passwordType" name="password"
                        class="form-control" placeholder="Enter password" @keyup="resetValidation" required>
                </div>
                <div class="form-group">
                    <label for="confirmPasswordInput">Confirm password</label>
                    <input id="confirmPasswordInput" v-model="confirmPassword" :type="passwordType"
                        name="confirmPassword" class="form-control" placeholder="Confirm password"
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
        </form>
    </section>
</template>
<script setup>
import Brand from "./Brand.vue";
import ToastMessage from "./shared/ToastMessage.vue";
import Spinner from "./shared/Spinner.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useAuthFeedbackStore } from "@/stores/authFeedback";

const router = useRouter();

const authStore = useAuthStore();
const authFeedbackStore = useAuthFeedbackStore();

const isLoading = ref(false);

// Input values
const email = ref("");
const password = ref("");

// Input prompts
const loginEmailPrompt = ref("");
const loginPasswordPrompt = ref("");

// Input references
const loginEmailInput = ref(null);
const loginPasswordInput = ref(null);

const regForm = ref(null);

const generalError = ref("");

const passwordType = ref("password");

const showToast = ref(false);

const errorMap = {
  email: { input: loginEmailInput, prompt: loginEmailPrompt },
  password: { input: loginPasswordInput, prompt: loginPasswordPrompt },
};

function showPassword(event) {
  const type = event.target.checked ? "text" : "password";
  passwordType.value = type;
}

onMounted(() => {
  if (authFeedbackStore.wasRegistered) {
    showToast.value = true;
    authFeedbackStore.setWasRegistered(false);
  }
});

function resetValidation() {
    Object.values(errorMap).forEach(({ input, prompt }) => {
        input.value.setCustomValidity('')
    })

    if (regForm.value.classList.contains('was-validated')) {
        regForm.value.classList.remove('was-validated')
    }

    generalError.value = ""
}

function setInputValidity(errorMapElement, message, validation) {
  errorMapElement.prompt.value = message;
  errorMapElement.input.value.setCustomValidity(validation);
}

function validateForm() {
  regForm.value.classList.add("was-validated");
}


async function handleSubmit() {
  resetValidation();

  const emailValue = email.value.trim();
  const passwordValue = password.value;

  let hasError = false;

  if (!emailValue) {
    setInputValidity(errorMap.email, "Email is required", "error");
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    setInputValidity(errorMap.email, "Incorrect email format", "error");
    hasError = true;
  }

  if (!passwordValue) {
    setInputValidity(errorMap.password, "Password is required", "error");
    hasError = true;
  }

  if (hasError) {
    validateForm();
    return;
  }

  try {
    isLoading.value = true;
    setTimeout(async () => {
      try {
        await authStore.login({ email: emailValue, password: passwordValue });
        await authStore.fetchUser();
        router.push("/welcome");
      } catch (error) {
        generalError.value = error?.response?.data.message[0] || "An error occurred, please try again.";
      } finally {
        isLoading.value = false;
        validateForm();
      }
    }, 3000)
  } catch (error) {
    generalError.value = error?.response?.data.message[0] || "An error occurred, please try again.";
  }
}
</script>

<template>
   <Spinner v-if="isLoading" size="md" message="Logging in..." />
  <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
    <form
      class="d-flex flex-column gap-2 needs-validation"
      ref="regForm"
      method="post"
      @submit.prevent="handleSubmit"
      novalidate
    >
      <Brand />
      <p class="h5 mb-3 medium-grey-text text-center">Log in to your account</p>

      <div v-if="generalError" class="alert alert-danger" role="alert">
  {{ generalError }}
</div>

      <div class="form-group">
        <label for="loginEmailInput">Email address</label>
        <input
          id="loginEmailInput"
          type="email"
          name="email"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          required
          ref="loginEmailInput"
          v-model="email"
        />
        <div class="invalid-feedback">{{ loginEmailPrompt }}</div>
      </div>

      <div class="form-group mb-2">
        <label for="loginPasswordInput">Password</label>
        <input
          id="loginPasswordInput"
          :type="passwordType"
          name="password"
          class="form-control"
          placeholder="Enter password"
          required
          ref="loginPasswordInput"
          v-model="password"
        />
        <div class="invalid-feedback">{{ loginPasswordPrompt }}</div>
      </div>

      <div class="form-check mb-2">
        <input
          type="checkbox"
          class="form-check-input"
          id="showPasswordCheckbox"
          @change="showPassword"
        />
        <label class="form-check-label" for="showPasswordCheckbox"
          >Show password</label
        >
      </div>

      <button type="submit" class="btn btn-primary mb-3">Log in</button>

      <p>
        Don't have an account?
        <router-link to="/register" class="link-opacity-75-hover"
          >Sign up</router-link
        >.
      </p>
    </form>

    <ToastMessage v-if="showToast" message="Registration successful! You can now login." type="success" />
  </section>
</template>

<style scoped>

</style>

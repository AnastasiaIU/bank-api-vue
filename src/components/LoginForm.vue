<script setup>
import Spinner from "./shared/Spinner.vue";
import Brand from "./shared/Brand.vue";
import Toast from "./shared/Toast.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

import { useAuthStore } from "@/stores/auth";
import { useAuthFeedbackStore } from "@/stores/authFeedback";

const schema = yup.object({
  email: yup.string().required("Email is required").email("Icorrect email format"),
  password: yup.string().required("Password is required"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const router = useRouter();

const authStore = useAuthStore();
const authFeedbackStore = useAuthFeedbackStore();

const isLoading = ref(false);

const toastRef = ref(null);

const generalError = ref("");

const passwordType = ref("password");

function showPassword(event) {
  const type = event.target.checked ? "text" : "password";
  passwordType.value = type;
}

onMounted(() => {
  if (authFeedbackStore.wasRegistered) {
    toastRef.value.displayToast();
    authFeedbackStore.setWasRegistered(false);
  }
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  generalError.value = "";

  try {
    await Promise.all([
      authStore.login(values),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
  } catch (error) {
    generalError.value = error?.response?.data.message[0] || "An error occurred.";
  } finally {
    isLoading.value = false;
    router.push("/");
  }
});

</script>

<template>
  <Spinner v-if="isLoading" size="md" message="Logging in..." />
  <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
    <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit">
      <Brand />
      <p class="h5 mb-3 medium-grey-text text-center">Log in to your account</p>

      <div v-if="generalError" class="alert alert-danger" role="alert">{{ generalError }}</div>

      <div class="form-group">
        <label for="loginEmailInput">Email address</label>
        <input id="loginEmailInput" type="email" name="email" class="form-control" aria-describedby="emailHelp"
          placeholder="Enter email" v-model="email" />
        <div class="invalid-feedback d-block">{{ emailError }}</div>
      </div>

      <div class="form-group mb-2">
        <label for="loginPasswordInput">Password</label>
        <input id="loginPasswordInput" :type="passwordType" name="password" class="form-control"
          placeholder="Enter password" v-model="password" />
        <div class="invalid-feedback d-block">{{ passwordError }}</div>
      </div>

      <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="showPasswordCheckbox" @change="showPassword" />
        <label class="form-check-label" for="showPasswordCheckbox">Show password</label>
      </div>

      <button type="submit" class="btn btn-primary mb-3">Log in</button>

      <p>
        Don't have an account?
        <router-link to="/register" class="link-opacity-75-hover">Sign up</router-link>.
      </p>
    </form>

    <Toast ref="toastRef" text="Registration successful. You can log in now." variant="success" />
  </section>
</template>

<script setup>
import Spinner from "./shared/Spinner.vue";
import Brand from "./shared/Brand.vue";
import Toast from "./shared/Toast.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";

import { useAuthStore } from "@/stores/auth";
import BaseInput from "@/components/shared/forms/BaseInput.vue";
import BasePasswordInput from "@/components/shared/forms/BasePasswordInput.vue";
import loginSchema from "@/schemas/loginSchema";

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);
const toastRef = ref(null);
const generalError = ref("");

const formContext = useForm({
  validationSchema: loginSchema,
});

const { handleSubmit } = formContext;

onMounted(() => {
  if (authStore.wasRegistered) {
    toastRef.value.displayToast();
    authStore.setWasRegistered(false);
  }
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  generalError.value = "";

  setTimeout(async () => {
    try {
      await authStore.login(values);
      router.push("/");
    } catch (err) {
      const rawMessage =
        err?.response?.data?.message || "An error occurred. Please try again.";
      const messages = Array.isArray(rawMessage) ? rawMessage : [rawMessage];

      let matched = false;

      for (const msg of messages) {
        const [key, ...rest] = msg.split(": ");
        const messageText = rest.join(": ").trim();

        if (key && messageText) {
          formContext.setFieldError(key, messageText);
          matched = true;
        }
      }

      if (!matched) {
        generalError.value = messages[0];
      }
    } finally {
      isLoading.value = false;
    }
  }, 3000);
});
</script>

<template>
  <Spinner v-if="isLoading" size="md" message="Logging in..." />
  <section class="card col-md-6 col-lg-5 col-xl-4 p-4 m-4">
    <form class="d-flex flex-column gap-2" @submit.prevent="onSubmit">
      <Brand />
      <p class="h5 mb-3 medium-grey-text text-center">Log in to your account</p>

      <div v-if="generalError" class="alert alert-danger" role="alert">
        {{ generalError }}
      </div>

      <div class="form-group">
        <BaseInput name="email" label="Email address" type="email" placeholder="Enter email" />
      </div>

      <div class="form-group mb-2">
        <BasePasswordInput name="password" label="Password" placeholder="Enter password" />
      </div>

      <button type="submit" class="btn btn-primary mb-3">Log in</button>

      <p>
        Don't have an account?
        <router-link to="/register" class="link-opacity-75-hover">Sign up</router-link>.
      </p>
    </form>

    <Toast ref="toastRef" text="Registration successful! You can log in now." variant="success" />
  </section>
</template>

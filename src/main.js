import './assets/styles/main.css'
import { useAuthStore } from "@/stores/auth";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
await authStore.initializeAuth()

app.mount('#app')
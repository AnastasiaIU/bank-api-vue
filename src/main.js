import './assets/styles/main.css'
import { useAuthStore } from "@/stores/auth";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersist)

const authStore = useAuthStore(pinia);
await authStore.initializeAuth();

app.use(pinia)
app.use(router)

app.mount('#app')

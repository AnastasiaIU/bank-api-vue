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

document.addEventListener("DOMContentLoaded", async () => {
    enableBootstrapFormValidation()
})

/**
 * Enables Bootstrap form validation.
 * Adds an event listener to the window's load event to apply custom Bootstrap validation styles to forms.
 * Prevents form submission if the form is invalid and adds the 'was-validated' class to the form.
 */
function enableBootstrapFormValidation() {
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        let forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
}
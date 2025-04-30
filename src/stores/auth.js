import { defineStore } from 'pinia'

import axios from "axios";

import { API_ENDPOINTS } from "@/utils/config";

export const useAuthStore = defineStore('auth', () => {
    async function register(credentials) {
        await axios.post(API_ENDPOINTS.register, credentials)
    }

    return { register }
})
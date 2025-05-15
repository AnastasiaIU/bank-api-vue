import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000
})

// Global response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Server/network error
      console.error('[Global] Server is unreachable or offline.')
      // Optionally show a global toast or use a global store flag
      alert("The server is currently unreachable. Please try again later.")
    }

    return Promise.reject(error)
  }
)

export default instance
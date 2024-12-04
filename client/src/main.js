import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state before mounting the app
const authStore = useAuthStore(pinia)

const initAuth = async () => {
    try {
        // Set loading state
        authStore.$patch({ loading: true })
        
        // Check authentication state
        await authStore.checkAuth()
        
        console.log('Auth initialization complete:', {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.user
        })
    } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear auth state on error
        authStore.clearAuthData()
    } finally {
        // Set initialized state and remove loading
        authStore.$patch({ 
            isInitialized: true,
            loading: false 
        })
        // Mount the app
        app.mount('#app')
    }
}

// Start initialization
initAuth()
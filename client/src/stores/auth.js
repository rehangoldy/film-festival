import { defineStore } from 'pinia'
import axios from 'axios'
import { useAlertStore } from './alert'
import router from '../router'
import { useMovieStore } from './movie'

const API_URL = 'http://localhost:8080/api'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    console.log('Initial Auth State:', { token, user })
    
    // Set default axios auth header if token exists
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('Setting default Authorization header:', axios.defaults.headers.common['Authorization'])
    }
    
    return {
      user: user,
      token: token,
      loading: false,
      error: null,
      isInitialized: false
    }
  },

  getters: {
    isAuthenticated: (state) => {
      const isValid = !!state.token && !!state.user
      console.log('Checking authentication:', { token: !!state.token, user: !!state.user, isValid })
      return isValid
    },
    isAdmin: (state) => {
      const isAdmin = state.user?.role === 'admin'
      console.log('Checking admin role:', { role: state.user?.role, isAdmin })
      return isAdmin
    }
  },

  actions: {
    setAuthData(token, user) {
      console.log('Setting auth data:', { token, user })
      this.token = token
      this.user = {
        ...user,
        name: user.name || 'User'
      }
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(this.user))
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      console.log('Updated Authorization header:', axios.defaults.headers.common['Authorization'])
    },

    clearAuthData() {
      console.log('Clearing auth data')
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      console.log('Cleared Authorization header:', axios.defaults.headers.common['Authorization'])
    },

    async login(email, password) {
      const alertStore = useAlertStore()
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        })
        
        const { token, user } = response.data.data
        this.setAuthData(token, user)
        
        // Redirect berdasarkan role
        if (user.role === 'admin') {
          await router.push('/admin')
          alertStore.success('Login Berhasil', `Selamat datang kembali, Admin ${user.name}!`)
        } else {
          await router.push('/')
          alertStore.success('Login Berhasil', `Selamat datang kembali, ${user.name}!`)
        }
        return true
      } catch (error) {
        this.error = null
        
        if (!error.response) {
          this.error = 'Tidak dapat terhubung ke server'
          alertStore.error('Kesalahan Koneksi', this.error)
          return false
        }

        const status = error.response.status
        const errorMessage = error.response.data?.message || ''
        
        if (status === 401) {
          if (errorMessage.toLowerCase().includes('password')) {
            this.error = 'Password yang Anda masukkan salah'
          } else if (errorMessage.toLowerCase().includes('email')) {
            this.error = 'Email tidak ditemukan'
          } else {
            this.error = 'Email atau password salah'
          }
        } else {
          this.error = 'Terjadi kesalahan saat login'
        }
        
        alertStore.error('Login Gagal', this.error)
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      const alertStore = useAlertStore()
      this.loading = true
      this.error = null

      try {
        await axios.post(`${API_URL}/auth/register`, userData)
        await router.push('/login')
        alertStore.success('Registrasi Berhasil', 'Silahkan login dengan akun yang telah dibuat')
        return true
      } catch (error) {
        if (!error.response) {
          this.error = 'Tidak dapat terhubung ke server'
          alertStore.error('Kesalahan Koneksi', this.error)
          return false
        }

        const errorMessage = error.response.data?.message || ''
        this.error = errorMessage || 'Terjadi kesalahan saat registrasi'
        alertStore.error('Registrasi Gagal', this.error)
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      const alertStore = useAlertStore()
      this.clearAuthData()
      router.push('/login')
      alertStore.info('Logout Berhasil', 'Anda telah keluar dari sistem')
    },

    async validateToken() {
      if (!this.token) return false
      
      try {
        const response = await axios.get(`${API_URL}/auth/validate`)
        // Update user data dari server
        if (response.data.valid && response.data.user) {
          this.user = response.data.user
        }
        return response.data.valid
      } catch (error) {
        console.error('Token validation error:', error)
        return false
      }
    },

    async checkAuth() {
      if (this.isInitialized && this.isAuthenticated) return true
      
      this.loading = true
      try {
        // Check if we have token in localStorage
        const token = localStorage.getItem('token')
        
        if (!token) {
          this.clearAuthData()
          return false
        }

        // Set the token in axios headers
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Validate token with backend and get fresh user data
        const isValid = await this.validateToken()
        
        if (!isValid) {
          this.clearAuthData()
          return false
        }

        // Token is valid and user data updated from validateToken
        this.isInitialized = true
        return true
      } catch (error) {
        console.error('Auth check error:', error)
        this.clearAuthData()
        return false
      } finally {
        this.loading = false
      }
    }
  }
})

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
      <svg 
        class="mx-auto mb-4 h-16 w-16 text-red-500" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
        />
      </svg>
      
      <h1 class="text-2xl font-bold text-gray-800 mb-4">
        Akses Ditolak
      </h1>
      
      <p class="text-gray-600 mb-6">
        Anda tidak memiliki izin untuk mengakses halaman ini. 
        Pastikan Anda memiliki hak akses yang sesuai.
      </p>
      
      <div class="flex justify-center space-x-4">
        <router-link 
          to="/" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Kembali ke Beranda
        </router-link>
        
        <router-link 
          v-if="!isAuthenticated"
          to="/login"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

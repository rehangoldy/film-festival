<template>
  <aside :class="[
    'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'lg:translate-x-0'
  ]">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white flex flex-col">
      <ul class="space-y-2 font-medium flex-grow">
        <li>
          <router-link to="/admin/dashboard" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/admin/dashboard' }">
            <svg class="w-6 h-6 text-gray-500 transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="ml-3">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/movies" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/admin/movies' }">
            <svg class="w-6 h-6 text-gray-500 transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span class="ml-3">Manajemen Film</span>
          </router-link>
        </li>
        <li>
          <router-link to="/admin/statistics" class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
            :class="{ 'bg-gray-100': $route.path === '/admin/statistics' }">
            <svg class="w-6 h-6 text-gray-500 transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="ml-3">Statistik</span>
          </router-link>
        </li>
      </ul>

      <!-- Bottom Actions -->
      <div class="mt-auto border-t border-gray-200 pt-4 space-y-2">
        <router-link to="/" class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100">
          <svg class="w-6 h-6 text-gray-500 transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="ml-3">Kembali ke Home</span>
        </router-link>

        <button @click="logout" class="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100">
          <svg class="w-6 h-6 text-gray-500 transition duration-75" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="ml-3">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
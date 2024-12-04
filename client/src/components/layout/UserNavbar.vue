<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold text-gray-800">
        Movie Festival
      </router-link>
      
      <div class="flex items-center space-x-4">
        <!-- Menu untuk Pengguna Terotentikasi -->
        <template v-if="isAuthenticated">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-gray-800 transition"
          >
            Beranda
          </router-link>
          
          <router-link 
            to="/voted-movies" 
            class="text-gray-600 hover:text-gray-800 transition"
          >
            Vote Saya
          </router-link>
          
          <!-- Menu Admin -->
          <template v-if="isAdmin">
            
            <router-link 
              to="/admin" 
              class="text-gray-600 hover:text-gray-800 transition"
            >
              Dashboard
            </router-link>
          </template>

          <!-- Profile Dropdown -->
          <div class="relative" v-click-outside="closeDropdown">
            <button 
              @click="toggleDropdown" 
              class="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition"
            >
              <span>{{ authStore.user?.name || 'Profile' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div 
              v-show="showDropdown" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
            >
              <button 
                @click="logout" 
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </template>

        <!-- Menu untuk Pengguna Tidak Terotentikasi -->
        <template v-else>
          <router-link 
            to="/login" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </router-link>
          <router-link 
            to="/register" 
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const showDropdown = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout gagal:', error)
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<style scoped>
nav a.router-link-exact-active {
  @apply text-blue-600 font-semibold;
}
</style>
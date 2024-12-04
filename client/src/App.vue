<template>
  <div class="min-h-screen bg-gray-50">
    <BaseAlert 
      :show="alertStore.show"
      :type="alertStore.type"
      :title="alertStore.title"
      :message="alertStore.message"
      @close="alertStore.hideAlert"
    />
    
    <template v-if="isAdminRoute">
      <div class="flex h-screen overflow-hidden">
        <AdminSidebar
          :is-open="sidebarOpen"
          @toggle-sidebar="toggleSidebar"
        />
        <div class="flex flex-col flex-1 overflow-hidden">
          <AdminNavbar
            :is-sidebar-open="sidebarOpen"
            @toggle-sidebar="toggleSidebar"
          />
          <main class="flex-1 relative overflow-y-auto focus:outline-none">
            <router-view v-if="!loading"></router-view>
            <div v-else class="flex justify-center items-center min-h-screen">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </main>
        </div>
      </div>
    </template>
    <template v-else>
      <UserNavbar v-if="!isAuthRoute && !isAdminRoute" />
      <router-view v-if="!loading"></router-view>
      <div v-else class="flex justify-center items-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAlertStore } from './stores/alert'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import BaseAlert from './components/base/BaseAlert.vue'
import UserNavbar from './components/layout/UserNavbar.vue'
import AdminNavbar from './components/layout/AdminNavbar.vue'
import AdminSidebar from './components/layout/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const alertStore = useAlertStore()
const authStore = useAuthStore()
const loading = ref(true)
const sidebarOpen = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isAuthRoute = computed(() => ['/login', '/register'].includes(route.path))

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

onMounted(async () => {
  try {
    // Check authentication status
    const isAuthenticated = await authStore.checkAuth()
    
    // If not authenticated and trying to access protected route
    if (!isAuthenticated && (route.meta.requiresAuth || isAdminRoute.value)) {
      router.push('/login')
      return
    }
    
    // If authenticated but not admin and trying to access admin route
    if (isAuthenticated && isAdminRoute.value && !authStore.isAdmin) {
      router.push('/')
      return
    }
    
    // If authenticated and trying to access auth route
    if (isAuthenticated && isAuthRoute.value) {
      router.push('/')
      return
    }
  } catch (error) {
    console.error('Error checking auth:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>

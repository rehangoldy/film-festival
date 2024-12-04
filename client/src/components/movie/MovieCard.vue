<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <!-- Thumbnail -->
    <div class="relative aspect-video">
      <img 
        :src="movie.thumbnail_path || '/images/default-thumbnail.jpg'" 
        :alt="movie.title"
        class="w-full h-full object-cover"
      >
      <div class="absolute bottom-0 right-0 bg-black bg-opacity-75 px-2 py-1 m-2 rounded text-white text-sm">
        {{ formatDuration(movie.duration) }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ movie.title }}
      </h3>
      
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ movie.description }}
      </p>

      <!-- Stats -->
      <div class="flex items-center justify-between text-sm text-gray-500">
        <div class="flex items-center space-x-2">
          <span class="flex items-center">
            <i class="fas fa-eye mr-1"></i>
            {{ formatNumber(movie.view_count) }}
          </span>
          <span class="flex items-center">
            <i class="fas fa-thumbs-up mr-1"></i>
            {{ formatNumber(movie.vote_count) }}
          </span>
        </div>

        <!-- Genres -->
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="genre in movie.Genres" 
            :key="genre.id"
            class="px-2 py-1 bg-gray-100 text-xs rounded-full"
          >
            {{ genre.name }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex justify-between items-center">
        <router-link 
          :to="{ name: 'movie-detail', params: { id: movie.id }}"
          class="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View Details
        </router-link>
        
        <!-- Admin Actions -->
        <div v-if="isAdmin" class="flex space-x-2">
          <router-link 
            :to="{ name: 'admin-movie-edit', params: { id: movie.id }}"
            class="text-gray-600 hover:text-gray-800"
          >
            <i class="fas fa-edit"></i>
          </router-link>
          <button 
            @click="$emit('delete', movie.id)"
            class="text-red-600 hover:text-red-800"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

const formatNumber = (num) => {
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}
</script>

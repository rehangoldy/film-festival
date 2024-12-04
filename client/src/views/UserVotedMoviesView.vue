<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Film Saya Vote</h1>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-xl text-red-600">{{ error }}</p>
    </div>
    
    <div v-else>
      <div v-if="!votedMovies.length" class="text-center py-12">
        <p class="text-xl text-gray-600">Anda belum memvote film apapun</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="movie in votedMovies" :key="movie.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <router-link :to="{ name: 'MovieDetail', params: { id: movie.id }}" class="block">
            <img 
              :src="getThumbnailUrl(movie.thumbnail_path)" 
              :alt="movie.title"
              class="w-full h-48 object-cover"
              @error="$event.target.src = '/placeholder.jpg'"
            />
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{{ movie.title }}</h2>
              <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ movie.description }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <span class="flex items-center">
                  <i class="far fa-eye mr-1"></i>
                  {{ formatNumber(movie.view_count) }} views
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from '../stores/movie'

const movieStore = useMovieStore()
const loading = ref(true)
const error = ref(null)
const votedMovies = ref([])

const getThumbnailUrl = (thumbnailPath) => {
  if (!thumbnailPath) return '/placeholder.jpg'
  return `http://localhost:8080/${thumbnailPath}`
}

const formatNumber = (num) => {
  if (!num) return '0'
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const movies = await movieStore.fetchVotedMovies()
    votedMovies.value = movies || []
  } catch (err) {
    console.error('Error fetching voted movies:', err)
    error.value = err.message || 'Failed to load voted movies'
    votedMovies.value = []
  } finally {
    loading.value = false
  }
})
</script>

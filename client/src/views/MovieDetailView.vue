<template>
  <main class="container mx-auto px-4 py-8">
    <div v-if="!loading">
      <div v-if="movie" class="max-w-6xl mx-auto">
        <!-- Back Button -->
        <button
          @click="$router.back()"
          class="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back
        </button>

        <!-- Movie Header -->
        <div class="flex flex-col md:flex-row gap-8 mb-8">
          <!-- Thumbnail -->
          <div class="w-full md:w-1/3">
            <img
              :src="getThumbnailUrl(movie.thumbnail_path)"
              :alt="movie.title"
              class="w-full h-auto rounded-lg shadow-lg"
              @error="$event.target.src = '/placeholder.jpg'"
            />
          </div>

          <!-- Movie Info -->
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ movie.title }}</h1>
            
            <div class="flex flex-wrap gap-4 mb-6">
              <span 
                v-for="genre in movie.genres" 
                :key="genre"
                class="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
              >
                {{ genre }}
              </span>
            </div>

            <div class="flex items-center gap-6 mb-6">
              <div class="flex items-center">
                <i class="far fa-eye text-gray-500 mr-2"></i>
                <span>{{ formatNumber(movie.view_count) }} views</span>
              </div>
              <MovieVoteButton
                :movie-id="movie.id"
              />
            </div>

            <p class="text-gray-700 mb-6">{{ movie.description }}</p>

            <div class="text-sm text-gray-500">
              <p>Upload date: {{ formatDate(movie.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Video Player -->
        <div class="aspect-w-16 aspect-h-9 mb-8">
          <MoviePlayer
            :movie="movie"
            @view="handleView"
          />
        </div>
      </div>
      <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600">Movie not found</p>
      </div>
    </div>
    <div v-else class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '../stores/movie'
import MoviePlayer from '../components/movie/MoviePlayer.vue'
import MovieVoteButton from '../components/movie/MovieVoteButton.vue'

const route = useRoute()
const movieStore = useMovieStore()
const movie = ref(null)
const loading = ref(true)

const formatNumber = (num) => {
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

const getThumbnailUrl = (thumbnailPath) => {
  if (!thumbnailPath) return '/placeholder.jpg'
  return `http://localhost:8080/${thumbnailPath}`
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleView = async () => {
  if (movie.value) {
    await movieStore.incrementViewCount(movie.value.id)
  }
}

onMounted(async () => {
  try {
    const movieId = parseInt(route.params.id)
    const movieData = await movieStore.fetchMovieById(movieId)
    movie.value = {
      ...movieData,
      genres: movieData.genres ? movieData.genres.map(g => g.name) : []
    }
  } catch (error) {
    console.error('Error fetching movie:', error)
  } finally {
    loading.value = false
  }
})
</script>

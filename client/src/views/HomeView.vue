<template>
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col space-y-6">
      <!-- Header Section -->
      <header class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Movie Festival</h1>
      </header>

      <!-- Search and Filter Section -->
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1 min-w-[200px]">
          <input type="text" v-model="searchQuery"
            placeholder="Cari film berdasarkan judul, deskripsi, artis, atau genre..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
        </div>

        <select v-model="selectedGenre"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="">Semua Genre</option>
          <option v-for="genre in genres" :key="genre" :value="genre">
            {{ genre }}
          </option>
        </select>

        <select v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
          <option value="newest">Terbaru</option>
          <option value="popular">Terpopuler</option>
          <option value="mostVoted">Terbanyak Divote</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="movieStore.loading" class="flex justify-center items-center h-64">
        <p>Memuat film...</p>
      </div>

      <!-- Movies Grid -->
      <div v-else-if="filteredMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="movie in filteredMovies" :key="movie.id"
          class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-xl cursor-pointer">
          <!-- Clickable area for navigation -->
          <div @click="$router.push(`/movie/${movie.id}`)" class="cursor-pointer">
            <img :src="getThumbnailUrl(movie.thumbnail_path)" :alt="movie.title" class="w-full h-48 object-cover"
              @error="handleImageError">
            <div class="p-4">
              <h2 class="text-lg font-semibold mb-2">{{ movie.title }}</h2>
              
              <!-- Artists -->
              <p class="text-sm text-gray-600 mb-2">
                <span class="font-medium">Artists:</span> {{ formatArtists(movie.artists) }}
              </p>
              
              <!-- Duration -->
              <p class="text-sm text-gray-600 mb-2">
                <span class="font-medium">Durasi:</span> {{ movie.duration }} menit
              </p>

              <!-- Views -->
              <p class="text-sm text-gray-600 mb-2">
                <i class="fas fa-eye mr-1"></i> {{ movie.view_count || 0 }} views
              </p>

              <div class="flex flex-wrap gap-1 mb-2">
                <span 
                  v-for="genre in movie.genres" 
                  :key="genre.id"
                  class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>
          </div>
          <!-- Vote button outside clickable area -->
          <div class="px-4 pb-4">
            <div class="flex justify-end">
              <movie-vote-button v-if="authStore.isAuthenticated" :movie-id="movie.id" />
            </div>
          </div>
        </div>
      </div>

      <!-- No Results State -->
      <div v-else class="text-center py-12 bg-gray-100 rounded-lg">
        <p class="text-xl text-gray-600">
          Tidak ada film yang ditemukan
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-6">
        <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="{
          'bg-blue-500 text-white': currentPage === page,
          'bg-gray-200 text-gray-700': currentPage !== page
        }" class="px-4 py-2 rounded">
          {{ page }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMovieStore } from '../stores/movie'
import { useAuthStore } from '../stores/auth'
import MovieVoteButton from '../components/movie/MovieVoteButton.vue'

const movieStore = useMovieStore()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const selectedGenre = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)

// Fetch initial movies and genres
onMounted(async () => {
  try {
    await movieStore.fetchMovies()
    await movieStore.fetchGenres()
  } catch (error) {
    console.error('Error initializing:', error)
  }
})

// Computed properties for filtering and sorting
const filteredMovies = computed(() => {
  let movies = [...movieStore.movies]

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    movies = movies.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      (movie.description && movie.description.toLowerCase().includes(query)) ||
      (movie.artists && movie.artists.some(artist => 
        typeof artist === 'string' && artist.toLowerCase().includes(query)
      )) ||
      (movie.genres && movie.genres.some(genre => 
        genre.name.toLowerCase().includes(query)
      ))
    )
  }

  // Filter by genre
  if (selectedGenre.value) {
    movies = movies.filter(movie => 
      movie.genres && movie.genres.some(genre => 
        genre.name === selectedGenre.value
      )
    )
  }

  // Sort movies
  switch (sortBy.value) {
    case 'popular':
      movies.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      break
    case 'mostVoted':
      movies.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      break
    default: // newest
      movies.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  }

  return movies
})

// Get unique genres from movies
const genres = computed(() => {
  const genreSet = new Set()
  movieStore.movies.forEach(movie => {
    if (movie.genres) {
      movie.genres.forEach(genre => genreSet.add(genre.name))
    }
  })
  return Array.from(genreSet)
})

// Handlers
const handleSearch = () => {
  currentPage.value = 1
  movieStore.setSearchQuery(searchQuery.value)
}

const handleGenreChange = () => {
  currentPage.value = 1
  movieStore.setSelectedGenre(selectedGenre.value)
}

const handleSortChange = () => {
  currentPage.value = 1
  movieStore.setSortBy(sortBy.value)
}

// Watch for changes in filters
watch([searchQuery], () => {
  handleSearch()
})

watch([selectedGenre], () => {
  handleGenreChange()
})

watch([sortBy], () => {
  handleSortChange()
})

const getThumbnailUrl = (thumbnailPath) => {
  if (!thumbnailPath) return '/placeholder.jpg'
  return `http://localhost:8080/${thumbnailPath}`
}

const formatArtists = (artists) => {
  if (!artists) return ''
  return Array.isArray(artists) ? artists.join(', ') : artists
}

// Pagination
const totalPages = computed(() => Math.ceil(filteredMovies.value.length / 12))

const handlePageChange = (page) => {
  currentPage.value = page
  movieStore.setPage(page)
}
</script>

<style scoped>
.movie-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div>
    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <!-- Search -->
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search movies..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @input="debouncedSearch"
        >
      </div>

      <!-- Genre Filter -->
      <div class="w-48">
        <select
          v-model="selectedGenre"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="loadMovies"
        >
          <option value="">All Genres</option>
          <option
            v-for="genre in genres"
            :key="genre.id"
            :value="genre.id"
          >
            {{ genre.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Movies Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && movies.length === 0" class="text-center py-12">
      <div class="text-gray-500 text-lg">
        No movies found
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="px-3 py-1 rounded border"
          :class="currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          Previous
        </button>
        
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          class="px-3 py-1 rounded border"
          :class="currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="px-3 py-1 rounded border"
          :class="currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovieStore } from '@/stores/movie'
import { useGenreStore } from '@/stores/genre'
import MovieCard from './MovieCard.vue'
import debounce from 'lodash/debounce'

const movieStore = useMovieStore()
const genreStore = useGenreStore()

// State
const loading = ref(false)
const searchQuery = ref('')
const selectedGenre = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed
const movies = computed(() => movieStore.movies)
const totalItems = computed(() => movieStore.total)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const genres = computed(() => genreStore.genres)

const displayedPages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i)
    }
  }

  range.forEach(i => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})

// Methods
const loadMovies = async () => {
  loading.value = true
  try {
    await movieStore.fetchMovies({
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchQuery.value,
      genre: selectedGenre.value
    })
  } finally {
    loading.value = false
  }
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
  loadMovies()
}, 300)

const changePage = (page) => {
  currentPage.value = page
  loadMovies()
}

const handleDelete = async (movieId) => {
  if (confirm('Are you sure you want to delete this movie?')) {
    try {
      await movieStore.deleteMovie(movieId)
      await loadMovies()
    } catch (error) {
      console.error('Failed to delete movie:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadMovies(),
    genreStore.fetchGenres()
  ])
})
</script>

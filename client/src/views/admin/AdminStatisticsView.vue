<template>
  <div class="p-4 sm:p-6 lg:p-8 lg:ml-64 pt-16 mt-10 mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Statistik Film Festival</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Most Viewed Movies -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Film Terpopuler</h2>
        <div v-if="loading.mostViewed" class="text-center">Memuat...</div>
        <div v-else-if="mostViewedMovies.length === 0" class="text-center">
          Belum ada data
        </div>
        <ul v-else class="space-y-3">
          <li 
            v-for="(movie, index) in mostViewedMovies" 
            :key="movie.id" 
            class="flex justify-between items-center"
          >
            <span class="font-medium">
              {{ index + 1 }}. {{ movie.title }}
            </span>
            <span class="text-gray-600">
              {{ movie.view_count }} views
            </span>
          </li>
        </ul>
      </div>
      
      <!-- Most Voted Movies -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">Film Terfavorit</h2>
        <div v-if="loading.mostVoted" class="text-center">Memuat...</div>
        <div v-else-if="mostVotedMovies.length === 0" class="text-center">
          Belum ada data
        </div>
        <ul v-else class="space-y-3">
          <li 
            v-for="(movie, index) in mostVotedMovies" 
            :key="movie.id" 
            class="flex justify-between items-center"
          >
            <span class="font-medium">
              {{ index + 1 }}. {{ movie.title }}
            </span>
            <span class="text-gray-600">
              {{ movie.vote_count }} votes
            </span>
          </li>
        </ul>
      </div>
      
      <!-- Genre Popularity -->
      <div class="bg-white rounded-lg shadow-md p-6 col-span-full">
        <h2 class="text-xl font-semibold mb-4">Popularitas Genre</h2>
        <div v-if="loading.genres" class="text-center">Memuat...</div>
        <div v-else-if="genrePopularity.length === 0" class="text-center">
          Belum ada data
        </div>
        <div v-else class="grid grid-cols-3 gap-4">
          <div 
            v-for="genre in genrePopularity" 
            :key="genre.name" 
            class="bg-gray-100 p-4 rounded-lg text-center"
          >
            <h3 class="font-semibold">{{ genre.name }}</h3>
            <p class="text-gray-600">{{ genre.movie_count }} Film</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from '../../stores/movie'

const movieStore = useMovieStore()

const mostViewedMovies = ref([])
const mostVotedMovies = ref([])
const genrePopularity = ref([])

const loading = ref({
  mostViewed: true,
  mostVoted: true,
  genres: true
})

onMounted(async () => {
  try {
    // Fetch Most Viewed Movies
    loading.value.mostViewed = true
    mostViewedMovies.value = await movieStore.fetchMostViewedMovies()
    loading.value.mostViewed = false

    // Fetch Most Voted Movies
    loading.value.mostVoted = true
    mostVotedMovies.value = await movieStore.fetchMostVotedMovies()
    loading.value.mostVoted = false

    // Fetch Genre Popularity
    loading.value.genres = true
    genrePopularity.value = await movieStore.fetchGenrePopularity()
    loading.value.genres = false

  } catch (error) {
    console.error('Gagal memuat statistik:', error)
  }
})
</script>

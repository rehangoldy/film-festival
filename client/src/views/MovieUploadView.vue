<template>
  <main class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Back
        </button>
        <h1 class="text-3xl font-bold text-gray-900">Upload Movie</h1>
      </div>

      <!-- Upload Form -->
      <MovieUploadForm
        :loading="loading"
        @submit="handleSubmit"
      />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import MovieUploadForm from '@/components/movie/MovieUploadForm.vue'

const router = useRouter()
const movieStore = useMovieStore()
const loading = ref(false)

const handleSubmit = async (movieData) => {
  loading.value = true
  try {
    const movie = await movieStore.uploadMovie(movieData)
    router.push(`/movies/${movie.id}`)
  } catch (error) {
    console.error('Error uploading movie:', error)
  } finally {
    loading.value = false
  }
}
</script>

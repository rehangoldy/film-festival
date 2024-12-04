<template>
  <div class="p-4 sm:p-6 lg:p-8 lg:ml-64 pt-16 mt-10">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Edit Film</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <p>Memuat data film...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Edit Form -->
      <form v-if="!loading" @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-600">Judul Film</label>
          <input type="text" id="title" v-model="movieData.title" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 bg-gray-50" />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-600">Deskripsi</label>
          <textarea id="description" v-model="movieData.description" rows="4" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 bg-gray-50"></textarea>
        </div>

        <!-- Artists -->
        <div>
          <label for="artists" class="block text-sm font-medium text-gray-600">Artists (pisahkan dengan koma)</label>
          <input type="text" id="artists" v-model="movieData.artists" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 bg-gray-50"
            placeholder="Contoh: John Doe, Jane Smith" />
        </div>


        <!-- Duration -->
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-600">Durasi (menit)</label>
          <input type="number" id="duration" v-model="movieData.duration" required min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-600 bg-gray-50" />
        </div>

        <!-- Genres -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Genre</label>
          <div class="mt-2 space-y-2">
            <div v-for="genre in genres" :key="genre.id" class="flex items-center">
              <input type="checkbox" :id="'genre-' + genre.id" :value="genre.id" v-model="movieData.genres"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label :for="'genre-' + genre.id" class="ml-2 text-sm text-gray-600">{{ genre.name }}</label>
            </div>
          </div>
        </div>

        <!-- Thumbnail -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Thumbnail</label>
          <div class="mt-2 flex items-center space-x-4">
            <img v-if="currentThumbnail" :src="currentThumbnail" alt="Current thumbnail"
              class="h-24 w-24 object-cover rounded" />
            <div class="flex-1">
              <input type="file" id="thumbnail" @change="handleThumbnailChange" accept="image/*"
                class="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-600 hover:file:bg-gray-100" />
              <p class="mt-1 text-sm text-gray-500">Kosongkan jika tidak ingin mengubah thumbnail</p>
            </div>
          </div>
        </div>

        <!-- Video File -->
        <div>
          <label class="block text-sm font-medium text-gray-600">File Video</label>
          <div class="mt-2">
            <input type="file" id="video" @change="handleVideoChange" accept="video/*"
              class="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-600 hover:file:bg-gray-100" />
            <p class="mt-1 text-sm text-gray-500">Kosongkan jika tidak ingin mengubah video</p>
            <p v-if="currentVideo" class="mt-1 text-sm text-gray-600">
              Video saat ini: {{ currentVideo }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-3">
          <router-link to="/admin/movies"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Batal
          </router-link>
          <button type="submit" :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from '../../stores/movie'
import { useAlertStore } from '../../stores/alert'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()
const alertStore = useAlertStore()

const loading = ref(false)
const error = ref(null)
const genres = ref([])
const currentThumbnail = ref(null)
const currentVideo = ref(null)

const movieData = ref({
  title: '',
  description: '',
  duration: '',
  artists: '',
  genres: [],
  thumbnail: null,
  video: null
})

// Fetch movie data and genres on mount
onMounted(async () => {
  try {
    loading.value = true

    // Fetch genres
    const response = await axios.get('http://localhost:8080/api/genres')
    genres.value = response.data.data

    // Fetch movie data
    const movieResponse = await axios.get(`http://localhost:8080/api/movies/${route.params.id}`)
    const movie = movieResponse.data.data

    // Set movie data
    movieData.value = {
      title: movie.title,
      description: movie.description,
      artists: Array.isArray(movie.artists) ? movie.artists.join(', ') : movie.artists,
      duration: movie.duration,
      genres: movie.Genres.map(g => g.id)
    }

    // Set current thumbnail and video paths
    if (movie.thumbnail_path) {
      currentThumbnail.value = `http://localhost:8080/${movie.thumbnail_path.replace('uploads/', '')}`
    }
    if (movie.file_path) {
      currentVideo.value = movie.file_path.split('/').pop() // Just show filename
    }

  } catch (err) {
    error.value = 'Gagal memuat data film'
    console.error('Error loading movie:', err)
  } finally {
    loading.value = false
  }
})

const handleThumbnailChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    movieData.value.thumbnail = file
    currentThumbnail.value = URL.createObjectURL(file)
  }
}

const handleVideoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    movieData.value.video = file
    currentVideo.value = file.name
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('title', movieData.value.title)
    formData.append('description', movieData.value.description)
    
    const artists = movieData.value.artists.split(',').map(a => a.trim()).filter(Boolean)
    formData.append('artists', JSON.stringify(artists))
    
    formData.append('duration', movieData.value.duration)
    formData.append('genres', JSON.stringify(movieData.value.genres))

    if (movieData.value.thumbnail) {
      formData.append('thumbnail', movieData.value.thumbnail)
    }
    if (movieData.value.video) {
      formData.append('movie', movieData.value.video)
    }

    await movieStore.updateMovie(route.params.id, formData)
    alertStore.success('Film berhasil diperbarui')
    router.push('/admin/movies')
  } catch (err) {
    error.value = err.message || 'Gagal memperbarui film'
    alertStore.error('Gagal memperbarui film', err.message)
  } finally {
    loading.value = false
  }
}
</script>

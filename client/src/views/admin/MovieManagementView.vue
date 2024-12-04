<template>
  <div class="p-4 sm:p-6 lg:p-8 lg:ml-64 pt-16 mt-10 mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Manajemen Film</h1>
      <router-link 
        to="/admin/movies/create" 
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tambah Film Baru
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p>Memuat daftar film...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- Movies Table -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artists</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="movie in movies" :key="movie.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img 
                  :src="getThumbnailUrl(movie.thumbnail_path)" 
                  :alt="movie.title" 
                  class="h-10 w-10 rounded-md mr-4 object-cover"
                  @error="handleImageError"
                >
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ movie.title }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ formatArtists(movie.artists) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ movie.duration }} menit</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="genre in movie.Genres" 
                  :key="genre.id"
                  class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                >
                  {{ genre.name }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ movie.view_count }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ movie.vote_count }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <router-link 
                  :to="`/admin/movies/edit/${movie.id}`" 
                  class="text-blue-600 hover:text-blue-900"
                >
                  Edit
                </router-link>
                <button 
                  @click="deleteMovie(movie.id)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-6">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="changePage(page)"
        :class="{
          'bg-blue-500 text-white': currentPage === page,
          'bg-gray-200 text-gray-700': currentPage !== page
        }"
        class="px-4 py-2 rounded"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMovieStore } from '../../stores/movie'
import { useAlertStore } from '../../stores/alert'
import { useRouter } from 'vue-router'


const movieStore = useMovieStore()
const alertStore = useAlertStore()
const router = useRouter()

const movies = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const showDeleteConfirm = ref(false)
const movieToDelete = ref(null)

const getThumbnailUrl = (thumbnailPath) => {
  if (!thumbnailPath) return '/placeholder.jpg'
  // Log untuk debugging
  console.log('Thumbnail path:', thumbnailPath)
  return `http://localhost:8080/${thumbnailPath}`
}

const handleImageError = (e) => {
  console.log('Image error occurred')
  e.target.src = '/placeholder.jpg'
}

const formatArtists = (artists) => {
  try {
    if (!artists) return '';
    if (Array.isArray(artists)) return artists.join(', ');
    const parsedArtists = JSON.parse(artists);
    return Array.isArray(parsedArtists) ? parsedArtists.join(', ') : artists;
  } catch (e) {
    return artists || '';
  }
}

onMounted(async () => {
  await fetchMovies()
})

const fetchMovies = async () => {
  try {
    loading.value = true
    const response = await movieStore.fetchMovies(currentPage.value)
    
    // Mengakses data dari response sesuai dengan format dari ResponseUtil di server
    const { movies: movieList, totalPages: total, currentPage: page } = response.data
    movies.value = movieList || []
    totalPages.value = total || 1
    currentPage.value = page || 1
  } catch (err) {
    error.value = 'Gagal memuat daftar film'
    console.error('Error in fetchMovies:', err)
    movies.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const changePage = async (page) => {
  currentPage.value = page
  await fetchMovies()
}

const deleteMovie = async (movieId) => {
  try {
    const confirmed = window.confirm('Apakah Anda yakin ingin menghapus film ini?')
    if (confirmed) {
      await movieStore.deleteMovie(movieId)
      alertStore.success('Film berhasil dihapus')
      await fetchMovies()
    }
  } catch (err) {
    alertStore.error('Gagal menghapus film', err.message)
  }
}
</script>

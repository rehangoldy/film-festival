<template>
  <div class="p-4 sm:p-6 lg:p-8 lg:ml-64 pt-16 mt-10 mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Tambah Film Baru</h1>
        <router-link to="/admin/movies" class="text-gray-600 hover:text-gray-900">
          Kembali
        </router-link>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Judul Film</label>
          <input type="text" id="title" v-model="formData.title" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white" />
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea id="description" v-model="formData.description" rows="4" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white"></textarea>
        </div>

        <div>
          <label for="artists" class="block text-sm font-medium text-gray-700">Artis (pisahkan dengan koma)</label>
          <input type="text" id="artists" v-model="artistsInput" placeholder="Contoh: John Doe, Jane Smith"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white" />
        </div>
        <!-- Duration (in minutes) -->
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700">Durasi (menit)</label>
          <input type="number" id="duration" v-model="formData.duration" required min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white" />
        </div>

        <!-- Genres -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="genre in genres" :key="genre.id" class="flex items-center">
              <input type="checkbox" :id="'genre-' + genre.id" :value="genre.id" v-model="formData.genres"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white" />
              <label :for="'genre-' + genre.id" class="ml-2 block text-sm text-gray-900">
                {{ genre.name }}
              </label>
            </div>
          </div>
        </div>

        <!-- Thumbnail -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
          <div class="flex items-center space-x-4">
            <input type="file" accept="image/*" @change="handleThumbnailChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white" />
            <img v-if="thumbnailPreview" :src="thumbnailPreview" class="h-20 w-20 object-cover rounded" />
          </div>
        </div>

        <!-- Video File -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">File Video</label>
          <input type="file" accept="video/*" @change="handleVideoChange"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 bg-white" />
          <div v-if="formData.video" class="mt-2 text-sm text-gray-500">
            File terpilih: {{ formData.video.name }}
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button type="submit" :disabled="loading"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : 'Simpan Film' }}
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
import { useRouter } from 'vue-router'

const movieStore = useMovieStore()
const alertStore = useAlertStore()
const router = useRouter()

const loading = ref(false)
const genres = ref([])
const thumbnailPreview = ref(null)
const artistsInput = ref('')

const formData = ref({
  title: '',
  description: '',
  duration: '',
  artists: [],
  genres: [],
  thumbnail: null,
  video: null
})

onMounted(async () => {
  try {
    genres.value = await movieStore.fetchGenres()
  } catch (error) {
    alertStore.error('Gagal memuat data genre', error.message)
  }
})

const handleThumbnailChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.thumbnail = file
    const reader = new FileReader()
    reader.onload = e => {
      thumbnailPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleVideoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.video = file
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    // Convert artists string to array
    formData.value.artists = artistsInput.value.split(',').map(artist => artist.trim()).filter(artist => artist)
    await movieStore.uploadMovie(formData.value)
    alertStore.success('Film berhasil ditambahkan')
    router.push('/admin/movies')
  } catch (error) {
    alertStore.error('Gagal menambahkan film', error.message)
  } finally {
    loading.value = false
  }
}
</script>

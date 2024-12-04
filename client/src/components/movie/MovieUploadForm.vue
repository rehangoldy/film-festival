<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Title</label>
      <input
        v-model="form.title"
        type="text"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Description</label>
      <textarea
        v-model="form.description"
        rows="4"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <!-- Duration -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Duration (minutes)</label>
      <input
        v-model.number="form.duration"
        type="number"
        min="1"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
    </div>

    <!-- Artists -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Artists</label>
      <div class="mt-1 flex items-center space-x-2">
        <input
          v-model="newArtist"
          type="text"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          @keypress.enter.prevent="addArtist"
        >
        <button
          type="button"
          @click="addArtist"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="(artist, index) in form.artists"
          :key="index"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
        >
          {{ artist }}
          <button
            type="button"
            @click="removeArtist(index)"
            class="ml-2 text-blue-600 hover:text-blue-800"
          >
            &times;
          </button>
        </span>
      </div>
    </div>

    <!-- Genres -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Genres</label>
      <select
        v-model="form.genres"
        multiple
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option
          v-for="genre in genres"
          :key="genre.id"
          :value="genre.id"
        >
          {{ genre.name }}
        </option>
      </select>
    </div>

    <!-- Movie File -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Movie File</label>
      <input
        type="file"
        @change="handleMovieFileChange"
        accept="video/*"
        class="mt-1 block w-full"
        :class="{ 'opacity-50': uploading }"
        :disabled="uploading"
      >
      <div v-if="uploadProgress > 0" class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            :style="{ width: `${uploadProgress}%` }"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}% uploaded</p>
      </div>
    </div>

    <!-- Thumbnail -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Thumbnail</label>
      <input
        type="file"
        @change="handleThumbnailChange"
        accept="image/*"
        class="mt-1 block w-full"
        :class="{ 'opacity-50': uploading }"
        :disabled="uploading"
      >
      <img
        v-if="thumbnailPreview"
        :src="thumbnailPreview"
        class="mt-2 h-32 object-cover rounded"
      >
    </div>

    <!-- Watch URL -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Watch URL</label>
      <input
        v-model="form.watch_url"
        type="url"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="uploading"
        :class="{ 'opacity-50 cursor-not-allowed': uploading }"
      >
        {{ uploading ? 'Uploading...' : 'Upload Movie' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGenreStore } from '@/stores/genre'
import { useMovieStore } from '@/stores/movie'
import { useRouter } from 'vue-router'

const router = useRouter()
const genreStore = useGenreStore()
const movieStore = useMovieStore()

const genres = computed(() => genreStore.genres)

// Form state
const form = reactive({
  title: '',
  description: '',
  duration: null,
  artists: [],
  genres: [],
  watch_url: '',
  movie: null,
  thumbnail: null
})

const newArtist = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const thumbnailPreview = ref(null)

// Methods
const addArtist = () => {
  if (newArtist.value.trim()) {
    form.artists.push(newArtist.value.trim())
    newArtist.value = ''
  }
}

const removeArtist = (index) => {
  form.artists.splice(index, 1)
}

const handleMovieFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.movie = file
  }
}

const handleThumbnailChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.thumbnail = file
    const reader = new FileReader()
    reader.onload = e => {
      thumbnailPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  uploading.value = true
  uploadProgress.value = 0

  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('duration', form.duration)
    formData.append('artists', JSON.stringify(form.artists))
    formData.append('genres', JSON.stringify(form.genres))
    formData.append('watch_url', form.watch_url)
    
    if (form.movie) {
      formData.append('movie', form.movie)
    }
    if (form.thumbnail) {
      formData.append('thumbnail', form.thumbnail)
    }

    await movieStore.createMovie(formData, (progress) => {
      uploadProgress.value = Math.round(progress)
    })

    router.push({ name: 'admin-movies' })
  } catch (error) {
    console.error('Failed to upload movie:', error)
  } finally {
    uploading.value = false
  }
}

// Load genres on mount
onMounted(async () => {
  if (!genres.value.length) {
    await genreStore.fetchGenres()
  }
})
</script>

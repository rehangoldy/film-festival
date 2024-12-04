<template>
  <div class="relative">
    <!-- Video Player -->
    <video ref="videoRef" class="w-full aspect-video bg-black" autoplay @timeupdate="handleTimeUpdate"
      @ended="handleEnded" @play="handlePlay" @pause="handlePause" @loadedmetadata="handleMetadataLoaded"
      @click="togglePlay">
      <source :src="getVideoUrl" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <!-- Controls -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      :class="{ 'opacity-0 hover:opacity-100 transition-opacity duration-300': !showControls }">
      <!-- Progress Bar -->
      <div class="relative w-full h-2 bg-gray-600/50 cursor-pointer mb-4 rounded-full overflow-hidden"
        @click="handleProgressClick" @mousemove="handleProgressHover" @mouseleave="hideTimeTooltip">
        <div class="absolute top-0 left-0 h-full bg-blue-500" :style="{ width: `${(currentTime / duration) * 100}%` }">
        </div>
        <!-- Time Tooltip -->
        <div v-if="showTimeTooltip"
          class="absolute bottom-full transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded"
          :style="{ left: `${tooltipPosition}%` }">
          {{ formatTime(tooltipTime) }}
        </div>
      </div>

      <div class="flex items-center justify-between text-white">
        <!-- Left Controls -->
        <div class="flex items-center space-x-6">
          <button @click="togglePlay"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none transition-colors">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" class="text-xl"></i>
          </button>

          <!-- Volume Control -->
          <div class="flex items-center space-x-2">
            <button @click="toggleMute"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none transition-colors">
              <i :class="volumeIcon" class="text-xl"></i>
            </button>
            <input type="range" v-model="volume" min="0" max="1" step="0.1" class="w-20 accent-blue-500">
          </div>

          <!-- Time Display -->
          <div class="text-sm font-medium">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <!-- Right Controls -->
        <div class="flex items-center space-x-4">
          <!-- Playback Speed -->
          <select v-model="playbackRate"
            class="px-2 py-1 bg-white/10 rounded text-sm border-none focus:ring-0 cursor-pointer hover:bg-white/20 transition-colors"
            @change="updatePlaybackRate">
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>

          <!-- Fullscreen Toggle -->
          <button @click="toggleFullscreen"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none transition-colors">
            <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'" class="text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMovieStore } from '../../stores/movie'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

// Refs
const videoRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)
const isFullscreen = ref(false)
const showControls = ref(true)
const progress = ref(0)
const showTimeTooltip = ref(false)
const tooltipPosition = ref(0)
const tooltipTime = ref(0)
const controlsTimeout = ref(null)
const hasTrackedInitialView = ref(false)

// Stores
const movieStore = useMovieStore()

// Computed
const getVideoUrl = computed(() => {
  if (!props.movie?.file_path) return ''
  return `http://localhost:8080/${props.movie.file_path}`
})

const volumeIcon = computed(() => {
  if (isMuted.value || volume.value === 0) return 'fas fa-volume-mute'
  if (volume.value < 0.5) return 'fas fa-volume-down'
  return 'fas fa-volume-up'
})

// Methods
const updatePlaybackRate = () => {
  if (videoRef.value) {
    videoRef.value.playbackRate = parseFloat(playbackRate.value)
  }
}

const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
}

const toggleMute = () => {
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
}

const toggleFullscreen = async () => {
  if (!videoRef.value) return

  try {
    if (!document.fullscreenElement) {
      await videoRef.value.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (error) {
    console.error('Error toggling fullscreen:', error)
  }
}

const handleTimeUpdate = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;

  // Update progress tracking every 30 seconds
  if (hasTrackedInitialView.value && Math.floor(currentTime.value) % 30 === 0 && currentTime.value > 0) {
    try {
      movieStore.trackView(props.movie.id, Math.floor(currentTime.value));
    } catch (error) {
      console.error('Failed to update view progress:', error);
    }
  }
}

const handleProgressClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = x / rect.width
  const newTime = percentage * duration.value
  if (videoRef.value) {
    videoRef.value.currentTime = newTime
  }
}

const handleProgressHover = (event) => {
  const rect = event.target.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  tooltipPosition.value = pos * 100
  tooltipTime.value = pos * duration.value
  showTimeTooltip.value = true
}

const hideTimeTooltip = () => {
  showTimeTooltip.value = false
}

const handleMetadataLoaded = () => {
  duration.value = videoRef.value.duration
}

const handlePlay = () => {
  isPlaying.value = true;
  if (!hasTrackedInitialView.value) {
    trackViewership();
  }
}

const handlePause = () => {
  isPlaying.value = false
}

const handleEnded = () => {
  isPlaying.value = false
  trackViewership()
}

const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  if (hrs > 0) parts.push(String(hrs).padStart(2, '0'))
  parts.push(String(mins).padStart(2, '0'))
  parts.push(String(secs).padStart(2, '0'))

  return parts.join(':')
}

const trackViewership = async () => {
  if (!props.movie?.id) return;

  try {
    await movieStore.trackView(props.movie.id, Math.floor(currentTime.value));
    hasTrackedInitialView.value = true;
  } catch (error) {
    console.error('Failed to track viewership:', error);
  }
}

const hideControlsAfterDelay = () => {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
  controlsTimeout.value = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

// Watchers
watch(volume, (newValue) => {
  if (videoRef.value) {
    videoRef.value.volume = newValue
  }
})

watch(playbackRate, (newValue) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = newValue
  }
})

// Mouse move event listener
const handleMouseMove = () => {
  showControls.value = true
  hideControlsAfterDelay()
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
  }
})
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #fff;
  margin-top: -4px;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
}

input[type="range"]:focus {
  outline: none;
}
</style>

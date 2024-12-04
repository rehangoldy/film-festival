<template>
  <button 
    @click="toggleVote" 
    :class="[
      'vote-button',
      'flex items-center gap-2',
      'px-4 py-2 rounded-full',
      'transition-all duration-300 ease-in-out',
      isVoted ? 'voted bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
      !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ]" 
    :disabled="!isAuthenticated"
  >
    <i :class="[
      'fas',
      'transition-transform duration-300',
      isVoted ? 'fa-heart scale-110' : 'fa-heart-circle-plus'
    ]"></i>
    <span class="transition-all duration-300">{{ isVoted ? 'Unvote' : 'Vote' }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useMovieStore } from '../../stores/movie'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  movieId: {
    type: Number,
    required: true
  }
})

const movieStore = useMovieStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isVoted = computed(() => movieStore.isMovieVoted(props.movieId))

const toggleVote = async () => {
  if (!isAuthenticated.value) return
  
  try {
    await movieStore.voteMovie(props.movieId)
  } catch (error) {
    console.error('Failed to toggle vote:', error)
  }
}
</script>

<style scoped>
.vote-button {
  color: white;
  font-weight: 500;
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vote-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.vote-button:active {
  transform: scale(0.95);
}

.voted i {
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>

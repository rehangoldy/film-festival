// Movie Genres
export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western'
]

// Sort Options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'mostVoted', label: 'Most Voted' }
]

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  MAX_PAGES_SHOWN: 5
}

// File Upload
export const UPLOAD = {
  MAX_VIDEO_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  MAX_IMAGE_SIZE: 50 * 1024 * 1024,   // 50MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
}

// Video Player
export const PLAYER = {
  PLAYBACK_RATES: [0.5, 1, 1.25, 1.5, 2],
  DEFAULT_VOLUME: 0.7,
  SEEK_TIME: 10 // seconds
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  MOVIE_DETAIL: '/movies/:id',
  MOVIE_UPLOAD: '/upload',
  ADMIN_DASHBOARD: '/admin'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme_preference',
  PLAYER_SETTINGS: 'player_settings'
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  MOVIES: {
    LIST: '/movies',
    DETAIL: '/movies/:id',
    UPLOAD: '/movies',
    VOTE: '/movies/:id/vote',
    VIEW: '/movies/:id/view'
  }
}

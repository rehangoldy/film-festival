import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: false } // Allow public access to home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/movies',
    name: 'Movies',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: false } // Allow public access to movies
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('../views/MovieDetailView.vue'),
    meta: { requiresAuth: false } // Allow public access to movie details
  },
  {
    path: '/voted-movies',
    name: 'VotedMovies',
    component: () => import('../views/UserVotedMoviesView.vue'),
    meta: { requiresAuth: true } // Require auth for voting
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'Admin',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    component: () => import('../views/admin/AdminStatisticsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/movies',
    name: 'adminMovies',
    component: () => import('../views/admin/MovieManagementView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/movies/create',
    name: 'createMovie',
    component: () => import('../views/admin/CreateMovieView.vue'),
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin/movies/edit/:id',
    name: 'EditMovie',
    component: () => import('../views/admin/EditMovieView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('../views/UnauthorizedView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  console.log('Navigation Guard:', {
    to: to.path,
    isAuthenticated: authStore.isAuthenticated,
    isInitialized: authStore.isInitialized
  })

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (!authStore.isInitialized) {
    try {
      await authStore.checkAuth()
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  if (requiresGuest && authStore.isAuthenticated) {
    next({ path: '/' })
    return
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Handle admin routes
  if (requiresAdmin && !authStore.isAdmin) {
    next({ path: '/unauthorized' })
    return
  }

  next()
})

export default router

import { defineStore } from 'pinia'
import axios from 'axios'

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [],
    loading: false,
    error: null,
    totalMovies: 0,
    currentPage: 1,
    itemsPerPage: 12,
    searchQuery: '',
    selectedGenre: null,
    sortBy: 'newest',
    votedMovies: [],
    viewedMovies: new Set(), // Track movies that have been viewed in current session
    votedMovieIds: new Set() // Track voted movie IDs
  }),

  getters: {
    getMovieById: (state) => (id) => {
      return state.movies.find(movie => movie.id === id)
    },
    
    filteredMovies: (state) => {
      let filtered = [...state.movies]
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(movie => 
          movie.title.toLowerCase().includes(query) ||
          movie.description.toLowerCase().includes(query)
        )
      }
      
      if (state.selectedGenre) {
        filtered = filtered.filter(movie => 
          movie.genres.includes(state.selectedGenre)
        )
      }
      
      switch(state.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'popular':
          filtered.sort((a, b) => b.view_count - a.view_count)
          break
        case 'mostVoted':
          filtered.sort((a, b) => b.vote_count - a.vote_count)
          break
      }
      
      return filtered
    },
    
    paginatedMovies: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      return state.filteredMovies.slice(start, end)
    },
    
    totalPages: (state) => {
      return Math.ceil(state.filteredMovies.length / state.itemsPerPage)
    },
    
    isMovieVoted: (state) => (movieId) => {
      return state.votedMovieIds.has(movieId)
    }
  },

  actions: {
    async fetchMovies(page = 1) {
      this.loading = true
      try {
        const response = await axios.get(`http://localhost:8080/api/movies?page=${page}`)
        
        // Pastikan response memiliki format yang benar
        if (!response.data || !response.data.data) {
          throw new Error('Invalid response format from server')
        }

        const { movies, totalPages, currentPage } = response.data.data
        
        this.movies = movies || []
        this.totalMovies = totalPages || 1
        this.currentPage = currentPage || 1
        this.error = null

        // Return full response untuk digunakan di komponen
        return response.data
      } catch (error) {
        console.error('Error fetching movies:', error)
        this.error = error.message || 'Failed to fetch movies'
        this.movies = []
        this.totalMovies = 0
        throw error
      } finally {
        this.loading = false
      }
    },

    async uploadMovie(movieData) {
      this.loading = true
      try {
        const formData = new FormData()
        
        // Add basic movie data
        formData.append('title', movieData.title)
        formData.append('description', movieData.description || '')
        formData.append('duration', movieData.duration)
        
        // Handle artists array
        const artists = Array.isArray(movieData.artists) ? movieData.artists : []
        formData.append('artists', JSON.stringify(artists))
        
        // Add thumbnail if exists
        if (movieData.thumbnail) {
          formData.append('thumbnail', movieData.thumbnail)
        }
        
        // Add video file if exists
        if (movieData.video) {
          formData.append('movie', movieData.video)
        }
        
        // Ensure genres is always an array before stringifying
        const genres = Array.isArray(movieData.genres) ? movieData.genres : []
        formData.append('genres', JSON.stringify(genres))

        const response = await axios.post('http://localhost:8080/api/movies', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.data && response.data.data) {
          this.movies.unshift(response.data.data)
          this.error = null
          return response.data.data
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Error uploading movie:', error.response?.data || error.message)
        this.error = error.response?.data?.message || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateMovie(id, movieData) {
      this.loading = true
      try {
        const formData = new FormData()
        
        // Add basic movie data
        formData.append('title', movieData.get('title'))
        formData.append('description', movieData.get('description'))
        formData.append('duration', movieData.get('duration'))
        formData.append('artists', movieData.get('artists'))
        
        // Add thumbnail if exists
        const thumbnail = movieData.get('thumbnail')
        if (thumbnail instanceof File) {
          formData.append('thumbnail', thumbnail)
        }
        
        // Add video file if exists
        const video = movieData.get('movie')
        if (video instanceof File) {
          formData.append('movie', video)
        }
        
        // Add genres
        const genres = movieData.get('genres')
        if (genres) {
          formData.append('genres', genres)
        }

        const response = await axios.put(`http://localhost:8080/api/movies/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Update local state
        const updatedMovie = response.data.data
        const index = this.movies.findIndex(movie => movie.id === id)
        if (index !== -1) {
          this.movies[index] = updatedMovie
        }
        
        this.error = null
        return updatedMovie
      } catch (error) {
        this.error = error.message
        console.error('Error updating movie:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteMovie(id) {
      try {
        await axios.delete(`http://localhost:8080/api/movies/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Remove movie from state
        const index = this.movies.findIndex(movie => movie.id === id);
        if (index !== -1) {
          this.movies.splice(index, 1);
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
      }
    },

    async fetchGenres() {
      try {
        const response = await axios.get('http://localhost:8080/api/genres')
        
        if (response.data && response.data.data) {
          return response.data.data
        }
        throw new Error('Invalid response format from server')
      } catch (error) {
        console.error('Error fetching genres:', error)
        throw error
      }
    },

    async voteMovie(movieId) {
      try {
        const response = await axios.post(`http://localhost:8080/api/movies/${movieId}/vote`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data?.data) {
          const { movie, vote_status } = response.data.data;
          
          // Update movie in movies list if it exists
          const index = this.movies.findIndex(m => m.id === movieId);
          if (index !== -1) {
            this.movies[index] = movie;
          }
          
          // Update voted status
          if (vote_status) {
            this.votedMovieIds.add(movieId);
          } else {
            this.votedMovieIds.delete(movieId);
          }

          return { movie, vote_status };
        }
      } catch (error) {
        console.error('Error voting movie:', error);
        throw error;
      }
    },

    async unvoteMovie(movieId) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/movies/${movieId}/vote`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data && response.data.data && response.data.data.movie) {
          // Update movie in movies list if it exists
          const index = this.movies.findIndex(m => m.id === movieId);
          if (index !== -1) {
            this.movies[index] = response.data.data.movie;
          }
          
          // Remove from voted movies
          this.votedMovieIds.delete(movieId);
        }
      } catch (error) {
        console.error('Error unvoting movie:', error);
        throw error;
      }
    },

    async incrementViewCount(id) {
      try {
        const response = await axios.post(`/api/movies/${id}/view`)
        const index = this.movies.findIndex(movie => movie.id === id)
        if (index !== -1) {
          this.movies[index] = {
            ...this.movies[index],
            view_count: response.data.view_count
          }
        }
        return response.data
      } catch (error) {
        console.error('Error incrementing view count:', error)
        throw error
      }
    },

    async fetchMovieById(id) {
      this.loading = true;
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/${id}`);
        if (!response.data || !response.data.data) {
          throw new Error('Invalid response format from server');
        }
        return response.data.data;
      } catch (error) {
        console.error('Error fetching movie:', error);
        this.error = error.message || 'Failed to fetch movie';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async trackView(movieId, duration) {
      // Check if movie has already been viewed in this session
      if (this.viewedMovies.has(movieId)) {
        return;
      }

      try {
        await axios.post(`http://localhost:8080/api/movies/${movieId}/view`, {
          duration_watched: duration,
          last_position: duration
        });
        
        // Mark movie as viewed in this session
        this.viewedMovies.add(movieId);
        
        // Update view count in local state if movie exists
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
          movie.view_count = (movie.view_count || 0) + 1;
        }
      } catch (error) {
        console.error('Error tracking view:', error);
        throw error;
      }
    },

    setPage(page) {
      this.currentPage = page
    },

    setSearchQuery(query) {
      this.searchQuery = query
      this.currentPage = 1
    },

    setSelectedGenre(genre) {
      this.selectedGenre = genre
      this.currentPage = 1
    },

    setSortBy(sortOption) {
      this.sortBy = sortOption
      this.currentPage = 1
    },

    async fetchVotedMovies() {
      try {
        const response = await axios.get('http://localhost:8080/api/movies/voted', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data?.data) {
          const votedMovies = response.data.data;
          // Update votedMovieIds Set
          this.votedMovieIds = new Set(votedMovies.map(movie => movie.id));
          return votedMovies;
        }
        return [];
      } catch (error) {
        console.error('Error fetching voted movies:', error?.response?.data || error.message);
        this.votedMovieIds = new Set(); // Reset pada kasus error
        return [];
      }
    },

    async fetchMostViewedMovies() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/movies/most-viewed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Most viewed movies response:', response.data)
        if (response.data?.status === 'success' && response.data?.data?.data) {
          return response.data.data.data
        }
        return []
      } catch (error) {
        console.error('Error fetching most viewed movies:', error?.response?.data || error.message)
        return []
      }
    },

    async fetchMostVotedMovies() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/movies/most-voted', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Most voted movies response:', response.data)
        if (response.data?.status === 'success' && response.data?.data?.data) {
          return response.data.data.data
        }
        return []
      } catch (error) {
        console.error('Error fetching most voted movies:', error?.response?.data || error.message)
        return []
      }
    },

    async fetchGenrePopularity() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8080/api/movies/genres/popularity', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.data && response.data.data) {
          return response.data.data
        }
        return []
      } catch (error) {
        console.error('Error fetching genre popularity:', error)
        return []
      }
    }
  }
})

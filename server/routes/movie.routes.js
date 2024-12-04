const express = require('express');
const router = express.Router();
const { Movie, Genre, MovieViewership, MovieVote, User } = require('../models');
const auth = require('../middleware/auth.jwt');
const { uploadMovie } = require('../middleware/upload.middleware');
const { Op } = require('sequelize');
const ResponseUtil = require('../utils/response.util'); 
const path = require('path'); 
const fs = require('fs'); 
const sequelize = require('../config/database'); 

// Statistics endpoints
// Get most viewed movies
router.get('/most-viewed', auth.verifyToken, async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: {
        status: 'active'
      },
      attributes: [
        'id', 
        'title',
        'thumbnail_path',
        'view_count'
      ],
      order: [['view_count', 'DESC']],
      limit: 5,
      raw: true
    });

    return ResponseUtil.success(res, {
      data: movies
    });
  } catch (error) {
    return ResponseUtil.error(res, error.message);
  }
});

// Get most voted movies 
router.get('/most-voted', auth.verifyToken, async (req, res) => {
  try {
    const movies = await Movie.findAll({
      where: {
        status: 'active'
      },
      attributes: [
        'id',
        'title', 
        'thumbnail_path',
        'vote_count'
      ],
      order: [['vote_count', 'DESC']],
      limit: 5,
      raw: true
    });

    return ResponseUtil.success(res, {
      data: movies
    });
  } catch (error) {
    return ResponseUtil.error(res, error.message);
  }
});

// Get genre popularity
router.get('/genres/popularity', auth.verifyToken, async (req, res) => {
  try {
    const genres = await Genre.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('Movies.id')), 'movie_count']
      ],
      include: [{
        model: Movie,
        as: 'Movies',
        attributes: [],
        through: { attributes: [] },
        where: {
          status: 'active'
        },
        required: false
      }],
      group: ['id', 'name'],
      order: [[sequelize.fn('COUNT', sequelize.col('Movies.id')), 'DESC']]
    });
    
    return ResponseUtil.success(res, {
      data: genres
    });
  } catch (error) {
    return ResponseUtil.error(res, error.message);
  }
});

// Get movie statistics (Admin only)
router.get('/stats/overview', auth.verifyToken, auth.isAdmin, async (req, res) => {
  try {
    const mostViewed = await Movie.findAll({
      order: [['view_count', 'DESC']],
      limit: 10,
      include: [Genre]
    });

    const mostVoted = await Movie.findAll({
      order: [['vote_count', 'DESC']],
      limit: 10,
      include: [Genre]
    });

    const popularGenres = await Genre.findAll({
      include: [{
        model: Movie,
        attributes: ['view_count', 'vote_count']
      }],
      order: [[Movie, 'view_count', 'DESC']]
    });

    return ResponseUtil.success(res, {
      mostViewed,
      mostVoted,
      popularGenres
    });
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to fetch movie statistics');
  }
});

// Get dashboard statistics (Admin only)
router.get('/dashboard/stats', auth.verifyToken, auth.isAdmin, async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.count();
    console.log('Total users:', totalUsers);

    // Get total movies (active and inactive)
    const totalMovies = await Movie.count();
    console.log('Total movies:', totalMovies);

    // Get active events (movies in last 30 days)
    const activeEvents = await Movie.count({
      where: {
        created_at: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // 30 hari terakhir
        }
      }
    });
    console.log('Active events:', activeEvents);

    return ResponseUtil.success(res, {
      data: {
        totalUsers,
        totalMovies,
        activeEvents
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return ResponseUtil.error(res, 'Failed to fetch dashboard statistics');
  }
});

// Create movie (Admin only)
router.post('/', auth.verifyToken, auth.isAdmin, uploadMovie, async (req, res) => {
  try {
    let artists = [];
    if (req.body.artists) {
      try {
        const parsedArtists = JSON.parse(req.body.artists);
        artists = Array.isArray(parsedArtists) ? parsedArtists : [parsedArtists];
      } catch (e) {
        artists = [req.body.artists];
      }
    }

    const movieData = {
      title: req.body.title,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      artists: artists,
      file_path: req.uploadedFiles?.movie || null,
      thumbnail_path: req.uploadedFiles?.thumbnail || null,
      watch_url: req.uploadedFiles?.movie ? `/api/movies/watch/${path.basename(req.uploadedFiles.movie)}` : null,
      status: 'active',
      view_count: 0
    };

    const movie = await Movie.create(movieData);

    // Handle genres
    if (req.body.genres) {
      const genres = JSON.parse(req.body.genres);
      await movie.setGenres(genres);
    }

    const movieWithGenres = await Movie.findByPk(movie.id, {
      include: [{ model: Genre }]
    });

    return ResponseUtil.success(res, { movie: movieWithGenres }, 'Movie created successfully', 201);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return ResponseUtil.validationError(res, error.errors);
    }
    return ResponseUtil.error(res, 'Failed to create movie');
  }
});

// Update movie (Admin only)
router.put('/:id', auth.verifyToken, auth.isAdmin, uploadMovie, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return ResponseUtil.notFound(res, 'Movie not found');
    }

    // Parse artists
    let artists = [];
    if (req.body.artists) {
      try {
        const parsedArtists = JSON.parse(req.body.artists);
        artists = Array.isArray(parsedArtists) ? parsedArtists : [parsedArtists];
      } catch (e) {
        artists = [req.body.artists];
      }
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      duration: parseInt(req.body.duration),
      artists: artists
    };

    // Handle thumbnail update
    if (req.files?.thumbnail) {
      // Delete old thumbnail if exists
      if (movie.thumbnail_path) {
        try {
          fs.unlinkSync(path.join(__dirname, '..', movie.thumbnail_path));
        } catch (err) {
          console.error('Error deleting old thumbnail:', err);
        }
      }
      updateData.thumbnail_path = req.uploadedFiles?.thumbnail || req.files.thumbnail[0].path;
    }

    // Handle video update
    if (req.files?.movie) {
      // Delete old video if exists
      if (movie.file_path) {
        try {
          fs.unlinkSync(path.join(__dirname, '..', movie.file_path));
        } catch (err) {
          console.error('Error deleting old video:', err);
        }
      }
      updateData.file_path = req.uploadedFiles?.movie || req.files.movie[0].path;
      updateData.watch_url = `/api/movies/watch/${path.basename(updateData.file_path)}`;
    }

    // Update movie in database
    await movie.update(updateData);

    // Update genres if provided
    if (req.body.genres) {
      const genres = JSON.parse(req.body.genres);
      await movie.setGenres(genres);
    }

    // Fetch updated movie with associations
    const updatedMovie = await Movie.findByPk(movie.id, {
      include: [{ model: Genre }]
    });

    return ResponseUtil.success(res, updatedMovie, 'Movie updated successfully');
  } catch (error) {
    return ResponseUtil.error(res, error.message || 'Failed to update movie');
  }
});

// Get all movies with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: movies } = await Movie.findAndCountAll({
      attributes: [
        'id',
        'title',
        'description',
        'artists',
        'duration',
        'thumbnail_path',
        'file_path',
        'view_count',
        'vote_count',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: Genre,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    return ResponseUtil.success(res, {
      movies,
      currentPage: page,
      totalPages,
      totalItems: count
    });
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to fetch movies');
  }
});

// Get user's voted movies
router.get('/voted', auth.verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all movie votes for the user
    const votes = await MovieVote.findAll({
      where: {
        user_id: userId,
        vote_status: true
      },
      raw: true
    });

    if (!votes || votes.length === 0) {
      return ResponseUtil.success(res, []);
    }

    // Extract and validate movie IDs
    const movieIds = votes
      .map(vote => vote.movie_id)
      .filter(id => typeof id === 'number' && !isNaN(id));

    if (movieIds.length === 0) {
      return ResponseUtil.success(res, []);
    }

    // Fetch movies with these IDs
    const votedMovies = await Movie.findAll({
      where: {
        id: movieIds
      },
      include: [{
        model: Genre,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }],
      order: [['created_at', 'DESC']]
    });

    return ResponseUtil.success(res, votedMovies);
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to fetch voted movies');
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    
    if (isNaN(movieId)) {
      return ResponseUtil.error(res, 'Invalid movie ID', 400);
    }

    const movie = await Movie.findByPk(movieId, {
      include: [
        {
          model: Genre,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    if (!movie) {
      return ResponseUtil.notFound(res, 'Movie not found');
    }

    return ResponseUtil.success(res, movie);
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to fetch movie');
  }
});

// Track movie view
router.post('/:id/view', auth.verifyToken, async (req, res) => {
  try {
    const { duration = 0, position = 0 } = req.body;
    const [viewership] = await MovieViewership.findOrCreate({
      where: {
        MovieId: req.params.id,
        UserId: req.user.id
      }
    });

    await viewership.update({
      duration_watched: duration,
      last_position: position,
      last_watched_at: new Date()
    });

    // Increment view count if this is first view
    await Movie.increment('view_count', {
      where: { id: req.params.id }
    });

    return ResponseUtil.success(res, viewership);
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to track movie view');
  }
});

// Vote a movie
router.post('/:id/vote', auth.verifyToken, async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return ResponseUtil.notFound(res, 'Movie not found');
    }

    // Find or create vote
    const [vote, created] = await MovieVote.findOrCreate({
      where: {
        movie_id: movieId,
        user_id: userId
      },
      defaults: {
        vote_status: true
      }
    });

    if (!created) {
      // Toggle existing vote
      const newVoteStatus = !vote.vote_status;
      await vote.update({ vote_status: newVoteStatus });
      
      // Update movie vote count
      if (newVoteStatus) {
        await movie.increment('vote_count');
      } else {
        await movie.decrement('vote_count');
      }
    } else {
      // New vote, increment count
      await movie.increment('vote_count');
    }

    await movie.reload();

    // Get updated movie with genres
    const updatedMovie = await Movie.findByPk(movieId, {
      include: [
        {
          model: Genre,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    return ResponseUtil.success(res, { 
      movie: updatedMovie,
      vote_status: created || vote.vote_status 
    }, 'Vote updated successfully');
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to vote movie');
  }
});

// Unvote a movie
router.delete('/:id/vote', auth.verifyToken, async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return ResponseUtil.notFound(res, 'Movie not found');
    }

    // Check if vote exists
    const vote = await MovieVote.findOne({
      where: {
        movie_id: movieId,
        user_id: userId,
        vote_status: true
      }
    });

    if (!vote) {
      return ResponseUtil.error(res, 'You have not voted for this movie', 400);
    }

    // Update vote status instead of deleting
    await vote.update({ vote_status: false });

    // Decrement vote count
    await movie.decrement('vote_count');
    await movie.reload();

    // Get updated movie with genres
    const updatedMovie = await Movie.findByPk(movieId, {
      include: [
        {
          model: Genre,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    return ResponseUtil.success(res, { movie: updatedMovie }, 'Vote removed successfully');
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to remove vote');
  }
});

// Delete movie (Admin only)
router.delete('/:id', auth.verifyToken, auth.isAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return ResponseUtil.notFound(res, 'Movie not found');
    }

    // Delete associated files
    if (movie.thumbnail_path) {
      try {
        fs.unlinkSync(path.join(__dirname, '..', movie.thumbnail_path));
      } catch (err) {
        console.error('Error deleting thumbnail:', err);
      }
    }
    if (movie.file_path) {
      try {
        fs.unlinkSync(path.join(__dirname, '..', movie.file_path));
      } catch (err) {
        console.error('Error deleting video file:', err);
      }
    }

    // Delete the movie
    await movie.destroy();

    // Reset auto-increment to the next available ID
    const [results] = await sequelize.query(
      `SELECT MAX(id) as maxId FROM Movies`
    );
    const maxId = results[0].maxId || 0;
    await sequelize.query(
      `ALTER TABLE Movies AUTO_INCREMENT = ${maxId + 1}`
    );

    return ResponseUtil.success(res, null, 'Movie deleted successfully');
  } catch (error) {
    return ResponseUtil.error(res, 'Failed to delete movie');
  }
});

module.exports = router;

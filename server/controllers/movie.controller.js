const { Movie, Genre, User, MovieVote, MovieViewership, sequelize } = require('../models');
const ResponseUtil = require('../utils/response.util');
const ValidatorUtil = require('../utils/validator.util');
const { Op } = require('sequelize');

class MovieController {
  static async create(req, res) {
    try {
      const validation = ValidatorUtil.validateMovie(req.body);
      if (!validation.isValid) {
        return ResponseUtil.validationError(res, validation.errors);
      }

      const { genres, ...movieData } = req.body;
      const movie = await sequelize.transaction(async (t) => {
        const newMovie = await Movie.create(movieData, { transaction: t });

        if (genres && genres.length > 0) {
          const genreInstances = await Promise.all(
            genres.map(name => Genre.findOrCreate({
              where: { name },
              transaction: t
            }).then(([genre]) => genre))
          );
          await newMovie.setGenres(genreInstances, { transaction: t });
        }

        return newMovie;
      });

      const movieWithGenres = await Movie.findByPk(movie.id, {
        include: [{ model: Genre }]
      });

      return ResponseUtil.success(res, { movie: movieWithGenres }, 'Movie created successfully', 201);
    } catch (error) {
      console.error('Create movie error:', error);
      return ResponseUtil.error(res, 'Failed to create movie');
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const validation = ValidatorUtil.validateMovie(req.body);
      if (!validation.isValid) {
        return ResponseUtil.validationError(res, validation.errors);
      }

      const movie = await Movie.findByPk(id);
      if (!movie) {
        return ResponseUtil.notFound(res, 'Movie not found');
      }

      const { genres, ...movieData } = req.body;
      await sequelize.transaction(async (t) => {
        await movie.update(movieData, { transaction: t });

        if (genres && genres.length > 0) {
          const genreInstances = await Promise.all(
            genres.map(name => Genre.findOrCreate({
              where: { name },
              transaction: t
            }).then(([genre]) => genre))
          );
          await movie.setGenres(genreInstances, { transaction: t });
        }
      });

      const updatedMovie = await Movie.findByPk(id, {
        include: [{ model: Genre }]
      });

      return ResponseUtil.success(res, { movie: updatedMovie }, 'Movie updated successfully');
    } catch (error) {
      console.error('Update movie error:', error);
      return ResponseUtil.error(res, 'Failed to update movie');
    }
  }

  static async list(req, res) {
    try {
      const { page = 1, limit = 10, search, genre } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { artists: { [Op.like]: `%${search}%` } }
        ];
      }

      const include = [{ model: Genre }];
      if (genre) {
        include[0].where = { name: genre };
      }

      const { count, rows: movies } = await Movie.findAndCountAll({
        where,
        include,
        limit: parseInt(limit),
        offset,
        distinct: true,
        order: [['created_at', 'DESC']]
      });

      return ResponseUtil.success(res, {
        movies,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      console.error('List movies error:', error);
      return ResponseUtil.error(res, 'Failed to list movies');
    }
  }

  static async vote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const movie = await Movie.findByPk(id);
      if (!movie) {
        return ResponseUtil.notFound(res, 'Movie not found');
      }

      const [vote, created] = await MovieVote.findOrCreate({
        where: { user_id: userId, movie_id: id },
        defaults: { vote_status: true }
      });

      if (!created) {
        await vote.update({ vote_status: !vote.vote_status });
      }

      return ResponseUtil.success(
        res, 
        { voted: vote.vote_status },
        `Movie ${vote.vote_status ? 'voted' : 'unvoted'} successfully`
      );
    } catch (error) {
      console.error('Vote movie error:', error);
      return ResponseUtil.error(res, 'Failed to vote movie');
    }
  }

  static async trackView(req, res) {
    try {
      const { id } = req.params;
      const { duration } = req.body;
      const userId = req.user?.id;

      const movie = await Movie.findByPk(id);
      if (!movie) {
        return ResponseUtil.notFound(res, 'Movie not found');
      }

      await movie.increment('view_count');

      if (userId && duration) {
        await MovieViewership.create({
          user_id: userId,
          movie_id: id,
          view_duration: duration
        });
      }

      return ResponseUtil.success(res, null, 'View tracked successfully');
    } catch (error) {
      console.error('Track view error:', error);
      return ResponseUtil.error(res, 'Failed to track view');
    }
  }

  static async getStats(req, res) {
    try {
      const mostViewed = await Movie.findAll({
        order: [['view_count', 'DESC']],
        limit: 10,
        include: [{ model: Genre }]
      });

      const mostVoted = await Movie.findAll({
        include: [
          { model: Genre },
          { 
            model: User,
            through: {
              where: { vote_status: true }
            },
            attributes: []
          }
        ],
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT COUNT(*)
                FROM movie_votes
                WHERE movie_votes.movie_id = Movie.id
                AND movie_votes.vote_status = true
              )`),
              'vote_count'
            ]
          ]
        },
        order: [[sequelize.literal('vote_count'), 'DESC']],
        limit: 10
      });

      const popularGenres = await Genre.findAll({
        include: [{
          model: Movie,
          attributes: []
        }],
        attributes: {
          include: [
            [sequelize.fn('COUNT', sequelize.col('Movies.id')), 'movie_count'],
            [
              sequelize.literal(`(
                SELECT SUM(m.view_count)
                FROM movies m
                INNER JOIN movie_genres mg ON mg.movie_id = m.id
                WHERE mg.genre_id = Genre.id
              )`),
              'total_views'
            ]
          ]
        },
        group: ['Genre.id'],
        order: [[sequelize.literal('total_views'), 'DESC']],
        limit: 5
      });

      return ResponseUtil.success(res, {
        mostViewed,
        mostVoted,
        popularGenres
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return ResponseUtil.error(res, 'Failed to get statistics');
    }
  }
}

module.exports = MovieController;

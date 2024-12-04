const sequelize = require('../config/database');
const User = require('./User');
const Movie = require('./Movie');
const Genre = require('./Genre');
const MovieVote = require('./MovieVote');
const MovieViewership = require('./MovieViewership');

// Define associations here if needed
Movie.belongsToMany(Genre, { 
  through: 'movie_genres',
  foreignKey: 'movie_id',
  otherKey: 'genre_id'
});
Genre.belongsToMany(Movie, { 
  through: 'movie_genres',
  foreignKey: 'genre_id',
  otherKey: 'movie_id'
});

// Movie votes associations
Movie.hasMany(MovieVote, { foreignKey: 'movie_id' });
MovieVote.belongsTo(Movie, { foreignKey: 'movie_id' });
User.hasMany(MovieVote, { foreignKey: 'user_id' });
MovieVote.belongsTo(User, { foreignKey: 'user_id' });

// Movie viewership associations
Movie.belongsToMany(User, { through: MovieViewership });
User.belongsToMany(Movie, { through: MovieViewership });

module.exports = {
  sequelize,
  User,
  Movie,
  Genre,
  MovieVote,
  MovieViewership
};

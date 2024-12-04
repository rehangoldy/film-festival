const { Genre } = require('../models');

async function seedGenres() {
  const genres = [
    { name: 'Action' },
    { name: 'Adventure' },
    { name: 'Animation' },
    { name: 'Comedy' },
    { name: 'Crime' },
    { name: 'Documentary' },
    { name: 'Drama' },
    { name: 'Family' },
    { name: 'Fantasy' },
    { name: 'Horror' },
    { name: 'Mystery' },
    { name: 'Romance' },
    { name: 'Sci-Fi' },
    { name: 'Thriller' },
    { name: 'War' }
  ];

  try {
    for (const genre of genres) {
      await Genre.findOrCreate({
        where: { name: genre.name },
        defaults: genre
      });
    }
    console.log('Genres seeded successfully');
  } catch (error) {
    console.error('Error seeding genres:', error);
  }
}

module.exports = seedGenres;

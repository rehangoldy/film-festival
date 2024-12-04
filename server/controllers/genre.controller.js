const db = require('../models');
const Genre = db.Genre;

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    res.json({
      status: 'success',
      data: genres
    });
  } catch (error) {
    console.error('Error getting genres:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get genres',
      error: error.message
    });
  }
};

exports.createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Genre name is required'
      });
    }

    const genre = await Genre.create({ name });

    res.status(201).json({
      status: 'success',
      data: genre
    });
  } catch (error) {
    console.error('Error creating genre:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create genre',
      error: error.message
    });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Genre name is required'
      });
    }

    const genre = await Genre.findByPk(id);
    
    if (!genre) {
      return res.status(404).json({
        status: 'error',
        message: 'Genre not found'
      });
    }

    await genre.update({ name });

    res.json({
      status: 'success',
      data: genre
    });
  } catch (error) {
    console.error('Error updating genre:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update genre',
      error: error.message
    });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const genre = await Genre.findByPk(id);
    
    if (!genre) {
      return res.status(404).json({
        status: 'error',
        message: 'Genre not found'
      });
    }

    await genre.destroy();

    res.json({
      status: 'success',
      message: 'Genre deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting genre:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete genre',
      error: error.message
    });
  }
};

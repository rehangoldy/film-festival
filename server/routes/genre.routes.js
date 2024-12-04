const express = require('express');
const { authJwt } = require('../middleware');
const genreController = require('../controllers/genre.controller');

const router = express.Router();

// Public routes
router.get('/', genreController.getAllGenres);

// Admin only routes
router.use(authJwt.verifyToken, authJwt.isAdmin);
router.post('/', genreController.createGenre);
router.put('/:id', genreController.updateGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;

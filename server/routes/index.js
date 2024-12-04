const express = require('express');
const authRoutes = require('./auth.routes');
const movieRoutes = require('./movie.routes');
const genreRoutes = require('./genre.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/genres', genreRoutes);

module.exports = router;

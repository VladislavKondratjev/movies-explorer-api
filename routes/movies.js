const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,

} = require('../controllers/movies');
const {
  authValidation,
  checkIdValidation,
  createMovieValidation,
} = require('../middlwares/validations');

router.get('/', authValidation, getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:id', checkIdValidation, deleteMovie);

module.exports = router;

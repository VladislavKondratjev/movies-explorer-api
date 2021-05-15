const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbiden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (movies.length === 0) {
        throw (new NotFoundError('Фильмы отсутствуют.'));
      } else if (!movies) {
        throw (new BadRequestError('Не удалось загрузить фильмы'));
      }
      return res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        throw (new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return res.send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.id)
    .orFail(() => new NotFoundError('Нет фильма по заданному id'))
    .then((movie) => {
      if (!movie.owner.equals(owner)) {
        next(new ForbiddenError('Вы не можете удалить чужой фильм!'));
      } else {
        movie.remove()
          .then(() => res.send(movie))
          .catch(next)
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id при удалении фильма.'));
      } else {
        next(err);
      }
    });
};

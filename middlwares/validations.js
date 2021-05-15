const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 ссимволов',
      }),
    email: Joi.string().required().email().messages({
      'any.required': 'Укажите почту.',
    }),
    password: Joi.string().required().min(6).messages({
      'any.required': 'Укажите пароль.',
      'string.min': 'Минимальная длина пароля - 6 символов.',
    }),
  }),
});

const updateUserInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Укажите имя.',
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 ссимволов',
      }),
    email: Joi.string().required().email().messages({
      'any.required': 'Укажите почту.',
    }),
  }),
});

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({
      'any.required': 'Укажите страну.',
    }),
    director: Joi.string().required().messages({
      'any.required': 'Укажите режиссёра.',
    }),
    duration: Joi.number().required().messages({
      'any.required': 'Укажите продолжительность фильма.',
    }),
    year: Joi.string().required().messages({
      'any.required': 'Укажите год.',
    }),
    description: Joi.string().required().messages({
      'any.required': 'Укажите описание.',
    }),
    image: Joi.string().custom((value, helpers) => {
      if (
        /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(
          value,
        )
      ) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
    trailer: Joi.string().custom((value, helpers) => {
      if (
        /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(
          value,
        )
      ) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
    thumbnail: Joi.string().custom((value, helpers) => {
      if (
        /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/.test(
          value,
        )
      ) {
        return value;
      }
      return helpers.message('Невалидная ссылка');
    }),
    movieId: Joi.number().required().messages({
      'any.required': 'Укажите id.',
    }),
    nameRU: Joi.string().required().messages({
      'any.required': 'Укажите название фильма.',
    }),
    nameEN: Joi.string().required().messages({
      'any.required': 'Enter movie name.',
    }),
  }),
});

const authValidation = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().min(2).max(200).required(),
    })
    .unknown(),
});

const checkIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'any.required': 'Укажите почту.',
      }),
    password: Joi.string().required().min(6)
      .messages({
        'any.required': 'Укажите пароль.',
        'string.min': 'Минимальная длина пароля - 8 символов.',
      }),
  }),
});

module.exports = {
  authValidation,
  updateUserInfoValidation,
  createUserValidation,
  checkIdValidation,
  createMovieValidation,
  loginValidation,
};

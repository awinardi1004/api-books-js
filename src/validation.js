const Joi = require('joi');

const addBookSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '"name" harus berupa teks',
    'string.empty': '"name" tidak boleh kosong',
    'any.required': '"name" wajib diisi',
  }),
  year: Joi.number().integer().min(0).required().messages({
    'number.base': '"year" harus berupa angka',
    'number.integer': '"year" harus berupa bilangan bulat',
    'number.min': '"year" tidak boleh negatif',
    'any.required': '"year" wajib diisi',
  }),
  author: Joi.string().required().messages({
    'string.base': '"author" harus berupa teks',
    'string.empty': '"author" tidak boleh kosong',
    'any.required': '"author" wajib diisi',
  }),
  summary: Joi.string().required().messages({
    'string.base': '"summary" harus berupa teks',
    'string.empty': '"summary" tidak boleh kosong',
    'any.required': '"summary" wajib diisi',
  }),
  publisher: Joi.string().required().messages({
    'string.base': '"publisher" harus berupa teks',
    'string.empty': '"publisher" tidak boleh kosong',
    'any.required': '"publisher" wajib diisi',
  }),
  pageCount: Joi.number().integer().min(1).required().messages({
    'number.base': '"pageCount" harus berupa angka',
    'number.integer': '"pageCount" harus berupa bilangan bulat',
    'number.min': '"pageCount" harus minimal 1 halaman',
    'any.required': '"pageCount" wajib diisi',
  }),
  readPage: Joi.number().integer().min(0).max(Joi.ref('pageCount')).required().messages({
    'number.base': '"readPage" harus berupa angka',
    'number.integer': '"readPage" harus berupa bilangan bulat',
    'number.min': '"readPage" tidak boleh negatif',
    'number.max': '"readPage" tidak boleh lebih besar dari "pageCount"',
    'any.required': '"readPage" wajib diisi',
  }),
  reading: Joi.boolean().required().messages({
    'boolean.base': '"reading" harus berupa true atau false',
    'any.required': '"reading" wajib diisi',
  }),
});

module.exports = { addBookSchema };


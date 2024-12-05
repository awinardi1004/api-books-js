const { addBookSchema } = require('./validation');
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Prioritaskan validasi readPage > pageCount
  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Validasi dari Joi
  const { error } = addBookSchema.validate(request.payload, { abortEarly: false });

  if (error) {
    const errorMessage = error.details[0].message;

    // Cek jika kesalahan karena 'name' tidak diisi
    if (errorMessage.includes('"name"')) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
    }

    // Kesalahan umum lainnya
    return h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${error.details.map((e) => e.message).join(', ')}`,
    }).code(400);
  }

  // Data valid, proses untuk menambahkan buku
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

module.exports = { addBookHandler };

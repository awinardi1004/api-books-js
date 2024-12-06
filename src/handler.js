const { addBookSchema } = require('./validation');
const { nanoid } = require('nanoid');
const books = require('./books');

// addBookHandler
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

// getAllBooksHandler
const getAllBooksHandler = (request) => {
  const { reading, finished, name } = request.query;

  // Filter buku berdasarkan query reading
  let filteredBooks = books;

  if (reading !== undefined) {
      const isReading = reading === '1';
      filteredBooks = books.filter((b) => b.reading === isReading);
  }

  // Filter buku berdasarkan query finished
  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = books.filter((b) => b.finished === isFinished);
  }

  // Filter berdasarkan `name`
  if (name !== undefined) {
    const nameLowerCase = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(nameLowerCase)
    );
}

  // Format data buku yang dikembalikan
  const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({
      id,
      name,
      publisher,
  }));

  return {
      status: 'success',
      data: {
          books: responseBooks,
      },
  };
};


// gerBookByIdHandler
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find(b => b.id === bookId);
    
    if (book) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

// editBookByIdHandler
const updateBookHandler = (request, h) => {
    const { bookId } = request.params; // Mengambil bookId dari URL parameter
    const {
      name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload; // Mengambil data dari request body
  
    // Validasi: Memeriksa apakah 'name' ada
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    }
  
    // Validasi: Memeriksa apakah 'readPage' lebih besar dari 'pageCount'
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }
  
    // Mencari buku berdasarkan bookId
    const index = books.findIndex((b) => b.id === bookId);
  
    // Jika buku tidak ditemukan
    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
    }
  
    books[index] = {
      ...books[index], 
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
  
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  };
  

// deletBookByIdHandler
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params; // Mengambil ID buku dari URL
  const index = books.findIndex((b) => b.id === bookId); 

  if (index !== -1) {
    books.splice(index, 1); // Menghapus buku dari array jika ditemukan
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  // Jika buku tidak ditemukan
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};



module.exports = { 
  addBookHandler, 
  getAllBooksHandler, 
  getBookByIdHandler, 
  updateBookHandler,
  deleteBookByIdHandler,
};

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: { type: String, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: String,
  category: String,
  totalCopies: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  price: Number,
  publishedDate: Date,
  description: String,
  shelfNumber: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);


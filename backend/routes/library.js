const express = require('express');
const Book = require('../models/Book');
const BookIssue = require('../models/BookIssue');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Books routes
router.get('/books', auth, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/books', auth, async (req, res) => {
  try {
    const book = new Book(req.body);
    book.availableCopies = book.totalCopies;
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Issue book
router.post('/issue', auth, async (req, res) => {
  try {
    const { bookId, studentId, staffId, dueDate } = req.body;
    const book = await Book.findById(bookId);
    
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book not available' });
    }
    
    const issue = new BookIssue({
      bookId,
      studentId,
      staffId,
      dueDate,
      issuedBy: req.user.userId
    });
    
    book.availableCopies -= 1;
    await book.save();
    await issue.save();
    
    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Return book
router.post('/return/:id', auth, async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    
    const book = await Book.findById(issue.bookId);
    issue.status = 'Returned';
    issue.returnDate = new Date();
    
    // Calculate fine if overdue
    if (new Date() > issue.dueDate) {
      const daysOverdue = Math.floor((new Date() - issue.dueDate) / (1000 * 60 * 60 * 24));
      issue.fineAmount = daysOverdue * 10; // 10 per day
    }
    
    book.availableCopies += 1;
    await book.save();
    await issue.save();
    
    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get issues
router.get('/issues', auth, async (req, res) => {
  try {
    const { studentId, status } = req.query;
    const query = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;
    
    const issues = await BookIssue.find(query)
      .populate('bookId')
      .populate('studentId')
      .populate('staffId');
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


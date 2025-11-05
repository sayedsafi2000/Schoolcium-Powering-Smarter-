const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-management';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  console.log('\n⚠️  MongoDB is not running. Please:');
  console.log('1. Make sure MongoDB is installed');
  console.log('2. Start MongoDB service:');
  console.log('   - Open Command Prompt as Administrator');
  console.log('   - Run: net start MongoDB');
  console.log('   OR if MongoDB is installed as a service:');
  console.log('   - Go to Services (services.msc)');
  console.log('   - Find "MongoDB" and start it');
  console.log('\n3. Or install MongoDB if not installed:');
  console.log('   Download from: https://www.mongodb.com/try/download/community');
  console.log('\nServer will continue running but database operations will fail until MongoDB is started.\n');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/library', require('./routes/library'));
app.use('/api/hostel', require('./routes/hostel'));
app.use('/api/transport', require('./routes/transport'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/parents', require('./routes/parents'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/communication', require('./routes/communication'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'School Management API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


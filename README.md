# School Management System

A comprehensive full-stack school management system built with React/Next.js, Express.js, and MongoDB.

## Features

- Student Management
- Teacher Management
- Attendance Management
- Exam Management
- Result & Transcript
- Fee Management
- Library Management
- Hostel Management
- Transport Management
- Human Resource
- Parent Portal
- Student Portal
- Certificate Management
- Communication
- Accounts & Finance
- Inventory
- Academic Management
- Admission Management
- Reports & Analytics
- Settings & Role Management

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Node.js/Express
- **Database**: MongoDB

## Installation

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Set up MongoDB:**
   - Make sure MongoDB is running on your local machine
   - Connection string: `mongodb://localhost:27017/`
   - Database name: `school-management`

3. **Set up environment variables:**
   - The backend already has a `.env` file template
   - Default MongoDB URI: `mongodb://localhost:27017/school-management`
   - Default backend port: `5000`
   - Frontend API URL: `http://localhost:5000/api`

4. **Run the application:**
```bash
# Terminal 1 - Backend (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2 - Frontend (runs on http://localhost:3000)
npm run dev:frontend
```

5. **Access the application:**
   - Open your browser and go to `http://localhost:3000`
   - Register a new account or login with existing credentials

## Project Structure

```
school-management/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/     # Authentication middleware
│   ├── config/          # Database configuration
│   └── server.js        # Express server
├── frontend/
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   ├── styles/          # CSS styles
│   └── public/          # Static assets
└── README.md
```

## API Endpoints

All API endpoints are prefixed with `/api/`:

- `/api/auth` - Authentication (login, register)
- `/api/students` - Student management
- `/api/teachers` - Teacher management
- `/api/attendance` - Attendance tracking
- `/api/exams` - Exam management
- `/api/results` - Results and transcripts
- `/api/fees` - Fee management
- `/api/library` - Library management
- `/api/hostel` - Hostel management
- `/api/transport` - Transport management
- `/api/hr` - Human resource
- `/api/parents` - Parent portal
- `/api/certificates` - Certificate management
- `/api/communication` - Communication (announcements, messages)
- `/api/accounts` - Accounts and finance
- `/api/inventory` - Inventory management
- `/api/academic` - Academic management (classes, subjects, routines)
- `/api/admissions` - Admission management
- `/api/reports` - Reports and analytics
- `/api/settings` - Settings and user management

## Features Overview

### Student Management
- Student admission and profile management
- Class assignment and ID card generation
- Complete student information tracking

### Teacher Management
- Teacher profiles and professional information
- Subject and class assignments
- Payroll management

### Attendance Management
- Student and teacher attendance tracking
- Daily attendance marking
- Attendance reports

### Exam Management
- Exam creation and scheduling
- Marks entry and grading
- Report card generation

### Fee Management
- Fee collection and tracking
- Payment status monitoring
- Due alerts and online payment support

### Library Management
- Book catalog management
- Book issue/return system
- Fine calculation

### Additional Modules
- Hostel management (room allocation, fees)
- Transport management (routes, vehicles, GPS tracking)
- Human resource (staff management, payroll)
- Parent portal (student progress, fees, attendance)
- Student portal (routines, assignments, online exams)
- Certificate management (online applications, auto-generation)
- Communication (SMS, email, internal messaging, announcements)
- Accounts & Finance (income/expense tracking, reports)
- Inventory management (asset tracking, purchase/stock)
- Academic management (class routines, subjects, syllabus)
- Admission management (online forms, merit lists)
- Reports & Analytics (comprehensive reporting dashboard)
- Settings & Role Management (user roles, permissions, academic year setup)

## Default Roles

- `admin` - Full system access
- `teacher` - Teacher-specific features
- `student` - Student portal access
- `parent` - Parent portal access
- `staff` - Staff management features
- `accountant` - Financial management
- `librarian` - Library management

## Notes

- Make sure MongoDB is running before starting the backend
- The system uses JWT for authentication
- All API requests require authentication token in headers
- Default JWT secret is set in `.env` file (change in production)


const express = require('express');
const multer  = require('multer');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

const router = express.Router();

// multer — memory storage, CSV only
const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// ── Helper: parse CSV buffer into array of objects ───────────────────────────
function parseCSV(buffer) {
  const text  = buffer.toString('utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  // Parse header — support quoted fields
  const parseRow = (line) => {
    const cols = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur.trim());
    return cols;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_'));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseRow(lines[i]);
    const obj  = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
    rows.push(obj);
  }
  return rows;
}

// ── Helper: map CSV row → Student document shape ─────────────────────────────
function rowToStudent(row) {
  // Accept flexible column names (snake_case or spaced)
  const get = (...keys) => {
    for (const k of keys) {
      const v = row[k] || row[k.replace(/_/g, ' ')] || row[k.replace(/_/g, '')] || '';
      if (v) return v;
    }
    return '';
  };

  const firstName = get('first_name', 'firstname', 'name');
  const lastName  = get('last_name',  'lastname',  'surname');
  const studentId = get('student_id', 'studentid', 'id', 'roll');

  if (!studentId)  throw new Error('Missing student_id');
  if (!firstName)  throw new Error('Missing first_name');

  return {
    studentId,
    personalInfo: {
      firstName,
      lastName:    lastName  || '',
      dateOfBirth: get('date_of_birth','dob','birthdate') || undefined,
      gender:      (['Male','Female','Other'].includes(get('gender')) ? get('gender') : 'Male'),
      phone:       get('phone','mobile','contact'),
      email:       get('email'),
      address:     get('address'),
      bloodGroup:  get('blood_group','bloodgroup','blood'),
    },
    guardianInfo: {
      fatherName:  get('father_name','fathername','father'),
      fatherPhone: get('father_phone','father_mobile'),
      motherName:  get('mother_name','mothername','mother'),
      motherPhone: get('mother_phone','mother_mobile'),
      guardianName:  get('guardian_name','guardian'),
      guardianPhone: get('guardian_phone'),
    },
    academicInfo: {
      admissionDate:   get('admission_date','admission_dt') || new Date(),
      admissionNumber: get('admission_number','admission_no','adm_no'),
      section:         get('section'),
      rollNumber:      get('roll_number','roll','roll_no'),
      academicYear:    get('academic_year','year') || '2024-2025',
    },
    status: (['Active','Inactive','Graduated','Transferred'].includes(get('status'))
              ? get('status') : 'Active'),
  };
}

// ── POST /api/students/import-csv ────────────────────────────────────────────
router.post('/import-csv', auth, csvUpload.single('file'), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No CSV file uploaded' });
    }

    const rows = parseCSV(req.file.buffer);
    const results = { imported: 0, skipped: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const lineNum = i + 2; // +2 because row 1 is header
      try {
        const data = rowToStudent(rows[i]);

        // Skip completely empty rows
        if (!data.studentId && !data.personalInfo.firstName) {
          results.skipped++;
          continue;
        }

        // Upsert: update if studentId exists, otherwise insert
        await Student.findOneAndUpdate(
          { studentId: data.studentId },
          { $set: data },
          { upsert: true, new: true, runValidators: false }
        );
        results.imported++;
      } catch (err) {
        results.skipped++;
        results.errors.push({ row: lineNum, message: err.message });
      }
    }

    res.json({
      message: `Import complete. ${results.imported} imported, ${results.skipped} skipped.`,
      ...results,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().populate('academicInfo.class').populate('userId');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('academicInfo.class')
      .populate('userId')
      .populate('transport.routeId')
      .populate('hostel.roomId');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create student
router.post('/', auth, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


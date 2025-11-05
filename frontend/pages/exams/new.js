import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewExam() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [formData, setFormData] = useState({
    examName: '',
    examType: 'Quiz',
    class: '',
    subject: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    duration: 60,
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
    status: 'Scheduled'
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
  }, [])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClasses(res.data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubjects(res.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/exams`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/exams')
    } catch (error) {
      alert('Error creating exam: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Create New Exam</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Exam Name *</label>
            <input
              type="text"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Exam Type *</label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              required
            >
              <option value="Quiz">Quiz</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Assignment">Assignment</option>
              <option value="Project">Project</option>
            </select>
          </div>
          <div className="form-group">
            <label>Class *</label>
            <select
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.className} {cls.section ? `- ${cls.section}` : ''}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Subject *</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.subjectName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
            />
          </div>
          <div className="form-group">
            <label>Total Marks *</label>
            <input
              type="number"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 100 })}
              required
            />
          </div>
          <div className="form-group">
            <label>Passing Marks</label>
            <input
              type="number"
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) || 40 })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Exam</button>
      </form>
    </div>
  )
}


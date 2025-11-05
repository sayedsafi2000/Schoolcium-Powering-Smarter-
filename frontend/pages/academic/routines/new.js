import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewRoutine() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [formData, setFormData] = useState({
    class: '',
    subject: '',
    teacher: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    academicYear: '2024-2025'
  })

  useEffect(() => {
    fetchClasses()
    fetchSubjects()
    fetchTeachers()
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

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTeachers(res.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/routines`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/academic')
    } catch (error) {
      alert('Error creating routine: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Routine</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
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
            <label>Teacher *</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.personalInfo?.firstName} {teacher.personalInfo?.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Day *</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              required
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time *</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Room</label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Routine</button>
      </form>
    </div>
  )
}


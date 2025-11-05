import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewClass() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    classTeacher: '',
    capacity: 40,
    academicYear: '2024-2025',
    roomNumber: ''
  })

  useEffect(() => {
    fetchTeachers()
    fetchSubjects()
  }, [])

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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/classes')
    } catch (error) {
      alert('Error creating class: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Class</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Class Name *</label>
            <input
              type="text"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              placeholder="e.g., Grade 1, Class 10"
              required
            />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="e.g., A, B, C"
            />
          </div>
          <div className="form-group">
            <label>Class Teacher</label>
            <select
              value={formData.classTeacher}
              onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
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
            <label>Capacity *</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 40 })}
              required
            />
          </div>
          <div className="form-group">
            <label>Academic Year</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g., 2024-2025"
            />
          </div>
          <div className="form-group">
            <label>Room Number</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Class</button>
      </form>
    </div>
  )
}


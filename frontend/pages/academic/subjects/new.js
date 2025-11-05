import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewSubject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    description: '',
    creditHours: 0,
    department: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/academic/subjects`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/academic')
    } catch (error) {
      alert('Error creating subject: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Subject</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Subject Code *</label>
            <input
              type="text"
              value={formData.subjectCode}
              onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Subject Name *</label>
            <input
              type="text"
              value={formData.subjectName}
              onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Credit Hours</label>
            <input
              type="number"
              value={formData.creditHours}
              onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Subject</button>
      </form>
    </div>
  )
}


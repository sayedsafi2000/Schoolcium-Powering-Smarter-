import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewAdmission() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    applicantName: '',
    dateOfBirth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    applyingClass: '',
    previousSchool: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: ''
  })

  useEffect(() => {
    fetchClasses()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admissions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/admissions')
    } catch (error) {
      alert('Error submitting admission: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>New Admission Application</h1>
      <form onSubmit={handleSubmit} className="form">
        <h2>Applicant Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Applicant Name *</label>
            <input
              type="text"
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <h2>Academic Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Applying Class *</label>
            <select
              value={formData.applyingClass}
              onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.className} {cls.section ? `- ${cls.section}` : ''}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Previous School</label>
            <input
              type="text"
              value={formData.previousSchool}
              onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
            />
          </div>
        </div>

        <h2>Guardian Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Guardian Name</label>
            <input
              type="text"
              value={formData.guardianName}
              onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Guardian Phone</label>
            <input
              type="tel"
              value={formData.guardianPhone}
              onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Guardian Email</label>
            <input
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Submit Application</button>
      </form>
    </div>
  )
}


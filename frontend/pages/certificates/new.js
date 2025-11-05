import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewCertificate() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [formData, setFormData] = useState({
    certificateType: 'Transfer',
    studentId: ''
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudents(res.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/certificates`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/certificates')
    } catch (error) {
      alert('Error applying for certificate: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Apply for Certificate</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Certificate Type *</label>
            <select
              value={formData.certificateType}
              onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })}
              required
            >
              <option value="Transfer">Transfer Certificate</option>
              <option value="Character">Character Certificate</option>
              <option value="Bonafide">Bonafide Certificate</option>
              <option value="Migration">Migration Certificate</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Degree</option>
            </select>
          </div>
          <div className="form-group">
            <label>Student *</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.personalInfo?.firstName} {student.personalInfo?.lastName} - {student.studentId}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Submit Application</button>
      </form>
    </div>
  )
}


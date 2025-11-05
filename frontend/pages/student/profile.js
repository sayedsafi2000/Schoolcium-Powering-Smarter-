import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function StudentProfile({ user }) {
  const router = useRouter()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/')
      return
    }
    fetchStudentProfile()
  }, [user])

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      // First get student ID from user
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Find student by userId or email
      const studentsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const studentData = studentsRes.data.find(s => 
        s.userId === userRes.data._id || 
        s.personalInfo?.email === userRes.data.email
      )
      
      if (studentData) {
        setStudent(studentData)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!student) return <div>Student profile not found</div>

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      <div className="form" style={{ maxWidth: '800px' }}>
        <h2>Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Student ID</label>
            <input type="text" value={student.studentId || ''} disabled />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" value={student.personalInfo?.firstName || ''} disabled />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value={student.personalInfo?.lastName || ''} disabled />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="text" value={student.personalInfo?.dateOfBirth ? new Date(student.personalInfo.dateOfBirth).toLocaleDateString() : ''} disabled />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <input type="text" value={student.personalInfo?.gender || ''} disabled />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={student.personalInfo?.email || ''} disabled />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={student.personalInfo?.phone || ''} disabled />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea value={student.personalInfo?.address || ''} disabled rows="3" />
          </div>
        </div>

        <h2>Guardian Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Father Name</label>
            <input type="text" value={student.guardianInfo?.fatherName || ''} disabled />
          </div>
          <div className="form-group">
            <label>Father Phone</label>
            <input type="text" value={student.guardianInfo?.fatherPhone || ''} disabled />
          </div>
          <div className="form-group">
            <label>Mother Name</label>
            <input type="text" value={student.guardianInfo?.motherName || ''} disabled />
          </div>
          <div className="form-group">
            <label>Mother Phone</label>
            <input type="text" value={student.guardianInfo?.motherPhone || ''} disabled />
          </div>
        </div>

        <h2>Academic Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Class</label>
            <input type="text" value={student.academicInfo?.class?.className || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Section</label>
            <input type="text" value={student.academicInfo?.section || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Roll Number</label>
            <input type="text" value={student.academicInfo?.rollNumber || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Admission Number</label>
            <input type="text" value={student.academicInfo?.admissionNumber || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Academic Year</label>
            <input type="text" value={student.academicInfo?.academicYear || 'N/A'} disabled />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input type="text" value={student.status || 'N/A'} disabled />
          </div>
        </div>
      </div>
    </div>
  )
}


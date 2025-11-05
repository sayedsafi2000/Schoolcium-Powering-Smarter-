import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewStudent() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studentId: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: ''
    },
    guardianInfo: {
      fatherName: '',
      fatherPhone: '',
      motherName: '',
      motherPhone: '',
      guardianName: '',
      guardianPhone: ''
    },
    academicInfo: {
      admissionDate: new Date().toISOString().split('T')[0],
      admissionNumber: '',
      rollNumber: '',
      academicYear: '2024-2025'
    },
    status: 'Active'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/students`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/students')
    } catch (error) {
      alert('Error creating student: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Student</h1>
      <form onSubmit={handleSubmit} className="form">
        <h2>Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              value={formData.personalInfo.firstName}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, firstName: e.target.value }
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={formData.personalInfo.lastName}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, lastName: e.target.value }
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={formData.personalInfo.dateOfBirth}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              value={formData.personalInfo.gender}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, gender: e.target.value }
              })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.personalInfo.email}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, email: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={formData.personalInfo.phone}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, phone: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={formData.personalInfo.address}
              onChange={(e) => setFormData({
                ...formData,
                personalInfo: { ...formData.personalInfo, address: e.target.value }
              })}
            />
          </div>
        </div>

        <h2>Guardian Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Father Name</label>
            <input
              type="text"
              value={formData.guardianInfo.fatherName}
              onChange={(e) => setFormData({
                ...formData,
                guardianInfo: { ...formData.guardianInfo, fatherName: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Father Phone</label>
            <input
              type="tel"
              value={formData.guardianInfo.fatherPhone}
              onChange={(e) => setFormData({
                ...formData,
                guardianInfo: { ...formData.guardianInfo, fatherPhone: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Mother Name</label>
            <input
              type="text"
              value={formData.guardianInfo.motherName}
              onChange={(e) => setFormData({
                ...formData,
                guardianInfo: { ...formData.guardianInfo, motherName: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Mother Phone</label>
            <input
              type="tel"
              value={formData.guardianInfo.motherPhone}
              onChange={(e) => setFormData({
                ...formData,
                guardianInfo: { ...formData.guardianInfo, motherPhone: e.target.value }
              })}
            />
          </div>
        </div>

        <h2>Academic Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Admission Number</label>
            <input
              type="text"
              value={formData.academicInfo.admissionNumber}
              onChange={(e) => setFormData({
                ...formData,
                academicInfo: { ...formData.academicInfo, admissionNumber: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Roll Number</label>
            <input
              type="text"
              value={formData.academicInfo.rollNumber}
              onChange={(e) => setFormData({
                ...formData,
                academicInfo: { ...formData.academicInfo, rollNumber: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Academic Year</label>
            <input
              type="text"
              value={formData.academicInfo.academicYear}
              onChange={(e) => setFormData({
                ...formData,
                academicInfo: { ...formData.academicInfo, academicYear: e.target.value }
              })}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Create Student</button>
      </form>
    </div>
  )
}


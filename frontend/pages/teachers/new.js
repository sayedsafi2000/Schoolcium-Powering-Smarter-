import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewTeacher() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    teacherId: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: ''
    },
    professionalInfo: {
      employeeId: '',
      joiningDate: new Date().toISOString().split('T')[0],
      qualification: '',
      specialization: '',
      experience: 0,
      department: '',
      designation: ''
    },
    salary: {
      amount: 0,
      accountNumber: '',
      bankName: ''
    },
    status: 'Active'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/teachers')
    } catch (error) {
      alert('Error creating teacher: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Teacher</h1>
      <form onSubmit={handleSubmit} className="form">
        <h2>Personal Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Teacher ID *</label>
            <input
              type="text"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
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

        <h2>Professional Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={formData.professionalInfo.employeeId}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, employeeId: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Joining Date</label>
            <input
              type="date"
              value={formData.professionalInfo.joiningDate}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, joiningDate: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Qualification</label>
            <input
              type="text"
              value={formData.professionalInfo.qualification}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, qualification: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              value={formData.professionalInfo.specialization}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, specialization: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Experience (Years)</label>
            <input
              type="number"
              value={formData.professionalInfo.experience}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, experience: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.professionalInfo.department}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, department: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input
              type="text"
              value={formData.professionalInfo.designation}
              onChange={(e) => setFormData({
                ...formData,
                professionalInfo: { ...formData.professionalInfo, designation: e.target.value }
              })}
            />
          </div>
        </div>

        <h2>Salary Information</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Salary Amount</label>
            <input
              type="number"
              value={formData.salary.amount}
              onChange={(e) => setFormData({
                ...formData,
                salary: { ...formData.salary, amount: parseFloat(e.target.value) || 0 }
              })}
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={formData.salary.accountNumber}
              onChange={(e) => setFormData({
                ...formData,
                salary: { ...formData.salary, accountNumber: e.target.value }
              })}
            />
          </div>
          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              value={formData.salary.bankName}
              onChange={(e) => setFormData({
                ...formData,
                salary: { ...formData.salary, bankName: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Create Teacher</button>
      </form>
    </div>
  )
}


import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function HR({ user }) {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStaff(res.data)
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Human Resource</h1>
        <Link href="/hr/new" className="btn btn-primary">Add Staff</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s._id}>
              <td>{s.staffId}</td>
              <td>{s.personalInfo?.firstName} {s.personalInfo?.lastName}</td>
              <td>{s.professionalInfo?.designation}</td>
              <td>{s.professionalInfo?.department || 'N/A'}</td>
              <td>{s.personalInfo?.email || 'N/A'}</td>
              <td>{s.personalInfo?.phone || 'N/A'}</td>
              <td><span className={`status status-${s.status?.toLowerCase()}`}>{s.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


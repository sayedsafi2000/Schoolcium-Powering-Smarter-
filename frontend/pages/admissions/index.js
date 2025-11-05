import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Admissions({ user }) {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admissions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmissions(res.data)
    } catch (error) {
      console.error('Error fetching admissions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admission Management</h1>
        <Link href="/admissions/new" className="btn btn-primary">New Admission</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Application Number</th>
            <th>Applicant Name</th>
            <th>Applying Class</th>
            <th>Phone</th>
            <th>Application Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map(admission => (
            <tr key={admission._id}>
              <td>{admission.applicationNumber || 'N/A'}</td>
              <td>{admission.applicantName}</td>
              <td>{admission.applyingClass?.className || 'N/A'}</td>
              <td>{admission.phone}</td>
              <td>{new Date(admission.applicationDate).toLocaleDateString()}</td>
              <td><span className={`status status-${admission.status?.toLowerCase().replace(' ', '-')}`}>{admission.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


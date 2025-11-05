import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Certificates({ user }) {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCertificates(res.data)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Certificate Management</h1>
        <Link href="/certificates/new" className="btn btn-primary">Apply for Certificate</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Certificate Type</th>
            <th>Student</th>
            <th>Application Date</th>
            <th>Status</th>
            <th>Issued Date</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map(cert => (
            <tr key={cert._id}>
              <td>{cert.certificateType}</td>
              <td>{cert.studentId?.personalInfo?.firstName || 'N/A'}</td>
              <td>{new Date(cert.applicationDate).toLocaleDateString()}</td>
              <td><span className={`status status-${cert.status?.toLowerCase()}`}>{cert.status}</span></td>
              <td>{cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


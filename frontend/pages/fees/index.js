import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Fees({ user }) {
  const router = useRouter()
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/student/fees')
      return
    }
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchFees()
  }, [user])

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFees(res.data)
    } catch (error) {
      console.error('Error fetching fees:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Fee Management</h1>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Fee Type</th>
            <th>Amount</th>
            <th>Paid</th>
            <th>Due</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(fee => (
            <tr key={fee._id}>
              <td>{fee.studentId?.personalInfo?.firstName || 'N/A'}</td>
              <td>{fee.feeType}</td>
              <td>${fee.amount}</td>
              <td>${fee.paidAmount || 0}</td>
              <td>${fee.amount - (fee.paidAmount || 0)}</td>
              <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
              <td><span className={`status status-${fee.status?.toLowerCase()}`}>{fee.status}</span></td>
              <td>
                {fee.status !== 'Paid' && (
                  <button className="btn btn-sm btn-primary">Pay</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function StudentFees({ user }) {
  const router = useRouter()
  const [fees, setFees] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/')
      return
    }
    fetchStudentData()
  }, [user])

  const fetchStudentData = async () => {
    try {
      const token = localStorage.getItem('token')
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const studentsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const studentData = studentsRes.data.find(s => 
        s.userId === userRes.data._id || 
        s.personalInfo?.email === userRes.data.email
      )
      
      if (studentData) {
        setStudent(studentData)
        const feesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees/student/${studentData._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setFees(feesRes.data)
      }
    } catch (error) {
      console.error('Error fetching fees:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'status-active'
      case 'Pending': return 'status-pending'
      case 'Overdue': return 'status-inactive'
      default: return ''
    }
  }

  const groupByMonth = (fees) => {
    const grouped = {}
    fees.forEach(fee => {
      const month = new Date(fee.dueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!grouped[month]) {
        grouped[month] = []
      }
      grouped[month].push(fee)
    })
    return grouped
  }

  if (loading) return <div>Loading...</div>

  const groupedFees = groupByMonth(fees)
  const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0)
  const totalPending = fees.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0)

  return (
    <div className="page-container">
      <h1>My Fees & Installments</h1>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>Total Fees</h3>
          <p className="stat-number">${fees.reduce((sum, f) => sum + f.amount, 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Paid</h3>
          <p className="stat-number" style={{ color: '#155724' }}>${totalPaid}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number" style={{ color: '#856404' }}>${totalPending}</p>
        </div>
      </div>

      {Object.keys(groupedFees).map(month => (
        <div key={month} style={{ marginBottom: '2rem' }}>
          <h2>{month}</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {groupedFees[month].map(fee => (
                <tr key={fee._id}>
                  <td>{fee.feeType}</td>
                  <td>${fee.amount}</td>
                  <td>${fee.paidAmount || 0}</td>
                  <td>${fee.amount - (fee.paidAmount || 0)}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${getStatusColor(fee.status)}`}>
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {fees.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No fee records found.</p>
        </div>
      )}
    </div>
  )
}


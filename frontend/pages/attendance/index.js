import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Attendance({ user }) {
  const router = useRouter()
  const [attendance, setAttendance] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    if (user?.role !== 'admin' && user?.role !== 'teacher') {
      router.push('/')
      return
    }
    fetchAttendance()
  }, [user, date])

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/attendance`, {
        params: { date },
        headers: { Authorization: `Bearer ${token}` }
      })
      setAttendance(res.data)
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Attendance</h1>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-group input"
          />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(record => (
            <tr key={record._id}>
              <td>
                {record.studentId?.personalInfo?.firstName || record.teacherId?.personalInfo?.firstName || 'N/A'}
              </td>
              <td>{record.type}</td>
              <td><span className={`status status-${record.status?.toLowerCase()}`}>{record.status}</span></td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Reports({ user }) {
  const [reportType, setReportType] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      let endpoint = ''
      if (reportType === 'dashboard') {
        endpoint = '/reports/dashboard'
      } else if (reportType === 'attendance') {
        endpoint = '/reports/attendance'
      } else if (reportType === 'finance') {
        endpoint = '/reports/finance'
      }
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [reportType])

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <div>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-group input"
          >
            <option value="dashboard">Dashboard</option>
            <option value="attendance">Attendance</option>
            <option value="finance">Finance</option>
          </select>
        </div>
      </div>
      {data && (
        <div className="report-content">
          {reportType === 'dashboard' && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Students</h3>
                <p className="stat-number">{data.totalStudents}</p>
              </div>
              <div className="stat-card">
                <h3>Total Teachers</h3>
                <p className="stat-number">{data.totalTeachers}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Attendance</h3>
                <p className="stat-number">{data.todayAttendance}</p>
              </div>
              <div className="stat-card">
                <h3>Today's Revenue</h3>
                <p className="stat-number">${data.todayRevenue}</p>
              </div>
            </div>
          )}
          {reportType === 'finance' && data && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Income</h3>
                <p className="stat-number">${data.income}</p>
              </div>
              <div className="stat-card">
                <h3>Total Expense</h3>
                <p className="stat-number">${data.expense}</p>
              </div>
              <div className="stat-card">
                <h3>Net Balance</h3>
                <p className="stat-number">${data.balance}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


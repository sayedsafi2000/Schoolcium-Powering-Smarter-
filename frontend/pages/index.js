import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

export default function Home({ user }) {
  const router = useRouter()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user && router.pathname !== '/') {
      router.push('/login')
      return
    }

    if (user) {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!user) {
    return (
      <div className="home-container">
        <div className="hero">
          <h1>School Management System</h1>
          <p>Comprehensive solution for managing your school</p>
          <div className="cta-buttons">
            <Link href="/login" className="btn btn-primary">Login</Link>
            <Link href="/register" className="btn btn-secondary">Register</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p className="stat-number">{stats.totalStudents}</p>
          </div>
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <p className="stat-number">{stats.totalTeachers}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Attendance</h3>
            <p className="stat-number">{stats.todayAttendance}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Revenue</h3>
            <p className="stat-number">${stats.todayRevenue}</p>
          </div>
        </div>
      )}
      <div className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          <Link href="/students" className="link-card">Students</Link>
          <Link href="/teachers" className="link-card">Teachers</Link>
          <Link href="/attendance" className="link-card">Attendance</Link>
          <Link href="/exams" className="link-card">Exams</Link>
          <Link href="/fees" className="link-card">Fees</Link>
          <Link href="/library" className="link-card">Library</Link>
          <Link href="/reports" className="link-card">Reports</Link>
          <Link href="/settings" className="link-card">Settings</Link>
        </div>
      </div>
    </div>
  )
}


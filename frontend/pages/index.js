import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

export default function Home({ user }) {
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [upcomingExams, setUpcomingExams] = useState([])
  const [pendingFees, setPendingFees] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [attendanceChart, setAttendanceChart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user && router.pathname !== '/') {
      router.push('/login')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch dashboard stats
      const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(statsRes.data)

      // Fetch upcoming exams
      const examsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const upcoming = examsRes.data
        .filter(exam => new Date(exam.startDate) >= new Date())
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 5)
      setUpcomingExams(upcoming)

      // Fetch recent announcements
      const annRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(annRes.data.slice(0, 5))

      // Fetch pending fees (for admin)
      if (user?.role === 'admin') {
        const feesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees?status=Pending`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPendingFees(feesRes.data.slice(0, 5))
      }

      // Fetch attendance chart data (last 7 days)
      const today = new Date()
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        last7Days.push(date.toISOString().split('T')[0])
      }
      
      const attendanceData = await Promise.all(
        last7Days.map(date =>
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/attendance?date=${date}`, {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => ({
            date,
            present: res.data.filter(a => a.status === 'Present').length,
            absent: res.data.filter(a => a.status === 'Absent').length
          })).catch(() => ({ date, present: 0, absent: 0 }))
        )
      )
      setAttendanceChart(attendanceData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  // Student Dashboard
  if (isStudent) {
    return (
      <div className="dashboard">
        <div className="dashboard-welcome">
          <div className="welcome-card">
            <h1>Welcome back, {user?.username}! 👋</h1>
            <p>Here's what's happening today</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>My GPA</h3>
              <p className="stat-number">4.2</p>
            </div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Attendance</h3>
              <p className="stat-number">95%</p>
            </div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Pending Fees</h3>
              <p className="stat-number">$250</p>
            </div>
          </div>
          <div className="stat-card stat-card-info">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Books Issued</h3>
              <p className="stat-number">3</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-widget">
            <div className="widget-header">
              <h2>📅 My Schedule Today</h2>
            </div>
            <div className="widget-content">
              <div className="schedule-item">
                <div className="schedule-time">09:00 - 10:00</div>
                <div className="schedule-details">
                  <strong>Mathematics</strong>
                  <span>Room 101</span>
                </div>
              </div>
              <div className="schedule-item">
                <div className="schedule-time">10:15 - 11:15</div>
                <div className="schedule-details">
                  <strong>Science</strong>
                  <span>Room 102</span>
                </div>
              </div>
              <div className="schedule-item">
                <div className="schedule-time">11:30 - 12:30</div>
                <div className="schedule-details">
                  <strong>English</strong>
                  <span>Room 103</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-widget">
            <div className="widget-header">
              <h2>📝 Upcoming Exams</h2>
            </div>
            <div className="widget-content">
              {upcomingExams.length > 0 ? (
                upcomingExams.map(exam => (
                  <div key={exam._id} className="exam-item">
                    <div className="exam-date">
                      {new Date(exam.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="exam-details">
                      <strong>{exam.examName}</strong>
                      <span>{exam.examType} - {exam.subject?.subjectName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No upcoming exams</p>
              )}
            </div>
          </div>
        </div>

        <div className="quick-links">
          <h2>Quick Access</h2>
          <div className="links-grid">
            <Link href="/student/profile" className="link-card">
              <span className="link-icon">👤</span>
              <div>My Profile</div>
            </Link>
            <Link href="/student/fees" className="link-card">
              <span className="link-icon">💰</span>
              <div>My Fees</div>
            </Link>
            <Link href="/student/routine" className="link-card">
              <span className="link-icon">📅</span>
              <div>My Routine</div>
            </Link>
            <Link href="/student/results" className="link-card">
              <span className="link-icon">📈</span>
              <div>My Results</div>
            </Link>
            <Link href="/student/books" className="link-card">
              <span className="link-icon">📚</span>
              <div>My Books</div>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Admin/Teacher Dashboard
  const maxAttendance = Math.max(...attendanceChart.map(d => d.present + d.absent), 1)

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-card">
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {stats && (isAdmin || isTeacher) && (
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents || 0}</p>
              <span className="stat-change positive">+12% from last month</span>
            </div>
          </div>
          <div className="stat-card stat-card-success">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p className="stat-number">{stats.totalTeachers || 0}</p>
              <span className="stat-change positive">+2 this month</span>
            </div>
          </div>
          <div className="stat-card stat-card-warning">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Today's Attendance</h3>
              <p className="stat-number">{stats.todayAttendance || 0}</p>
              <span className="stat-change">Active today</span>
            </div>
          </div>
          {isAdmin && (
            <>
              <div className="stat-card stat-card-info">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Today's Revenue</h3>
                  <p className="stat-number">${stats.todayRevenue || 0}</p>
                  <span className="stat-change positive">+8% from yesterday</span>
                </div>
              </div>
              <div className="stat-card stat-card-danger">
                <div className="stat-icon">⏰</div>
                <div className="stat-content">
                  <h3>Pending Fees</h3>
                  <p className="stat-number">{pendingFees.length}</p>
                  <span className="stat-change">Requires attention</span>
                </div>
              </div>
              <div className="stat-card stat-card-secondary">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <h3>Library Books</h3>
                  <p className="stat-number">1,234</p>
                  <span className="stat-change">Total collection</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="dashboard-grid">
        {/* Attendance Chart */}
        {(isAdmin || isTeacher) && (
          <div className="dashboard-widget widget-chart">
            <div className="widget-header">
              <h2>📊 Attendance Trend (Last 7 Days)</h2>
            </div>
            <div className="widget-content">
              <div className="chart-container">
                {attendanceChart.map((day, index) => {
                  const total = day.present + day.absent
                  const presentPercent = maxAttendance > 0 ? (day.present / maxAttendance) * 100 : 0
                  return (
                    <div key={index} className="chart-bar-group">
                      <div className="chart-bars">
                        <div 
                          className="chart-bar chart-bar-present"
                          style={{ height: `${(day.present / maxAttendance) * 100}%` }}
                          title={`Present: ${day.present}`}
                        />
                        <div 
                          className="chart-bar chart-bar-absent"
                          style={{ height: `${(day.absent / maxAttendance) * 100}%` }}
                          title={`Absent: ${day.absent}`}
                        />
                      </div>
                      <div className="chart-label">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-color present"></span>Present</span>
                <span className="legend-item"><span className="legend-color absent"></span>Absent</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2>⚡ Recent Activities</h2>
          </div>
          <div className="widget-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">➕</div>
                <div className="activity-content">
                  <strong>New student registered</strong>
                  <span>2 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <strong>Exam created: Midterm Math</strong>
                  <span>15 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💰</div>
                <div className="activity-content">
                  <strong>Fee payment received</strong>
                  <span>1 hour ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📚</div>
                <div className="activity-content">
                  <strong>Book issued to student</strong>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Exams */}
        {(isAdmin || isTeacher) && (
          <div className="dashboard-widget">
            <div className="widget-header">
              <h2>📝 Upcoming Exams</h2>
              <Link href="/exams" className="widget-action">View All</Link>
            </div>
            <div className="widget-content">
              {upcomingExams.length > 0 ? (
                upcomingExams.map(exam => (
                  <div key={exam._id} className="exam-item">
                    <div className="exam-date">
                      {new Date(exam.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="exam-details">
                      <strong>{exam.examName}</strong>
                      <span>{exam.examType} - {exam.class?.className} - {exam.subject?.subjectName}</span>
                    </div>
                    <div className="exam-status">
                      <span className={`status status-${exam.status?.toLowerCase()}`}>{exam.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No upcoming exams</p>
              )}
            </div>
          </div>
        )}

        {/* Announcements */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2>📢 Latest Announcements</h2>
            <Link href="/communication" className="widget-action">View All</Link>
          </div>
          <div className="widget-content">
            {announcements.length > 0 ? (
              announcements.map(announcement => (
                <div key={announcement._id} className="announcement-item">
                  <div className="announcement-badge">{announcement.type}</div>
                  <div className="announcement-content">
                    <strong>{announcement.title}</strong>
                    <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-state">No announcements</p>
            )}
          </div>
        </div>

        {/* Pending Fees (Admin Only) */}
        {isAdmin && pendingFees.length > 0 && (
          <div className="dashboard-widget widget-alert">
            <div className="widget-header">
              <h2>⚠️ Pending Fees</h2>
              <Link href="/fees" className="widget-action">View All</Link>
            </div>
            <div className="widget-content">
              {pendingFees.map(fee => (
                <div key={fee._id} className="fee-item">
                  <div className="fee-student">{fee.studentId?.personalInfo?.firstName || 'Student'}</div>
                  <div className="fee-amount">${fee.amount - (fee.paidAmount || 0)}</div>
                  <div className="fee-date">{new Date(fee.dueDate).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="dashboard-widget">
          <div className="widget-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          <div className="widget-content">
            <div className="quick-actions-grid">
              {(isAdmin || isTeacher) && (
                <>
                  <Link href="/students/new" className="quick-action-btn">
                    <span>➕</span>
                    <div>Add Student</div>
                  </Link>
                  {isAdmin && (
                    <Link href="/teachers/new" className="quick-action-btn">
                      <span>👨‍🏫</span>
                      <div>Add Teacher</div>
                    </Link>
                  )}
                  <Link href="/exams/new" className="quick-action-btn">
                    <span>📝</span>
                    <div>Create Exam</div>
                  </Link>
                  <Link href="/attendance" className="quick-action-btn">
                    <span>✅</span>
                    <div>Mark Attendance</div>
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link href="/fees" className="quick-action-btn">
                    <span>💰</span>
                    <div>Collect Fee</div>
                  </Link>
                  <Link href="/library/new" className="quick-action-btn">
                    <span>📚</span>
                    <div>Add Book</div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h2>Quick Links</h2>
        <div className="links-grid">
          {(isAdmin || isTeacher) && (
            <Link href="/students" className="link-card">
              <span className="link-icon">👨‍🎓</span>
              <div>Students</div>
            </Link>
          )}
          {isAdmin && (
            <Link href="/teachers" className="link-card">
              <span className="link-icon">👨‍🏫</span>
              <div>Teachers</div>
            </Link>
          )}
          {(isAdmin || isTeacher) && (
            <Link href="/attendance" className="link-card">
              <span className="link-icon">✅</span>
              <div>Attendance</div>
            </Link>
          )}
          {(isAdmin || isTeacher) && (
            <Link href="/exams" className="link-card">
              <span className="link-icon">📝</span>
              <div>Exams</div>
            </Link>
          )}
          {isAdmin && (
            <Link href="/fees" className="link-card">
              <span className="link-icon">💰</span>
              <div>Fees</div>
            </Link>
          )}
          {(isAdmin || isTeacher) && (
            <Link href="/library" className="link-card">
              <span className="link-icon">📚</span>
              <div>Library</div>
            </Link>
          )}
          {isAdmin && (
            <>
              <Link href="/reports" className="link-card">
                <span className="link-icon">📊</span>
                <div>Reports</div>
              </Link>
              <Link href="/settings" className="link-card">
                <span className="link-icon">⚙️</span>
                <div>Settings</div>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

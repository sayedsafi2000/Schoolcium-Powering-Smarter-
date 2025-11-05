import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children, user, setUser }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>School Management</h2>
        </div>
        <div className="nav-links">
          <Link href="/">Dashboard</Link>
          <div className="dropdown">
            <span>Students</span>
            <div className="dropdown-content">
              <Link href="/students">All Students</Link>
              <Link href="/students/new">Add Student</Link>
            </div>
          </div>
          <div className="dropdown">
            <span>Teachers</span>
            <div className="dropdown-content">
              <Link href="/teachers">All Teachers</Link>
              <Link href="/teachers/new">Add Teacher</Link>
            </div>
          </div>
          <Link href="/attendance">Attendance</Link>
          <Link href="/exams">Exams</Link>
          <Link href="/results">Results</Link>
          <Link href="/fees">Fees</Link>
          <Link href="/classes">Classes</Link>
          <div className="dropdown">
            <span>More</span>
            <div className="dropdown-content">
              <Link href="/library">Library</Link>
              <Link href="/hostel">Hostel</Link>
              <Link href="/transport">Transport</Link>
              <Link href="/hr">HR</Link>
              <Link href="/admissions">Admissions</Link>
              <Link href="/certificates">Certificates</Link>
              <Link href="/communication">Communication</Link>
              <Link href="/accounts">Accounts</Link>
              <Link href="/inventory">Inventory</Link>
              <Link href="/academic">Academic</Link>
              <Link href="/reports">Reports</Link>
              <Link href="/settings">Settings</Link>
            </div>
          </div>
          <span className="user-info">{user?.username}</span>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}


import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children, user, setUser }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false)
  }, [router.pathname])

  if (!user) {
    return <>{children}</>
  }

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  const adminMenuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/students', label: 'Students', icon: '👨‍🎓', submenu: [
      { href: '/students', label: 'All Students' },
      { href: '/students/new', label: 'Add Student' }
    ]},
    { href: '/teachers', label: 'Teachers', icon: '👨‍🏫', submenu: [
      { href: '/teachers', label: 'All Teachers' },
      { href: '/teachers/new', label: 'Add Teacher' }
    ]},
    { href: '/attendance', label: 'Attendance', icon: '✅' },
    { href: '/exams', label: 'Exams', icon: '📝' },
    { href: '/results', label: 'Results', icon: '📈' },
    { href: '/fees', label: 'Fees', icon: '💰' },
    { href: '/classes', label: 'Classes', icon: '🏫' },
    { href: '/library', label: 'Library', icon: '📚' },
    { href: '/hostel', label: 'Hostel', icon: '🛏️' },
    { href: '/transport', label: 'Transport', icon: '🚌' },
    { href: '/hr', label: 'HR', icon: '👔' },
    { href: '/admissions', label: 'Admissions', icon: '📋' },
    { href: '/certificates', label: 'Certificates', icon: '🎓' },
    { href: '/communication', label: 'Communication', icon: '💬' },
    { href: '/accounts', label: 'Accounts', icon: '💳' },
    { href: '/inventory', label: 'Inventory', icon: '📦' },
    { href: '/academic', label: 'Academic', icon: '📖' },
    { href: '/reports', label: 'Reports', icon: '📊' },
    { href: '/banners', label: 'Banners', icon: '🖼️' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  const teacherMenuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/students', label: 'Students', icon: '👨‍🎓' },
    { href: '/exams', label: 'Exams', icon: '📝' },
    { href: '/library', label: 'Library', icon: '📚' },
    { href: '/attendance', label: 'Attendance', icon: '✅' },
    { href: '/results', label: 'Results', icon: '📈' }
  ]

  const studentMenuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/student/profile', label: 'My Profile', icon: '👤' },
    { href: '/student/fees', label: 'My Fees', icon: '💰' },
    { href: '/student/routine', label: 'My Routine', icon: '📅' },
    { href: '/student/results', label: 'My Results', icon: '📈' },
    { href: '/student/books', label: 'My Books', icon: '📚' }
  ]

  const menuItems = isAdmin ? adminMenuItems : isTeacher ? teacherMenuItems : studentMenuItems

  const MenuItem = ({ item, isActive }) => {
    const [submenuOpen, setSubmenuOpen] = useState(false)
    const hasSubmenu = item.submenu && item.submenu.length > 0

    return (
      <>
        <Link
          href={item.href}
          className={`menu-item ${isActive ? 'active' : ''}`}
          onClick={() => hasSubmenu && setSubmenuOpen(!submenuOpen)}
        >
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
          {hasSubmenu && (
            <span className="menu-arrow">{submenuOpen ? '▼' : '▶'}</span>
          )}
        </Link>
        {hasSubmenu && submenuOpen && (
          <div className="submenu">
            {item.submenu.map(subItem => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={`submenu-item ${router.pathname === subItem.href ? 'active' : ''}`}
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="layout-container">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <h2>🎓 School</h2>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <MenuItem
              key={item.href}
              item={item}
              isActive={router.pathname === item.href || (item.submenu && item.submenu.some(sub => router.pathname === sub.href))}
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="topbar">
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
          <div className="topbar-title">
            <h1>{getPageTitle(router.pathname)}</h1>
          </div>
          <div className="topbar-actions">
            <span className="welcome-text">Welcome, {user?.username}!</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}

function getPageTitle(pathname) {
  const titles = {
    '/': 'Dashboard',
    '/students': 'Students',
    '/teachers': 'Teachers',
    '/attendance': 'Attendance',
    '/exams': 'Exams',
    '/results': 'Results',
    '/fees': 'Fees',
    '/classes': 'Classes',
    '/library': 'Library',
    '/student/profile': 'My Profile',
    '/student/fees': 'My Fees',
    '/student/routine': 'My Routine',
    '/student/results': 'My Results',
    '/student/books': 'My Books'
  }
  return titles[pathname] || 'School Management'
}

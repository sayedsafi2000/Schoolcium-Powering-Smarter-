import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  LayoutDashboard, Users, UserCheck, FileText, DollarSign, BookOpen,
  Hotel, Bus, Briefcase, ClipboardList, Award, MessageSquare, CreditCard,
  Package, GraduationCap, BarChart3, Image as ImageIcon, Settings,
  Menu, X, ChevronLeft, LogOut, User, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/custom/theme-toggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const PAGE_META = {
  '/': { title: 'Dashboard', description: 'Overview of school activity and metrics' },
  '/students': { title: 'Students', description: 'Student records and enrollment' },
  '/teachers': { title: 'Teachers', description: 'Faculty profiles and assignments' },
  '/attendance': { title: 'Attendance', description: 'Daily attendance tracking' },
  '/exams': { title: 'Exams', description: 'Exam schedules and management' },
  '/results': { title: 'Results', description: 'Exam results and performance' },
  '/fees': { title: 'Fees', description: 'Fee collection and payment status' },
  '/classes': { title: 'Classes', description: 'Class sections and capacity' },
  '/library': { title: 'Library', description: 'Books and issue records' },
  '/hostel': { title: 'Hostel', description: 'Rooms and student allocation' },
  '/transport': { title: 'Transport', description: 'Vehicles and route management' },
  '/hr': { title: 'Human Resources', description: 'Staff records and HR operations' },
  '/admissions': { title: 'Admissions', description: 'Application review and enrollment' },
  '/certificates': { title: 'Certificates', description: 'Certificate requests and issuance' },
  '/communication': { title: 'Communication', description: 'Announcements and notices' },
  '/accounts': { title: 'Accounts', description: 'Income, expenses, and transactions' },
  '/inventory': { title: 'Inventory', description: 'Stock levels and supplies' },
  '/academic': { title: 'Academic', description: 'Subjects, routines, and curriculum' },
  '/reports': { title: 'Reports', description: 'Analytics and school reports' },
  '/notices': { title: 'Notice Board', description: 'School notices and announcements' },
  '/banners': { title: 'Banners', description: 'Website banner management' },
  '/settings': { title: 'Settings', description: 'System configuration' },
  '/student/profile': { title: 'My Profile', description: 'Your personal information' },
  '/student/fees': { title: 'My Fees', description: 'Fee status and payments' },
  '/student/routine': { title: 'My Routine', description: 'Weekly class schedule' },
  '/student/results': { title: 'My Results', description: 'Your exam results' },
  '/student/books': { title: 'My Books', description: 'Issued library books' },
}

function getPageMeta(pathname) {
  if (PAGE_META[pathname]) return PAGE_META[pathname]

  if (pathname.includes('/new')) {
    return { title: 'Create Record', description: 'Fill in the required information' }
  }

  return { title: 'Schoolcium', description: 'School management system' }
}

export default function AppLayout({ children, user, setUser }) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [router.pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  if (!user) {
    return <>{children}</>
  }

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'

  const adminMenuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/teachers', label: 'Teachers', icon: UserCheck },
    { href: '/attendance', label: 'Attendance', icon: ClipboardList },
    { href: '/exams', label: 'Exams', icon: FileText },
    { href: '/results', label: 'Results', icon: BarChart3 },
    { href: '/fees', label: 'Fees', icon: DollarSign },
    { href: '/classes', label: 'Classes', icon: GraduationCap },
    { href: '/library', label: 'Library', icon: BookOpen },
    { href: '/hostel', label: 'Hostel', icon: Hotel },
    { href: '/transport', label: 'Transport', icon: Bus },
    { href: '/hr', label: 'HR', icon: Briefcase },
    { href: '/admissions', label: 'Admissions', icon: ClipboardList },
    { href: '/certificates', label: 'Certificates', icon: Award },
    { href: '/communication', label: 'Communication', icon: MessageSquare },
    { href: '/accounts', label: 'Accounts', icon: CreditCard },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/academic', label: 'Academic', icon: GraduationCap },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/banners', label: 'Banners', icon: ImageIcon },
    { href: '/notices', label: 'Notice Board', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const teacherMenuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/students', label: 'Students', icon: Users },
    { href: '/exams', label: 'Exams', icon: FileText },
    { href: '/library', label: 'Library', icon: BookOpen },
    { href: '/attendance', label: 'Attendance', icon: ClipboardList },
    { href: '/results', label: 'Results', icon: BarChart3 },
  ]

  const studentMenuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/profile', label: 'My Profile', icon: User },
    { href: '/student/fees', label: 'My Fees', icon: DollarSign },
    { href: '/student/routine', label: 'My Routine', icon: ClipboardList },
    { href: '/student/results', label: 'My Results', icon: BarChart3 },
    { href: '/student/books', label: 'My Books', icon: BookOpen },
  ]

  const menuItems = isAdmin ? adminMenuItems : isTeacher ? teacherMenuItems : studentMenuItems
  const pageMeta = getPageMeta(router.pathname)

  return (
    <div className="min-h-screen bg-background">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 surface-sidebar transition-transform duration-200",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          !sidebarOpen && "lg:-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold">Schoolcium</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = router.pathname === item.href

              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn("nav-item", isActive && "nav-item-active")}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-3 space-y-2">
            <div className="flex items-center gap-3 rounded-md px-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {getInitials(user?.username || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className={cn("transition-all duration-200", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
        <header className="sticky top-0 z-30 surface-header">
          <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden h-8 w-8"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex h-8 w-8"
              >
                <ChevronLeft className={cn("h-4 w-4 transition-transform", !sidebarOpen && "rotate-180")} />
              </Button>
              <div className="min-w-0">
                <h1 className="text-base font-semibold truncate">{pageMeta.title}</h1>
                <p className="text-xs text-muted-foreground truncate hidden sm:block">
                  {pageMeta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground hidden md:inline">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="px-4 py-5 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  Users, UserCheck, CheckCircle, DollarSign, BookOpen, TrendingUp,
  Calendar, Bell, Plus, FileText, GraduationCap
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { StatCard } from '@/components/custom/stat-card'
import { ChartCard } from '@/components/custom/chart-card'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

function QuickLink({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="surface-card block p-4 text-center transition-colors hover:bg-muted/50">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-medium">{label}</p>
    </Link>
  )
}

function ListRow({ children }) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border px-4 py-3">
      {children}
    </div>
  )
}

export default function Home({ user }) {
  const [stats, setStats] = useState(null)
  const [attendanceChart, setAttendanceChart] = useState([])
  const [upcomingExams, setUpcomingExams] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')

      const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(statsRes.data)

      const examsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUpcomingExams(
        examsRes.data
          .filter(exam => new Date(exam.startDate) >= new Date())
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 5)
      )

      const annRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(annRes.data.slice(0, 5))

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
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            present: res.data.filter(a => a.status === 'Present').length,
            absent: res.data.filter(a => a.status === 'Absent').length,
          })).catch(() => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            present: 0,
            absent: 0,
          }))
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
      <div className="auth-shell flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Schoolcium</h1>
          <p className="mt-2 text-muted-foreground">
            A practical school management system for attendance, fees, exams, and daily operations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="min-w-[140px]">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="min-w-[140px]">Create account</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'admin'
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'

  if (loading) {
    return (
      <div className="page-shell">
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (isStudent) {
    return (
      <div className="page-shell">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h2 className="mt-1 text-lg font-semibold">{user?.username}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Here is a quick view of your day.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} title="My GPA" value="4.2" change="+0.3 this semester" variant="success" />
          <StatCard icon={CheckCircle} title="Attendance" value="95%" variant="success" />
          <StatCard icon={DollarSign} title="Pending Fees" value="$250" variant="warning" />
          <StatCard icon={BookOpen} title="Books Issued" value="3" variant="info" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Today&apos;s schedule
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-2 pt-0">
              {[
                { time: '09:00 - 10:00', subject: 'Mathematics', room: 'Room 101' },
                { time: '10:15 - 11:15', subject: 'Science', room: 'Room 102' },
                { time: '11:30 - 12:30', subject: 'English', room: 'Room 103' },
              ].map((schedule, i) => (
                <ListRow key={i}>
                  <div className="w-24 shrink-0 text-sm font-medium text-muted-foreground">{schedule.time}</div>
                  <div>
                    <div className="font-medium">{schedule.subject}</div>
                    <div className="text-sm text-muted-foreground">{schedule.room}</div>
                  </div>
                </ListRow>
              ))}
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Upcoming exams
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-2 pt-0">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <ListRow key={exam._id}>
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md border border-border bg-muted text-sm">
                      <span className="text-xs uppercase text-muted-foreground">
                        {new Date(exam.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-lg font-semibold">{new Date(exam.startDate).getDate()}</span>
                    </div>
                    <div>
                      <div className="font-medium">{exam.examName}</div>
                      <div className="text-sm text-muted-foreground">
                        {exam.examType} · {exam.subject?.subjectName || 'General'}
                      </div>
                    </div>
                  </ListRow>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No upcoming exams</p>
              )}
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <QuickLink href="/student/profile" icon={Users} label="My Profile" />
          <QuickLink href="/student/fees" icon={DollarSign} label="My Fees" />
          <QuickLink href="/student/routine" icon={Calendar} label="My Routine" />
          <QuickLink href="/student/results" icon={TrendingUp} label="My Results" />
          <QuickLink href="/student/books" icon={BookOpen} label="My Books" />
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="surface-card p-5">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h2 className="mt-1 text-lg font-semibold">{user?.username}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {stats && (isAdmin || isTeacher) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} title="Total Students" value={stats.totalStudents || 0} variant="info" />
          <StatCard icon={UserCheck} title="Total Teachers" value={stats.totalTeachers || 0} variant="success" />
          <StatCard icon={CheckCircle} title="Today's Attendance" value={stats.todayAttendance || 0} variant="default" />
          {isAdmin && (
            <StatCard icon={DollarSign} title="Today's Revenue" value={formatCurrency(stats.todayRevenue || 0)} variant="success" />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Attendance trend" description="Last 7 days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="present" stroke="#15803d" fill="#15803d" fillOpacity={0.15} />
              <Area type="monotone" dataKey="absent" stroke="#dc2626" fill="#dc2626" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <GlassCard>
          <GlassCardHeader>
            <div className="flex items-center justify-between gap-3">
              <GlassCardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                Announcements
              </GlassCardTitle>
              <Link href="/communication">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </div>
          </GlassCardHeader>
          <GlassCardContent className="space-y-2 pt-0">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement._id} className="rounded-md border border-border px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline">{announcement.type}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{announcement.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(announcement.publishDate || announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No announcements yet</p>
            )}
          </GlassCardContent>
        </GlassCard>
      </div>

      {(isAdmin || isTeacher) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickLink href="/students/new" icon={Plus} label="Add Student" />
          {isAdmin && <QuickLink href="/teachers/new" icon={Plus} label="Add Teacher" />}
          <QuickLink href="/exams/new" icon={FileText} label="Create Exam" />
          <QuickLink href="/attendance" icon={CheckCircle} label="Attendance" />
          {isAdmin && <QuickLink href="/fees" icon={DollarSign} label="Collect Fee" />}
          {isAdmin && <QuickLink href="/library/new" icon={BookOpen} label="Add Book" />}
        </div>
      )}
    </div>
  )
}

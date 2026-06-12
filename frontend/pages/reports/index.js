import { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, UserCheck, CheckCircle, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatCard } from '@/components/custom/stat-card'
import { ChartCard } from '@/components/custom/chart-card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const chartData = stats ? [
    { name: 'Students', value: stats.totalStudents || 0 },
    { name: 'Teachers', value: stats.totalTeachers || 0 },
    { name: 'Attendance', value: stats.todayAttendance || 0 },
  ] : []

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total students" value={stats?.totalStudents || 0} variant="info" />
        <StatCard icon={UserCheck} title="Total teachers" value={stats?.totalTeachers || 0} variant="success" />
        <StatCard icon={CheckCircle} title="Today's attendance" value={stats?.todayAttendance || 0} variant="default" />
        <StatCard icon={DollarSign} title="Today's revenue" value={formatCurrency(stats?.todayRevenue || 0)} variant="success" />
      </div>

      <ChartCard title="School overview" description="Key metrics at a glance">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

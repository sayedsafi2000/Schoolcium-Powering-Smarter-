import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { ChartCard } from '@/components/custom/chart-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const selectClassName =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

export default function Results({ user }) {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [exams, setExams] = useState([])
  const [classes, setClasses] = useState([])
  const [examId, setExamId] = useState('')
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/student/results')
      return
    }
    loadFilters()
  }, [user])

  useEffect(() => {
    if (user?.role === 'student') return
    fetchResults()
  }, [examId, classId, user])

  const loadFilters = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_URL

      const [examsRes, classesRes] = await Promise.all([
        axios.get(`${base}/exams`, { headers }),
        axios.get(`${base}/academic/classes`, { headers }),
      ])
      setExams(examsRes.data)
      setClasses(classesRes.data)
    } catch {
      toast.error('Failed to load filters')
    } finally {
      setLoading(false)
    }
  }

  const fetchResults = async () => {
    setFetching(true)
    try {
      const token = localStorage.getItem('token')
      const params = {}
      if (examId) params.examId = examId
      if (classId) params.classId = classId

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      })
      setResults(res.data)
    } catch {
      toast.error('Failed to load results')
    } finally {
      setFetching(false)
    }
  }

  const chartData = useMemo(() => {
    const grades = results.reduce((acc, r) => {
      const grade = r.grade || 'Ungraded'
      acc[grade] = (acc[grade] || 0) + 1
      return acc
    }, {})
    return Object.entries(grades).map(([name, value]) => ({ name, value }))
  }, [results])

  const exportCsv = useCallback(() => {
    if (results.length === 0) {
      toast.error('No results to export')
      return
    }

    const headers = ['Student', 'Exam', 'Subject', 'Marks', 'Total', 'Grade', 'GPA']
    const rows = results.map(r => {
      const s = r.studentId?.personalInfo
      const studentName = s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : ''
      return [
        studentName,
        r.examId?.examName || '',
        r.subject?.subjectName || '',
        r.marksObtained ?? '',
        r.totalMarks ?? '',
        r.grade || '',
        r.gpa ?? '',
      ]
    })

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `results-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Results exported')
  }, [results])

  const columns = useMemo(() => [
    {
      id: 'student',
      header: 'Student',
      cell: ({ row }) => {
        const s = row.original.studentId?.personalInfo
        const name = s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() : '—'
        return <span className="font-medium">{name}</span>
      },
    },
    {
      id: 'exam',
      header: 'Exam',
      cell: ({ row }) => row.original.examId?.examName || '—',
    },
    {
      id: 'subject',
      header: 'Subject',
      cell: ({ row }) => row.original.subject?.subjectName || '—',
    },
    {
      accessorKey: 'marksObtained',
      header: 'Marks',
      cell: ({ row }) => <span className="tabular-nums">{row.getValue('marksObtained')}</span>,
    },
    {
      accessorKey: 'totalMarks',
      header: 'Total',
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.getValue('totalMarks')}</span>,
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => {
        const grade = row.getValue('grade')
        return grade ? <Badge variant="outline">{grade}</Badge> : '—'
      },
    },
    {
      accessorKey: 'gpa',
      header: 'GPA',
      cell: ({ row }) => {
        const gpa = row.getValue('gpa')
        return gpa != null ? <span className="tabular-nums">{gpa}</span> : '—'
      },
    },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-32 ml-auto" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <Button variant="outline" onClick={exportCsv} disabled={results.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </PageActions>

      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examFilter">Exam</Label>
            <select
              id="examFilter"
              className={selectClassName}
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
            >
              <option value="">All exams</option>
              {exams.map(exam => (
                <option key={exam._id} value={exam._id}>{exam.examName}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="classFilter">Class</Label>
            <select
              id="classFilter"
              className={selectClassName}
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">All classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}{cls.section ? ` (${cls.section})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {chartData.length > 0 && (
        <ChartCard title="Grade distribution" description="Results breakdown by grade">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      <GlassCard className="p-5">
        {fetching ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : (
          <DataTable columns={columns} data={results} />
        )}
      </GlassCard>
    </div>
  )
}

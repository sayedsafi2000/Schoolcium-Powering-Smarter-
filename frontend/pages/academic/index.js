import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Academic() {
  const [activeTab, setActiveTab] = useState('classes')
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const base = process.env.NEXT_PUBLIC_API_URL

      if (activeTab === 'classes') {
        const res = await axios.get(`${base}/academic/classes`, { headers })
        setClasses(res.data)
      } else if (activeTab === 'subjects') {
        const res = await axios.get(`${base}/academic/subjects`, { headers })
        setSubjects(res.data)
      } else {
        const res = await axios.get(`${base}/academic/routines`, { headers })
        setRoutines(res.data)
      }
    } catch {
      toast.error('Failed to load academic data')
    } finally {
      setLoading(false)
    }
  }

  const classColumns = useMemo(() => [
    { accessorKey: 'className', header: 'Class', cell: ({ row }) => <span className="font-medium">{row.getValue('className')}</span> },
    { accessorKey: 'section', header: 'Section', cell: ({ row }) => row.getValue('section') || '—' },
    { id: 'teacher', header: 'Class teacher', cell: ({ row }) => row.original.classTeacher?.personalInfo?.firstName || '—' },
    { accessorKey: 'capacity', header: 'Capacity' },
    { accessorKey: 'currentStrength', header: 'Enrolled' },
  ], [])

  const subjectColumns = useMemo(() => [
    { accessorKey: 'subjectCode', header: 'Code', cell: ({ row }) => <span className="font-medium">{row.getValue('subjectCode')}</span> },
    { accessorKey: 'subjectName', header: 'Subject' },
    { accessorKey: 'department', header: 'Department', cell: ({ row }) => row.getValue('department') || '—' },
    { accessorKey: 'creditHours', header: 'Credits', cell: ({ row }) => row.getValue('creditHours') ?? '—' },
  ], [])

  const routineColumns = useMemo(() => [
    { id: 'class', header: 'Class', cell: ({ row }) => row.original.class?.className || '—' },
    { id: 'subject', header: 'Subject', cell: ({ row }) => row.original.subject?.subjectName || '—' },
    { id: 'teacher', header: 'Teacher', cell: ({ row }) => row.original.teacher?.personalInfo?.firstName || '—' },
    { accessorKey: 'day', header: 'Day' },
    { id: 'time', header: 'Time', cell: ({ row }) => `${row.original.startTime || ''} – ${row.original.endTime || ''}`.trim() },
    { accessorKey: 'room', header: 'Room', cell: ({ row }) => row.getValue('room') || '—' },
  ], [])

  const tabConfig = {
    classes: { data: classes, columns: classColumns, searchKey: 'className', addHref: '/classes/new', addLabel: 'Add class' },
    subjects: { data: subjects, columns: subjectColumns, searchKey: 'subjectName', addHref: '/academic/subjects/new', addLabel: 'Add subject' },
    routines: { data: routines, columns: routineColumns, searchKey: 'day', addHref: '/academic/routines/new', addLabel: 'Add routine' },
  }

  const current = tabConfig[activeTab]

  if (loading && classes.length === 0 && subjects.length === 0 && routines.length === 0) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-56 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={activeTab === 'classes' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('classes')}>Classes</Button>
          <Button variant={activeTab === 'subjects' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('subjects')}>Subjects</Button>
          <Button variant={activeTab === 'routines' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('routines')}>Routines</Button>
        </div>
        <Link href={current.addHref}><Button><Plus className="h-4 w-4 mr-2" />{current.addLabel}</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        {loading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <DataTable columns={current.columns} data={current.data} searchKey={current.searchKey} />
        )}
      </GlassCard>
    </div>
  )
}

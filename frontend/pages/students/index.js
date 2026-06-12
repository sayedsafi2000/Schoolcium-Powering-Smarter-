import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { getInitials } from '@/lib/utils'
import { toast } from 'sonner'

function StatusBadge({ status }) {
  const tone =
    status === 'Active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
    : status === 'Inactive' ? 'border-muted bg-muted/50 text-muted-foreground'
    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
  return <Badge variant="outline" className={tone}>{status || '—'}</Badge>
}

function StudentName({ student }) {
  const first = student.personalInfo?.firstName || ''
  const last = student.personalInfo?.lastName || ''
  const name = `${first} ${last}`.trim() || 'Unknown'
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        {getInitials(name)}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  )
}

export default function Students({ user }) {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    fetchStudents()
  }, [user])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setStudents(res.data)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => <StudentName student={row.original} />,
    },
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => <span className="tabular-nums text-muted-foreground">{row.getValue('studentId')}</span>,
    },
    {
      id: 'class',
      header: 'Class',
      cell: ({ row }) => row.original.academicInfo?.class?.className || '—',
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.personalInfo?.phone || '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-36 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      {user?.role === 'admin' && (
        <PageActions>
          <Link href="/students/import">
            <Button variant="outline"><Upload className="h-4 w-4 mr-2" />Import CSV</Button>
          </Link>
          <Link href="/students/new">
            <Button><Plus className="h-4 w-4 mr-2" />Add student</Button>
          </Link>
        </PageActions>
      )}

      <GlassCard className="p-5">
        <DataTable columns={columns} data={students} searchKey="studentId" />
      </GlassCard>
    </div>
  )
}

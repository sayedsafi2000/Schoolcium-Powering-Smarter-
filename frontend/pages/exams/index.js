import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

function ExamStatusBadge({ status }) {
  const tone =
    status === 'Completed' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
    : status === 'Scheduled' ? 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300'
    : status === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
    : 'border-muted bg-muted/50 text-muted-foreground'
  return <Badge variant="outline" className={tone}>{status || '—'}</Badge>
}

export default function Exams({ user }) {
  const router = useRouter()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    fetchExams()
  }, [user])

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setExams(res.data)
    } catch {
      toast.error('Failed to load exams')
    } finally {
      setLoading(false)
    }
  }

  const canCreate = user?.role === 'admin' || user?.role === 'teacher'

  const columns = useMemo(() => [
    {
      accessorKey: 'examName',
      header: 'Exam',
      cell: ({ row }) => <span className="font-medium">{row.getValue('examName')}</span>,
    },
    {
      accessorKey: 'examType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('examType')}</Badge>,
    },
    {
      id: 'class',
      header: 'Class',
      cell: ({ row }) => row.original.class?.className || '—',
    },
    {
      id: 'startDate',
      header: 'Start date',
      cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <ExamStatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => canCreate ? (
        <Link href={`/exams/${row.original._id}/edit`}>
          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
        </Link>
      ) : null,
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
      {canCreate && (
        <PageActions>
          <Link href="/exams/new">
            <Button><Plus className="h-4 w-4 mr-2" />Create exam</Button>
          </Link>
        </PageActions>
      )}

      <GlassCard className="p-5">
        <DataTable columns={columns} data={exams} searchKey="examName" />
      </GlassCard>
    </div>
  )
}

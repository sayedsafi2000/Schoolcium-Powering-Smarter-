import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { DollarSign, Wallet, Clock, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

function FeeStatusBadge({ status }) {
  const tone =
    status === 'Paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
    : status === 'Partial' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
    : status === 'Overdue' ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
    : 'border-muted bg-muted/50 text-muted-foreground'
  return <Badge variant="outline" className={tone}>{status || '—'}</Badge>
}

export default function Fees({ user }) {
  const router = useRouter()
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)

  const canManage = user?.role === 'admin' || user?.role === 'accountant'

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/student/fees')
      return
    }
    if (!canManage) {
      router.push('/')
      return
    }
    fetchFees()
  }, [user])

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fees`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFees(res.data)
    } catch {
      toast.error('Failed to load fees')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const total = fees.reduce((sum, f) => sum + (f.amount || 0), 0)
    const collected = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0)
    return { total, collected, pending: total - collected }
  }, [fees])

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
      accessorKey: 'feeType',
      header: 'Fee type',
      cell: ({ row }) => <Badge variant="outline">{row.getValue('feeType')}</Badge>,
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount || 0),
    },
    {
      id: 'paid',
      header: 'Paid',
      cell: ({ row }) => formatCurrency(row.original.paidAmount || 0),
    },
    {
      id: 'due',
      header: 'Due',
      cell: ({ row }) => {
        const due = (row.original.amount || 0) - (row.original.paidAmount || 0)
        return <span className={due > 0 ? 'text-amber-600 font-medium' : ''}>{formatCurrency(due)}</span>
      },
    },
    {
      id: 'dueDate',
      header: 'Due date',
      cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <FeeStatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => canManage ? (
        <Link href={`/fees/${row.original._id}/edit`}>
          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
        </Link>
      ) : null,
    },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-36 ml-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      {canManage && (
        <PageActions>
          <Link href="/fees/collect">
            <Button><DollarSign className="h-4 w-4 mr-2" />Collect fee</Button>
          </Link>
        </PageActions>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Wallet} title="Total fees" value={formatCurrency(stats.total)} variant="info" />
        <StatCard icon={DollarSign} title="Collected" value={formatCurrency(stats.collected)} variant="success" />
        <StatCard icon={Clock} title="Pending" value={formatCurrency(stats.pending)} variant="warning" />
      </div>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={fees} searchKey="feeType" />
      </GlassCard>
    </div>
  )
}

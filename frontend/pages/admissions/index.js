import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Check, X, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Admissions({ user }) {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchAdmissions()
  }, [])

  const fetchAdmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admissions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAdmissions(res.data)
    } catch {
      toast.error('Failed to load admissions')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    setUpdating(id)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admissions/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Application ${status.toLowerCase()}`)
      fetchAdmissions()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdating(null)
    }
  }

  const columns = useMemo(() => [
    { id: 'applicationNumber', header: 'Application #', cell: ({ row }) => row.original.applicationNumber || '—' },
    { accessorKey: 'applicantName', header: 'Applicant', cell: ({ row }) => <span className="font-medium">{row.getValue('applicantName')}</span> },
    { id: 'class', header: 'Class', cell: ({ row }) => row.original.applyingClass?.className || '—' },
    { accessorKey: 'phone', header: 'Phone' },
    { id: 'date', header: 'Applied', cell: ({ row }) => new Date(row.original.applicationDate).toLocaleDateString() },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
    { id: 'actions', header: '', cell: ({ row }) => {
      if (user?.role !== 'admin') return null
      const { _id, status } = row.original
      const busy = updating === _id
      return (
        <div className="flex items-center gap-1">
          {['Pending', 'Under Review'].includes(status) && (
            <>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => updateStatus(_id, 'Approved')}>
                <Check className="h-3.5 w-3.5 mr-1" />Approve
              </Button>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => updateStatus(_id, 'Rejected')}>
                <X className="h-3.5 w-3.5 mr-1" />Reject
              </Button>
            </>
          )}
          {status === 'Approved' && (
            <Button size="sm" disabled={busy} onClick={() => updateStatus(_id, 'Admitted')}>
              <UserPlus className="h-3.5 w-3.5 mr-1" />Admit
            </Button>
          )}
        </div>
      )
    }},
  ], [user, updating])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-40 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <Link href="/admissions/new"><Button><Plus className="h-4 w-4 mr-2" />New application</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={admissions} searchKey="applicantName" />
      </GlassCard>
    </div>
  )
}

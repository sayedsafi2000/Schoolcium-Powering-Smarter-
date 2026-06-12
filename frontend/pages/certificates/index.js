import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Check, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Certificates({ user }) {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificates`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCertificates(res.data)
    } catch {
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setUpdating(id)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/certificates/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Certificate approved')
      fetchCertificates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve')
    } finally {
      setUpdating(null)
    }
  }

  const handleIssue = async (id) => {
    const certificateNumber = prompt('Enter certificate number:')
    if (!certificateNumber?.trim()) return

    setUpdating(id)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/certificates/${id}/issue`, { certificateNumber }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Certificate issued')
      fetchCertificates()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue certificate')
    } finally {
      setUpdating(null)
    }
  }

  const columns = useMemo(() => [
    { accessorKey: 'certificateType', header: 'Type', cell: ({ row }) => <span className="font-medium">{row.getValue('certificateType')}</span> },
    { id: 'student', header: 'Student', cell: ({ row }) => {
      const s = row.original.studentId?.personalInfo
      return s ? `${s.firstName || ''} ${s.lastName || ''}`.trim() || '—' : '—'
    }},
    { id: 'applied', header: 'Applied', cell: ({ row }) => new Date(row.original.applicationDate).toLocaleDateString() },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
    { id: 'issued', header: 'Issued', cell: ({ row }) => row.original.issuedDate ? new Date(row.original.issuedDate).toLocaleDateString() : '—' },
    { id: 'actions', header: '', cell: ({ row }) => {
      if (user?.role !== 'admin') return null
      const { _id, status } = row.original
      const busy = updating === _id
      return (
        <div className="flex items-center gap-1">
          {status === 'Pending' && (
            <Button variant="outline" size="sm" disabled={busy} onClick={() => handleApprove(_id)}>
              <Check className="h-3.5 w-3.5 mr-1" />Approve
            </Button>
          )}
          {status === 'Approved' && (
            <Button size="sm" disabled={busy} onClick={() => handleIssue(_id)}>
              <FileCheck className="h-3.5 w-3.5 mr-1" />Issue
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
        <Link href="/certificates/new"><Button><Plus className="h-4 w-4 mr-2" />New request</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={certificates} searchKey="certificateType" />
      </GlassCard>
    </div>
  )
}

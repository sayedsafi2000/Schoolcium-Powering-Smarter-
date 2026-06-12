import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function HR() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStaff(res.data)
    } catch {
      toast.error('Failed to load staff records')
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => [
    { accessorKey: 'staffId', header: 'Staff ID', cell: ({ row }) => <span className="font-medium">{row.getValue('staffId')}</span> },
    { id: 'name', header: 'Name', cell: ({ row }) => {
      const p = row.original.personalInfo
      return p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : '—'
    }},
    { id: 'department', header: 'Department', cell: ({ row }) => row.original.professionalInfo?.department || '—' },
    { id: 'designation', header: 'Designation', cell: ({ row }) => row.original.professionalInfo?.designation || '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-32 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <Link href="/hr/new"><Button><Plus className="h-4 w-4 mr-2" />Add staff</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={staff} searchKey="staffId" />
      </GlassCard>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Banners({ user }) {
  const router = useRouter()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchBanners()
  }, [user])

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBanners(res.data)
    } catch {
      toast.error('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Banner deleted')
      fetchBanners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete banner')
    }
  }

  const columns = useMemo(() => [
    { id: 'image', header: 'Preview', cell: ({ row }) => (
      row.original.imageUrl ? (
        <img src={row.original.imageUrl} alt={row.original.title} className="h-10 w-16 rounded border border-border object-cover" />
      ) : '—'
    )},
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span> },
    { accessorKey: 'position', header: 'Position', cell: ({ row }) => <Badge variant="outline">{row.getValue('position')}</Badge> },
    { accessorKey: 'order', header: 'Order' },
    { id: 'status', header: 'Status', cell: ({ row }) => (
      <Badge variant="outline">{row.original.isActive ? 'Active' : 'Inactive'}</Badge>
    )},
    { id: 'dates', header: 'Schedule', cell: ({ row }) => {
      const { startDate, endDate } = row.original
      if (!startDate && !endDate) return '—'
      const start = startDate ? new Date(startDate).toLocaleDateString() : '—'
      const end = endDate ? new Date(endDate).toLocaleDateString() : '—'
      return `${start} – ${end}`
    }},
    { id: 'actions', header: '', cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(row.original._id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    )},
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
      <PageActions>
        <Link href="/banners/new"><Button><Plus className="h-4 w-4 mr-2" />Add banner</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={banners} searchKey="title" />
      </GlassCard>
    </div>
  )
}

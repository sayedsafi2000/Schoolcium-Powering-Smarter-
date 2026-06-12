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

export default function Communication() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch {
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => [
    { accessorKey: 'title', header: 'Title', cell: ({ row }) => <span className="font-medium">{row.getValue('title')}</span> },
    { accessorKey: 'content', header: 'Content', cell: ({ row }) => {
      const text = row.getValue('content') || ''
      return <span className="text-muted-foreground">{text.length > 80 ? `${text.slice(0, 80)}…` : text}</span>
    }},
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge> },
    { accessorKey: 'targetAudience', header: 'Audience', cell: ({ row }) => row.getValue('targetAudience') || '—' },
    { id: 'publishDate', header: 'Published', cell: ({ row }) => {
      const date = row.original.publishDate || row.original.createdAt
      return date ? new Date(date).toLocaleDateString() : '—'
    }},
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-44 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <Link href="/communication/new"><Button><Plus className="h-4 w-4 mr-2" />New announcement</Button></Link>
      </PageActions>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={announcements} searchKey="title" />
      </GlassCard>
    </div>
  )
}

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import {
  Plus, Trash2, Pencil, Eye, EyeOff, Pin, PinOff, Search, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

const CATEGORIES = ['All', 'General', 'Academic', 'Exam', 'Admission', 'Event', 'Holiday', 'Sports', 'Cultural', 'Other']

const categoryColors = {
  General: 'default', Academic: 'secondary', Exam: 'destructive',
  Admission: 'outline', Event: 'secondary', Holiday: 'outline',
  Sports: 'default', Cultural: 'secondary', Other: 'outline',
}

export default function Notices({ user }) {
  const router = useRouter()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    if (user?.role !== 'admin') { router.push('/'); return }
    fetchNotices()
  }, [user])

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notices`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotices(res.data)
    } catch {
      toast.error('Failed to load notices')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice and all its attachments?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Notice deleted')
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notice')
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(res.data.message)
      fetchNotices()
    } catch {
      toast.error('Failed to update notice')
    }
  }

  const handleToggleImportant = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}/important`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Notice updated')
      fetchNotices()
    } catch {
      toast.error('Failed to update notice')
    }
  }

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchCat = categoryFilter === 'All' || n.category === categoryFilter
      const matchSearch = !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        (n.shortDescription || '').toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [notices, search, categoryFilter])

  const columns = useMemo(() => [
    {
      id: 'image',
      header: '',
      cell: ({ row }) =>
        row.original.featuredImage?.url ? (
          <img
            src={row.original.featuredImage.url}
            alt={row.original.title}
            className="h-10 w-14 rounded border border-border object-cover"
          />
        ) : (
          <div className="h-10 w-14 rounded border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <p className="font-medium leading-tight">{row.getValue('title')}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {row.original.shortDescription || '—'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant={categoryColors[row.getValue('category')] || 'outline'}>
          {row.getValue('category')}
        </Badge>
      ),
    },
    {
      accessorKey: 'noticeDate',
      header: 'Date',
      cell: ({ row }) =>
        new Date(row.getValue('noticeDate')).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
        }),
    },
    {
      id: 'attachments',
      header: 'Files',
      cell: ({ row }) => {
        const count = row.original.attachments?.length || 0
        return count > 0 ? (
          <Badge variant="outline">{count} file{count > 1 ? 's' : ''}</Badge>
        ) : '—'
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={row.original.isPublished ? 'default' : 'secondary'}>
            {row.original.isPublished ? 'Published' : 'Draft'}
          </Badge>
          {row.original.isImportant && (
            <Badge variant="destructive" className="text-xs">Pinned</Badge>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={row.original.isPublished ? 'Unpublish' : 'Publish'}
            onClick={() => handleTogglePublish(row.original._id)}
          >
            {row.original.isPublished
              ? <EyeOff className="h-4 w-4 text-muted-foreground" />
              : <Eye className="h-4 w-4 text-green-600" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title={row.original.isImportant ? 'Unpin' : 'Pin as important'}
            onClick={() => handleToggleImportant(row.original._id)}
          >
            {row.original.isImportant
              ? <PinOff className="h-4 w-4 text-muted-foreground" />
              : <Pin className="h-4 w-4 text-amber-500" />}
          </Button>
          <Link href={`/notices/${row.original._id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            title="Delete"
            onClick={() => handleDelete(row.original._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [notices])

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
        <Link href="/notices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Notice
          </Button>
        </Link>
      </PageActions>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notices..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={categoryFilter === cat ? 'default' : 'outline'}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <GlassCard className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredNotices.length} notice{filteredNotices.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <DataTable columns={columns} data={filteredNotices} searchKey="title" />
      </GlassCard>
    </div>
  )
}

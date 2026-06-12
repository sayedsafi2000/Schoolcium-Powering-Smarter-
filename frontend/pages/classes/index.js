import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Trash2, Users as UsersIcon, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Classes({ user }) {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    fetchClasses()
  }, [user])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClasses(res.data)
    } catch (error) {
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Class deleted')
      fetchClasses()
    } catch (error) {
      toast.error('Failed to delete class')
    }
  }

  const columns = useMemo(() => [
    { accessorKey: 'className', header: 'Class', cell: ({ row }) => <span className="font-medium">{row.getValue('className')}</span> },
    { accessorKey: 'section', header: 'Section', cell: ({ row }) => row.getValue('section') || '—' },
    { accessorKey: 'capacity', header: 'Capacity' },
    { id: 'teacher', header: 'Class Teacher', cell: ({ row }) => row.original.classTeacher?.personalInfo?.firstName || 'Not assigned' },
    { id: 'students', header: 'Students', cell: ({ row }) => {
      const cls = row.original
      return <span className="inline-flex items-center gap-1.5"><UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />{cls.currentStrength || 0}/{cls.capacity || 0}</span>
    }},
    { id: 'actions', header: '', cell: ({ row }) => user?.role === 'admin' ? (
      <div className="flex items-center gap-1">
        <Link href={`/classes/${row.original._id}/edit`}>
          <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /></Button>
        </Link>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(row.original._id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ) : null },
  ], [user])

  if (loading) {
    return <div className="page-shell"><Skeleton className="h-10 w-full" /><Skeleton className="h-80 w-full" /></div>
  }

  return (
    <div className="page-shell">
      {user?.role === 'admin' && (
        <PageActions>
          <Link href="/classes/new"><Button><Plus className="h-4 w-4 mr-2" />Add class</Button></Link>
        </PageActions>
      )}
      <GlassCard><DataTable columns={columns} data={classes} searchKey="className" /></GlassCard>
    </div>
  )
}

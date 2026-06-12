import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Hotel, BedDouble, DoorOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export default function Hostel() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hostel/rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRooms(res.data)
    } catch {
      toast.error('Failed to load hostel rooms')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => ({
    total: rooms.length,
    available: rooms.filter(r => r.status === 'Available').length,
    occupiedBeds: rooms.reduce((sum, r) => sum + (r.occupiedBeds || 0), 0),
    totalBeds: rooms.reduce((sum, r) => sum + (r.totalBeds || 0), 0),
  }), [rooms])

  const columns = useMemo(() => [
    { id: 'hostel', header: 'Hostel', cell: ({ row }) => row.original.hostelId?.hostelName || '—' },
    { accessorKey: 'roomNumber', header: 'Room', cell: ({ row }) => <span className="font-medium">{row.getValue('roomNumber')}</span> },
    { accessorKey: 'floor', header: 'Floor', cell: ({ row }) => row.getValue('floor') ?? '—' },
    { id: 'beds', header: 'Beds', cell: ({ row }) => `${row.original.occupiedBeds || 0}/${row.original.totalBeds || 0}` },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-48 ml-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <Link href="/hostel/allocate"><Button variant="outline"><BedDouble className="h-4 w-4 mr-2" />Allocate</Button></Link>
        <Link href="/hostel/rooms/new"><Button><Plus className="h-4 w-4 mr-2" />Add room</Button></Link>
      </PageActions>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Hotel} title="Total rooms" value={stats.total} variant="info" />
        <StatCard icon={DoorOpen} title="Available rooms" value={stats.available} variant="success" />
        <StatCard icon={BedDouble} title="Bed occupancy" value={`${stats.occupiedBeds}/${stats.totalBeds}`} variant="default" />
      </div>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={rooms} searchKey="roomNumber" />
      </GlassCard>
    </div>
  )
}

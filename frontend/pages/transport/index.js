import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Bus, Route } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Transport() {
  const [activeTab, setActiveTab] = useState('routes')
  const [routes, setRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      if (activeTab === 'routes') {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/routes`, { headers })
        setRoutes(res.data)
      } else {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/vehicles`, { headers })
        setVehicles(res.data)
      }
    } catch {
      toast.error('Failed to load transport data')
    } finally {
      setLoading(false)
    }
  }

  const routeColumns = useMemo(() => [
    { accessorKey: 'routeName', header: 'Route', cell: ({ row }) => <span className="font-medium">{row.getValue('routeName')}</span> },
    { accessorKey: 'routeNumber', header: 'Number' },
    { accessorKey: 'startLocation', header: 'From', cell: ({ row }) => row.getValue('startLocation') || '—' },
    { accessorKey: 'endLocation', header: 'To', cell: ({ row }) => row.getValue('endLocation') || '—' },
    { id: 'fee', header: 'Monthly fee', cell: ({ row }) => formatCurrency(row.original.monthlyFee || 0) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  ], [])

  const vehicleColumns = useMemo(() => [
    { accessorKey: 'vehicleNumber', header: 'Number', cell: ({ row }) => <span className="font-medium">{row.getValue('vehicleNumber')}</span> },
    { accessorKey: 'vehicleType', header: 'Type' },
    { accessorKey: 'capacity', header: 'Capacity', cell: ({ row }) => row.getValue('capacity') ?? '—' },
    { id: 'driver', header: 'Driver', cell: ({ row }) => {
      const d = row.original.driver?.personalInfo
      return d ? `${d.firstName || ''} ${d.lastName || ''}`.trim() || '—' : '—'
    }},
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  ], [])

  const stats = useMemo(() => ({
    routes: routes.length,
    activeRoutes: routes.filter(r => r.status === 'Active').length,
    vehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === 'Active').length,
  }), [routes, vehicles])

  if (loading && routes.length === 0 && vehicles.length === 0) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-48 ml-auto" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="page-shell space-y-4">
      <PageActions>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={activeTab === 'routes' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('routes')}>Routes</Button>
          <Button variant={activeTab === 'vehicles' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('vehicles')}>Vehicles</Button>
        </div>
        {activeTab === 'routes' ? (
          <Link href="/transport/routes/new"><Button><Plus className="h-4 w-4 mr-2" />Add route</Button></Link>
        ) : (
          <Link href="/transport/new"><Button><Plus className="h-4 w-4 mr-2" />Add vehicle</Button></Link>
        )}
      </PageActions>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard icon={Route} title="Active routes" value={`${stats.activeRoutes}/${stats.routes}`} variant="info" />
        <StatCard icon={Bus} title="Active vehicles" value={`${stats.activeVehicles}/${stats.vehicles}`} variant="success" />
      </div>

      <GlassCard className="p-5">
        {loading ? (
          <Skeleton className="h-80 w-full" />
        ) : (
          <DataTable
            columns={activeTab === 'routes' ? routeColumns : vehicleColumns}
            data={activeTab === 'routes' ? routes : vehicles}
            searchKey={activeTab === 'routes' ? 'routeName' : 'vehicleNumber'}
          />
        )}
      </GlassCard>
    </div>
  )
}

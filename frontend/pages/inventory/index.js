import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, Package, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

export default function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(res.data)
    } catch {
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => ({
    totalItems: items.length,
    totalValue: items.reduce((sum, i) => sum + (i.totalValue || 0), 0),
    lowStock: items.filter(i => i.status === 'Low Stock' || (i.quantity != null && i.quantity <= 5)).length,
  }), [items])

  const columns = useMemo(() => [
    { accessorKey: 'itemCode', header: 'Code', cell: ({ row }) => <span className="font-medium">{row.getValue('itemCode')}</span> },
    { accessorKey: 'itemName', header: 'Item' },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => row.getValue('category') || '—' },
    { id: 'quantity', header: 'Qty', cell: ({ row }) => `${row.original.quantity ?? 0} ${row.original.unit || ''}`.trim() },
    { id: 'unitPrice', header: 'Unit price', cell: ({ row }) => formatCurrency(row.original.unitPrice || 0) },
    { id: 'totalValue', header: 'Total value', cell: ({ row }) => formatCurrency(row.original.totalValue || 0) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline">{row.getValue('status')}</Badge> },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-32 ml-auto" />
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
        <Link href="/inventory/new"><Button><Plus className="h-4 w-4 mr-2" />Add item</Button></Link>
      </PageActions>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Package} title="Total items" value={stats.totalItems} variant="info" />
        <StatCard icon={Package} title="Stock value" value={formatCurrency(stats.totalValue)} variant="success" />
        <StatCard icon={AlertTriangle} title="Low stock" value={stats.lowStock} variant="warning" />
      </div>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={items} searchKey="itemName" />
      </GlassCard>
    </div>
  )
}

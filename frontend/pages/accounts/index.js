import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/custom/data-table'
import { GlassCard } from '@/components/custom/glass-card'
import { StatCard } from '@/components/custom/stat-card'
import { ChartCard } from '@/components/custom/chart-card'
import { PageActions } from '@/components/custom/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'

const PIE_COLORS = ['#15803d', '#dc2626', '#2563eb', '#d97706', '#7c3aed']

export default function Accounts() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transactions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(res.data)
    } catch {
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + (t.amount || 0), 0)
    const expense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + (t.amount || 0), 0)
    return { income, expense, balance: income - expense }
  }, [transactions])

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc, t) => {
      const key = t.category || t.type || 'Other'
      acc[key] = (acc[key] || 0) + (t.amount || 0)
      return acc
    }, {})
    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  }, [transactions])

  const columns = useMemo(() => [
    { id: 'date', header: 'Date', cell: ({ row }) => new Date(row.original.date).toLocaleDateString() },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => row.getValue('category') || '—' },
    { id: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount || 0) },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => row.getValue('description') || '—' },
    { accessorKey: 'paymentMethod', header: 'Method', cell: ({ row }) => row.getValue('paymentMethod') || '—' },
  ], [])

  if (loading) {
    return (
      <div className="page-shell space-y-4">
        <Skeleton className="h-10 w-56 ml-auto" />
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
        <Link href="/accounts/new-account"><Button variant="outline">New account</Button></Link>
        <Link href="/accounts/new-transaction"><Button><Plus className="h-4 w-4 mr-2" />New transaction</Button></Link>
      </PageActions>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} title="Total income" value={formatCurrency(stats.income)} variant="success" />
        <StatCard icon={TrendingDown} title="Total expense" value={formatCurrency(stats.expense)} variant="danger" />
        <StatCard icon={Wallet} title="Net balance" value={formatCurrency(stats.balance)} variant="info" />
      </div>

      <ChartCard title="Transactions by category" description="Distribution of recorded amounts">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No transaction data yet</div>
        )}
      </ChartCard>

      <GlassCard className="p-5">
        <DataTable columns={columns} data={transactions} searchKey="category" />
      </GlassCard>
    </div>
  )
}

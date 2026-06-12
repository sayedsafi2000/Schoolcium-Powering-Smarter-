import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewTransaction() {
  const router = useRouter()
  const [accounts, setAccounts] = useState([])
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    accountId: '',
    type: 'Income',
    category: '',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    reference: '',
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accounts/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAccounts(res.data)
    } catch (error) {
      toast.error('Failed to load accounts')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Transaction recorded')
      router.push('/accounts')
    } catch (error) {
      toast.error('Failed to create transaction', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="New Transaction"
      description="Record an income or expense transaction"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Create Transaction"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountId">Account *</Label>
          <select id="accountId" className={selectClassName} value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} required>
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account._id} value={account._id}>{account.accountName} ({account.accountType})</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <select id="type" className={selectClassName} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <select id="paymentMethod" className={selectClassName} value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}

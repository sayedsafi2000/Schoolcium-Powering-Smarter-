import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewAccount() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'Income',
    balance: 0,
    description: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/accounts`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Account created')
      router.push('/accounts')
    } catch (error) {
      toast.error('Failed to create account', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="New Account"
      description="Create a new financial account"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Create Account"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name *</Label>
          <Input id="accountName" value={formData.accountName} onChange={(e) => setFormData({ ...formData, accountName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type *</Label>
          <select id="accountType" className={selectClassName} value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
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

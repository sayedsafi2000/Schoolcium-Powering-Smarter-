import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormPageLayout, selectClassName } from '@/components/custom/form-page-layout'
import { toast } from 'sonner'

export default function NewInventoryItem() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    category: '',
    quantity: 0,
    unit: 'Piece',
    unitPrice: 0,
    supplier: '',
    location: '',
    minimumStock: 10,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Inventory item added')
      router.push('/inventory')
    } catch (error) {
      toast.error('Failed to add item', {
        description: error.response?.data?.message || error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormPageLayout
      title="Add Inventory Item"
      description="Add a new item to school inventory"
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      isLoading={saving}
      submitLabel="Add Item"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="itemCode">Item Code *</Label>
          <Input id="itemCode" value={formData.itemCode} onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="itemName">Item Name *</Label>
          <Input id="itemName" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input id="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitPrice">Unit Price</Label>
          <Input id="unitPrice" type="number" step="0.01" value={formData.unitPrice} onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumStock">Minimum Stock</Label>
          <Input id="minimumStock" type="number" value={formData.minimumStock} onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        </div>
      </div>
    </FormPageLayout>
  )
}

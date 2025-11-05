import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewInventoryItem() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    category: '',
    quantity: 0,
    unit: 'Piece',
    unitPrice: 0,
    supplier: '',
    location: '',
    minimumStock: 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inventory/items`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/inventory')
    } catch (error) {
      alert('Error creating item: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Inventory Item</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Item Code *</label>
            <input
              type="text"
              value={formData.itemCode}
              onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="Piece, Box, Kg, etc."
            />
          </div>
          <div className="form-group">
            <label>Unit Price</label>
            <input
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Minimum Stock</label>
            <input
              type="number"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  )
}


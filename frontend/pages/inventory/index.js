import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Inventory({ user }) {
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
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <Link href="/inventory/new" className="btn btn-primary">Add Item</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.itemCode}</td>
              <td>{item.itemName}</td>
              <td>{item.category || 'N/A'}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>${item.unitPrice || 0}</td>
              <td>${item.totalValue || 0}</td>
              <td><span className={`status status-${item.status?.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


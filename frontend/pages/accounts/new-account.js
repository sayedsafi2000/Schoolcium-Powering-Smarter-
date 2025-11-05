import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewAccount() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'Income',
    balance: 0,
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/accounts/accounts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/accounts')
    } catch (error) {
      alert('Error creating account: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>New Account</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Account Name *</label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Account Type *</label>
            <select
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              required
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
            </select>
          </div>
          <div className="form-group">
            <label>Initial Balance</label>
            <input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
              step="0.01"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  )
}


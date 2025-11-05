import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Accounts({ user }) {
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
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Accounts & Finance</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/accounts/new-transaction" className="btn btn-primary">New Transaction</Link>
          <Link href="/accounts/new-account" className="btn btn-secondary">New Account</Link>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td><span className={`status status-${transaction.type?.toLowerCase()}`}>{transaction.type}</span></td>
              <td>{transaction.category || 'N/A'}</td>
              <td>${transaction.amount}</td>
              <td>{transaction.description || '-'}</td>
              <td>{transaction.paymentMethod || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Transport({ user }) {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/routes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoutes(res.data)
    } catch (error) {
      console.error('Error fetching routes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Transport Management</h1>
        <Link href="/transport/new" className="btn btn-primary">Add Route</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Route Name</th>
            <th>Route Number</th>
            <th>Start Location</th>
            <th>End Location</th>
            <th>Monthly Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route._id}>
              <td>{route.routeName}</td>
              <td>{route.routeNumber}</td>
              <td>{route.startLocation}</td>
              <td>{route.endLocation}</td>
              <td>${route.monthlyFee}</td>
              <td><span className={`status status-${route.status?.toLowerCase()}`}>{route.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Hostel({ user }) {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHostels()
  }, [])

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hostel/hostels`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setHostels(res.data)
    } catch (error) {
      console.error('Error fetching hostels:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Hostel Management</h1>
        <Link href="/hostel/new" className="btn btn-primary">Add Hostel</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Hostel Name</th>
            <th>Type</th>
            <th>Total Rooms</th>
            <th>Occupied Rooms</th>
            <th>Total Beds</th>
            <th>Occupied Beds</th>
          </tr>
        </thead>
        <tbody>
          {hostels.map(hostel => (
            <tr key={hostel._id}>
              <td>{hostel.hostelName}</td>
              <td>{hostel.type}</td>
              <td>{hostel.totalRooms}</td>
              <td>{hostel.occupiedRooms}</td>
              <td>{hostel.totalBeds}</td>
              <td>{hostel.occupiedBeds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewRoute() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState([])
  const [staff, setStaff] = useState([])
  const [formData, setFormData] = useState({
    routeName: '',
    routeNumber: '',
    startLocation: '',
    endLocation: '',
    distance: 0,
    monthlyFee: 0,
    vehicle: '',
    driver: '',
    status: 'Active'
  })

  useEffect(() => {
    fetchVehicles()
    fetchStaff()
  }, [])

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transport/vehicles`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVehicles(res.data)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hr`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStaff(res.data)
    } catch (error) {
      console.error('Error fetching staff:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transport/routes`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/transport')
    } catch (error) {
      alert('Error creating route: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Transport Route</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Route Name *</label>
            <input
              type="text"
              value={formData.routeName}
              onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Route Number *</label>
            <input
              type="text"
              value={formData.routeNumber}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Location *</label>
            <input
              type="text"
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>End Location *</label>
            <input
              type="text"
              value={formData.endLocation}
              onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Distance (km)</label>
            <input
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label>Monthly Fee</label>
            <input
              type="number"
              value={formData.monthlyFee}
              onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label>Vehicle</label>
            <select
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.vehicleNumber} - {v.vehicleType}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Driver</label>
            <select
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
            >
              <option value="">Select Driver</option>
              {staff.map(s => (
                <option key={s._id} value={s._id}>
                  {s.personalInfo?.firstName} {s.personalInfo?.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Route</button>
      </form>
    </div>
  )
}


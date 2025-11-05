import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewHostel() {
  const router = useRouter()
  const [staff, setStaff] = useState([])
  const [formData, setFormData] = useState({
    hostelName: '',
    type: 'Boys',
    address: '',
    totalRooms: 0,
    totalBeds: 0,
    warden: '',
    monthlyFee: 0,
    facilities: []
  })

  const [facilityInput, setFacilityInput] = useState('')

  useEffect(() => {
    fetchStaff()
  }, [])

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

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()]
      })
      setFacilityInput('')
    }
  }

  const removeFacility = (index) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/hostel/hostels`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/hostel')
    } catch (error) {
      alert('Error creating hostel: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Hostel</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Hostel Name *</label>
            <input
              type="text"
              value={formData.hostelName}
              onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Total Rooms *</label>
            <input
              type="number"
              value={formData.totalRooms}
              onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="form-group">
            <label>Total Beds *</label>
            <input
              type="number"
              value={formData.totalBeds}
              onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 0 })}
              required
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
            <label>Warden</label>
            <select
              value={formData.warden}
              onChange={(e) => setFormData({ ...formData, warden: e.target.value })}
            >
              <option value="">Select Warden</option>
              {staff.map(s => (
                <option key={s._id} value={s._id}>
                  {s.personalInfo?.firstName} {s.personalInfo?.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Facilities</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
              placeholder="Add facility and press Enter"
            />
            <button type="button" onClick={addFacility} className="btn btn-secondary">Add</button>
          </div>
          <div>
            {formData.facilities.map((facility, index) => (
              <span key={index} style={{ display: 'inline-block', margin: '0.25rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '4px' }}>
                {facility}
                <button type="button" onClick={() => removeFacility(index)} style={{ marginLeft: '0.5rem', background: 'red', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>×</button>
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Hostel</button>
      </form>
    </div>
  )
}


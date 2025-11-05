import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewAnnouncement() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'General',
    targetAudience: ['All'],
    classes: [],
    expiryDate: ''
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClasses(res.data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const handleTargetAudienceChange = (value) => {
    if (value === 'All') {
      setFormData({ ...formData, targetAudience: ['All'] })
    } else {
      const current = formData.targetAudience.filter(a => a !== 'All')
      if (current.includes(value)) {
        setFormData({ ...formData, targetAudience: current.filter(a => a !== value) })
      } else {
        setFormData({ ...formData, targetAudience: [...current, value] })
      }
    }
  }

  const handleClassChange = (classId) => {
    const current = formData.classes
    if (current.includes(classId)) {
      setFormData({ ...formData, classes: current.filter(c => c !== classId) })
    } else {
      setFormData({ ...formData, classes: [...current, classId] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/communication')
    } catch (error) {
      alert('Error creating announcement: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Create New Announcement</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="6"
            required
          />
        </div>
        <div className="form-group">
          <label>Target Audience</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['All', 'Students', 'Teachers', 'Parents', 'Staff'].map(audience => (
              <label key={audience} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.targetAudience.includes(audience)}
                  onChange={() => handleTargetAudienceChange(audience)}
                />
                {audience}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Specific Classes (Optional)</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {classes.map(cls => (
              <label key={cls._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={formData.classes.includes(cls._id)}
                  onChange={() => handleClassChange(cls._id)}
                />
                {cls.className} {cls.section ? `- ${cls.section}` : ''}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Create Announcement</button>
      </form>
    </div>
  )
}


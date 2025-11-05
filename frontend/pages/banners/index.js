import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

export default function Banners({ user, setUser }) {
  const router = useRouter()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: 'homepage',
    order: 0,
    link: '',
    startDate: '',
    endDate: '',
    isActive: true
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }
    fetchBanners()
  }, [user])

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBanners(res.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      formDataToSend.append('image', imageFile)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('position', formData.position)
      formDataToSend.append('order', formData.order)
      formDataToSend.append('link', formData.link)
      formDataToSend.append('startDate', formData.startDate)
      formDataToSend.append('endDate', formData.endDate)
      formDataToSend.append('isActive', formData.isActive)

      if (editingBanner) {
        // Update existing banner
        if (imageFile) {
          // Update image
          const imageRes = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/banners/${editingBanner._id}/image`,
            formDataToSend,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          )
          
          // Update other fields
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/banners/${editingBanner._id}`,
            {
              title: formData.title,
              description: formData.description,
              position: formData.position,
              order: formData.order,
              link: formData.link,
              startDate: formData.startDate,
              endDate: formData.endDate,
              isActive: formData.isActive
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        } else {
          // Update without image
          await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/banners/${editingBanner._id}`,
            formData,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        }
      } else {
        // Create new banner
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/banners`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            },
            timeout: 120000, // 2 minutes timeout
            onUploadProgress: () => {}
          }
        )
      }

      resetForm()
      fetchBanners()
      alert(editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!')
    } catch (error) {
      const errorData = error.response?.data || {}
      const errorMessage = errorData.message || error.message || 'Unknown error occurred'
      alert(`Error saving banner: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      position: banner.position || 'homepage',
      order: banner.order || 0,
      link: banner.link || '',
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      isActive: banner.isActive !== undefined ? banner.isActive : true
    })
    setImagePreview(banner.imageUrl)
    setImageFile(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBanners()
      alert('Banner deleted successfully!')
    } catch (error) {
      alert('Error deleting banner: ' + (error.response?.data?.message || error.message))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      position: 'homepage',
      order: 0,
      link: '',
      startDate: '',
      endDate: '',
      isActive: true
    })
    setImageFile(null)
    setImagePreview(null)
    setEditingBanner(null)
    setShowForm(false)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Banner Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Banner'}
        </button>
      </div>

      {showForm && (
        <div className="form" style={{ marginBottom: '2rem' }}>
          <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Banner Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter banner title"
                />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="homepage">Homepage</option>
                  <option value="about">About</option>
                  <option value="contact">Contact</option>
                  <option value="gallery">Gallery</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Order (Display Priority)</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>Start Date (Optional)</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Enter banner description"
              />
            </div>

            <div className="form-group">
              <label>Banner Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingBanner}
              />
              {imagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '300px', 
                      borderRadius: '8px',
                      border: '2px solid var(--border-color)'
                    }} 
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                {' '}Active (Show on website)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Position</th>
              <th>Order</th>
              <th>Status</th>
              <th>Dates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  No banners found. Create your first banner!
                </td>
              </tr>
            ) : (
              banners.map(banner => (
                <tr key={banner._id}>
                  <td>
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title}
                      style={{
                        width: '100px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                  </td>
                  <td>
                    <strong>{banner.title}</strong>
                    {banner.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {banner.description.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="status status-active">{banner.position}</span>
                  </td>
                  <td>{banner.order}</td>
                  <td>
                    <span className={`status status-${banner.isActive ? 'active' : 'inactive'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {banner.startDate && (
                      <div style={{ fontSize: '0.875rem' }}>
                        From: {new Date(banner.startDate).toLocaleDateString()}
                      </div>
                    )}
                    {banner.endDate && (
                      <div style={{ fontSize: '0.875rem' }}>
                        To: {new Date(banner.endDate).toLocaleDateString()}
                      </div>
                    )}
                    {!banner.startDate && !banner.endDate && 'No dates set'}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(banner)}
                      className="btn btn-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(banner._id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


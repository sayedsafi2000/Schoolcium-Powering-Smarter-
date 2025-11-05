import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function NewBook() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: '',
    totalCopies: 1,
    price: 0,
    publishedDate: '',
    description: '',
    shelfNumber: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      router.push('/library')
    } catch (error) {
      alert('Error creating book: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="page-container">
      <h1>Add New Book</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
          </div>
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
            <label>Author *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              value={formData.publisher}
              onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
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
            <label>Total Copies *</label>
            <input
              type="number"
              value={formData.totalCopies}
              onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label>Published Date</label>
            <input
              type="date"
              value={formData.publishedDate}
              onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Shelf Number</label>
            <input
              type="text"
              value={formData.shelfNumber}
              onChange={(e) => setFormData({ ...formData, shelfNumber: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  )
}


import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Library({ user }) {
  const [books, setBooks] = useState([])
  const [issues, setIssues] = useState([])
  const [activeTab, setActiveTab] = useState('books')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks()
    } else {
      fetchIssues()
    }
  }, [activeTab])

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBooks(res.data)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/issues`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIssues(res.data)
    } catch (error) {
      console.error('Error fetching issues:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Library Management</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/library/new" className="btn btn-primary">Add Book</Link>
          <div>
          <button
            className={`btn ${activeTab === 'books' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('books')}
          >
            Books
          </button>
          <button
            className={`btn ${activeTab === 'issues' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('issues')}
          >
            Issues
          </button>
        </div>
      </div>
      {activeTab === 'books' ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Total Copies</th>
              <th>Available</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn || 'N/A'}</td>
                <td>{book.totalCopies}</td>
                <td>{book.availableCopies}</td>
                <td>{book.category || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Student</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <tr key={issue._id}>
                <td>{issue.bookId?.title || 'N/A'}</td>
                <td>{issue.studentId?.personalInfo?.firstName || 'N/A'}</td>
                <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                <td><span className={`status status-${issue.status?.toLowerCase()}`}>{issue.status}</span></td>
                <td>${issue.fineAmount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


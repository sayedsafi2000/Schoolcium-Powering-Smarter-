import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function StudentBooks({ user }) {
  const router = useRouter()
  const [issues, setIssues] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/')
      return
    }
    fetchStudentBooks()
  }, [user])

  const fetchStudentBooks = async () => {
    try {
      const token = localStorage.getItem('token')
      const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const studentsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const studentData = studentsRes.data.find(s => 
        s.userId === userRes.data._id || 
        s.personalInfo?.email === userRes.data.email
      )
      
      if (studentData) {
        setStudent(studentData)
        const issuesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/library/issues`, {
          params: { studentId: studentData._id },
          headers: { Authorization: `Bearer ${token}` }
        })
        setIssues(issuesRes.data)
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Issued': return 'status-pending'
      case 'Returned': return 'status-active'
      case 'Overdue': return 'status-inactive'
      default: return ''
    }
  }

  if (loading) return <div>Loading...</div>

  const activeIssues = issues.filter(i => i.status === 'Issued' || i.status === 'Overdue')
  const returnedIssues = issues.filter(i => i.status === 'Returned')

  return (
    <div className="page-container">
      <h1>My Library Books</h1>
      
      {activeIssues.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Currently Issued Books</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {activeIssues.map(issue => (
                <tr key={issue._id}>
                  <td>{issue.bookId?.title || 'N/A'}</td>
                  <td>{issue.bookId?.author || 'N/A'}</td>
                  <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>${issue.fineAmount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {returnedIssues.length > 0 && (
        <div>
          <h2>Returned Books History</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Author</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returnedIssues.map(issue => (
                <tr key={issue._id}>
                  <td>{issue.bookId?.title || 'N/A'}</td>
                  <td>{issue.bookId?.author || 'N/A'}</td>
                  <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`status ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {issues.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No books issued yet.</p>
        </div>
      )}
    </div>
  )
}


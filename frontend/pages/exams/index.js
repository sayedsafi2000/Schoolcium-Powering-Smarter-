import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'

export default function Exams({ user }) {
  const router = useRouter()
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/')
      return
    }
    fetchExams()
  }, [user])

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExams(res.data)
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Exams</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <Link href="/exams/new" className="btn btn-primary">Create Exam</Link>
        )}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Exam Name</th>
            <th>Type</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam._id}>
              <td>{exam.examName}</td>
              <td>{exam.examType}</td>
              <td>{exam.class?.className || 'N/A'}</td>
              <td>{exam.subject?.subjectName || 'N/A'}</td>
              <td>{new Date(exam.startDate).toLocaleDateString()}</td>
              <td>{new Date(exam.endDate).toLocaleDateString()}</td>
              <td><span className={`status status-${exam.status?.toLowerCase()}`}>{exam.status}</span></td>
              <td>
                <Link href={`/exams/${exam._id}`} className="btn btn-sm">View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


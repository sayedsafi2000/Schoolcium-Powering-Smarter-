import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Results({ user }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setResults(res.data)
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <h1>Results & Transcript</h1>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Exam</th>
            <th>Subject</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
            <th>Grade</th>
            <th>GPA</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result._id}>
              <td>{result.studentId?.personalInfo?.firstName || 'N/A'}</td>
              <td>{result.examId?.examName || 'N/A'}</td>
              <td>{result.subject?.subjectName || 'N/A'}</td>
              <td>{result.marksObtained}</td>
              <td>{result.totalMarks}</td>
              <td>{result.grade || '-'}</td>
              <td>{result.gpa || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


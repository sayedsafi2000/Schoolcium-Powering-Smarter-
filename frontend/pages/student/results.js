import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function StudentResults({ user }) {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/')
      return
    }
    fetchStudentResults()
  }, [user])

  const fetchStudentResults = async () => {
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
        const resultsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/results/student/${studentData._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setResults(resultsRes.data)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateGPA = () => {
    if (results.length === 0) return 0
    const totalGPA = results.reduce((sum, r) => sum + (r.gpa || 0), 0)
    return (totalGPA / results.length).toFixed(2)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <h1>My Results</h1>
      
      {results.length > 0 && (
        <div className="stat-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h3>Overall GPA</h3>
          <p className="stat-number" style={{ fontSize: '3rem' }}>{calculateGPA()}</p>
        </div>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Exam</th>
            <th>Subject</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>GPA</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => {
            const percentage = ((result.marksObtained / result.totalMarks) * 100).toFixed(2)
            return (
              <tr key={result._id}>
                <td>{result.examId?.examName || 'N/A'}</td>
                <td>{result.subject?.subjectName || 'N/A'}</td>
                <td>{result.marksObtained}</td>
                <td>{result.totalMarks}</td>
                <td>{percentage}%</td>
                <td>{result.grade || '-'}</td>
                <td>{result.gpa || '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No results found.</p>
        </div>
      )}
    </div>
  )
}


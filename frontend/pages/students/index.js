import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Students({ user }) {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStudents(res.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchStudents()
    } catch (error) {
      alert('Error deleting student')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Students</h1>
        <Link href="/students/new" className="btn btn-primary">Add Student</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.personalInfo?.firstName} {student.personalInfo?.lastName}</td>
              <td>{student.academicInfo?.class?.className || 'N/A'}</td>
              <td>{student.personalInfo?.email || 'N/A'}</td>
              <td>{student.personalInfo?.phone || 'N/A'}</td>
              <td><span className={`status status-${student.status?.toLowerCase()}`}>{student.status}</span></td>
              <td>
                <Link href={`/students/${student._id}`} className="btn btn-sm">View</Link>
                <Link href={`/students/${student._id}/edit`} className="btn btn-sm">Edit</Link>
                <button onClick={() => handleDelete(student._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


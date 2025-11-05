import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Teachers({ user }) {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTeachers(res.data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTeachers()
    } catch (error) {
      alert('Error deleting teacher')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Teachers</h1>
        <Link href="/teachers/new" className="btn btn-primary">Add Teacher</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Teacher ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => (
            <tr key={teacher._id}>
              <td>{teacher.teacherId}</td>
              <td>{teacher.personalInfo?.firstName} {teacher.personalInfo?.lastName}</td>
              <td>{teacher.personalInfo?.email || 'N/A'}</td>
              <td>{teacher.personalInfo?.phone || 'N/A'}</td>
              <td>{teacher.professionalInfo?.department || 'N/A'}</td>
              <td><span className={`status status-${teacher.status?.toLowerCase()}`}>{teacher.status}</span></td>
              <td>
                <Link href={`/teachers/${teacher._id}`} className="btn btn-sm">View</Link>
                <Link href={`/teachers/${teacher._id}/edit`} className="btn btn-sm">Edit</Link>
                <button onClick={() => handleDelete(teacher._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


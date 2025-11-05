import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Classes({ user }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/academic/classes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchClasses()
    } catch (error) {
      alert('Error deleting class: ' + (error.response?.data?.message || error.message))
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Classes</h1>
        <Link href="/classes/new" className="btn btn-primary">Add Class</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Section</th>
            <th>Class Teacher</th>
            <th>Capacity</th>
            <th>Current Strength</th>
            <th>Academic Year</th>
            <th>Room Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls._id}>
              <td>{cls.className}</td>
              <td>{cls.section || '-'}</td>
              <td>{cls.classTeacher?.personalInfo?.firstName || 'N/A'}</td>
              <td>{cls.capacity}</td>
              <td>{cls.currentStrength}</td>
              <td>{cls.academicYear || '-'}</td>
              <td>{cls.roomNumber || '-'}</td>
              <td>
                <Link href={`/classes/${cls._id}`} className="btn btn-sm">View</Link>
                <Link href={`/classes/${cls._id}/edit`} className="btn btn-sm">Edit</Link>
                <button onClick={() => handleDelete(cls._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


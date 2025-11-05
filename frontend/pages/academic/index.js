import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Academic({ user }) {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [routines, setRoutines] = useState([])
  const [activeTab, setActiveTab] = useState('classes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'classes') {
      fetchClasses()
    } else if (activeTab === 'subjects') {
      fetchSubjects()
    } else {
      fetchRoutines()
    }
  }, [activeTab])

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

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubjects(res.data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/routines`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRoutines(res.data)
    } catch (error) {
      console.error('Error fetching routines:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Academic Management</h1>
        <div>
          <button
            className={`btn ${activeTab === 'classes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('classes')}
          >
            Classes
          </button>
          <button
            className={`btn ${activeTab === 'subjects' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('subjects')}
          >
            Subjects
          </button>
          <button
            className={`btn ${activeTab === 'routines' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('routines')}
          >
            Routines
          </button>
        </div>
      </div>
      {activeTab === 'classes' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Section</th>
              <th>Class Teacher</th>
              <th>Capacity</th>
              <th>Current Strength</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {activeTab === 'subjects' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Department</th>
              <th>Credit Hours</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(subject => (
              <tr key={subject._id}>
                <td>{subject.subjectCode}</td>
                <td>{subject.subjectName}</td>
                <td>{subject.department || 'N/A'}</td>
                <td>{subject.creditHours || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {activeTab === 'routines' && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {routines.map(routine => (
              <tr key={routine._id}>
                <td>{routine.class?.className || 'N/A'}</td>
                <td>{routine.subject?.subjectName || 'N/A'}</td>
                <td>{routine.teacher?.personalInfo?.firstName || 'N/A'}</td>
                <td>{routine.day}</td>
                <td>{routine.startTime} - {routine.endTime}</td>
                <td>{routine.room || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


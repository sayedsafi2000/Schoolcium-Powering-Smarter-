import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function StudentRoutine({ user }) {
  const router = useRouter()
  const [routines, setRoutines] = useState([])
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/')
      return
    }
    fetchStudentRoutine()
  }, [user])

  const fetchStudentRoutine = async () => {
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
      
      if (studentData && studentData.academicInfo?.class) {
        setStudent(studentData)
        const routinesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/academic/routines`, {
          params: { classId: studentData.academicInfo.class._id || studentData.academicInfo.class },
          headers: { Authorization: `Bearer ${token}` }
        })
        setRoutines(routinesRes.data)
      }
    } catch (error) {
      console.error('Error fetching routine:', error)
    } finally {
      setLoading(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const getRoutineByDay = (day) => routines.filter(r => r.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <h1>My Class Routine</h1>
      {student?.academicInfo?.class && (
        <p><strong>Class:</strong> {student.academicInfo.class.className} {student.academicInfo.section ? `- ${student.academicInfo.section}` : ''}</p>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {days.map(day => {
          const dayRoutines = getRoutineByDay(day)
          if (dayRoutines.length === 0) return null
          
          return (
            <div key={day} className="stat-card">
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>{day}</h3>
              <div>
                {dayRoutines.map(routine => (
                  <div key={routine._id} style={{ 
                    padding: '0.75rem', 
                    marginBottom: '0.5rem', 
                    background: '#f8f9fa', 
                    borderRadius: '4px',
                    borderLeft: '3px solid #3498db'
                  }}>
                    <div><strong>{routine.subject?.subjectName || 'N/A'}</strong></div>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      {routine.startTime} - {routine.endTime}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
                      {routine.teacher?.personalInfo?.firstName || 'N/A'} {routine.teacher?.personalInfo?.lastName || ''}
                    </div>
                    {routine.room && (
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>
                        Room: {routine.room}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {routines.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No routine found for your class.</p>
        </div>
      )}
    </div>
  )
}


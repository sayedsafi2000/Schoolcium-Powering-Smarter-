import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

export default function Communication({ user }) {
  const [announcements, setAnnouncements] = useState([])
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('announcements')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements()
    } else {
      fetchMessages()
    }
  }, [activeTab])

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communication/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnnouncements(res.data)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/communication/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(res.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Communication</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/communication/new" className="btn btn-primary">New Announcement</Link>
          <div>
            <button
              className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('announcements')}
            >
              Announcements
            </button>
            <button
              className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </button>
          </div>
        </div>
      </div>
      {activeTab === 'announcements' ? (
        <div>
          {announcements.map(announcement => (
            <div key={announcement._id} className="announcement-card">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <small>{new Date(announcement.publishDate).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(message => (
              <tr key={message._id}>
                <td>{message.from?.username || 'N/A'}</td>
                <td>{message.subject || '-'}</td>
                <td>{message.content.substring(0, 50)}...</td>
                <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                <td>{message.isRead ? 'Read' : 'Unread'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}


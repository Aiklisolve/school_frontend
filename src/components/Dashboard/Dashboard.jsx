import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserTypeLabel = (type) => {
    const labels = {
      student: 'Student',
      parent: 'Parent',
      teacher: 'Teacher',
      staff: 'School Staff'
    }
    return labels[type] || type
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name || user?.email}!</h1>
          <p className="user-type-badge">{getUserTypeLabel(user?.userType)}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Dashboard</h2>
          <p>You have successfully logged in as a {getUserTypeLabel(user?.userType)}.</p>
          <p className="info-text">
            This is a placeholder dashboard. The full dashboard will be implemented based on your user role.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


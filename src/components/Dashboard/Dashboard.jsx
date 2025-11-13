import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const { user, logout, otp, setOtp } = useAuth()
  const navigate = useNavigate()

  // Check localStorage for OTP on mount and sync with context
  useEffect(() => {
    const storedOtp = localStorage.getItem('otp')
    
    // If OTP is in localStorage but not in context, restore it
    if (storedOtp && !otp) {
      setOtp(storedOtp)
    }
  }, [otp, setOtp])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getUserTypeLabel = (type) => {
    const labels = {
      student: 'Student',
      parent: 'Parent',
      teacher: 'Teacher',
      staff: 'School Staff',
      admin: 'Admin'
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
          {/* {(otp || localStorage.getItem('otp')) && (
            <div className="otp-display">
              <h3>Your OTP</h3>
              <div className="otp-code">{otp || localStorage.getItem('otp')}</div>
              <p className="otp-info">This OTP was sent during login</p>
            </div>
          )} */}
          <p className="info-text">
            This is a placeholder dashboard. The full dashboard will be implemented based on your user role.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


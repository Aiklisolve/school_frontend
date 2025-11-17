import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
          <p className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
            {getUserTypeLabel(user?.userType)}
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 text-white border-none px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md"
        >
          Logout
        </button>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-gray-900 m-0 mb-4 text-xl">Dashboard</h2>
          <p className="text-gray-600 leading-relaxed my-2">You have successfully logged in as a {getUserTypeLabel(user?.userType)}.</p>
          {/* {(otp || localStorage.getItem('otp')) && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 my-6 text-center text-white">
              <h3 className="m-0 mb-4 text-lg font-semibold text-white">Your OTP</h3>
              <div className="text-3xl font-bold tracking-widest bg-white/20 px-6 py-4 rounded-lg my-4 font-mono">
                {otp || localStorage.getItem('otp')}
              </div>
              <p className="my-3 text-sm opacity-90 text-white">This OTP was sent during login</p>
            </div>
          )} */}
          <p className="text-gray-500 text-sm italic mt-4">
            This is a placeholder dashboard. The full dashboard will be implemented based on your user role.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


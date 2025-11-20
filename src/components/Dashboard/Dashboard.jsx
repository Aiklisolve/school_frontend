import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ParentRegistration from '../ParentRegistration/ParentRegistration'

const Dashboard = () => {
  const { user, logout, otp, setOtp } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('registration')

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

  // Robust parent-role check: look at multiple possible fields and localStorage fallback
  const isParentUser = (() => {
    try {
      const local = localStorage.getItem('user')
      const localParsed = local ? JSON.parse(local) : null
      const u = user || localParsed
      if (!u) return false

      const roleCandidates = [u.userType, u.user_type, u.role, u.type, u.roleName, u.role_name]
      for (let r of roleCandidates) {
        if (!r) continue
        const s = String(r).toLowerCase()
        if (s.includes('parent')) return true
      }

      // Also check nested fields that some APIs return
      if (u?.roles && Array.isArray(u.roles)) {
        for (const r of u.roles) {
          if (String(r).toLowerCase().includes('parent')) return true
        }
      }

      return false
    } catch (e) {
      return false
    }
  })()

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

      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 m-0 mb-2 text-xl">Dashboard</h2>
            <p className="text-gray-600 text-sm">You are a {getUserTypeLabel(user?.userType)}</p>
          </div>

          <div className="mt-6">
            {user?.userType === 'PARENT' ? (
              <>
                {/* Tabs */}
                <div className="flex gap-2 border-b pb-2">
                  {['registration','upload','chat','meeting','calendar'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-t-md -mb-px ${activeTab===tab ? 'bg-white border border-b-0 border-gray-200 text-gray-800' : 'text-gray-500'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {activeTab === 'registration' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Parent Registration</h3>
                      <ParentRegistration />
                    </div>
                  )}

                  {activeTab === 'upload' && (
                    <div className="p-6 bg-white rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">Upload</h3>
                      <p className="text-sm text-gray-600">Upload documents and images here (placeholder).</p>
                    </div>
                  )}

                  {activeTab === 'chat' && (
                    <div className="p-6 bg-white rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">Chat AI</h3>
                      <p className="text-sm text-gray-600">Chat with AI assistant (placeholder).</p>
                    </div>
                  )}

                  {activeTab === 'meeting' && (
                    <div className="p-6 bg-white rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">Meeting Scheduler</h3>
                      <p className="text-sm text-gray-600">Schedule parent-teacher meetings here (placeholder).</p>
                    </div>
                  )}

                  {activeTab === 'calendar' && (
                    <div className="p-6 bg-white rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">Calendar</h3>
                      <p className="text-sm text-gray-600">Calendar view (placeholder).</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 bg-white rounded-md shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
                <p className="text-sm text-gray-600">These tabs are available for Parent users only. Your role: <span className="font-medium">{getUserTypeLabel(user?.userType)}</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


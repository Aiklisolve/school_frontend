import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const StudentDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Overview', gradient: 'from-purple-500 to-purple-600', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'courses', label: 'My Courses', gradient: 'from-blue-500 to-blue-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'assignments', label: 'Assignments', gradient: 'from-orange-500 to-orange-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'grades', label: 'Grades', gradient: 'from-green-500 to-green-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'timetable', label: 'Timetable', gradient: 'from-indigo-500 to-indigo-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'materials', label: 'Study Materials', gradient: 'from-pink-500 to-pink-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      'overview': 'Overview',
      'courses': 'My Courses',
      'assignments': 'Assignments',
      'grades': 'Grades',
      'timetable': 'Timetable',
      'materials': 'Study Materials'
    }
    return titles[tab] || 'Student Dashboard'
  }

  const getTabDescription = (tab) => {
    const descriptions = {
      'overview': 'View your academic overview and quick access to all features',
      'courses': 'View your enrolled courses and class schedules',
      'assignments': 'Submit and track your assignment submissions',
      'grades': 'Check your academic performance and grades',
      'timetable': 'View your daily class schedule and timetable',
      'materials': 'Access study materials and resources'
    }
    return descriptions[tab] || 'Manage your academic activities'
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get user_id from user object
        const userId = user?.id || user?.user_id
        if (!userId) {
          console.warn('User ID not found in user object:', user)
          setError('User ID not found')
          setLoading(false)
          return
        }

        // Step 1: Call /api/users/{user_id} to get user details and student_id
        const token = localStorage.getItem('token')
        const userUrl = `${API_BASE_URL}/users/${userId}`
        console.log('Fetching user details from:', userUrl)
        
        const userResponse = await axios.get(userUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('User API Response:', userResponse.data)
        
        // Step 2: Extract student_id from the response
        const studentId = userResponse.data?.student?.[0]?.student_id
        if (!studentId) {
          console.warn('Student ID not found in user response:', userResponse.data)
          setError('Student ID not found in user profile')
          setLoading(false)
          return
        }

        // Step 3: Call /api/students/{student_id}/dashboard
        const dashboardUrl = `${API_BASE_URL}/students/${studentId}/dashboard`
        console.log('Fetching student dashboard data from:', dashboardUrl)
        
        const dashboardResponse = await axios.get(dashboardUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Student Dashboard API Response:', dashboardResponse.data)
        setDashboardData(dashboardResponse.data)
      } catch (err) {
        console.error('Error fetching student dashboard data:', err)
        setError(err.response?.data?.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar Navigation */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-purple-700 to-pink-700 text-white shadow-2xl flex flex-col transition-all duration-300 overflow-hidden h-full flex-shrink-0`}>
        {/* Sidebar Header - Fixed at top */}
        {sidebarOpen && (
          <>
            <div className="p-6 border-b border-purple-600 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9l.01 0" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Student Portal</h1>
                  <p className="text-xs text-purple-200">Dashboard</p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-600">
                <p className="text-sm font-medium truncate">{user?.full_name || user?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-purple-200 mt-1">Welcome back!</p>
              </div>
            </div>
          </>
        )}

        {/* Navigation Menu - Scrollable */}
        {sidebarOpen && (
          <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden min-h-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setSidebarOpen(false) // Hide sidebar when item is selected
                }}
                className={`w-full px-6 py-4 text-left flex items-center gap-4 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 border-r-4 border-white shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeTab === tab.id ? 'bg-white/30' : 'bg-white/10'
                }`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                </div>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Logout Button - Fixed at bottom */}
        {sidebarOpen && (
          <div className="p-4 border-t border-purple-600 flex-shrink-0 bg-gradient-to-b from-purple-700 to-pink-700">
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center gap-3 transition-all duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full min-w-0">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getTabTitle(activeTab)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {getTabDescription(activeTab)}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loading ? '...' : (dashboardData?.attendanceSummary?.[0]?.attendance_percentage || '0')}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Fee Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : (dashboardData?.feeSummary?.total_balance ? `₹${dashboardData.feeSummary.total_balance}` : '₹0')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Overall %</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '...' : (dashboardData?.recentReportCards?.[0]?.overall_percentage || '0')}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-8 min-h-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-red-200">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : (
            <>
          {/* Statistics Cards - Modern Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Attendance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Attendance</h3>
              <p className="text-gray-900 text-3xl font-bold">
                {dashboardData?.attendanceSummary?.[0]?.attendance_percentage || '0'}%
              </p>
            </div>
          </div>

          {/* Overall Percentage Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Overall %</h3>
              <p className="text-gray-900 text-3xl font-bold">
                {dashboardData?.recentReportCards?.[0]?.overall_percentage || '0'}%
              </p>
            </div>
          </div>

          {/* Fee Balance Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Fee Balance</h3>
              <p className="text-gray-900 text-3xl font-bold">
                ₹{dashboardData?.feeSummary?.total_balance || '0'}
              </p>
            </div>
          </div>

          {/* Upcoming Payments Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Upcoming Payments</h3>
              <p className="text-gray-900 text-3xl font-bold">
                {dashboardData?.upcomingPayments?.length || 0}
              </p>
            </div>
          </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Profile Section */}
                {dashboardData?.profile && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Full Name</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Admission Number</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.admission_number}</p>
                      </div>
                      {dashboardData.profile.roll_number && (
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Roll Number</p>
                          <p className="text-gray-900 font-semibold">{dashboardData.profile.roll_number}</p>
                        </div>
                      )}
                      {dashboardData.profile.gender && (
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Gender</p>
                          <p className="text-gray-900 font-semibold">{dashboardData.profile.gender}</p>
                        </div>
                      )}
                      {dashboardData.profile.date_of_birth && (
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Date of Birth</p>
                          <p className="text-gray-900 font-semibold">
                            {new Date(dashboardData.profile.date_of_birth).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Admission Class</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.admission_class}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Current Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          dashboardData.profile.current_status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {dashboardData.profile.current_status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">School</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.school_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Branch</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.branch_name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Enrollment */}
                {dashboardData?.currentEnrollment && (
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Current Enrollment</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {dashboardData.currentEnrollment.class_name} - Section {dashboardData.currentEnrollment.section_name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">Academic Year: {dashboardData.currentEnrollment.year_name}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Enrollment Date: {new Date(dashboardData.currentEnrollment.enrollment_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          dashboardData.currentEnrollment.is_current && dashboardData.currentEnrollment.is_active
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {dashboardData.currentEnrollment.is_current && dashboardData.currentEnrollment.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attendance Summary */}
                {dashboardData?.attendanceSummary && dashboardData.attendanceSummary.length > 0 && (
                  <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Summary</h3>
                    <div className="space-y-3">
                      {dashboardData.attendanceSummary.slice(0, 2).map((summary, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                Month {summary.month} - {new Date(summary.updated_at).getFullYear()}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Updated: {new Date(summary.updated_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{summary.attendance_percentage}%</p>
                              <p className="text-xs text-gray-500">Attendance</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Total Days</p>
                              <p className="text-sm font-bold text-gray-900">{summary.total_school_days}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Present</p>
                              <p className="text-sm font-bold text-green-600">{summary.present_days}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Absent</p>
                              <p className="text-sm font-bold text-red-600">{summary.absent_days}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Late</p>
                              <p className="text-sm font-bold text-orange-600">{summary.late_days}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Half Days</p>
                              <p className="text-sm font-bold text-yellow-600">{summary.half_days}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Attendance */}
                {dashboardData?.recentAttendance && dashboardData.recentAttendance.length > 0 && (
                  <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h3>
                    <div className="space-y-3">
                      {dashboardData.recentAttendance.slice(0, 2).map((attendance, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {new Date(attendance.attendance_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                              </h4>
                              {attendance.check_in_time && attendance.check_out_time && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Check-in: {attendance.check_in_time?.substring(0, 5)} • Check-out: {attendance.check_out_time?.substring(0, 5)}
                                </p>
                              )}
                              {attendance.remarks && (
                                <p className="text-xs text-gray-500 mt-1">Remarks: {attendance.remarks}</p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              attendance.status === 'PRESENT' 
                                ? 'bg-green-500 text-white'
                                : attendance.status === 'ABSENT'
                                ? 'bg-red-500 text-white'
                                : attendance.status === 'LATE'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}>
                              {attendance.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fee Summary */}
                {dashboardData?.feeSummary && (
                  <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Fee Summary</h3>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Fee</p>
                          <p className="text-gray-900 font-bold text-lg">₹{dashboardData.feeSummary.total_fee_amount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Concession</p>
                          <p className="text-gray-900 font-bold text-lg">₹{dashboardData.feeSummary.concession_amount}</p>
                          {dashboardData.feeSummary.concession_reason && (
                            <p className="text-xs text-gray-600 mt-1">({dashboardData.feeSummary.concession_reason})</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Paid</p>
                          <p className="text-gray-900 font-bold text-lg">₹{dashboardData.feeSummary.total_paid}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Balance</p>
                          <p className="text-orange-600 font-bold text-lg">₹{dashboardData.feeSummary.total_balance}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upcoming Payments */}
                {dashboardData?.upcomingPayments && dashboardData.upcomingPayments.length > 0 && (
                  <div className="bg-white border-2 border-red-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Payments</h3>
                    <div className="space-y-3">
                      {dashboardData.upcomingPayments.slice(0, 2).map((payment) => (
                        <div key={payment.payment_id} className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">Installment #{payment.installment_number}</h4>
                              <p className="text-sm text-gray-600">
                                Due Date: {new Date(payment.due_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'PAID' 
                                ? 'bg-green-500 text-white'
                                : payment.status === 'PARTIAL'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-red-500 text-white'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Amount Due</p>
                              <p className="text-sm font-bold text-gray-900">₹{payment.amount_due}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Amount Paid</p>
                              <p className="text-sm font-bold text-green-600">₹{payment.amount_paid}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Balance</p>
                              <p className="text-sm font-bold text-red-600">₹{payment.balance_amount}</p>
                            </div>
                            {payment.payment_date && (
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Payment Date</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {new Date(payment.payment_date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                          {payment.payment_mode && (
                            <p className="text-xs text-gray-500 mt-2">Payment Mode: {payment.payment_mode}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Circulars */}
                {dashboardData?.recentCirculars && dashboardData.recentCirculars.length > 0 && (
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Circulars</h3>
                    <div className="space-y-4">
                      {dashboardData.recentCirculars.slice(0, 2).map((circular, idx) => (
                        <div key={`${circular.circular_id}-${idx}`} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{circular.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">Circular ID: {circular.circular_id}</p>
                            </div>
                            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {circular.target_audience}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{circular.content}</p>
                          <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-gray-500">
                              {new Date(circular.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              circular.delivery_status === 'SENT' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {circular.delivery_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="animate-fadeIn">
                {dashboardData?.currentEnrollment ? (
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-8 shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">My Current Enrollment</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Class</p>
                          <p className="text-gray-900 font-bold text-xl">{dashboardData.currentEnrollment.class_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Section</p>
                          <p className="text-gray-900 font-bold text-xl">{dashboardData.currentEnrollment.section_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Academic Year</p>
                          <p className="text-gray-900 font-bold text-xl">{dashboardData.currentEnrollment.year_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Enrollment Date</p>
                          <p className="text-gray-900 font-bold text-xl">
                            {new Date(dashboardData.currentEnrollment.enrollment_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Section ID</p>
                          <p className="text-gray-900 font-semibold">{dashboardData.currentEnrollment.section_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Class ID</p>
                          <p className="text-gray-900 font-semibold">{dashboardData.currentEnrollment.class_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Year ID</p>
                          <p className="text-gray-900 font-semibold">{dashboardData.currentEnrollment.year_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Status</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            dashboardData.currentEnrollment.is_current && dashboardData.currentEnrollment.is_active
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-300 text-gray-700'
                          }`}>
                            {dashboardData.currentEnrollment.is_current && dashboardData.currentEnrollment.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">My Courses</h3>
                    <p className="text-gray-600">No enrollment information available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-orange-200 rounded-xl p-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Fee & Payments</h3>
                  
                  {/* Fee Summary */}
                  {dashboardData?.feeSummary && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Fee Summary</h4>
                      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Fee</p>
                            <p className="text-gray-900 font-bold text-2xl">₹{dashboardData.feeSummary.total_fee_amount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Concession</p>
                            <p className="text-gray-900 font-bold text-2xl">₹{dashboardData.feeSummary.concession_amount}</p>
                            {dashboardData.feeSummary.concession_reason && (
                              <p className="text-xs text-gray-600 mt-1">({dashboardData.feeSummary.concession_reason})</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Paid</p>
                            <p className="text-green-600 font-bold text-2xl">₹{dashboardData.feeSummary.total_paid}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Balance</p>
                            <p className="text-red-600 font-bold text-2xl">₹{dashboardData.feeSummary.total_balance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Upcoming Payments */}
                  {dashboardData?.upcomingPayments && dashboardData.upcomingPayments.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Upcoming Payments</h4>
                      <div className="space-y-4">
                        {dashboardData.upcomingPayments.map((payment) => (
                          <div key={payment.payment_id} className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h5 className="font-bold text-gray-900 text-lg">Installment #{payment.installment_number}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  Due Date: {new Date(payment.due_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                payment.status === 'PAID' 
                                  ? 'bg-green-500 text-white'
                                  : payment.status === 'PARTIAL'
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Amount Due</p>
                                <p className="text-sm font-bold text-gray-900">₹{payment.amount_due}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Amount Paid</p>
                                <p className="text-sm font-bold text-green-600">₹{payment.amount_paid}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Balance</p>
                                <p className="text-sm font-bold text-red-600">₹{payment.balance_amount}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Late Fee</p>
                                <p className="text-sm font-bold text-orange-600">₹{payment.late_fee_applicable}</p>
                              </div>
                            </div>
                            {payment.payment_date && (
                              <div className="mt-4 pt-4 border-t border-red-200">
                                <p className="text-xs text-gray-500">Payment Date: {new Date(payment.payment_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</p>
                                {payment.payment_mode && (
                                  <p className="text-xs text-gray-500 mt-1">Payment Mode: {payment.payment_mode}</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="animate-fadeIn">
                {dashboardData?.recentReportCards && dashboardData.recentReportCards.length > 0 ? (
                  <div className="space-y-6">
                    {dashboardData.recentReportCards.map((reportCard) => (
                      <div key={reportCard.report_id} className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-md">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Report Card - {reportCard.term}</h3>
                            <p className="text-sm text-gray-600">{reportCard.year_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-green-600">{reportCard.overall_percentage}%</p>
                            <p className="text-xs text-gray-500">Overall Percentage</p>
                          </div>
                        </div>
                        
                        {reportCard.overall_grade && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Overall Grade: <span className="font-bold">{reportCard.overall_grade}</span></p>
                          </div>
                        )}
                        
                        {reportCard.subjects && reportCard.subjects.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-lg font-bold text-gray-900 mb-3">Subject-wise Performance</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {reportCard.subjects.map((subject) => (
                                <div key={subject.report_card_subject_id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-bold text-gray-900">{subject.subject_name}</h5>
                                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                      {subject.grade}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div>
                                      <p className="text-xs text-gray-500">Marks</p>
                                      <p className="text-sm font-bold text-gray-900">{subject.obtained_marks}/{subject.max_marks}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Percentage</p>
                                      <p className="text-sm font-bold text-gray-900">
                                        {((subject.obtained_marks / subject.max_marks) * 100).toFixed(1)}%
                                      </p>
                                    </div>
                                  </div>
                                  {subject.teacher_remarks && (
                                    <p className="text-xs text-gray-600 mt-2 italic">"{subject.teacher_remarks}"</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(reportCard.class_rank || reportCard.section_rank) && (
                          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                            {reportCard.class_rank && (
                              <div>
                                <p className="text-xs text-gray-500">Class Rank</p>
                                <p className="text-sm font-bold text-gray-900">{reportCard.class_rank}</p>
                              </div>
                            )}
                            {reportCard.section_rank && (
                              <div>
                                <p className="text-xs text-gray-500">Section Rank</p>
                                <p className="text-sm font-bold text-gray-900">{reportCard.section_rank}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            reportCard.status === 'PUBLISHED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {reportCard.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Grades</h3>
                    <p className="text-gray-600">No report cards available yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timetable' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Attendance & Schedule</h3>
                  
                  {/* Recent Attendance */}
                  {dashboardData?.recentAttendance && dashboardData.recentAttendance.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Attendance Records</h4>
                      <div className="space-y-3">
                        {dashboardData.recentAttendance.slice(0, 5).map((attendance, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-bold text-gray-900">
                                  {new Date(attendance.attendance_date).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    weekday: 'long'
                                  })}
                                </h5>
                                {attendance.check_in_time && attendance.check_out_time && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {attendance.check_in_time?.substring(0, 5)} - {attendance.check_out_time?.substring(0, 5)}
                                  </p>
                                )}
                                {attendance.remarks && (
                                  <p className="text-xs text-gray-500 mt-1">{attendance.remarks}</p>
                                )}
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                attendance.status === 'PRESENT' 
                                  ? 'bg-green-500 text-white'
                                  : attendance.status === 'ABSENT'
                                  ? 'bg-red-500 text-white'
                                  : attendance.status === 'LATE'
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-300 text-gray-700'
                              }`}>
                                {attendance.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Attendance Summary */}
                  {dashboardData?.attendanceSummary && dashboardData.attendanceSummary.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Monthly Attendance Summary</h4>
                      <div className="space-y-3">
                        {dashboardData.attendanceSummary.map((summary, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h5 className="font-bold text-gray-900">Month {summary.month}</h5>
                              <p className="text-2xl font-bold text-green-600">{summary.attendance_percentage}%</p>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="text-sm font-bold">{summary.total_school_days}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Present</p>
                                <p className="text-sm font-bold text-green-600">{summary.present_days}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Absent</p>
                                <p className="text-sm font-bold text-red-600">{summary.absent_days}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Late</p>
                                <p className="text-sm font-bold text-orange-600">{summary.late_days}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Half</p>
                                <p className="text-sm font-bold text-yellow-600">{summary.half_days}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-pink-200 rounded-xl p-8 shadow-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Circulars & Notifications</h3>
                  
                  {dashboardData?.recentCirculars && dashboardData.recentCirculars.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recentCirculars.map((circular, idx) => (
                        <div key={`${circular.circular_id}-${idx}`} className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{circular.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">Circular ID: {circular.circular_id}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {circular.target_audience}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                circular.delivery_status === 'SENT' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {circular.delivery_status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{circular.content}</p>
                          {circular.attachment_url && (
                            <div className="mt-3">
                              <a 
                                href={circular.attachment_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-pink-600 hover:text-pink-800 font-semibold flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                View Attachment
                              </a>
                            </div>
                          )}
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-pink-200">
                            <p className="text-xs text-gray-500">
                              {new Date(circular.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            {circular.read_at && (
                              <p className="text-xs text-gray-500">
                                Read: {new Date(circular.read_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📢</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No Circulars</h4>
                      <p className="text-gray-600">No circulars or notifications available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard


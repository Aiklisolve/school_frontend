import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const TeacherDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Overview', gradient: 'from-blue-500 to-blue-600', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'classes', label: 'My Classes', gradient: 'from-green-500 to-green-600', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'assignments', label: 'Assignments', gradient: 'from-orange-500 to-orange-600', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'grades', label: 'Grades', gradient: 'from-purple-500 to-purple-600', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'students', label: 'Students', gradient: 'from-pink-500 to-pink-600', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'schedule', label: 'Schedule', gradient: 'from-indigo-500 to-indigo-600', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
  ]

  const getTabTitle = (tab) => {
    const titles = {
      'overview': 'Overview',
      'classes': 'My Classes',
      'assignments': 'Assignments',
      'grades': 'Grades',
      'students': 'Students',
      'schedule': 'Schedule'
    }
    return titles[tab] || 'Teacher Dashboard'
  }

  const getTabDescription = (tab) => {
    const descriptions = {
      'overview': 'View your teaching overview and quick access to all features',
      'classes': 'Manage your classes and view class details',
      'assignments': 'Create and review student assignments',
      'grades': 'Manage student grades and academic performance',
      'students': 'View and manage all your students',
      'schedule': 'View your weekly teaching schedule and timetable'
    }
    return descriptions[tab] || 'Manage your teaching activities'
  }

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get teacher ID from user object
        const teacherId = user?.id || user?.user_id || user?.teacher_id
        if (!teacherId) {
          console.warn('Teacher ID not found in user object:', user)
          setError('Teacher ID not found')
          setLoading(false)
          return
        }

        const url = `${API_BASE_URL}/teachers/${teacherId}/dashboard`
        console.log('Fetching teacher dashboard data from:', url)
        
        const token = localStorage.getItem('token')
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('Teacher Dashboard API Response:', response.data)
        setDashboardData(response.data)
      } catch (err) {
        console.error('Error fetching teacher dashboard data:', err)
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
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-green-700 to-emerald-700 text-white shadow-2xl flex flex-col transition-all duration-300 overflow-hidden h-full flex-shrink-0`}>
        {/* Sidebar Header - Fixed at top */}
        {sidebarOpen && (
          <>
            <div className="p-6 border-b border-green-600 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold">Teacher Portal</h1>
                  <p className="text-xs text-green-200">Dashboard</p>
                </div>
              </div>
              <div className="pt-4 border-t border-green-600">
                <p className="text-sm font-medium truncate">{user?.full_name || user?.name || user?.email?.split('@')[0]}</p>
                <p className="text-xs text-green-200 mt-1">Welcome back!</p>
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
          <div className="p-4 border-t border-green-600 flex-shrink-0 bg-gradient-to-b from-green-700 to-emerald-700">
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
                <p className="text-xs text-gray-500">Sections</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '...' : (dashboardData?.stats?.totalSections || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Students</p>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : (dashboardData?.stats?.totalStudents || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">PTMs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loading ? '...' : (dashboardData?.upcomingPtms?.length || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-8 min-h-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
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
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">{dashboardData?.stats?.totalSections || 0}</h3>
                  <p className="text-blue-100 text-sm">Total Sections</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">{dashboardData?.stats?.totalStudents || 0}</h3>
                  <p className="text-green-100 text-sm">Total Students</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">{dashboardData?.upcomingPtms?.length || 0}</h3>
                  <p className="text-orange-100 text-sm">Upcoming PTMs</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">{dashboardData?.recentAttendanceMarked?.length || 0}</h3>
                  <p className="text-purple-100 text-sm">Recent Attendance</p>
                </div>
              </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Profile Section */}
                {dashboardData?.profile && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Full Name</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Email</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Designation</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.designation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Employee ID</p>
                        <p className="text-gray-900 font-semibold">{dashboardData.profile.employee_id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upcoming PTMs - Show only 2 items */}
                {dashboardData?.upcomingPtms && dashboardData.upcomingPtms.length > 0 && (
                  <div className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Parent-Teacher Meetings</h3>
                    <div className="space-y-4">
                      {dashboardData.upcomingPtms.slice(0, 2).map((ptm, idx) => (
                        <div key={ptm.session_id || idx} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{ptm.session_name}</h4>
                              <p className="text-sm text-gray-600">{ptm.class_name} • {ptm.year_name}</p>
                            </div>
                            {ptm.current_bookings > 0 && (
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                {ptm.current_bookings}/{ptm.max_bookings} Bookings
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Date</p>
                              <p className="text-sm text-gray-900 font-medium">
                                {new Date(ptm.session_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Time</p>
                              <p className="text-sm text-gray-900 font-medium">
                                {ptm.start_time?.substring(0, 5)} - {ptm.end_time?.substring(0, 5)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold">Available Slots</p>
                              <p className="text-sm text-gray-900 font-medium">
                                {ptm.max_bookings - (ptm.current_bookings || 0)} remaining
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Attendance - Show only 2 items */}
                {dashboardData?.recentAttendanceMarked && dashboardData.recentAttendanceMarked.length > 0 && (
                  <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h3>
                    <div className="space-y-3">
                      {dashboardData.recentAttendanceMarked.slice(0, 2).map((attendance, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-gray-900">{attendance.class_name} - Section {attendance.section_name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(attendance.attendance_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="flex gap-4">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Present</p>
                                <p className="text-lg font-bold text-green-600">{attendance.present_count}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Absent</p>
                                <p className="text-lg font-bold text-red-600">{attendance.absent_count}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Late</p>
                                <p className="text-lg font-bold text-orange-600">{attendance.late_count}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Circulars - Show only 2 items */}
                {dashboardData?.recentCirculars && dashboardData.recentCirculars.length > 0 && (
                  <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-md">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Circulars</h3>
                    <div className="space-y-4">
                      {dashboardData.recentCirculars.slice(0, 2).map((circular) => (
                        <div key={circular.circular_id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{circular.title}</h4>
                              <p className="text-xs text-gray-500 mt-1">Circular #{circular.circular_number}</p>
                            </div>
                            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {circular.target_audience}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{circular.content}</p>
                          <p className="text-xs text-gray-500 mt-3">
                            {new Date(circular.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'classes' && (
              <div className="space-y-4 animate-fadeIn">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading classes...</p>
                  </div>
                ) : dashboardData?.currentAssignments && dashboardData.currentAssignments.length > 0 ? (
                  dashboardData.currentAssignments.map((assignment, idx) => (
                    <div key={assignment.section_id || idx} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {assignment.class_name} - Section {assignment.section_name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            Academic Year: {assignment.year_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Section ID: {assignment.section_id} • Class ID: {assignment.class_id}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          assignment.is_current 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-700'
                        }`}>
                          {assignment.is_current ? 'Current' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                          View Class
                        </button>
                        <button className="bg-white border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors">
                          Manage
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📚</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Classes Assigned</h4>
                    <p className="text-gray-600">You don't have any class assignments yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Algebra Homework</h3>
                      <p className="text-sm text-gray-600 mb-1">Due: Tomorrow at 11:59 PM</p>
                      <p className="text-sm text-gray-600">28 out of 30 students submitted</p>
                    </div>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Pending</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Submission Progress</span>
                      <span className="font-semibold">93%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full" style={{ width: '93%' }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                      Review Submissions
                    </button>
                    <button className="bg-white border-2 border-orange-600 text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Physics Lab Report</h3>
                      <p className="text-sm text-gray-600 mb-1">Due: Next Monday at 5:00 PM</p>
                      <p className="text-sm text-gray-600">15 out of 42 students submitted</p>
                    </div>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">In Progress</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Submission Progress</span>
                      <span className="font-semibold">36%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '36%' }}></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Review Submissions
                    </button>
                    <button className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-purple-200 rounded-xl p-8 shadow-md">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Grade Management</h3>
                    <p className="text-gray-600">View and manage student grades for all your classes</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white text-center">
                      <h4 className="text-2xl font-bold mb-1">
                        {dashboardData?.stats?.totalSections || 0}
                      </h4>
                      <p className="text-purple-100 text-sm">Total Sections</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white text-center">
                      <h4 className="text-2xl font-bold mb-1">
                        {dashboardData?.stats?.totalStudents || 0}
                      </h4>
                      <p className="text-indigo-100 text-sm">Total Students</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white text-center">
                      <h4 className="text-2xl font-bold mb-1">
                        {dashboardData?.currentAssignments?.length || 0}
                      </h4>
                      <p className="text-pink-100 text-sm">Active Classes</p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                      Manage Grades
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-pink-200 rounded-xl p-8 shadow-md">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Directory</h3>
                    <p className="text-gray-600">View and manage all your students across different classes</p>
                  </div>
                  {dashboardData?.currentAssignments && dashboardData.currentAssignments.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {dashboardData.currentAssignments.map((assignment, idx) => (
                          <div key={assignment.section_id || idx} className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              {assignment.class_name} - Section {assignment.section_name}
                            </h4>
                            <p className="text-2xl font-bold text-pink-600 mb-1">
                              {dashboardData?.stats?.totalStudents || 0}
                            </p>
                            <p className="text-sm text-gray-600">Students</p>
                            <p className="text-xs text-gray-500 mt-2">{assignment.year_name}</p>
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                          View All Students
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h4>
                      <p className="text-gray-600">You don't have any assigned classes with students yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-8 shadow-md">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events & Schedule</h3>
                    <p className="text-gray-600">View your upcoming parent-teacher meetings and events</p>
                  </div>
                  {dashboardData?.upcomingPtms && dashboardData.upcomingPtms.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.upcomingPtms.slice(0, 2).map((ptm, idx) => {
                        const ptmDate = new Date(ptm.session_date)
                        const dayName = ptmDate.toLocaleDateString('en-US', { weekday: 'long' })
                        const isToday = ptmDate.toDateString() === new Date().toDateString()
                        
                        return (
                          <div key={ptm.session_id || idx} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-gray-900">{dayName}</h4>
                                <p className="text-sm text-gray-600">
                                  {ptm.session_name} • {ptm.class_name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {ptmDate.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })} • {ptm.start_time?.substring(0, 5)} - {ptm.end_time?.substring(0, 5)}
                                </p>
                                {ptm.current_bookings > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Bookings: {ptm.current_bookings}/{ptm.max_bookings}
                                  </p>
                                )}
                                {ptm.current_bookings === 0 && (
                                  <p className="text-xs text-green-600 mt-1 font-semibold">
                                    {ptm.max_bookings} slots available
                                  </p>
                                )}
                              </div>
                              {isToday && (
                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">Today</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📅</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Events</h4>
                      <p className="text-gray-600">You don't have any upcoming events scheduled.</p>
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

export default TeacherDashboard

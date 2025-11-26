import React, { useState } from 'react'

const StudentDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', gradient: 'from-purple-500 to-purple-600' },
    { id: 'courses', label: 'My Courses', gradient: 'from-blue-500 to-blue-600' },
    { id: 'assignments', label: 'Assignments', gradient: 'from-orange-500 to-orange-600' },
    { id: 'grades', label: 'Grades', gradient: 'from-green-500 to-green-600' },
    { id: 'timetable', label: 'Timetable', gradient: 'from-indigo-500 to-indigo-600' },
    { id: 'materials', label: 'Study Materials', gradient: 'from-pink-500 to-pink-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Header - Matching Admin Dashboard Style */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9l.01 0" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 m-0">Welcome back, {user?.full_name || user?.name || user?.email?.split('@')[0]}!</h1>
                <p className="text-sm text-gray-500 mt-1">Student Dashboard</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Student Dashboard</h2>
          <p className="text-purple-100">Access your courses, assignments, grades, and academic resources</p>
        </div>

        {/* Statistics Cards - Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Enrolled Courses Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Enrolled Courses</h3>
              <p className="text-gray-900 text-3xl font-bold">8</p>
            </div>
          </div>

          {/* Pending Assignments Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Pending Assignments</h3>
              <p className="text-gray-900 text-3xl font-bold">5</p>
            </div>
          </div>

          {/* Average Grade Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Average Grade</h3>
              <p className="text-gray-900 text-3xl font-bold">87%</p>
            </div>
          </div>

          {/* Classes Today Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Classes Today</h3>
              <p className="text-gray-900 text-3xl font-bold">4</p>
            </div>
          </div>
        </div>

        {/* Enhanced Attractive Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
          <div className="flex gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap border-b-2 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r ${tab.gradient} text-white border-transparent shadow-md` 
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">My Courses</h3>
                  <p className="text-gray-600 text-sm">View your enrolled courses and class schedules</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Assignments</h3>
                  <p className="text-gray-600 text-sm">Submit and track your assignment submissions</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Grades</h3>
                  <p className="text-gray-600 text-sm">Check your academic performance and grades</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Timetable</h3>
                  <p className="text-gray-600 text-sm">View your daily class schedule and timetable</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Study Materials</h3>
                  <p className="text-gray-600 text-sm">Access study materials and resources</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Messages</h3>
                  <p className="text-gray-600 text-sm">Communicate with teachers and classmates</p>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">My Courses</h3>
                <p className="text-gray-600">View your enrolled courses and class schedules</p>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Assignments</h3>
                <p className="text-gray-600">Submit and track your assignment submissions</p>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Grades</h3>
                <p className="text-gray-600">Check your academic performance and grades</p>
              </div>
            )}

            {activeTab === 'timetable' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Timetable</h3>
                <p className="text-gray-600">View your daily class schedule and timetable</p>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Study Materials</h3>
                <p className="text-gray-600">Access study materials and resources</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard


import React, { useState } from 'react'

const TeacherDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', gradient: 'from-blue-500 to-blue-600' },
    { id: 'classes', label: 'My Classes', gradient: 'from-green-500 to-green-600' },
    { id: 'assignments', label: 'Assignments', gradient: 'from-orange-500 to-orange-600' },
    { id: 'grades', label: 'Grades', gradient: 'from-purple-500 to-purple-600' },
    { id: 'students', label: 'Students', gradient: 'from-pink-500 to-pink-600' },
    { id: 'schedule', label: 'Schedule', gradient: 'from-indigo-500 to-indigo-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Attractive Professional Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b-2 border-green-200 shadow-lg relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-200/30 to-green-200/20 rounded-full -ml-24 -mb-24"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Enhanced Icon with Glow Effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300 border-2 border-white/50">
                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
        </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      </div>

              {/* Enhanced Text Section */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold text-gray-900 m-0 leading-tight">
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {user?.full_name || user?.name || user?.email?.split('@')[0]}
                  </span>
                  !
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md border border-green-400/50 transform hover:scale-105 transition-transform">
                    <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Teacher Dashboard
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Logout Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Teacher Dashboard</h2>
          <p className="text-blue-100">Manage your classes, students, and academic activities</p>
        </div>

        {/* Enhanced Tabs */}
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

          {/* Tab Content with Animations */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">12</h3>
                  <p className="text-blue-100 text-sm">Active Classes</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">245</h3>
                  <p className="text-green-100 text-sm">Total Students</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">38</h3>
                  <p className="text-orange-100 text-sm">Pending Assignments</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  <h3 className="text-3xl font-bold mb-1">5</h3>
                  <p className="text-purple-100 text-sm">Classes Today</p>
                </div>
              </div>
            )}

            {activeTab === 'classes' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Mathematics - Grade 10A</h3>
                      <p className="text-sm text-gray-600 mb-1">45 students enrolled</p>
                      <p className="text-sm text-gray-600">Mon, Wed, Fri • 9:00 AM - 10:00 AM</p>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>
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
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Physics - Grade 11B</h3>
                      <p className="text-sm text-gray-600 mb-1">42 students enrolled</p>
                      <p className="text-sm text-gray-600">Tue, Thu • 2:00 PM - 3:30 PM</p>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>
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
                      <h4 className="text-2xl font-bold mb-1">87%</h4>
                      <p className="text-purple-100 text-sm">Average Grade</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white text-center">
                      <h4 className="text-2xl font-bold mb-1">245</h4>
                      <p className="text-indigo-100 text-sm">Total Students</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white text-center">
                      <h4 className="text-2xl font-bold mb-1">12</h4>
                      <p className="text-pink-100 text-sm">Classes</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Mathematics - Grade 10A</h4>
                      <p className="text-2xl font-bold text-pink-600 mb-1">45</p>
                      <p className="text-sm text-gray-600">Students</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Physics - Grade 11B</h4>
                      <p className="text-2xl font-bold text-pink-600 mb-1">42</p>
                      <p className="text-sm text-gray-600">Students</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                      View All Students
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="animate-fadeIn">
                <div className="bg-white border-2 border-indigo-200 rounded-xl p-8 shadow-md">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Class Schedule</h3>
                    <p className="text-gray-600">View your weekly teaching schedule and timetable</p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">Monday</h4>
                          <p className="text-sm text-gray-600">Mathematics - Grade 10A • 9:00 AM - 10:00 AM</p>
                        </div>
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-semibold">Today</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">Wednesday</h4>
                          <p className="text-sm text-gray-600">Mathematics - Grade 10A • 9:00 AM - 10:00 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-gray-900">Tuesday</h4>
                          <p className="text-sm text-gray-600">Physics - Grade 11B • 2:00 PM - 3:30 PM</p>
                        </div>
                      </div>
                    </div>
          </div>
                  <div className="mt-6 text-center">
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                      View Full Schedule
                    </button>
          </div>
          </div>
          </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard

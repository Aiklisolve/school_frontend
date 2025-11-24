import React, { useState } from 'react'

const TeacherDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'classes', label: 'My Classes', icon: '📚' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grades', icon: '🎯' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'schedule', label: 'Schedule', icon: '📅' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 px-8 py-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-4xl">👨‍🏫</span>
            </div>
            <div>
              <h1 className="m-0 text-white text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
              <p className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold mt-2">
                TEACHER
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white text-purple-600 border-none px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-lg hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 shadow-2xl mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-4xl font-bold mb-2">Teacher Dashboard</h2>
              <p className="text-xl text-purple-100">Manage your classes, students, and academic activities</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-5xl">📚</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex gap-2 border-b-2 border-purple-100 pb-2 mb-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-2xl font-bold mb-1">12</h3>
                  <p className="text-purple-100">Active Classes</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">👥</div>
                  <h3 className="text-2xl font-bold mb-1">245</h3>
                  <p className="text-indigo-100">Total Students</p>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">📝</div>
                  <h3 className="text-2xl font-bold mb-1">38</h3>
                  <p className="text-pink-100">Pending Assignments</p>
                </div>
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="text-4xl mb-3">📅</div>
                  <h3 className="text-2xl font-bold mb-1">5</h3>
                  <p className="text-violet-100">Classes Today</p>
                </div>
              </div>
            )}

            {activeTab === 'classes' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">📚 Mathematics - Grade 10A</h3>
                  <p className="text-gray-600">45 students • Mon, Wed, Fri • 9:00 AM - 10:00 AM</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">📚 Physics - Grade 11B</h3>
                  <p className="text-gray-600">42 students • Tue, Thu • 2:00 PM - 3:30 PM</p>
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <div className="bg-white border-2 border-pink-200 rounded-xl p-6 hover:shadow-lg transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">📝 Algebra Homework</h3>
                  <p className="text-gray-600 mb-2">Due: Tomorrow • 28/30 submissions</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '93%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Grade Management</h3>
                <p className="text-gray-600">View and manage student grades</p>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Directory</h3>
                <p className="text-gray-600">View and manage your students</p>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Class Schedule</h3>
                <p className="text-gray-600">View your weekly teaching schedule</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard

import React from 'react'

const TeacherDashboard = ({ user, handleLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
          <p className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
            teacher
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
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
          <div className="text-center py-6">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
              👨‍🏫
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Teacher Dashboard</h2>
            <p className="text-lg text-gray-600 mb-2">Welcome to your teaching portal!</p>
            <p className="text-md text-blue-600 font-semibold">You have successfully logged in as a teacher.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">📚 My Classes</h3>
            <p className="text-gray-600 text-sm">View and manage your assigned classes and subjects.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">📝 Assignments</h3>
            <p className="text-gray-600 text-sm">Create and review student assignments and submissions.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">📊 Grades</h3>
            <p className="text-gray-600 text-sm">Manage student grades and academic performance.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">👥 Students</h3>
            <p className="text-gray-600 text-sm">View student profiles and communicate with students.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">📅 Schedule</h3>
            <p className="text-gray-600 text-sm">Check your teaching schedule and timetables.</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">💬 Messages</h3>
            <p className="text-gray-600 text-sm">Communicate with parents and students.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard


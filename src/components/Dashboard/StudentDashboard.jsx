import React from 'react'

const StudentDashboard = ({ user, handleLogout }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
      <div>
        <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
        <p className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
          STUDENT
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
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
            🎓
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Student Dashboard</h2>
          <p className="text-lg text-gray-600 mb-2">Welcome to your student portal!</p>
          <p className="text-md text-purple-600 font-semibold">You have successfully logged in as a STUDENT.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">📖 My Courses</h3>
          <p className="text-gray-600 text-sm">View your enrolled courses and class schedules.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">📝 Assignments</h3>
          <p className="text-gray-600 text-sm">Submit and track your assignment submissions.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">📊 Grades</h3>
          <p className="text-gray-600 text-sm">Check your academic performance and grades.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">📅 Timetable</h3>
          <p className="text-gray-600 text-sm">View your daily class schedule and timetable.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">📚 Study Materials</h3>
          <p className="text-gray-600 text-sm">Access study materials and resources.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">💬 Messages</h3>
          <p className="text-gray-600 text-sm">Communicate with teachers and classmates.</p>
        </div>
      </div>
    </div>
  </div>
)

export default StudentDashboard


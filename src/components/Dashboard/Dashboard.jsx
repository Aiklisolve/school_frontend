import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import TeacherDashboard from './TeacherDashboard'
import ParentDashboard from './ParentDashboard'
import StudentDashboard from './StudentDashboard'
import RelationshipRegistration from '../Registration/RelationshipRegistration'
import BranchRegistration from '../Registration/BranchRegistration'
import SchoolRegistration from '../Registration/SchoolRegistration'
import UsersRegistration from '../Registration/UsersRegistration'
import StudentRegistration from '../Registration/StudentRegistration'
import ParentRegistration from '../Registration/ParentRegistration'
import SearchableSelect from '../Registration/SearchableSelect'
import DataUploader from './DataUploader'

const API_BASE_URL = 'http://localhost:8080/api'

// Hash password using Web Crypto API (SHA-256)
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const Dashboard = () => {
  const { user, logout, otp, setOtp } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('upload')

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

  // Get normalized user type (handle different cases)
  const getUserType = () => {
    if (!user) return null
    const userType = (user.userType || user.user_type || user.role || '').toString().toLowerCase()
    
    if (userType === 'teacher' || userType === 'teachers') return 'teacher'
    if (userType === 'parent' || userType === 'parents') return 'parent'
    if (userType === 'student' || userType === 'students') return 'student'
    if (userType === 'admin' || userType === 'admins' || userType === 'principal') return 'admin'
    
    return null
  }

  const userType = getUserType()

  const getUserTypeLabel = (type) => {
    const labels = {
      student: 'STUDENT',
      parent: 'PARENT',
      teacher: 'TEACHER',
      admin: 'ADMIN'
    }
    return labels[type] || type?.toUpperCase() || 'USER'
  }

 
  // const TeacherDashboard = () => (
  //   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  //     <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
  //       <div>
  //         <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
  //         <p className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
  //           TEACHER
  //         </p>
  //       </div>
  //       <button 
  //         onClick={handleLogout} 
  //         className="bg-red-600 text-white border-none px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md"
  //       >
  //         Logout
  //       </button>
  //     </div>

  //     <div className="p-6 max-w-6xl mx-auto">
  //       <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
  //         <div className="text-center py-6">
  //           <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
  //             👨‍🏫
  //           </div>
  //           <h2 className="text-3xl font-bold text-gray-900 mb-3">Teacher Dashboard</h2>
  //           <p className="text-lg text-gray-600 mb-2">Welcome to your teaching portal!</p>
  //           <p className="text-md text-blue-600 font-semibold">You have successfully logged in as a TEACHER.</p>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">📚 My Classes</h3>
  //           <p className="text-gray-600 text-sm">View and manage your assigned classes and subjects.</p>
  //         </div>
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">📝 Assignments</h3>
  //           <p className="text-gray-600 text-sm">Create and review student assignments and submissions.</p>
  //         </div>
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">📊 Grades</h3>
  //           <p className="text-gray-600 text-sm">Manage student grades and academic performance.</p>
  //         </div>
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">👥 Students</h3>
  //           <p className="text-gray-600 text-sm">View student profiles and communicate with students.</p>
  //         </div>
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">📅 Schedule</h3>
  //           <p className="text-gray-600 text-sm">Check your teaching schedule and timetables.</p>
  //         </div>
  //         <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
  //           <h3 className="text-xl font-semibold mb-3 text-gray-900">💬 Messages</h3>
  //           <p className="text-gray-600 text-sm">Communicate with parents and students.</p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  // Parent Dashboard Component - MOVED TO ParentDashboard.jsx
  // const ParentDashboard = () => (
  //   <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
  //     <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
  //       <div>
  //         <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
  //         <p className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
  //           PARENT
  //         </p>
  //       </div>
  //       <button 
  //         onClick={handleLogout} 
  //         className="bg-red-600 text-white border-none px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-md"
  //       >
  //         Logout
  //       </button>
  //     </div>

  //     <div className="p-6 max-w-6xl mx-auto">
  //       <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
  //         <div className="text-center py-6">
  //           <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
  //             👨‍👩‍👧‍👦
  //           </div>
  //           <h2 className="text-3xl font-bold text-gray-900 mb-3">Parent Dashboard</h2>
  //           <p className="text-lg text-gray-600 mb-2">Welcome to your parent portal!</p>
  //           <p className="text-md text-green-600 font-semibold">You have successfully logged in as a PARENT.</p>
  //         </div>
  //         </div>

  //               {/* Tabs */}
  //       <div className="bg-white rounded-xl p-6 shadow-lg">
  //         <div className="flex gap-2 border-b pb-2 mb-4">
  //           {['upload','chat','meeting','calendar'].map(tab => (
  //                   <button
  //                     key={tab}
  //                     onClick={() => setActiveTab(tab)}
  //               className={`px-4 py-2 rounded-t-md -mb-px font-semibold transition-colors ${
  //                 activeTab === tab 
  //                   ? 'bg-white border border-b-0 border-gray-200 text-green-600' 
  //                   : 'text-gray-500 hover:text-gray-700'
  //               }`}
  //             >
  //               {tab.charAt(0).toUpperCase() + tab.slice(1)}
  //             </button>
  //           ))}
  //         </div>

  //         <div className="mt-4">
  //           {activeTab === 'upload' && (
  //             <div className="p-6 bg-gray-50 rounded-md">
  //               <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
  //               <p className="text-sm text-gray-600">Upload documents and images related to your child's education.</p>
  //             </div>
  //           )}

  //           {activeTab === 'chat' && (
  //             <div className="p-6 bg-gray-50 rounded-md">
  //               <h3 className="text-lg font-semibold mb-2">Chat AI Assistant</h3>
  //               <p className="text-sm text-gray-600">Chat with AI assistant for school-related queries and support.</p>
  //             </div>
  //           )}

  //           {activeTab === 'meeting' && (
  //             <div className="p-6 bg-gray-50 rounded-md">
  //               <h3 className="text-lg font-semibold mb-2">Meeting Scheduler</h3>
  //               <p className="text-sm text-gray-600">Schedule parent-teacher meetings and appointments.</p>
  //             </div>
  //           )}

  //           {activeTab === 'calendar' && (
  //             <div className="p-6 bg-gray-50 rounded-md">
  //               <h3 className="text-lg font-semibold mb-2">Calendar</h3>
  //               <p className="text-sm text-gray-600">View school events, holidays, and important dates.</p>
  //             </div>
  //           )}
  //         </div>
  // Admin Dashboard Component
  const AdminDashboard = () => {
    const [adminActiveTab, setAdminActiveTab] = useState('registration')
    const [registrationType, setRegistrationType] = useState('school')
    const [reportUploadFile, setReportUploadFile] = useState(null)
    const [reportUploading, setReportUploading] = useState(false)
    const [reportUploadError, setReportUploadError] = useState('')
    
    // Statistics counts state
    const [stats, setStats] = useState({
      schools: 0,
      branches: 0,
      users: 0,
      students: 0,
      parents: 0
    })
    const [loadingStats, setLoadingStats] = useState(true)
    
    // Fetch statistics counts
    const fetchStatistics = async () => {
      setLoadingStats(true)
      const token = localStorage.getItem('token')
      
      try {
        // Fetch all counts in parallel
        const [schoolsRes, branchesRes, usersRes, studentsRes, parentsRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/schools`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            params: { page: 1, limit: 10000 }
          }),
          axios.get(`${API_BASE_URL}/branches`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            params: { page: 1, limit: 10000 }
          }),
          axios.get(`${API_BASE_URL}/users`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            params: { page: 1, limit: 10000 }
          }),
          axios.get(`${API_BASE_URL}/students`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            params: { page: 1, limit: 10000 }
          }),
          axios.get(`${API_BASE_URL}/parents`, {
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            params: { page: 1, limit: 10000 }
          })
        ])
        
        // Extract counts from responses
        const getCount = (result, type = '') => {
          if (result.status === 'fulfilled') {
            const response = result.value
            const data = response.data
            
            // Log for debugging
            if (type === 'users') {
              console.log('Users API Response:', data)
            }
            
            // Handle different response structures
            if (Array.isArray(data)) {
              return data.length
            }
            
            // Check for nested data arrays
            if (data?.data && Array.isArray(data.data)) {
              return data.data.length
            }
            
            // Check for type-specific arrays (users, students, parents, etc.)
            if (data?.users && Array.isArray(data.users)) {
              return data.users.length
            }
            if (data?.students && Array.isArray(data.students)) {
              return data.students.length
            }
            if (data?.parents && Array.isArray(data.parents)) {
              return data.parents.length
            }
            if (data?.schools && Array.isArray(data.schools)) {
              return data.schools.length
            }
            if (data?.branches && Array.isArray(data.branches)) {
              return data.branches.length
            }
            
            // Check for count/total properties
            if (data?.count !== undefined) {
              return typeof data.count === 'number' ? data.count : parseInt(data.count) || 0
            }
            if (data?.total !== undefined) {
              return typeof data.total === 'number' ? data.total : parseInt(data.total) || 0
            }
            
            // If it's an object but not an array, try to find any array property
            if (data && typeof data === 'object' && !Array.isArray(data)) {
              const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]))
              if (arrayKeys.length > 0) {
                return data[arrayKeys[0]].length
              }
            }
            
            return 0
          } else if (result.status === 'rejected') {
            console.error(`Error fetching ${type}:`, result.reason)
            return 0
          }
          return 0
        }
        
        setStats({
          schools: getCount(schoolsRes, 'schools'),
          branches: getCount(branchesRes, 'branches'),
          users: getCount(usersRes, 'users'),
          students: getCount(studentsRes, 'students'),
          parents: getCount(parentsRes, 'parents')
        })
      } catch (error) {
        console.error('Error fetching statistics:', error)
      } finally {
        setLoadingStats(false)
      }
    }
    
    // Fetch statistics on component mount
    useEffect(() => {
      fetchStatistics()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    // Helper to load SweetAlert2 from CDN if not present
    const loadSwal = async () => {
      if (window.Swal) return window.Swal
      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11'
        script.onload = () => resolve(window.Swal)
        script.onerror = () => reject(new Error('Failed to load SweetAlert2'))
        document.head.appendChild(script)
      })
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 m-0">Welcome back, {user?.full_name || user?.name || user?.email?.split('@')[0]}!</h1>
                  <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
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
          {/* Statistics Cards - Modern Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Schools Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Schools</h3>
                <p className="text-gray-900 text-3xl font-bold">
                  {loadingStats ? (
                    <span className="text-gray-300">...</span>
                  ) : (
                    stats.schools.toLocaleString()
                  )}
                </p>
              </div>
            </div>

            {/* Branches Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Branches</h3>
                <p className="text-gray-900 text-3xl font-bold">
                  {loadingStats ? (
                    <span className="text-gray-300">...</span>
                  ) : (
                    stats.branches.toLocaleString()
                  )}
                </p>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Users</h3>
                <p className="text-gray-900 text-3xl font-bold">
                  {loadingStats ? (
                    <span className="text-gray-300">...</span>
                  ) : (
                    stats.users.toLocaleString()
                  )}
                </p>
              </div>
            </div>

            {/* Students Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Students</h3>
                <p className="text-gray-900 text-3xl font-bold">
                  {loadingStats ? (
                    <span className="text-gray-300">...</span>
                  ) : (
                    stats.students.toLocaleString()
                  )}
                </p>
              </div>
            </div>

            {/* Parents Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wider">Parents</h3>
                <p className="text-gray-900 text-3xl font-bold">
                  {loadingStats ? (
                    <span className="text-gray-300">...</span>
                  ) : (
                    stats.parents.toLocaleString()
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
            <div className="flex gap-1 border-b border-gray-200 bg-gray-50 px-4 py-2 overflow-x-auto">
              {['registration', 'users', 'settings', 'reports', 'dataupload'].map(tab => {
                const tabLabels = {
                  'registration': 'Registration',
                  'users': 'User Management',
                  'settings': 'Settings',
                  'reports': 'Reports',
                  'dataupload': 'Data Upload'
                }
                const tabIcons = {
                  'registration': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  'users': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
                  'settings': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
                  'reports': 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  'dataupload': 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setAdminActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap border-b-2 transform ${
                      adminActiveTab === tab 
                        ? 'bg-white text-indigo-600 border-indigo-600 scale-105 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300 hover:scale-102'
                    }`}
                  >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${adminActiveTab === tab ? 'scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tabIcons[tab]} />
                    </svg>
                    {tabLabels[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              })}
            </div>

            <div className="p-6">
              {adminActiveTab === 'registration' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Modern Header Section */}
                  <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">Registration Portal</h3>
                        <p className="text-indigo-100">Register new schools, branches, and users in the system</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional Registration Type Selector */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {[
                      { value: 'school', label: 'School', desc: 'Register School', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'blue', gradient: 'from-blue-500 to-blue-600', hover: 'hover:border-blue-300 hover:bg-blue-50', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
                      { value: 'branch', label: 'Branch', desc: 'Register Branch', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'purple', gradient: 'from-purple-500 to-purple-600', hover: 'hover:border-purple-300 hover:bg-purple-50', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
                      { value: 'users', label: 'Users', desc: 'Register Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'green', gradient: 'from-green-500 to-green-600', hover: 'hover:border-green-300 hover:bg-green-50', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
                      { value: 'student', label: 'Student', desc: 'Register Student', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', color: 'orange', gradient: 'from-orange-500 to-orange-600', hover: 'hover:border-orange-300 hover:bg-orange-50', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
                      { value: 'parent', label: 'Parent', desc: 'Register Parent', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'pink', gradient: 'from-pink-500 to-pink-600', hover: 'hover:border-pink-300 hover:bg-pink-50', iconBg: 'bg-pink-50', iconColor: 'text-pink-600' },
                      { value: 'relationship', label: 'Relationship', desc: 'Create Relationship', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'violet', gradient: 'from-violet-500 to-violet-600', hover: 'hover:border-violet-300 hover:bg-violet-50', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' }
                    ].map(type => (
                      <button
                        key={type.value}
                        onClick={() => setRegistrationType(type.value)}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-center relative group ${
                          registrationType === type.value
                            ? `bg-gradient-to-r ${type.gradient} text-white border-transparent shadow-lg`
                            : `border-gray-200 bg-white text-gray-700 ${type.hover} hover:shadow-md`
                        }`}
                      >
                        {/* Simple background effect on active */}
                        {registrationType === type.value && (
                          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                        )}
                        
                        {/* Icon container */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-200 relative z-10 ${
                          registrationType === type.value 
                            ? 'bg-white/20 shadow-md' 
                            : `${type.iconBg} ${type.iconColor} group-hover:scale-105`
                        }`}>
                          <svg className={`w-7 h-7 transition-colors duration-200 ${registrationType === type.value ? 'text-white' : type.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                          </svg>
                        </div>
                        
                        {/* Label */}
                        <div className={`font-bold text-base mb-1 relative z-10 transition-colors duration-200 ${registrationType === type.value ? 'text-white' : 'text-gray-900'}`}>
                          {type.label}
                        </div>
                        
                        {/* Description */}
                        <div className={`text-xs relative z-10 transition-colors duration-200 ${registrationType === type.value ? 'text-white/90' : 'text-gray-500'}`}>
                          {type.desc}
                        </div>
                        
                        {/* Simple active indicator */}
                        {registrationType === type.value && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* School Registration */}
                  {registrationType === 'school' && (
                    <div className="animate-fadeIn">
                      <SchoolRegistration />
                    </div>
                  )}

                  {/* Branch Registration */}
                  {registrationType === 'branch' && (
                    <div className="animate-fadeIn">
                      <BranchRegistration />
                    </div>
                  )}

                  {/* Users Registration */}
                  {registrationType === 'users' && (
                    <div className="animate-fadeIn">
                      <UsersRegistration />
                    </div>
                  )}

                  {/* Student Registration */}
                  {registrationType === 'student' && (
                    <div className="animate-fadeIn">
                      <StudentRegistration />
                    </div>
                  )}

                  {/* Parent Registration */}
                  {registrationType === 'parent' && (
                    <div className="animate-fadeIn">
                      <ParentRegistration />
                    </div>
                  )}

                  {/* Relationship Registration */}
                  {registrationType === 'relationship' && (
                    <div className="animate-fadeIn">
                      <RelationshipRegistration />
                    </div>
                  )}
                            </div>
              )}

              {adminActiveTab === 'users' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Modern Header */}
                  <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">User Management</h3>
                        <p className="text-green-100">Manage teachers, students, parents, and staff accounts</p>
                      </div>
                    </div>
                  </div>
                          
                  {/* Modern Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Manage Users</h4>
                      <p className="text-sm text-gray-600 mb-4">View, edit, and delete user accounts across the system.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        View Users
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Add New Users</h4>
                      <p className="text-sm text-gray-600 mb-4">Create new user accounts for teachers, students, and staff members.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Add User
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">User Roles</h4>
                      <p className="text-sm text-gray-600 mb-4">Manage user roles and permissions for different access levels.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Manage Roles
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'settings' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Modern Header */}
                  <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">School Settings</h3>
                        <p className="text-purple-100">Configure school information and system settings</p>
                      </div>
                    </div>
                  </div>
                          
                  {/* Modern Settings Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">School Information</h4>
                      <p className="text-sm text-gray-600 mb-4">Update school name, address, and contact details.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Edit Settings
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                          
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Security Settings</h4>
                      <p className="text-sm text-gray-600 mb-4">Manage security settings and access controls.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Configure
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                          
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">System Reports</h4>
                      <p className="text-sm text-gray-600 mb-4">Generate and view various system reports.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        View Reports
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Analytics</h4>
                      <p className="text-sm text-gray-600 mb-4">Monitor system usage and performance metrics.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        View Analytics
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'dataupload' && (
                <div className="animate-fadeIn">
                  <DataUploader />
                </div>
              )}

              {adminActiveTab === 'reports' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Modern Header */}
                  <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">Reports & Analytics</h3>
                        <p className="text-teal-100">View system reports, analytics, and upload report card data</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modern Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">System Reports</h4>
                      <p className="text-sm text-gray-600 mb-4">Generate and view various system reports and statistics.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Generate Report
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Analytics</h4>
                      <p className="text-sm text-gray-600 mb-4">Monitor system usage and performance metrics in real-time.</p>
                      <button className="text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors flex items-center gap-1">
                        View Analytics
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Modern Excel File Upload Section */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">Upload Report Cards</h4>
                          <p className="text-sm text-indigo-100 mt-0.5">Upload an Excel file containing student report card marks and results</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        
                        if (!reportUploadFile) {
                          setReportUploadError('Please select an Excel file')
                          return
                        }
                        
                        // Validate file type
                        const fileName = reportUploadFile.name.toLowerCase()
                        const validExtensions = ['.csv', '.xlsx', '.xls']
                        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
                        if (!hasValidExtension) {
                          setReportUploadError('Please select a valid Excel or CSV file (.csv, .xlsx, .xls)')
                          return
                        }
                        
                        setReportUploadError('')
                        setReportUploading(true)
                        
                        try {
                          const formData = new FormData()
                          formData.append('csvFile', reportUploadFile)
                          formData.append('schoolId', '1')
                          formData.append('yearId', '1')
                          formData.append('term', 'TERM1')
                          
                          console.log('Uploading file:', reportUploadFile.name)
                          console.log('FormData entries:')
                          for (let pair of formData.entries()) {
                            console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
                          }
                          
                          const url = `${API_BASE_URL}/report-cards/upload-csv`
                          console.log('Calling API:', url)
                          
                          const response = await axios.post(url, formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data'
                            }
                          })
                          
                          console.log('Upload response:', response.data)
                          
                          // Show success message
                          const Swal = await loadSwal()
                          Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: response.data?.message || 'Report cards uploaded successfully!',
                            timer: 3000,
                            showConfirmButton: false
                          })
                          
                          // Reset form
                          setReportUploadFile(null)
                          const fileInput = document.getElementById('reportExcelFile')
                          if (fileInput) {
                            fileInput.value = ''
                          }
                        } catch (error) {
                          const errorMsg = error.response?.data?.message || 'Failed to upload report cards. Please try again.'
                          setReportUploadError(errorMsg)
                          try {
                            const Swal = await loadSwal()
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: errorMsg
                            })
                          } catch (swalError) {
                            // Fallback to alert if SweetAlert2 fails
                          }
                        } finally {
                          setReportUploading(false)
                        }
                      }}>
                        <div className="space-y-5">
                          {/* Modern File Upload Field */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              Excel File <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 cursor-pointer group">
                              <input
                                type="file"
                                id="reportExcelFile"
                                accept=".csv,.xlsx,.xls"
                                onChange={(e) => {
                                  const file = e.target.files[0]
                                  setReportUploadFile(file)
                                  setReportUploadError('')
                                }}
                                className="hidden"
                              />
                              <label htmlFor="reportExcelFile" className="cursor-pointer">
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:from-indigo-200 group-hover:to-blue-200 transition-colors">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-1 font-medium">
                                    <span className="text-indigo-600 font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">Excel or CSV file (.csv, .xlsx, .xls)</p>
                                  {reportUploadFile && (
                                    <div className="mt-4 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                      <p className="text-sm text-green-700 font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {reportUploadFile.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </label>
                            </div>
                            {reportUploadError && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 flex items-center gap-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {reportUploadError}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Modern Submit Button */}
                          <button
                            type="submit"
                            disabled={reportUploading || !reportUploadFile}
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                          >
                            {reportUploading ? (
                              <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Upload Excel File
                              </>
                            )}
                          </button>
                        </div>
                      </form>
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

  // Render appropriate dashboard based on user type
  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unknown User Type</h2>
          <p className="text-gray-600 mb-4">Unable to determine user type. Please log in again.</p>
          <button 
            onClick={handleLogout} 
            className="bg-red-600 text-white border-none px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {userType === 'teacher' && <TeacherDashboard user={user} handleLogout={handleLogout} />}
      {userType === 'parent' && <ParentDashboard user={user} handleLogout={handleLogout} />}
      {userType === 'student' && <StudentDashboard user={user} handleLogout={handleLogout} />}
      {userType === 'admin' && <AdminDashboard user={user} handleLogout={handleLogout} />}
    </>
  )
}

export default Dashboard


  
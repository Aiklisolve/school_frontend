import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import TeacherDashboard from './TeacherDashboard'
import ParentDashboard from './ParentDashboard'
import StudentDashboard from './StudentDashboard'
import RelationshipRegistration from '../Registration/RelationshipRegistration'
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
        const getCount = (result) => {
          if (result.status === 'fulfilled') {
            const data = result.value.data
            if (Array.isArray(data)) return data.length
            if (data?.data && Array.isArray(data.data)) return data.data.length
            if (data?.count !== undefined) return data.count
            if (data?.total !== undefined) return data.total
            return 0
          }
          return 0
        }
        
        setStats({
          schools: getCount(schoolsRes),
          branches: getCount(branchesRes),
          users: getCount(usersRes),
          students: getCount(studentsRes),
          parents: getCount(parentsRes)
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
    
    // School Registration State
    const [schoolForm, setSchoolForm] = useState({
      school_code: '',
      school_name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      website: '',
      board_type: '',
      academic_session_start_month: '',
      grading_system: '',
      affiliation_number: '',
      recognition_status: '',
      rte_compliance: false
    })
    const [schoolErrors, setSchoolErrors] = useState({})
    const [schoolSubmitting, setSchoolSubmitting] = useState(false)
    
    // School Form Validation
    const validateSchoolForm = () => {
      const errors = {}
      
      if (!schoolForm.school_code.trim()) {
        errors.school_code = 'School code is required'
      }
      
      if (!schoolForm.school_name.trim()) {
        errors.school_name = 'School name is required'
      }
      
      if (!schoolForm.address_line1.trim()) {
        errors.address_line1 = 'Address line 1 is required'
      }
      
      if (!schoolForm.city.trim()) {
        errors.city = 'City is required'
      }
      
      if (!schoolForm.state.trim()) {
        errors.state = 'State is required'
      }
      
      const pinRegex = /^\d{6}$/
      if (!schoolForm.pincode || !pinRegex.test(schoolForm.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pin code'
      }
      
      const phoneRegex = /^\d{10}$/
      if (!schoolForm.phone || !phoneRegex.test(schoolForm.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number'
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!schoolForm.email || !emailRegex.test(schoolForm.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (schoolForm.website && schoolForm.website.trim()) {
        try {
          new URL(schoolForm.website)
        } catch {
          errors.website = 'Please enter a valid website URL'
        }
      }
      
      if (!schoolForm.board_type) {
        errors.board_type = 'Board type is required'
      }
      
      if (!schoolForm.academic_session_start_month) {
        errors.academic_session_start_month = 'Academic session start month is required'
      }
      
      if (!schoolForm.grading_system) {
        errors.grading_system = 'Grading system is required'
      }
      
      if (!schoolForm.affiliation_number.trim()) {
        errors.affiliation_number = 'Affiliation number is required'
      }
      
      if (!schoolForm.recognition_status) {
        errors.recognition_status = 'Recognition status is required'
      }
      
      setSchoolErrors(errors)
      return Object.keys(errors).length === 0
    }
    
    // Handle School Form Change
    const handleSchoolFormChange = (e) => {
      const { name, value, type, checked } = e.target
      
      // For phone and pincode, only allow digits
      let processedValue = value
      if (name === 'phone' || name === 'pincode') {
        processedValue = value.replace(/\D/g, '') // Remove all non-digit characters
        if (name === 'phone' && processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10)
        }
        if (name === 'pincode' && processedValue.length > 6) {
          processedValue = processedValue.slice(0, 6)
        }
      }
      
      setSchoolForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : processedValue
      }))
      // Clear error for this field
      if (schoolErrors[name]) {
        setSchoolErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
    
    // Handle School Form Submit
    const handleSchoolSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateSchoolForm()) {
        return
      }
      
      setSchoolSubmitting(true)
      
      try {
        const payload = {
          school_code: schoolForm.school_code,
          school_name: schoolForm.school_name,
          address_line1: schoolForm.address_line1,
          address_line2: schoolForm.address_line2 || '',
          city: schoolForm.city,
          state: schoolForm.state,
          pincode: schoolForm.pincode,
          phone: schoolForm.phone,
          email: schoolForm.email,
          website: schoolForm.website || '',
          board_type: schoolForm.board_type,
          academic_session_start_month: parseInt(schoolForm.academic_session_start_month),
          grading_system: schoolForm.grading_system,
          affiliation_number: schoolForm.affiliation_number,
          recognition_status: schoolForm.recognition_status,
          rte_compliance: schoolForm.rte_compliance
        }
        
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_BASE_URL}/schools/register`, payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Show SweetAlert2 success message
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'School registered successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Reset form
        setSchoolForm({
          school_code: '',
          school_name: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          email: '',
          website: '',
          board_type: '',
          academic_session_start_month: '',
          grading_system: '',
          affiliation_number: '',
          recognition_status: '',
          rte_compliance: false
        })
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to register school. Please try again.'
        try {
          const Swal = await loadSwal()
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          })
        } catch (swalError) {
          alert(errorMsg)
        }
      } finally {
        setSchoolSubmitting(false)
      }
    }
    
    // Branch Registration State
    const [branchForm, setBranchForm] = useState({
      school_id: '',
      branch_code: '',
      branch_name: '',
      address_line1: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      is_main_branch: false,
      max_students: ''
    })
    const [branchErrors, setBranchErrors] = useState({})
    const [branchSubmitting, setBranchSubmitting] = useState(false)
    const [branchSchoolsList, setBranchSchoolsList] = useState([])
    const [loadingBranchSchools, setLoadingBranchSchools] = useState(false)
    
    // Fetch all schools for branch registration (no pagination)
    const fetchBranchSchools = async () => {
      setLoadingBranchSchools(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/schools`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all schools
          }
        })
        
        let schools = []
        
        if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            schools = response.data.data
          } else if (response.data.data && Array.isArray(response.data.data.schools)) {
            schools = response.data.data.schools
          } else if (Array.isArray(response.data.data.list)) {
            schools = response.data.data.list
          } else if (Array.isArray(response.data.data.records)) {
            schools = response.data.data.records
          }
        } else if (Array.isArray(response.data)) {
          schools = response.data
        }
        
        setBranchSchoolsList(schools)
        
      } catch (error) {
        console.error('Error fetching schools for branch:', error)
        setBranchSchoolsList([])
      } finally {
        setLoadingBranchSchools(false)
      }
    }
    
    // Branch Form Validation
    const validateBranchForm = () => {
      const errors = {}
      
      if (!branchForm.school_id) {
        errors.school_id = 'School ID is required'
      }
      
      if (!branchForm.branch_code.trim()) {
        errors.branch_code = 'Branch code is required'
      }
      
      if (!branchForm.branch_name.trim()) {
        errors.branch_name = 'Branch name is required'
      }
      
      if (!branchForm.address_line1.trim()) {
        errors.address_line1 = 'Address line 1 is required'
      }
      
      if (!branchForm.city.trim()) {
        errors.city = 'City is required'
      }
      
      if (!branchForm.state.trim()) {
        errors.state = 'State is required'
      }
      
      const pinRegex = /^\d{6}$/
      if (!branchForm.pincode || !pinRegex.test(branchForm.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pin code'
      }
      
      const phoneRegex = /^\d{10}$/
      if (!branchForm.phone || !phoneRegex.test(branchForm.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number'
      }
      
      if (branchForm.max_students && branchForm.max_students.trim()) {
        const maxStudents = parseInt(branchForm.max_students)
        if (isNaN(maxStudents) || maxStudents <= 0) {
          errors.max_students = 'Please enter a valid positive number'
        }
      }
      
      setBranchErrors(errors)
      return Object.keys(errors).length === 0
    }
    
    // Handle Branch Form Change
    const handleBranchFormChange = (e) => {
      const { name, value, type, checked } = e.target
      
      let processedValue = value
      if (name === 'phone' || name === 'pincode') {
        processedValue = value.replace(/\D/g, '')
        if (name === 'phone' && processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10)
        }
        if (name === 'pincode' && processedValue.length > 6) {
          processedValue = processedValue.slice(0, 6)
        }
      }
      
      if (name === 'max_students') {
        processedValue = value.replace(/\D/g, '')
      }
      
      setBranchForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : processedValue
      }))
      
      if (branchErrors[name]) {
        setBranchErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
    
    // Handle Branch Form Submit
    const handleBranchSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateBranchForm()) {
        return
      }
      
      setBranchSubmitting(true)
      
      try {
        const payload = {
          school_id: parseInt(branchForm.school_id),
          branch_code: branchForm.branch_code.trim(),
          branch_name: branchForm.branch_name.trim(),
          address_line1: branchForm.address_line1.trim(),
          city: branchForm.city.trim(),
          state: branchForm.state.trim(),
          pincode: branchForm.pincode,
          phone: branchForm.phone,
          is_main_branch: branchForm.is_main_branch,
          max_students: branchForm.max_students ? parseInt(branchForm.max_students) : null
        }
  const token = localStorage.getItem('token')
        
        const response = await axios.post(`${API_BASE_URL}/branches`, payload, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        })
        
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Branch registered successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Reset form
        setBranchForm({
          school_id: '',
          branch_code: '',
          branch_name: '',
          address_line1: '',
          city: '',
          state: '',
          pincode: '',
          phone: '',
          is_main_branch: false,
          max_students: ''
        })
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to register branch. Please try again.'
        try {
          const Swal = await loadSwal()
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          })
        } catch (swalError) {
          alert(errorMsg)
        }
      } finally {
        setBranchSubmitting(false)
      }
    }
    
    // Users Registration State
    const [userForm, setUserForm] = useState({
      school_id: '',
      branch_id: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      full_name: '',
      date_of_birth: '',
      gender: '',
      role: '',
      employee_id: '',
      designation: '',
      alternate_phone: '',
      emergency_contact: '',
      address_line1: '',
      city: '',
      state: '',
      pincode: ''
    })
    const [userErrors, setUserErrors] = useState({})
    const [userSubmitting, setUserSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [schoolsList, setSchoolsList] = useState([])
    const [loadingSchools, setLoadingSchools] = useState(false)
    const [branchesList, setBranchesList] = useState([])
    const [loadingBranches, setLoadingBranches] = useState(false)
    
    // Fetch all schools from API (no pagination)
    const fetchSchools = async () => {
      setLoadingSchools(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/schools`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all schools
          }
        })
        
        let schools = []
        
        // Handle paginated response structure - API returns { "data": [...] }
        if (response.data && response.data.data) {
          // If data is an array (most common structure: { data: [...] })
          if (Array.isArray(response.data.data)) {
            schools = response.data.data
          } 
          // If data is an object with schools array
          else if (response.data.data && Array.isArray(response.data.data.schools)) {
            schools = response.data.data.schools
          } 
          // If data is an object with list array
          else if (Array.isArray(response.data.data.list)) {
            schools = response.data.data.list
          } 
          // If data is an object with records array
          else if (Array.isArray(response.data.data.records)) {
            schools = response.data.data.records
          }
        } 
        // Direct array response
        else if (Array.isArray(response.data)) {
          schools = response.data
        }
        
        setSchoolsList(schools)
        
      } catch (error) {
        console.error('Error fetching schools:', error)
        setSchoolsList([])
      } finally {
        setLoadingSchools(false)
      }
    }
    
    // Clear school selection if selected school is not in current page list
    useEffect(() => {
      if (userForm.school_id && schoolsList.length > 0) {
        const schoolExists = schoolsList.some(school => school.school_id === userForm.school_id)
        if (!schoolExists) {
          // Clear selection if school is not in current page
          setUserForm(prev => ({ ...prev, school_id: '' }))
          if (userErrors.school_id) {
            setUserErrors(prev => ({ ...prev, school_id: '' }))
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schoolsList])
    
    // Fetch all branches from API (no pagination)
    const fetchBranches = async () => {
      setLoadingBranches(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/branches`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all branches
          }
        })
        
        let branches = []
        
        // Handle paginated response structure - API returns { "data": [...] }
        if (response.data && response.data.data) {
          // If data is an array (most common structure: { data: [...] })
          if (Array.isArray(response.data.data)) {
            branches = response.data.data
          } 
          // If data is an object with branches array
          else if (response.data.data && Array.isArray(response.data.data.branches)) {
            branches = response.data.data.branches
          } 
          // If data is an object with list array
          else if (Array.isArray(response.data.data.list)) {
            branches = response.data.data.list
          } 
          // If data is an object with records array
          else if (Array.isArray(response.data.data.records)) {
            branches = response.data.data.records
          }
        } 
        // Direct array response
        else if (Array.isArray(response.data)) {
          branches = response.data
        }
        
        setBranchesList(branches)
        
      } catch (error) {
        console.error('Error fetching branches:', error)
        setBranchesList([])
      } finally {
        setLoadingBranches(false)
      }
    }
    
    
    // Fetch all schools and branches when Users Registration tab is active
    useEffect(() => {
      if (registrationType === 'users') {
        if (schoolsList.length === 0 && !loadingSchools) {
          fetchSchools()
        }
        if (branchesList.length === 0 && !loadingBranches) {
          fetchBranches()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationType])
    
    // Fetch all schools when Branch Registration tab is active
    useEffect(() => {
      if (registrationType === 'branch') {
        if (branchSchoolsList.length === 0 && !loadingBranchSchools) {
          fetchBranchSchools()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationType])
    
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
    
    // Users Form Validation
    const validateUserForm = () => {
      const errors = {}
      
      if (!userForm.school_id) {
        errors.school_id = 'School ID is required'
      }
      
      if (!userForm.branch_id) {
        errors.branch_id = 'Branch ID is required'
      }
      
      if (!userForm.username.trim()) {
        errors.username = 'Username is required'
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!userForm.email || !emailRegex.test(userForm.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      const phoneRegex = /^\d{10}$/
      if (!userForm.phone || !phoneRegex.test(userForm.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number'
      }
      
      if (!userForm.password || userForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      if (!userForm.full_name.trim()) {
        errors.full_name = 'Full name is required'
      }
      
      if (!userForm.date_of_birth) {
        errors.date_of_birth = 'Date of birth is required'
      }
      
      if (!userForm.gender) {
        errors.gender = 'Gender is required'
      }
      
      if (!userForm.role) {
        errors.role = 'Role is required'
      }
      
      if (!userForm.employee_id.trim()) {
        errors.employee_id = 'Employee ID is required'
      }
      
      if (!userForm.designation.trim()) {
        errors.designation = 'Designation is required'
      }
      
      if (userForm.alternate_phone && !phoneRegex.test(userForm.alternate_phone)) {
        errors.alternate_phone = 'Please enter a valid 10-digit alternate phone number'
      }
      
      if (userForm.emergency_contact && !phoneRegex.test(userForm.emergency_contact)) {
        errors.emergency_contact = 'Please enter a valid 10-digit emergency contact number'
      }
      
      if (!userForm.address_line1.trim()) {
        errors.address_line1 = 'Address line 1 is required'
      }
      
      if (!userForm.city.trim()) {
        errors.city = 'City is required'
      }
      
      if (!userForm.state.trim()) {
        errors.state = 'State is required'
      }
      
      const pinRegex = /^\d{6}$/
      if (!userForm.pincode || !pinRegex.test(userForm.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pin code'
      }
      
      setUserErrors(errors)
      return Object.keys(errors).length === 0
    }
    
    // Handle User Form Change
    const handleUserFormChange = (e) => {
      const { name, value, type, checked } = e.target
      
      // For phone fields and pincode, only allow digits
      let processedValue = value
      if (name === 'phone' || name === 'alternate_phone' || name === 'emergency_contact' || name === 'pincode') {
        processedValue = value.replace(/\D/g, '') // Remove all non-digit characters
        if ((name === 'phone' || name === 'alternate_phone' || name === 'emergency_contact') && processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10)
        }
        if (name === 'pincode' && processedValue.length > 6) {
          processedValue = processedValue.slice(0, 6)
        }
      }
      
      // branch_id is now dropdown, no need to restrict to digits
      
      setUserForm(prev => ({
        ...prev,
        [name]: processedValue
      }))
      // Clear error for this field
      if (userErrors[name]) {
        setUserErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
    
    // Handle User Form Submit
    const handleUserSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateUserForm()) {
        return
      }
      
      setUserSubmitting(true)
      
      try {
        // Send password as plain text (as user typed it)
        const payload = {
          school_id: parseInt(userForm.school_id),
          branch_id: parseInt(userForm.branch_id),
          username: userForm.username,
          email: userForm.email,
          phone: userForm.phone,
          password: userForm.password,
          full_name: userForm.full_name,
          date_of_birth: userForm.date_of_birth,
          gender: userForm.gender,
          role: userForm.role,
          employee_id: userForm.employee_id,
          designation: userForm.designation,
          alternate_phone: userForm.alternate_phone || userForm.phone,
          emergency_contact: userForm.emergency_contact || userForm.phone,
          address_line1: userForm.address_line1,
          city: userForm.city,
          state: userForm.state,
          pincode: userForm.pincode
        }
        
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_BASE_URL}/users/register`, payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Show SweetAlert2 success message
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'User registered successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Reset form
        setUserForm({
          school_id: '',
          branch_id: '',
          username: '',
          email: '',
          phone: '',
          password: '',
          full_name: '',
          date_of_birth: '',
          gender: '',
          role: '',
          employee_id: '',
          designation: '',
          alternate_phone: '',
          emergency_contact: '',
          address_line1: '',
          city: '',
          state: '',
          pincode: ''
        })
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to register user. Please try again.'
        try {
          const Swal = await loadSwal()
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          })
        } catch (swalError) {
          alert(errorMsg)
        }
      } finally {
        setUserSubmitting(false)
      }
    }
    
    // Student Registration State
    const [studentForm, setStudentForm] = useState({
      school_id: '',
      user_id: '',
      branch_id: '',
      admission_number: '',
      roll_number: '',
      full_name: '',
      date_of_birth: '',
      gender: '',
      blood_group: '',
      aadhar_number: '',
      admission_date: '',
      admission_class: '',
      current_status: 'ACTIVE',
      address_line1: '',
      city: '',
      state: '',
      pincode: '',
      medical_conditions: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      student_photo_url: ''
    })
    const [studentErrors, setStudentErrors] = useState({})
    const [studentSubmitting, setStudentSubmitting] = useState(false)
    
    // Student Registration - Schools and Branches State
    const [studentSchoolsList, setStudentSchoolsList] = useState([])
    const [loadingStudentSchools, setLoadingStudentSchools] = useState(false)
    const [studentBranchesList, setStudentBranchesList] = useState([])
    const [loadingStudentBranches, setLoadingStudentBranches] = useState(false)
    
    // Student Registration - Users State
    const [studentUsersList, setStudentUsersList] = useState([])
    const [loadingStudentUsers, setLoadingStudentUsers] = useState(false)
    
    // Fetch schools for Student Registration
    // Fetch all schools for Student Registration (no pagination)
    const fetchStudentSchools = async () => {
      setLoadingStudentSchools(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/schools`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all schools
          }
        })
        
        let schools = []
        
        if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            schools = response.data.data
          } else if (response.data.data && Array.isArray(response.data.data.schools)) {
            schools = response.data.data.schools
          } else if (Array.isArray(response.data.data.list)) {
            schools = response.data.data.list
          } else if (Array.isArray(response.data.data.records)) {
            schools = response.data.data.records
          }
        } else if (Array.isArray(response.data)) {
          schools = response.data
        }
        
        setStudentSchoolsList(schools)
      } catch (error) {
        console.error('Error fetching schools for student:', error)
        setStudentSchoolsList([])
      } finally {
        setLoadingStudentSchools(false)
      }
    }
    
    // Fetch all branches for Student Registration (no pagination)
    const fetchStudentBranches = async () => {
      setLoadingStudentBranches(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/branches`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all branches
          }
        })
        
        let branches = []
        
        if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            branches = response.data.data
          } else if (response.data.data && Array.isArray(response.data.data.branches)) {
            branches = response.data.data.branches
          } else if (Array.isArray(response.data.data.list)) {
            branches = response.data.data.list
          } else if (Array.isArray(response.data.data.records)) {
            branches = response.data.data.records
          }
        } else if (Array.isArray(response.data)) {
          branches = response.data
        }
        
        setStudentBranchesList(branches)
      } catch (error) {
        console.error('Error fetching branches for student:', error)
        setStudentBranchesList([])
      } finally {
        setLoadingStudentBranches(false)
      }
    }
    
    // Fetch users by school for Student Registration
    const fetchStudentUsersBySchool = async (schoolId) => {
      if (!schoolId) {
        setStudentUsersList([])
        setStudentForm(prev => ({ ...prev, user_id: '' }))
        return
      }
      
      setLoadingStudentUsers(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/users/school/${schoolId}/STUDENT`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        let users = []
        
        console.log('Student Registration - API Response:', response.data)
        
        // Handle different response structures
        if (Array.isArray(response.data)) {
          users = response.data
        } else if (response.data && Array.isArray(response.data.users)) {
          // API returns { status: "success", users: [...] }
          users = response.data.users
        } else if (response.data && Array.isArray(response.data.data)) {
          users = response.data.data
        } else if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
          users = response.data.data.users
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // Single object response - wrap it in an array
          if (response.data.user_id || response.data.school_id) {
            users = [response.data]
          }
        }
        
        console.log('Student Registration - Parsed users:', users)
        console.log('Student Registration - Users count:', users.length)
        
        setStudentUsersList(users)
        
      } catch (error) {
        console.error('Error fetching users for student:', error)
        setStudentUsersList([])
      } finally {
        setLoadingStudentUsers(false)
      }
    }
    
    // Fetch users when school is selected in Student Registration
    useEffect(() => {
      if (studentForm.school_id) {
        fetchStudentUsersBySchool(studentForm.school_id)
      } else {
        setStudentUsersList([])
        setStudentForm(prev => ({ ...prev, user_id: '' }))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentForm.school_id])
    
    // Fetch all schools and branches when Student Registration tab is active
    useEffect(() => {
      if (registrationType === 'student') {
        if (studentSchoolsList.length === 0 && !loadingStudentSchools) {
          fetchStudentSchools()
        }
        if (studentBranchesList.length === 0 && !loadingStudentBranches) {
          fetchStudentBranches()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationType])
    
    // Parent Registration State
    const [parentForm, setParentForm] = useState({
      school_id: '',
      user_id: '',
      full_name: '',
      phone: '',
      whatsapp_number: '',
      email: '',
      occupation: '',
      annual_income_range: '',
      education_level: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      pincode: ''
    })
    const [parentErrors, setParentErrors] = useState({})
    const [parentSubmitting, setParentSubmitting] = useState(false)
    
    // Parent Registration - Schools State
    const [parentSchoolsList, setParentSchoolsList] = useState([])
    const [loadingParentSchools, setLoadingParentSchools] = useState(false)
    
    // Parent Registration - Users State
    const [parentUsersList, setParentUsersList] = useState([])
    const [loadingParentUsers, setLoadingParentUsers] = useState(false)
    
    // Fetch all schools for Parent Registration (no pagination)
    const fetchParentSchools = async () => {
      setLoadingParentSchools(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/schools`, {
          headers: { 'Content-Type': 'application/json' },
          params: {
            page: 1,
            limit: 10000 // Fetch all schools
          }
        })
        
        let schools = []
        
        if (response.data && response.data.data) {
          if (Array.isArray(response.data.data)) {
            schools = response.data.data
          } else if (response.data.data && Array.isArray(response.data.data.schools)) {
            schools = response.data.data.schools
          } else if (Array.isArray(response.data.data.list)) {
            schools = response.data.data.list
          } else if (Array.isArray(response.data.data.records)) {
            schools = response.data.data.records
          }
        } else if (Array.isArray(response.data)) {
          schools = response.data
        }
        
        setParentSchoolsList(schools)
      } catch (error) {
        console.error('Error fetching schools for parent:', error)
        setParentSchoolsList([])
      } finally {
        setLoadingParentSchools(false)
      }
    }
    
    // Clear parent school selection if not in current page list
    useEffect(() => {
      if (parentForm.school_id && parentSchoolsList.length > 0) {
        const schoolExists = parentSchoolsList.some(school => school.school_id === parentForm.school_id || school.school_id === String(parentForm.school_id))
        if (!schoolExists) {
          setParentForm(prev => ({ ...prev, school_id: '' }))
          if (parentErrors.school_id) {
            setParentErrors(prev => ({ ...prev, school_id: '' }))
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentSchoolsList])
    
    // Fetch users by school for Parent Registration
    const fetchParentUsersBySchool = async (schoolId) => {
      if (!schoolId) {
        setParentUsersList([])
        setParentForm(prev => ({ ...prev, user_id: '' }))
        return
      }
      
      setLoadingParentUsers(true)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/users/school/${schoolId}/PARENT`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        let users = []
        
        console.log('API Response:', response.data)
        
        // Handle different response structures
        if (Array.isArray(response.data)) {
          users = response.data
        } else if (response.data && Array.isArray(response.data.users)) {
          // API returns { status: "success", users: [...] }
          users = response.data.users
        } else if (response.data && Array.isArray(response.data.data)) {
          users = response.data.data
        } else if (response.data && response.data.data && Array.isArray(response.data.data.users)) {
          users = response.data.data.users
        } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          // Single object response - wrap it in an array
          if (response.data.user_id || response.data.school_id) {
            users = [response.data]
          }
        }
        
        console.log('Parsed users:', users)
        console.log('Users count:', users.length)
        
        setParentUsersList(users)
        
      } catch (error) {
        console.error('Error fetching users for parent:', error)
        setParentUsersList([])
      } finally {
        setLoadingParentUsers(false)
      }
    }
    
    // Fetch users when school is selected in Parent Registration
    useEffect(() => {
      if (parentForm.school_id) {
        fetchParentUsersBySchool(parentForm.school_id)
      } else {
        setParentUsersList([])
        setParentForm(prev => ({ ...prev, user_id: '' }))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentForm.school_id])
    
    // Fetch all schools when Parent Registration tab is active
    useEffect(() => {
      if (registrationType === 'parent') {
        if (parentSchoolsList.length === 0 && !loadingParentSchools) {
          fetchParentSchools()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [registrationType])
    
    // Parent Form Validation
    const validateParentForm = () => {
      const errors = {}
      
      if (!parentForm.school_id) {
        errors.school_id = 'School ID is required'
      }
      
      if (!parentForm.user_id) {
        errors.user_id = 'User ID is required'
      }
      
      if (!parentForm.full_name.trim()) {
        errors.full_name = 'Full name is required'
      } else if (parentForm.full_name.trim().length < 3) {
        errors.full_name = 'Full name must be at least 3 characters'
      }
      
      const phoneRegex = /^[6-9]\d{9}$/
      if (!parentForm.phone || !phoneRegex.test(parentForm.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number starting with 6-9'
      }
      
      if (!parentForm.whatsapp_number || !phoneRegex.test(parentForm.whatsapp_number)) {
        errors.whatsapp_number = 'Please enter a valid 10-digit WhatsApp number starting with 6-9'
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!parentForm.email || !emailRegex.test(parentForm.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (!parentForm.occupation.trim()) {
        errors.occupation = 'Occupation is required'
      }
      
      if (!parentForm.annual_income_range) {
        errors.annual_income_range = 'Annual income range is required'
      }
      
      if (!parentForm.education_level) {
        errors.education_level = 'Education level is required'
      }
      
      if (!parentForm.address_line1.trim()) {
        errors.address_line1 = 'Address line 1 is required'
      }
      
      if (!parentForm.city.trim()) {
        errors.city = 'City is required'
      }
      
      if (!parentForm.state.trim()) {
        errors.state = 'State is required'
      }
      
      const pinRegex = /^\d{6}$/
      if (!parentForm.pincode || !pinRegex.test(parentForm.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pin code'
      }
      
      setParentErrors(errors)
      return Object.keys(errors).length === 0
    }
    
    // Handle Parent Form Change
    const handleParentFormChange = (e) => {
      const { name, value } = e.target
      
      // For phone, whatsapp_number, pincode, only allow digits
      let processedValue = value
      if (name === 'phone' || name === 'whatsapp_number' || name === 'pincode') {
        processedValue = value.replace(/\D/g, '') // Remove all non-digit characters
        if ((name === 'phone' || name === 'whatsapp_number') && processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10)
        }
        if (name === 'pincode' && processedValue.length > 6) {
          processedValue = processedValue.slice(0, 6)
        }
      }
      
      setParentForm(prev => ({
        ...prev,
        [name]: processedValue || value
      }))
      
      // Clear user_id when school changes
      if (name === 'school_id') {
        setParentForm(prev => ({ ...prev, [name]: processedValue || value, user_id: '' }))
      }
      
      // Clear error for this field
      if (parentErrors[name]) {
        setParentErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
    
    // Handle Parent Form Submit
    const handleParentSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateParentForm()) {
        return
      }
      
      setParentSubmitting(true)
      
      try {
        const payload = {
          school_id: parseInt(parentForm.school_id),
          user_id: parentForm.user_id ? String(parentForm.user_id) : undefined,
          full_name: parentForm.full_name,
          phone: parentForm.phone,
          whatsapp_number: parentForm.whatsapp_number,
          email: parentForm.email,
          occupation: parentForm.occupation,
          annual_income_range: parentForm.annual_income_range,
          education_level: parentForm.education_level,
          address_line1: parentForm.address_line1,
          address_line2: parentForm.address_line2 || '',
          city: parentForm.city,
          state: parentForm.state,
          pincode: parentForm.pincode
        }
        
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_BASE_URL}/parents/register`, payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Show SweetAlert2 success message
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data?.message || 'Parent registered successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Reset form
        setParentForm({
          school_id: '',
          user_id: '',
          full_name: '',
          phone: '',
          whatsapp_number: '',
          email: '',
          occupation: '',
          annual_income_range: '',
          education_level: '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          pincode: ''
        })
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to register parent. Please try again.'
        try {
          const Swal = await loadSwal()
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          })
        } catch (swalError) {
          alert(errorMsg)
        }
      } finally {
        setParentSubmitting(false)
      }
    }
    
    // Student Form Validation
    const validateStudentForm = () => {
      const errors = {}
      
      if (!studentForm.school_id) {
        errors.school_id = 'School ID is required'
      }
      
      if (!studentForm.user_id) {
        errors.user_id = 'User ID is required'
      }
      
      if (!studentForm.branch_id) {
        errors.branch_id = 'Branch ID is required'
      }
      
      if (!studentForm.admission_number.trim()) {
        errors.admission_number = 'Admission number is required'
      }
      
      if (!studentForm.roll_number.trim()) {
        errors.roll_number = 'Roll number is required'
      }
      
      if (!studentForm.full_name.trim()) {
        errors.full_name = 'Full name is required'
      }
      
      if (!studentForm.date_of_birth) {
        errors.date_of_birth = 'Date of birth is required'
      }
      
      if (!studentForm.gender) {
        errors.gender = 'Gender is required'
      }
      
      if (!studentForm.blood_group) {
        errors.blood_group = 'Blood group is required'
      }
      
      if (!studentForm.aadhar_number.trim()) {
        errors.aadhar_number = 'Aadhar number is required'
      } else if (!/^\d{12}$/.test(studentForm.aadhar_number)) {
        errors.aadhar_number = 'Please enter a valid 12-digit Aadhar number'
      }
      
      if (!studentForm.admission_date) {
        errors.admission_date = 'Admission date is required'
      }
      
      if (!studentForm.admission_class) {
        errors.admission_class = 'Admission class is required'
      }
      
      if (!studentForm.current_status) {
        errors.current_status = 'Current status is required'
      }
      
      if (!studentForm.address_line1.trim()) {
        errors.address_line1 = 'Address line 1 is required'
      }
      
      if (!studentForm.city.trim()) {
        errors.city = 'City is required'
      }
      
      if (!studentForm.state.trim()) {
        errors.state = 'State is required'
      }
      
      const pinRegex = /^\d{6}$/
      if (!studentForm.pincode || !pinRegex.test(studentForm.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pin code'
      }
      
      if (!studentForm.emergency_contact_name.trim()) {
        errors.emergency_contact_name = 'Emergency contact name is required'
      }
      
      const phoneRegex = /^\d{10}$/
      if (!studentForm.emergency_contact_phone || !phoneRegex.test(studentForm.emergency_contact_phone)) {
        errors.emergency_contact_phone = 'Please enter a valid 10-digit emergency contact phone'
      }
      
      if (studentForm.student_photo_url && studentForm.student_photo_url.trim()) {
        try {
          new URL(studentForm.student_photo_url)
        } catch {
          errors.student_photo_url = 'Please enter a valid URL'
        }
      }
      
      setStudentErrors(errors)
      return Object.keys(errors).length === 0
    }
    
    // Handle Student Form Change
    const handleStudentFormChange = (e) => {
      const { name, value, type, checked } = e.target
      
      // For phone, pincode, aadhar, only allow digits (school_id and branch_id are now dropdowns)
      let processedValue = value
      if (name === 'emergency_contact_phone' || name === 'pincode' || name === 'aadhar_number') {
        processedValue = value.replace(/\D/g, '') // Remove all non-digit characters
        if (name === 'emergency_contact_phone' && processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10)
        }
        if (name === 'pincode' && processedValue.length > 6) {
          processedValue = processedValue.slice(0, 6)
        }
        if (name === 'aadhar_number' && processedValue.length > 12) {
          processedValue = processedValue.slice(0, 12)
        }
      }
      
      setStudentForm(prev => ({
        ...prev,
        [name]: processedValue
      }))
      
      // Clear user_id when school changes
      if (name === 'school_id') {
        setStudentForm(prev => ({ ...prev, [name]: processedValue, user_id: '' }))
      }
      
      // Clear error for this field
      if (studentErrors[name]) {
        setStudentErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
    
    // Handle Student Form Submit
    const handleStudentSubmit = async (e) => {
      e.preventDefault()
      
      if (!validateStudentForm()) {
        return
      }
      
      setStudentSubmitting(true)
      
      try {
        const payload = {
          school_id: parseInt(studentForm.school_id),
          user_id: studentForm.user_id ? String(studentForm.user_id) : undefined,
          branch_id: parseInt(studentForm.branch_id),
          admission_number: studentForm.admission_number,
          roll_number: studentForm.roll_number,
          full_name: studentForm.full_name,
          date_of_birth: studentForm.date_of_birth,
          gender: studentForm.gender,
          blood_group: studentForm.blood_group,
          aadhar_number: studentForm.aadhar_number,
          admission_date: studentForm.admission_date,
          admission_class: studentForm.admission_class,
          current_status: studentForm.current_status,
          address_line1: studentForm.address_line1,
          city: studentForm.city,
          state: studentForm.state,
          pincode: studentForm.pincode,
          medical_conditions: studentForm.medical_conditions || '',
          emergency_contact_name: studentForm.emergency_contact_name,
          emergency_contact_phone: studentForm.emergency_contact_phone,
          student_photo_url: studentForm.student_photo_url || ''
        }
        
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_BASE_URL}/students/register`, payload, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Show SweetAlert2 success message
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Student registered successfully!',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        
        // Reset form
        setStudentForm({
          school_id: '',
          user_id: '',
          branch_id: '',
          admission_number: '',
          roll_number: '',
          full_name: '',
          date_of_birth: '',
          gender: '',
          blood_group: '',
          aadhar_number: '',
          admission_date: '',
          admission_class: '',
          current_status: 'ACTIVE',
          address_line1: '',
          city: '',
          state: '',
          pincode: '',
          medical_conditions: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          student_photo_url: ''
        })
        
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to register student. Please try again.'
        try {
          const Swal = await loadSwal()
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMsg
          })
        } catch (swalError) {
          alert(errorMsg)
        }
      } finally {
        setStudentSubmitting(false)
      }
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 px-8 py-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              </div>
              <div>
                <h1 className="m-0 text-white text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
                <p className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold mt-2">
                  ADMIN
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-white text-slate-800 border-none px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:shadow-lg hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-xl p-4 shadow-lg mb-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
                <p className="text-sm text-slate-200">Manage your school system, users, and administrative tasks</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Schools Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Schools</h3>
              <p className="text-white text-3xl font-bold">
                {loadingStats ? (
                  <span className="text-white/70">...</span>
                ) : (
                  stats.schools.toLocaleString()
                )}
              </p>
            </div>

            {/* Branches Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Branches</h3>
              <p className="text-white text-3xl font-bold">
                {loadingStats ? (
                  <span className="text-white/70">...</span>
                ) : (
                  stats.branches.toLocaleString()
                )}
              </p>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Users</h3>
              <p className="text-white text-3xl font-bold">
                {loadingStats ? (
                  <span className="text-white/70">...</span>
                ) : (
                  stats.users.toLocaleString()
                )}
              </p>
            </div>

            {/* Students Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Students</h3>
              <p className="text-white text-3xl font-bold">
                {loadingStats ? (
                  <span className="text-white/70">...</span>
                ) : (
                  stats.students.toLocaleString()
                )}
              </p>
            </div>

            {/* Parents Card */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-white text-sm font-semibold mb-1">Parents</h3>
              <p className="text-white text-3xl font-bold">
                {loadingStats ? (
                  <span className="text-white/70">...</span>
                ) : (
                  stats.parents.toLocaleString()
                )}
              </p>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
            <div className="flex gap-2 border-b border-slate-200 pb-2 mb-4 overflow-x-auto">
              {['registration', 'users', 'settings', 'reports', 'dataupload'].map(tab => {
                const tabLabels = {
                  'registration': 'Registration',
                  'users': 'Users',
                  'settings': 'Settings',
                  'reports': 'Reports',
                  'dataupload': 'Data Upload'
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setAdminActiveTab(tab)}
                    className={`px-4 py-2 rounded-t-md text-sm font-semibold transition-all duration-200 ${
                      adminActiveTab === tab 
                        ? 'bg-slate-800 text-white border-b-2 border-slate-800' 
                        : 'text-gray-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tabLabels[tab] || tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              })}
            </div>

                <div className="mt-2">
              {adminActiveTab === 'registration' && (
                    <div className="space-y-4">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3 text-white shadow-md">
                    <h3 className="text-lg font-bold mb-1">Registration Portal</h3>
                    <p className="text-xs text-slate-200">Register new schools, branches, and users in the system</p>
                  </div>
                  
                  {/* Registration Type Selector - Modern Card Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                    {[
                      { value: 'school', label: 'School', desc: 'Register School' },
                      { value: 'branch', label: 'Branch', desc: 'Register Branch' },
                      { value: 'users', label: 'Users', desc: 'Register Users' },
                      { value: 'student', label: 'Student', desc: 'Register Student' },
                      { value: 'parent', label: 'Parent', desc: 'Register Parent' },
                      { value: 'relationship', label: 'Relationship', desc: 'Create Relationship' }
                    ].map(type => (
                      <button
                        key={type.value}
                        onClick={() => setRegistrationType(type.value)}
                        className={`p-2 rounded-lg border transition-all duration-200 text-left ${
                          registrationType === type.value
                            ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                            : 'border-slate-200 bg-white text-gray-700 hover:border-slate-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="font-bold text-sm mb-0.5">{type.label}</div>
                        <div className={`text-xs ${registrationType === type.value ? 'text-slate-200' : 'text-gray-500'}`}>{type.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* School Registration */}
                  {registrationType === 'school' && (
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                        <h4 className="text-base font-bold text-white">School Registration</h4>
                        <p className="text-xs text-slate-200 mt-0.5">Fill in the details to register a new school</p>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleSchoolSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="school_code"
                                value={schoolForm.school_code}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                                  schoolErrors.school_code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., SCH001"
                              />
                              {schoolErrors.school_code && <p className="text-red-600 text-xs mt-1">{schoolErrors.school_code}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="school_name"
                                value={schoolForm.school_name}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.school_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter school name"
                              />
                              {schoolErrors.school_name && <p className="text-red-600 text-xs mt-1">{schoolErrors.school_name}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="address_line1"
                              value={schoolForm.address_line1}
                              onChange={handleSchoolFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                schoolErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter address line 1"
                            />
                            {schoolErrors.address_line1 && <p className="text-red-600 text-xs mt-1">{schoolErrors.address_line1}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                            <input
                              type="text"
                              name="address_line2"
                              value={schoolForm.address_line2}
                              onChange={handleSchoolFormChange}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                              placeholder="Enter address line 2 (optional)"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="city"
                                value={schoolForm.city}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                              {schoolErrors.city && <p className="text-red-600 text-xs mt-1">{schoolErrors.city}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={schoolForm.state}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter state"
                              />
                              {schoolErrors.state && <p className="text-red-600 text-xs mt-1">{schoolErrors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={schoolForm.pincode}
                                onChange={handleSchoolFormChange}
                                maxLength="6"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 6-digit pin code"
                              />
                              {schoolErrors.pincode && <p className="text-red-600 text-xs mt-1">{schoolErrors.pincode}</p>}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="phone"
                                value={schoolForm.phone}
                                onChange={handleSchoolFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit phone number"
                              />
                              {schoolErrors.phone && <p className="text-red-600 text-xs mt-1">{schoolErrors.phone}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                              <input
                                type="email"
                                name="email"
                                value={schoolForm.email}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="contact@school.com"
                              />
                              {schoolErrors.email && <p className="text-red-600 text-xs mt-1">{schoolErrors.email}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                            <input
                              type="url"
                              name="website"
                              value={schoolForm.website}
                              onChange={handleSchoolFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                schoolErrors.website ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="https://school.com"
                            />
                            {schoolErrors.website && <p className="text-red-600 text-xs mt-1">{schoolErrors.website}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Board Type <span className="text-red-500">*</span></label>
                              <select
                                name="board_type"
                                value={schoolForm.board_type}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.board_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select board type</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="State Board">State Board</option>
                                <option value="IB">IB</option>
                                <option value="IGCSE">IGCSE</option>
                              </select>
                              {schoolErrors.board_type && <p className="text-red-600 text-xs mt-1">{schoolErrors.board_type}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Session Start Month <span className="text-red-500">*</span></label>
                              <select
                                name="academic_session_start_month"
                                value={schoolForm.academic_session_start_month}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.academic_session_start_month ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                              </select>
                              {schoolErrors.academic_session_start_month && <p className="text-red-600 text-xs mt-1">{schoolErrors.academic_session_start_month}</p>}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Grading System <span className="text-red-500">*</span></label>
                              <select
                                name="grading_system"
                                value={schoolForm.grading_system}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.grading_system ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select grading system</option>
                                <option value="PERCENTAGE">Percentage</option>
                                <option value="GRADE_POINTS">Grade Points</option>
                                <option value="LETTER_GRADES">Letter Grades</option>
                              </select>
                              {schoolErrors.grading_system && <p className="text-red-600 text-xs mt-1">{schoolErrors.grading_system}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Affiliation Number <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="affiliation_number"
                                value={schoolForm.affiliation_number}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  schoolErrors.affiliation_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter affiliation number"
                              />
                              {schoolErrors.affiliation_number && <p className="text-red-600 text-xs mt-1">{schoolErrors.affiliation_number}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Recognition Status <span className="text-red-500">*</span></label>
                            <select
                              name="recognition_status"
                              value={schoolForm.recognition_status}
                              onChange={handleSchoolFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                schoolErrors.recognition_status ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Select recognition status</option>
                              <option value="RECOGNIZED">Recognized</option>
                              <option value="UNRECOGNIZED">Unrecognized</option>
                              <option value="PENDING">Pending</option>
                            </select>
                            {schoolErrors.recognition_status && <p className="text-red-600 text-xs mt-1">{schoolErrors.recognition_status}</p>}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="rte_compliance"
                              id="rte_compliance"
                              checked={schoolForm.rte_compliance}
                              onChange={handleSchoolFormChange}
                              className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                            />
                            <label htmlFor="rte_compliance" className="text-sm font-semibold text-gray-700">
                              RTE Compliance
                            </label>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={schoolSubmitting}
                            className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              schoolSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            {schoolSubmitting ? 'Registering...' : 'Register School'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Branch Registration */}
                  {registrationType === 'branch' && (
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                        <h4 className="text-base font-bold text-white">Branch Registration</h4>
                        <p className="text-xs text-slate-200 mt-0.5">Fill in the details to register a new branch for an existing school</p>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleBranchSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="school_id"
                                value={branchForm.school_id}
                                onChange={handleBranchFormChange}
                                disabled={loadingBranchSchools}
                                loading={loadingBranchSchools}
                                error={!!branchErrors.school_id}
                                placeholder={loadingBranchSchools ? 'Loading schools...' : 'Select school'}
                                options={branchSchoolsList.map(school => ({
                                  value: school.school_id,
                                  label: `${school.school_id} - ${school.school_name}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {branchErrors.school_id && <p className="text-red-600 text-xs mt-1">{branchErrors.school_id}</p>}
                              {!loadingBranchSchools && branchSchoolsList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No schools available. Please register a school first.</p>
                              )}
                              {!loadingBranchSchools && branchSchoolsList.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1">Found {branchSchoolsList.length} school(s). Type to search.</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="branch_code"
                                value={branchForm.branch_code}
                                onChange={handleBranchFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.branch_code ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., MAIN"
                              />
                              {branchErrors.branch_code && <p className="text-red-600 text-xs mt-1">{branchErrors.branch_code}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="branch_name"
                              value={branchForm.branch_name}
                              onChange={handleBranchFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                branchErrors.branch_name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Main Campus"
                            />
                            {branchErrors.branch_name && <p className="text-red-600 text-xs mt-1">{branchErrors.branch_name}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="address_line1"
                              value={branchForm.address_line1}
                              onChange={handleBranchFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                branchErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter address line 1"
                            />
                            {branchErrors.address_line1 && <p className="text-red-600 text-xs mt-1">{branchErrors.address_line1}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="city"
                                value={branchForm.city}
                                onChange={handleBranchFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                              {branchErrors.city && <p className="text-red-600 text-xs mt-1">{branchErrors.city}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={branchForm.state}
                                onChange={handleBranchFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter state"
                              />
                              {branchErrors.state && <p className="text-red-600 text-xs mt-1">{branchErrors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={branchForm.pincode}
                                onChange={handleBranchFormChange}
                                maxLength="6"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 6-digit pin code"
                              />
                              {branchErrors.pincode && <p className="text-red-600 text-xs mt-1">{branchErrors.pincode}</p>}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="phone"
                                value={branchForm.phone}
                                onChange={handleBranchFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit phone number"
                              />
                              {branchErrors.phone && <p className="text-red-600 text-xs mt-1">{branchErrors.phone}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Students</label>
                              <input
                                type="text"
                                name="max_students"
                                value={branchForm.max_students}
                                onChange={handleBranchFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  branchErrors.max_students ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., 1500"
                              />
                              {branchErrors.max_students && <p className="text-red-600 text-xs mt-1">{branchErrors.max_students}</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="is_main_branch"
                              id="is_main_branch"
                              checked={branchForm.is_main_branch}
                              onChange={handleBranchFormChange}
                              className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                            />
                            <label htmlFor="is_main_branch" className="text-sm font-semibold text-gray-700">
                              Is Main Branch
                            </label>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={branchSubmitting}
                            className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              branchSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            {branchSubmitting ? 'Registering...' : 'Register Branch'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Users Registration */}
                  {registrationType === 'users' && (
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                        <h4 className="text-base font-bold text-white">Users Registration</h4>
                        <p className="text-xs text-slate-200 mt-0.5">Register new users (Principal, Teacher, Parent, Admin, Student) in the system</p>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="school_id"
                                value={userForm.school_id}
                                onChange={handleUserFormChange}
                                disabled={loadingSchools}
                                loading={loadingSchools}
                                error={!!userErrors.school_id}
                                placeholder={loadingSchools ? 'Loading schools...' : 'Select school'}
                                options={schoolsList.map(school => ({
                                  value: school.school_id,
                                  label: `${school.school_id} - ${school.school_name}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {userErrors.school_id && <p className="text-red-600 text-xs mt-1">{userErrors.school_id}</p>}
                              {!loadingSchools && schoolsList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No schools available. Please register a school first.</p>
                              )}
                              {!loadingSchools && schoolsList.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1">Found {schoolsList.length} school(s). Type to search.</p>
                              )}
                            </div>
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch ID <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="branch_id"
                                value={userForm.branch_id}
                                onChange={handleUserFormChange}
                                disabled={loadingBranches}
                                loading={loadingBranches}
                                error={!!userErrors.branch_id}
                                placeholder={loadingBranches ? 'Loading branches...' : 'Select branch'}
                                options={branchesList.map(branch => ({
                                  value: branch.branch_id,
                                  label: `${branch.branch_id} - ${branch.branch_name}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {userErrors.branch_id && <p className="text-red-600 text-xs mt-1">{userErrors.branch_id}</p>}
                              {!loadingBranches && branchesList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No branches available. Please register a branch first.</p>
                              )}
                              {!loadingBranches && branchesList.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1">Found {branchesList.length} branch(es). Type to search.</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Username <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="username"
                                value={userForm.username}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.username ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter username"
                              />
                              {userErrors.username && <p className="text-red-600 text-xs mt-1">{userErrors.username}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Role <span className="text-red-500">*</span></label>
                              <select
                                name="role"
                                value={userForm.role}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.role ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select role</option>
                                <option value="PRINCIPAL">Principal</option>
                                <option value="TEACHER">Teacher</option>
                                <option value="PARENT">Parent</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STUDENT">Student</option>
                              </select>
                              {userErrors.role && <p className="text-red-600 text-xs mt-1">{userErrors.role}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="full_name"
                              value={userForm.full_name}
                              onChange={handleUserFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                userErrors.full_name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter full name"
                            />
                            {userErrors.full_name && <p className="text-red-600 text-xs mt-1">{userErrors.full_name}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                              <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="user@example.com"
                              />
                              {userErrors.email && <p className="text-red-600 text-xs mt-1">{userErrors.email}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="phone"
                                value={userForm.phone}
                                onChange={handleUserFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit phone number"
                              />
                              {userErrors.phone && <p className="text-red-600 text-xs mt-1">{userErrors.phone}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 pr-12 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter password (min 6 characters)"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {userErrors.password && <p className="text-red-600 text-xs mt-1">{userErrors.password}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                              <input
                                type="date"
                                name="date_of_birth"
                                value={userForm.date_of_birth}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {userErrors.date_of_birth && <p className="text-red-600 text-xs mt-1">{userErrors.date_of_birth}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                              <select
                                name="gender"
                                value={userForm.gender}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.gender ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                              </select>
                              {userErrors.gender && <p className="text-red-600 text-xs mt-1">{userErrors.gender}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="employee_id"
                                value={userForm.employee_id}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.employee_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter employee ID"
                              />
                              {userErrors.employee_id && <p className="text-red-600 text-xs mt-1">{userErrors.employee_id}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Designation <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="designation"
                              value={userForm.designation}
                              onChange={handleUserFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                userErrors.designation ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter designation"
                            />
                            {userErrors.designation && <p className="text-red-600 text-xs mt-1">{userErrors.designation}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Phone</label>
                              <input
                                type="tel"
                                name="alternate_phone"
                                value={userForm.alternate_phone}
                                onChange={handleUserFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.alternate_phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter alternate phone (optional)"
                              />
                              {userErrors.alternate_phone && <p className="text-red-600 text-xs mt-1">{userErrors.alternate_phone}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
                              <input
                                type="tel"
                                name="emergency_contact"
                                value={userForm.emergency_contact}
                                onChange={handleUserFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.emergency_contact ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter emergency contact (optional)"
                              />
                              {userErrors.emergency_contact && <p className="text-red-600 text-xs mt-1">{userErrors.emergency_contact}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="address_line1"
                              value={userForm.address_line1}
                              onChange={handleUserFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                userErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter address line 1"
                            />
                            {userErrors.address_line1 && <p className="text-red-600 text-xs mt-1">{userErrors.address_line1}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="city"
                                value={userForm.city}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                              {userErrors.city && <p className="text-red-600 text-xs mt-1">{userErrors.city}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={userForm.state}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter state"
                              />
                              {userErrors.state && <p className="text-red-600 text-xs mt-1">{userErrors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={userForm.pincode}
                                onChange={handleUserFormChange}
                                maxLength="6"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  userErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 6-digit pin code"
                              />
                              {userErrors.pincode && <p className="text-red-600 text-xs mt-1">{userErrors.pincode}</p>}
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={userSubmitting}
                            className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              userSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            {userSubmitting ? 'Registering...' : 'Register User'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Student Registration */}
                  {registrationType === 'student' && (
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                        <h4 className="text-base font-bold text-white">Student Registration</h4>
                        <p className="text-xs text-slate-200 mt-0.5">Fill in the details to register a new student in the system</p>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleStudentSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="school_id"
                                value={studentForm.school_id}
                                onChange={handleStudentFormChange}
                                disabled={loadingStudentSchools}
                                loading={loadingStudentSchools}
                                error={!!studentErrors.school_id}
                                placeholder={loadingStudentSchools ? 'Loading schools...' : 'Select school'}
                                options={studentSchoolsList.map(school => ({
                                  value: school.school_id,
                                  label: `${school.school_id} - ${school.school_name}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {studentErrors.school_id && <p className="text-red-600 text-xs mt-1">{studentErrors.school_id}</p>}
                              {!loadingStudentSchools && studentSchoolsList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No schools available. Please register a school first.</p>
                              )}
                              {!loadingStudentSchools && studentSchoolsList.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1">Found {studentSchoolsList.length} school(s). Type to search.</p>
                              )}
                            </div>
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch ID <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="branch_id"
                                value={studentForm.branch_id}
                                onChange={handleStudentFormChange}
                                disabled={loadingStudentBranches}
                                loading={loadingStudentBranches}
                                error={!!studentErrors.branch_id}
                                placeholder={loadingStudentBranches ? 'Loading branches...' : 'Select branch'}
                                options={studentBranchesList.map(branch => ({
                                  value: branch.branch_id,
                                  label: `${branch.branch_id} - ${branch.branch_name}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {studentErrors.branch_id && <p className="text-red-600 text-xs mt-1">{studentErrors.branch_id}</p>}
                              {!loadingStudentBranches && studentBranchesList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No branches available. Please register a branch first.</p>
                              )}
                              {!loadingStudentBranches && studentBranchesList.length > 0 && (
                                <p className="text-gray-500 text-xs mt-1">Found {studentBranchesList.length} branch(es). Type to search.</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Users Dropdown */}
                          {studentForm.school_id && (
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">User <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="user_id"
                                value={studentForm.user_id}
                                onChange={handleStudentFormChange}
                                disabled={loadingStudentUsers}
                                loading={loadingStudentUsers}
                                error={!!studentErrors.user_id}
                                placeholder={loadingStudentUsers ? 'Loading users...' : 'Select user'}
                                options={studentUsersList.map((user, index) => ({
                                  value: user.user_id || user.id,
                                  label: `${user.user_id || user.id} - ${user.full_name || 'N/A'}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {studentErrors.user_id && <p className="text-red-600 text-xs mt-1">{studentErrors.user_id}</p>}
                              {!loadingStudentUsers && studentForm.school_id && studentUsersList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No users available for this school.</p>
                              )}
                              {!loadingStudentUsers && studentUsersList.length > 0 && (
                                <p className="text-green-600 text-xs mt-1">Found {studentUsersList.length} user(s) for this school. Type to search.</p>
                              )}
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Number <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="admission_number"
                                value={studentForm.admission_number}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.admission_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., ADM-2025-001"
                              />
                              {studentErrors.admission_number && <p className="text-red-600 text-xs mt-1">{studentErrors.admission_number}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="roll_number"
                                value={studentForm.roll_number}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.roll_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., 10A-01"
                              />
                              {studentErrors.roll_number && <p className="text-red-600 text-xs mt-1">{studentErrors.roll_number}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="full_name"
                              value={studentForm.full_name}
                              onChange={handleStudentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                studentErrors.full_name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter full name"
                            />
                            {studentErrors.full_name && <p className="text-red-600 text-xs mt-1">{studentErrors.full_name}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth <span className="text-red-500">*</span></label>
                              <input
                                type="date"
                                name="date_of_birth"
                                value={studentForm.date_of_birth}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.date_of_birth ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {studentErrors.date_of_birth && <p className="text-red-600 text-xs mt-1">{studentErrors.date_of_birth}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                              <select
                                name="gender"
                                value={studentForm.gender}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.gender ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                              </select>
                              {studentErrors.gender && <p className="text-red-600 text-xs mt-1">{studentErrors.gender}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group <span className="text-red-500">*</span></label>
                              <select
                                name="blood_group"
                                value={studentForm.blood_group}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.blood_group ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                              </select>
                              {studentErrors.blood_group && <p className="text-red-600 text-xs mt-1">{studentErrors.blood_group}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="aadhar_number"
                              value={studentForm.aadhar_number}
                              onChange={handleStudentFormChange}
                              maxLength="12"
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                studentErrors.aadhar_number ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter 12-digit Aadhar number"
                            />
                            {studentErrors.aadhar_number && <p className="text-red-600 text-xs mt-1">{studentErrors.aadhar_number}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Date <span className="text-red-500">*</span></label>
                              <input
                                type="date"
                                name="admission_date"
                                value={studentForm.admission_date}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.admission_date ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                              {studentErrors.admission_date && <p className="text-red-600 text-xs mt-1">{studentErrors.admission_date}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Class <span className="text-red-500">*</span></label>
                              <select
                                name="admission_class"
                                value={studentForm.admission_class}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.admission_class ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select class</option>
                                <option value="1">Class 1</option>
                                <option value="2">Class 2</option>
                                <option value="3">Class 3</option>
                                <option value="4">Class 4</option>
                                <option value="5">Class 5</option>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                              </select>
                              {studentErrors.admission_class && <p className="text-red-600 text-xs mt-1">{studentErrors.admission_class}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Status <span className="text-red-500">*</span></label>
                              <select
                                name="current_status"
                                value={studentForm.current_status}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.current_status ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                                <option value="SUSPENDED">Suspended</option>
                              </select>
                              {studentErrors.current_status && <p className="text-red-600 text-xs mt-1">{studentErrors.current_status}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="address_line1"
                              value={studentForm.address_line1}
                              onChange={handleStudentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                studentErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter address line 1"
                            />
                            {studentErrors.address_line1 && <p className="text-red-600 text-xs mt-1">{studentErrors.address_line1}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="city"
                                value={studentForm.city}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                              {studentErrors.city && <p className="text-red-600 text-xs mt-1">{studentErrors.city}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={studentForm.state}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter state"
                              />
                              {studentErrors.state && <p className="text-red-600 text-xs mt-1">{studentErrors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={studentForm.pincode}
                                onChange={handleStudentFormChange}
                                maxLength="6"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 6-digit pin code"
                              />
                              {studentErrors.pincode && <p className="text-red-600 text-xs mt-1">{studentErrors.pincode}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions</label>
                            <textarea
                              name="medical_conditions"
                              value={studentForm.medical_conditions}
                              onChange={handleStudentFormChange}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                              rows="3"
                              placeholder="Enter any medical conditions (optional)"
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="emergency_contact_name"
                                value={studentForm.emergency_contact_name}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.emergency_contact_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter emergency contact name"
                              />
                              {studentErrors.emergency_contact_name && <p className="text-red-600 text-xs mt-1">{studentErrors.emergency_contact_name}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="emergency_contact_phone"
                                value={studentForm.emergency_contact_phone}
                                onChange={handleStudentFormChange}
                                maxLength="10"
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  studentErrors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit emergency contact phone"
                              />
                              {studentErrors.emergency_contact_phone && <p className="text-red-600 text-xs mt-1">{studentErrors.emergency_contact_phone}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Student Photo URL</label>
                            <input
                              type="url"
                              name="student_photo_url"
                              value={studentForm.student_photo_url}
                              onChange={handleStudentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                studentErrors.student_photo_url ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="https://example.com/photos/student.png (optional)"
                            />
                            {studentErrors.student_photo_url && <p className="text-red-600 text-xs mt-1">{studentErrors.student_photo_url}</p>}
                          </div>
                          
                          <button
                            type="submit"
                            disabled={studentSubmitting}
                            className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              studentSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            {studentSubmitting ? 'Registering...' : 'Register Student'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Parent Registration */}
                  {registrationType === 'parent' && (
                    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                        <h4 className="text-base font-bold text-white">Parent Registration</h4>
                        <p className="text-xs text-slate-200 mt-0.5">Fill in the details to register a new parent in the system</p>
                      </div>
                      <div className="p-4">
                        <form onSubmit={handleParentSubmit} className="space-y-4">
                          <div style={{ width: '100%' }}>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                            <SearchableSelect
                              name="school_id"
                              value={parentForm.school_id}
                              onChange={handleParentFormChange}
                              disabled={loadingParentSchools}
                              loading={loadingParentSchools}
                              error={!!parentErrors.school_id}
                              placeholder={loadingParentSchools ? 'Loading schools...' : 'Select school'}
                              options={parentSchoolsList.map(school => ({
                                value: school.school_id,
                                label: `${school.school_id} - ${school.school_name}`
                              }))}
                              className="w-full"
                              style={{ width: '100%' }}
                            />
                            {parentErrors.school_id && <p className="text-red-600 text-xs mt-1">{parentErrors.school_id}</p>}
                            {!loadingParentSchools && parentSchoolsList.length === 0 && (
                              <p className="text-yellow-600 text-xs mt-1">No schools available. Please register a school first.</p>
                            )}
                            {!loadingParentSchools && parentSchoolsList.length > 0 && (
                              <p className="text-gray-500 text-xs mt-1">Found {parentSchoolsList.length} school(s). Type to search.</p>
                            )}
                          </div>
                          
                          {/* Users Dropdown */}
                          {parentForm.school_id && (
                            <div style={{ width: '100%' }}>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">User <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="user_id"
                                value={parentForm.user_id}
                                onChange={handleParentFormChange}
                                disabled={loadingParentUsers}
                                loading={loadingParentUsers}
                                error={!!parentErrors.user_id}
                                placeholder={loadingParentUsers ? 'Loading users...' : 'Select user'}
                                options={parentUsersList.map((user, index) => ({
                                  value: user.user_id || user.id,
                                  label: `${user.user_id || user.id} - ${user.full_name || 'N/A'}`
                                }))}
                                className="w-full"
                                style={{ width: '100%' }}
                              />
                              {parentErrors.user_id && <p className="text-red-600 text-xs mt-1">{parentErrors.user_id}</p>}
                              {!loadingParentUsers && parentForm.school_id && parentUsersList.length === 0 && (
                                <p className="text-yellow-600 text-xs mt-1">No users available for this school.</p>
                              )}
                              {!loadingParentUsers && parentUsersList.length > 0 && (
                                <p className="text-green-600 text-xs mt-1">Found {parentUsersList.length} user(s) for this school. Type to search.</p>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="full_name"
                              value={parentForm.full_name}
                              onChange={handleParentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                parentErrors.full_name ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter full name"
                            />
                            {parentErrors.full_name && <p className="text-red-600 text-xs mt-1">{parentErrors.full_name}</p>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="phone"
                                value={parentForm.phone}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                              />
                              {parentErrors.phone && <p className="text-red-600 text-xs mt-1">{parentErrors.phone}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                              <input
                                type="tel"
                                name="whatsapp_number"
                                value={parentForm.whatsapp_number}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.whatsapp_number ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 10-digit WhatsApp number"
                                maxLength="10"
                              />
                              {parentErrors.whatsapp_number && <p className="text-red-600 text-xs mt-1">{parentErrors.whatsapp_number}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                            <input
                              type="email"
                              name="email"
                              value={parentForm.email}
                              onChange={handleParentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                parentErrors.email ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="parent@example.com"
                            />
                            {parentErrors.email && <p className="text-red-600 text-xs mt-1">{parentErrors.email}</p>}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="occupation"
                                value={parentForm.occupation}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.occupation ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter occupation"
                              />
                              {parentErrors.occupation && <p className="text-red-600 text-xs mt-1">{parentErrors.occupation}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income Range <span className="text-red-500">*</span></label>
                              <select
                                name="annual_income_range"
                                value={parentForm.annual_income_range}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.annual_income_range ? 'border-red-500' : 'border-gray-300'
                                }`}
                              >
                                <option value="">Select range</option>
                                <option value="5-7 LPA">5-7 LPA</option>
                                <option value="3-5 LPA">3-5 LPA</option>
                                <option value="1-3 LPA">1-3 LPA</option>
                                <option value="<1 LPA">&lt;1 LPA</option>
                                <option value=">7 LPA">&gt;7 LPA</option>
                              </select>
                              {parentErrors.annual_income_range && <p className="text-red-600 text-xs mt-1">{parentErrors.annual_income_range}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Education Level <span className="text-red-500">*</span></label>
                            <select
                              name="education_level"
                              value={parentForm.education_level}
                              onChange={handleParentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                parentErrors.education_level ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">Select education level</option>
                              <option value="Graduate">Graduate</option>
                              <option value="Postgraduate">Postgraduate</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="High School">High School</option>
                              <option value="Other">Other</option>
                            </select>
                            {parentErrors.education_level && <p className="text-red-600 text-xs mt-1">{parentErrors.education_level}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="address_line1"
                              value={parentForm.address_line1}
                              onChange={handleParentFormChange}
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                parentErrors.address_line1 ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter address line 1"
                            />
                            {parentErrors.address_line1 && <p className="text-red-600 text-xs mt-1">{parentErrors.address_line1}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                            <input
                              type="text"
                              name="address_line2"
                              value={parentForm.address_line2}
                              onChange={handleParentFormChange}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                              placeholder="Enter address line 2 (optional)"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="city"
                                value={parentForm.city}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.city ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter city"
                              />
                              {parentErrors.city && <p className="text-red-600 text-xs mt-1">{parentErrors.city}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="state"
                                value={parentForm.state}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.state ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter state"
                              />
                              {parentErrors.state && <p className="text-red-600 text-xs mt-1">{parentErrors.state}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="pincode"
                                value={parentForm.pincode}
                                onChange={handleParentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                                  parentErrors.pincode ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter 6-digit pin code"
                                maxLength="6"
                              />
                              {parentErrors.pincode && <p className="text-red-600 text-xs mt-1">{parentErrors.pincode}</p>}
                            </div>
                          </div>
                          <button
                            type="submit"
                            disabled={parentSubmitting}
                            className={`w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              parentSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {parentSubmitting ? 'Registering...' : 'Register Parent'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Relationship Registration */}
                  {registrationType === 'relationship' && (
                    <RelationshipRegistration />
                  )}
                </div>
              )}

              {adminActiveTab === 'users' && (
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3 text-white shadow-md">
                    <h3 className="text-lg font-bold mb-1">User Management</h3>
                    <p className="text-xs text-slate-200">Manage teachers, students, parents, and staff accounts</p>
                  </div>

                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Manage Users</h4>
                      <p className="text-xs text-gray-600 mb-2">View, edit, and delete user accounts across the system.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        View Users →
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Add New Users</h4>
                      <p className="text-xs text-gray-600 mb-2">Create new user accounts for teachers, students, and staff members.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        Add User →
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">User Roles</h4>
                      <p className="text-xs text-gray-600 mb-2">Manage user roles and permissions for different access levels.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        Manage Roles →
                      </button>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xl font-bold text-slate-800">0</div>
                      <div className="text-xs text-gray-600 mt-0.5">Total Users</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xl font-bold text-slate-800">0</div>
                      <div className="text-xs text-gray-600 mt-0.5">Teachers</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xl font-bold text-slate-800">0</div>
                      <div className="text-xs text-gray-600 mt-0.5">Students</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xl font-bold text-slate-800">0</div>
                      <div className="text-xs text-gray-600 mt-0.5">Parents</div>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'settings' && (
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3 text-white shadow-md">
                    <h3 className="text-lg font-bold mb-1">School Settings</h3>
                    <p className="text-xs text-slate-200">Configure school information and system settings</p>
                  </div>

                  {/* Settings Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">School Information</h4>
                      <p className="text-xs text-gray-600 mb-2">Update school name, address, and contact details.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        Edit Settings →
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Security Settings</h4>
                      <p className="text-xs text-gray-600 mb-2">Manage security settings and access controls.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        Configure →
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">System Reports</h4>
                      <p className="text-xs text-gray-600 mb-2">Generate and view various system reports.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        View Reports →
                      </button>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Analytics</h4>
                      <p className="text-xs text-gray-600 mb-2">Monitor system usage and performance metrics.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        View Analytics →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'dataupload' && (
                <div className="space-y-4">
                  <DataUploader />
                </div>
              )}

              {adminActiveTab === 'reports' && (
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3 text-white shadow-md">
                    <h3 className="text-lg font-bold mb-1">Reports & Analytics</h3>
                    <p className="text-xs text-slate-200">View system reports, analytics, and upload report card data</p>
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">System Reports</h4>
                      <p className="text-xs text-gray-600 mb-2">Generate and view various system reports and statistics.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        Generate Report →
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                        <div className="w-4 h-4 bg-slate-600 rounded"></div>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 mb-1">Analytics</h4>
                      <p className="text-xs text-gray-600 mb-2">Monitor system usage and performance metrics in real-time.</p>
                      <button className="text-slate-700 font-semibold text-xs hover:text-slate-900 transition-colors">
                        View Analytics →
                      </button>
                    </div>
                  </div>

                  {/* Excel File Upload Section */}
                  <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
                      <h4 className="text-base font-bold text-white">Upload Report Cards</h4>
                      <p className="text-xs text-slate-200 mt-0.5">Upload an Excel file containing student report card marks and results</p>
                    </div>
                    <div className="p-4">
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
                        <div className="space-y-4">
                          {/* File Upload Field */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Excel File <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
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
                                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  <p className="text-sm text-gray-600 mb-1">
                                    <span className="text-slate-700 font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">Excel or CSV file (.csv, .xlsx, .xls)</p>
                                  {reportUploadFile && (
                                    <p className="text-sm text-green-600 font-semibold mt-2">
                                      Selected: {reportUploadFile.name}
                                    </p>
                                  )}
                                </div>
                              </label>
                            </div>
                            {reportUploadError && (
                              <p className="text-red-600 text-xs mt-1">{reportUploadError}</p>
                            )}
                          </div>
                          
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={reportUploading || !reportUploadFile}
                            className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {reportUploading ? 'Uploading...' : 'Upload Excel File'}
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



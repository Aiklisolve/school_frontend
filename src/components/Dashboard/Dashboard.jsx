import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

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

  // Teacher Dashboard Component
  const TeacherDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
          <p className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
            TEACHER
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
            <p className="text-md text-blue-600 font-semibold">You have successfully logged in as a TEACHER.</p>
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

  // Parent Dashboard Component
  const ParentDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
          <p className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
            PARENT
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
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
              👨‍👩‍👧‍👦
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Parent Dashboard</h2>
            <p className="text-lg text-gray-600 mb-2">Welcome to your parent portal!</p>
            <p className="text-md text-green-600 font-semibold">You have successfully logged in as a PARENT.</p>
          </div>
          </div>

                {/* Tabs */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex gap-2 border-b pb-2 mb-4">
            {['upload','chat','meeting','calendar'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-md -mb-px font-semibold transition-colors ${
                  activeTab === tab 
                    ? 'bg-white border border-b-0 border-gray-200 text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'upload' && (
              <div className="p-6 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600">Upload documents and images related to your child's education.</p>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="p-6 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Chat AI Assistant</h3>
                <p className="text-sm text-gray-600">Chat with AI assistant for school-related queries and support.</p>
              </div>
            )}

            {activeTab === 'meeting' && (
              <div className="p-6 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Meeting Scheduler</h3>
                <p className="text-sm text-gray-600">Schedule parent-teacher meetings and appointments.</p>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="p-6 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Calendar</h3>
                <p className="text-sm text-gray-600">View school events, holidays, and important dates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Student Dashboard Component
  const StudentDashboard = () => (
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

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const [adminActiveTab, setAdminActiveTab] = useState('registration')
    const [registrationType, setRegistrationType] = useState('school')
    
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
        
        const response = await axios.post(`${API_BASE_URL}/schools/register`, payload, {
          headers: { 'Content-Type': 'application/json' }
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
      
      // For school_id and branch_id, only allow digits
      if (name === 'school_id' || name === 'branch_id') {
        processedValue = value.replace(/\D/g, '')
      }
      
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
        // Hash the password before sending
        const hashedPassword = await hashPassword(userForm.password)
        
        const payload = {
          school_id: parseInt(userForm.school_id),
          branch_id: parseInt(userForm.branch_id),
          username: userForm.username,
          email: userForm.email,
          phone: userForm.phone,
          password: hashedPassword,
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
        
        const response = await axios.post(`${API_BASE_URL}/users/register`, payload, {
          headers: { 'Content-Type': 'application/json' }
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
    
    // Student Form Validation
    const validateStudentForm = () => {
      const errors = {}
      
      if (!studentForm.school_id) {
        errors.school_id = 'School ID is required'
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
      
      // For phone, pincode, aadhar, school_id, branch_id, only allow digits
      let processedValue = value
      if (name === 'emergency_contact_phone' || name === 'pincode' || name === 'aadhar_number' || name === 'school_id' || name === 'branch_id') {
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
        
        const response = await axios.post(`${API_BASE_URL}/students/register`, payload, {
          headers: { 'Content-Type': 'application/json' }
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="bg-white px-8 py-6 shadow-md flex justify-between items-center">
          <div>
            <h1 className="m-0 text-gray-900 text-2xl font-bold">Welcome, {user?.name || user?.email}!</h1>
            <p className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-xl text-xs font-semibold mt-2">
              ADMIN
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
              <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white text-6xl font-bold px-8 py-4 rounded-2xl mb-4 shadow-lg">
                ⚙️
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard</h2>
              <p className="text-lg text-gray-600 mb-2">Welcome to your administrative portal!</p>
              <p className="text-md text-orange-600 font-semibold">You have successfully logged in as an ADMIN.</p>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex gap-2 border-b pb-2 mb-4">
              {['registration', 'users', 'settings', 'reports'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setAdminActiveTab(tab)}
                  className={`px-4 py-2 rounded-t-md -mb-px font-semibold transition-colors ${
                    adminActiveTab === tab 
                      ? 'bg-white border border-b-0 border-gray-200 text-orange-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
              {adminActiveTab === 'registration' && (
                    <div>
                  <h3 className="text-lg font-semibold mb-4">Registration Portal</h3>
                  
                  {/* Registration Type Selector */}
                  <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {[
                        { value: 'school', label: 'School Registration' },
                        { value: 'users', label: 'Users Registration' },
                        { value: 'student', label: 'Student Registration' },
                        { value: 'parent', label: 'Parent Registration' }
                      ].map(type => (
                        <button
                          key={type.value}
                          onClick={() => setRegistrationType(type.value)}
                          className={`px-4 py-2 font-semibold text-sm whitespace-nowrap transition-colors border-b-2 ${
                            registrationType === type.value
                              ? 'border-orange-500 text-orange-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* School Registration */}
                  {registrationType === 'school' && (
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🏫</span>
                        <h4 className="text-xl font-semibold text-gray-900">School Registration</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Register a new school in the system.</p>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <form onSubmit={handleSchoolSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School Code <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="school_code"
                                value={schoolForm.school_code}
                                onChange={handleSchoolFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                  schoolErrors.school_code ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <label htmlFor="rte_compliance" className="text-sm font-semibold text-gray-700">
                              RTE Compliance
                            </label>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={schoolSubmitting}
                            className={`w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
                              schoolSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                          >
                            {schoolSubmitting ? 'Registering...' : 'Register School'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Users Registration */}
                  {registrationType === 'users' && (
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">👥</span>
                        <h4 className="text-xl font-semibold text-gray-900">Users Registration</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Register new users (Principal, Teacher, Parent, Admin, Student) in the system.</p>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <form onSubmit={handleUserSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="school_id"
                                value={userForm.school_id}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                  userErrors.school_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter school ID"
                              />
                              {userErrors.school_id && <p className="text-red-600 text-xs mt-1">{userErrors.school_id}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch ID <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="branch_id"
                                value={userForm.branch_id}
                                onChange={handleUserFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                  userErrors.branch_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter branch ID"
                              />
                              {userErrors.branch_id && <p className="text-red-600 text-xs mt-1">{userErrors.branch_id}</p>}
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 pr-12 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                            className={`w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
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
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🎓</span>
                        <h4 className="text-xl font-semibold text-gray-900">Student Registration</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Register new students in the system.</p>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <form onSubmit={handleStudentSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="school_id"
                                value={studentForm.school_id}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                  studentErrors.school_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter school ID"
                              />
                              {studentErrors.school_id && <p className="text-red-600 text-xs mt-1">{studentErrors.school_id}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch ID <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="branch_id"
                                value={studentForm.branch_id}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                  studentErrors.branch_id ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter branch ID"
                              />
                              {studentErrors.branch_id && <p className="text-red-600 text-xs mt-1">{studentErrors.branch_id}</p>}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Admission Number <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                name="admission_number"
                                value={studentForm.admission_number}
                                onChange={handleStudentFormChange}
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
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
                              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500 ${
                                studentErrors.student_photo_url ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="https://example.com/photos/student.png (optional)"
                            />
                            {studentErrors.student_photo_url && <p className="text-red-600 text-xs mt-1">{studentErrors.student_photo_url}</p>}
                          </div>
                          
                          <button
                            type="submit"
                            disabled={studentSubmitting}
                            className={`w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 ${
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
                    <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">👨‍👩‍👧‍👦</span>
                        <h4 className="text-xl font-semibold text-gray-900">Parent Registration</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">Register new parents in the system.</p>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <form className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">School</label>
                            <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                              <option value="">Select school</option>
                              <option value="1">Bright Future School (ID: 1)</option>
                              <option value="2">Green Valley Academy (ID: 2)</option>
                              <option value="3">Sunrise Public School (ID: 3)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                              <input
                                type="tel"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                              <input
                                type="tel"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter 10-digit WhatsApp number"
                                maxLength="10"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                              type="email"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                              placeholder="parent@example.com"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter occupation"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income Range</label>
                              <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                                <option value="">Select range</option>
                                <option value="5-7 LPA">5-7 LPA</option>
                                <option value="3-5 LPA">3-5 LPA</option>
                                <option value="1-3 LPA">1-3 LPA</option>
                                <option value="<1 LPA">&lt;1 LPA</option>
                                <option value=">7 LPA">&gt;7 LPA</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Education Level</label>
                            <select className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                              <option value="">Select education level</option>
                              <option value="Graduate">Graduate</option>
                              <option value="Postgraduate">Postgraduate</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="High School">High School</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                              placeholder="Enter address line 1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                              placeholder="Enter address line 2 (optional)"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter city"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter state"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Code</label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                placeholder="Enter 6-digit pin code"
                                maxLength="6"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            Register Parent
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminActiveTab === 'users' && (
                <div className="p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">User Management</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage teachers, students, parents, and staff accounts.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">👥 Manage Users</h4>
                      <p className="text-sm text-gray-600">View, edit, and delete user accounts.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">➕ Add New Users</h4>
                      <p className="text-sm text-gray-600">Create new user accounts for teachers, students, and staff.</p>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'settings' && (
                <div className="p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">School Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure school information and system settings.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">🏫 School Information</h4>
                      <p className="text-sm text-gray-600">Update school name, address, and contact details.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">🔐 Security Settings</h4>
                      <p className="text-sm text-gray-600">Manage security settings and access controls.</p>
                    </div>
                  </div>
                </div>
              )}

              {adminActiveTab === 'reports' && (
                <div className="p-6 bg-gray-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Reports & Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">View system reports and analytics.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">📊 System Reports</h4>
                      <p className="text-sm text-gray-600">Generate and view various system reports.</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold mb-2">📈 Analytics</h4>
                      <p className="text-sm text-gray-600">Monitor system usage and performance metrics.</p>
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
      {userType === 'teacher' && <TeacherDashboard />}
      {userType === 'parent' && <ParentDashboard />}
      {userType === 'student' && <StudentDashboard />}
      {userType === 'admin' && <AdminDashboard />}
    </>
  )
}

export default Dashboard



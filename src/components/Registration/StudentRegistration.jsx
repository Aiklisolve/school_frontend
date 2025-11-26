import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SearchableSelect from './SearchableSelect'

const API_BASE_URL = 'http://localhost:8080/api'

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

const StudentRegistration = () => {
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
  
  // Fetch all schools and branches on component mount
  useEffect(() => {
    if (studentSchoolsList.length === 0 && !loadingStudentSchools) {
      fetchStudentSchools()
    }
    if (studentBranchesList.length === 0 && !loadingStudentBranches) {
      fetchStudentBranches()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
        <h4 className="text-lg font-semibold text-white">Student Registration</h4>
        <p className="text-sm text-indigo-100 mt-1">Fill in the details to register a new student in the system</p>
      </div>
      <div className="p-6">
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
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              studentSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {studentSubmitting ? 'Registering...' : 'Register Student'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentRegistration


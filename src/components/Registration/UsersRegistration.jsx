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

const UsersRegistration = () => {
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
      
      setSchoolsList(schools)
      
    } catch (error) {
      console.error('Error fetching schools:', error)
      setSchoolsList([])
    } finally {
      setLoadingSchools(false)
    }
  }
  
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
      
      setBranchesList(branches)
      
    } catch (error) {
      console.error('Error fetching branches:', error)
      setBranchesList([])
    } finally {
      setLoadingBranches(false)
    }
  }
  
  // Fetch all schools and branches on component mount
  useEffect(() => {
    if (schoolsList.length === 0 && !loadingSchools) {
      fetchSchools()
    }
    if (branchesList.length === 0 && !loadingBranches) {
      fetchBranches()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
    
    let processedValue = value
    if (name === 'phone' || name === 'alternate_phone' || name === 'emergency_contact' || name === 'pincode') {
      processedValue = value.replace(/\D/g, '')
      if ((name === 'phone' || name === 'alternate_phone' || name === 'emergency_contact') && processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10)
      }
      if (name === 'pincode' && processedValue.length > 6) {
        processedValue = processedValue.slice(0, 6)
      }
    }
    
    setUserForm(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
        <h4 className="text-lg font-semibold text-white">Users Registration</h4>
        <p className="text-sm text-indigo-100 mt-1">Register new users (Principal, Teacher, Parent, Admin, Student) in the system</p>
      </div>
      <div className="p-6">
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
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              userSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {userSubmitting ? 'Registering...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default UsersRegistration


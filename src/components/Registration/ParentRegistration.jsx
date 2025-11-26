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

const ParentRegistration = () => {
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
  
  // Fetch all schools on component mount
  useEffect(() => {
    if (parentSchoolsList.length === 0 && !loadingParentSchools) {
      fetchParentSchools()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
        <h4 className="text-lg font-semibold text-white">Parent Registration</h4>
        <p className="text-sm text-indigo-100 mt-1">Fill in the details to register a new parent in the system</p>
      </div>
      <div className="p-6">
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
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              parentSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {parentSubmitting ? 'Registering...' : 'Register Parent'}
            </button>
        </form>
          </div>
    </div>
  )
}

export default ParentRegistration

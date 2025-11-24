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

const BranchRegistration = () => {
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
  
  // Fetch all schools on component mount
  useEffect(() => {
    if (branchSchoolsList.length === 0 && !loadingBranchSchools) {
      fetchBranchSchools()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
      
      const response = await axios.post(`${API_BASE_URL}/branches`, payload, {
        headers: { 'Content-Type': 'application/json' }
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

  return (
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
  )
}

export default BranchRegistration


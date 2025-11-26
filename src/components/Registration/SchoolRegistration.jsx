import React, { useState } from 'react'
import axios from 'axios'

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

const SchoolRegistration = () => {
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

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
        <h4 className="text-lg font-semibold text-white">School Registration</h4>
        <p className="text-sm text-indigo-100 mt-1">Fill in the details to register a new school</p>
      </div>
      <div className="p-6">
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
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              schoolSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {schoolSubmitting ? 'Registering...' : 'Register School'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SchoolRegistration


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

const RelationshipRegistration = () => {
  const [relationshipForm, setRelationshipForm] = useState({
    school_id: '',
    parent_id: '',
    parent_name: '',
    student_id: '',
    student_name: '',
    relationship_type: '',
    is_primary_contact: false,
    is_fee_responsible: false,
    is_emergency_contact: false
  })
  const [relationshipErrors, setRelationshipErrors] = useState({})
  const [relationshipSubmitting, setRelationshipSubmitting] = useState(false)
  
  // Schools list state
  const [schoolsList, setSchoolsList] = useState([])
  const [loadingSchools, setLoadingSchools] = useState(false)
  
  // Parents list state
  const [parentsList, setParentsList] = useState([])
  const [loadingParents, setLoadingParents] = useState(false)
  
  // Students list state
  const [studentsList, setStudentsList] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  
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
  
  // Fetch parents list from API by school
  const fetchParents = async (schoolId) => {
    if (!schoolId) {
      setParentsList([])
      setRelationshipForm(prev => ({ ...prev, parent_id: '', parent_name: '' }))
      return
    }
    
    setLoadingParents(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/parents/school/${schoolId}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      let parents = []
      
      // Handle API response structure: { status: "success", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        parents = response.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        parents = response.data.data
      } else if (Array.isArray(response.data)) {
        parents = response.data
      }
      
      setParentsList(parents)
      
    } catch (error) {
      console.error('Error fetching parents:', error)
      setParentsList([])
    } finally {
      setLoadingParents(false)
    }
  }
  
  // Fetch students list from API by school
  const fetchStudents = async (schoolId) => {
    if (!schoolId) {
      setStudentsList([])
      setRelationshipForm(prev => ({ ...prev, student_id: '', student_name: '' }))
      return
    }
    
    setLoadingStudents(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/students/school/${schoolId}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      let students = []
      
      // Handle API response structure: { status: "success", data: [...] }
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        students = response.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        students = response.data.data
      } else if (Array.isArray(response.data)) {
        students = response.data
      }
      
      setStudentsList(students)
      
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudentsList([])
    } finally {
      setLoadingStudents(false)
    }
  }
  
  // Fetch all schools when component is first rendered
  useEffect(() => {
    if (schoolsList.length === 0 && !loadingSchools) {
      fetchSchools()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Fetch parents and students when school is selected
  useEffect(() => {
    if (relationshipForm.school_id) {
      fetchParents(relationshipForm.school_id)
      fetchStudents(relationshipForm.school_id)
      // Clear selections when school changes
      setRelationshipForm(prev => ({
        ...prev,
        parent_id: '',
        parent_name: '',
        student_id: '',
        student_name: ''
      }))
    } else {
      setParentsList([])
      setStudentsList([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipForm.school_id])
  
  // Auto-fill parent name when parent is selected
  useEffect(() => {
    if (relationshipForm.parent_id && parentsList.length > 0) {
      const selectedParent = parentsList.find(p => p.parent_id === relationshipForm.parent_id || p.parent_id === String(relationshipForm.parent_id))
      if (selectedParent) {
        setRelationshipForm(prev => ({
          ...prev,
          parent_name: selectedParent.full_name || selectedParent.parent_name || ''
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipForm.parent_id, parentsList])
  
  // Auto-fill student name when student is selected
  useEffect(() => {
    if (relationshipForm.student_id && studentsList.length > 0) {
      const selectedStudent = studentsList.find(s => s.student_id === relationshipForm.student_id || s.student_id === String(relationshipForm.student_id))
      if (selectedStudent) {
        setRelationshipForm(prev => ({
          ...prev,
          student_name: selectedStudent.full_name || selectedStudent.student_name || ''
        }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipForm.student_id, studentsList])
  
  // Relationship Form Validation
  const validateRelationshipForm = () => {
    const errors = {}
    
    if (!relationshipForm.parent_id) {
      errors.parent_id = 'Parent ID is required'
    }
    
    if (!relationshipForm.parent_name.trim()) {
      errors.parent_name = 'Parent name is required'
    }
    
    if (!relationshipForm.student_id) {
      errors.student_id = 'Student ID is required'
    }
    
    if (!relationshipForm.student_name.trim()) {
      errors.student_name = 'Student name is required'
    }
    
    if (!relationshipForm.relationship_type) {
      errors.relationship_type = 'Relationship type is required'
    }
    
    setRelationshipErrors(errors)
    return Object.keys(errors).length === 0
  }
  
  // Handle Relationship Form Change
  const handleRelationshipFormChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setRelationshipForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (relationshipErrors[name]) {
      setRelationshipErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  // Handle Relationship Form Submit
  const handleRelationshipSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateRelationshipForm()) {
      return
    }
    
    setRelationshipSubmitting(true)
    
    try {
      // Prepare payload exactly as per API specification
      const payload = {
        parent_id: String(relationshipForm.parent_id),
        parent_name: relationshipForm.parent_name.trim(),
        student_id: String(relationshipForm.student_id),
        student_name: relationshipForm.student_name.trim(),
        relationship_type: relationshipForm.relationship_type,
        is_primary_contact: Boolean(relationshipForm.is_primary_contact),
        is_fee_responsible: Boolean(relationshipForm.is_fee_responsible),
        is_emergency_contact: Boolean(relationshipForm.is_emergency_contact)
      }
      
      console.log('Relationship Registration - Payload being sent:', JSON.stringify(payload, null, 2))
      
      // Get JWT token from localStorage
      const token = localStorage.getItem('token')
      
      const response = await axios.post(`${API_BASE_URL}/relationships`, payload, {
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
      
      // Store token if provided in response
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
        console.log('Token stored after relationship registration')
      } else if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token)
        console.log('Token stored after relationship registration')
      }
      
      const Swal = await loadSwal()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Relationship registered successfully!',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
      
      // Reset form (keep school selected)
      setRelationshipForm({
        school_id: relationshipForm.school_id,
        parent_id: '',
        parent_name: '',
        student_id: '',
        student_name: '',
        relationship_type: '',
        is_primary_contact: false,
        is_fee_responsible: false,
        is_emergency_contact: false
      })
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to register relationship. Please try again.'
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
      setRelationshipSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
        <h4 className="text-lg font-semibold text-white">Relationship Registration</h4>
        <p className="text-sm text-indigo-100 mt-1">Create a relationship between a parent and a student</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleRelationshipSubmit} className="space-y-4">
          {/* School Selection */}
          <div style={{ width: '100%' }}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">School ID <span className="text-red-500">*</span></label>
            <SearchableSelect
              name="school_id"
              value={relationshipForm.school_id}
              onChange={handleRelationshipFormChange}
              disabled={loadingSchools}
              loading={loadingSchools}
              error={!!relationshipErrors.school_id}
              placeholder={loadingSchools ? 'Loading schools...' : 'Select school'}
              options={schoolsList.map(school => ({
                value: school.school_id,
                label: `${school.school_id} - ${school.school_name}`
              }))}
              className="w-full"
              style={{ width: '100%' }}
            />
            {relationshipErrors.school_id && <p className="text-red-600 text-xs mt-1">{relationshipErrors.school_id}</p>}
            {!loadingSchools && schoolsList.length === 0 && (
              <p className="text-yellow-600 text-xs mt-1">No schools available. Please register a school first.</p>
            )}
            {!loadingSchools && schoolsList.length > 0 && (
              <p className="text-gray-500 text-xs mt-1">Found {schoolsList.length} school(s). Type to search.</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Parent ID <span className="text-red-500">*</span></label>
              <SearchableSelect
                name="parent_id"
                value={relationshipForm.parent_id}
                onChange={handleRelationshipFormChange}
                disabled={loadingParents || !relationshipForm.school_id}
                loading={loadingParents}
                error={!!relationshipErrors.parent_id}
                placeholder={!relationshipForm.school_id ? 'Please select a school first' : loadingParents ? 'Loading parents...' : 'Select parent'}
                options={parentsList.map(parent => ({
                  value: parent.parent_id,
                  label: String(parent.parent_id) + " - " + parent.full_name || parent.parent_name || 'N/A'
                }))}
                className="w-full"
                style={{ width: '100%' }}
              />
              {relationshipErrors.parent_id && <p className="text-red-600 text-xs mt-1">{relationshipErrors.parent_id}</p>}
              {!loadingParents && relationshipForm.school_id && parentsList.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">No parents available for this school.</p>
              )}
              {!loadingParents && parentsList.length > 0 && (
                <p className="text-green-600 text-xs mt-1">Found {parentsList.length} parent(s). Type to search.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="parent_name"
                value={relationshipForm.parent_name}
                onChange={handleRelationshipFormChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                  relationshipErrors.parent_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Parent name (auto-filled from selection)"
              />
              {relationshipErrors.parent_name && <p className="text-red-600 text-xs mt-1">{relationshipErrors.parent_name}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{ width: '100%' }}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID <span className="text-red-500">*</span></label>
              <SearchableSelect
                name="student_id"
                value={relationshipForm.student_id}
                onChange={handleRelationshipFormChange}
                disabled={loadingStudents || !relationshipForm.school_id}
                loading={loadingStudents}
                error={!!relationshipErrors.student_id}
                placeholder={!relationshipForm.school_id ? 'Please select a school first' : loadingStudents ? 'Loading students...' : 'Select student'}
                options={studentsList.map(student => ({
                  value: student.student_id,
                  label: `${student.student_id} - ${student.full_name || student.student_name || 'N/A'}`
                }))}
                className="w-full"
                style={{ width: '100%' }}
              />  
              {relationshipErrors.student_id && <p className="text-red-600 text-xs mt-1">{relationshipErrors.student_id}</p>}
              {!loadingStudents && relationshipForm.school_id && studentsList.length === 0 && (
                <p className="text-yellow-600 text-xs mt-1">No students available for this school.</p>
              )}
              {!loadingStudents && studentsList.length > 0 && (
                <p className="text-green-600 text-xs mt-1">Found {studentsList.length} student(s). Type to search.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="student_name"
                value={relationshipForm.student_name}
                onChange={handleRelationshipFormChange}
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                  relationshipErrors.student_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Student name (auto-filled from selection)"
              />
              {relationshipErrors.student_name && <p className="text-red-600 text-xs mt-1">{relationshipErrors.student_name}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship Type <span className="text-red-500">*</span></label>
            <select
              name="relationship_type"
              value={relationshipForm.relationship_type}
              onChange={handleRelationshipFormChange}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500 ${
                relationshipErrors.relationship_type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select relationship type</option>
              <option value="MOTHER">Mother</option>
              <option value="FATHER">Father</option>
              <option value="GUARDIAN">Guardian</option>
              <option value="GRANDFATHER">Grandfather</option>
              <option value="GRANDMOTHER">Grandmother</option>
              <option value="UNCLE">Uncle</option>
              <option value="AUNT">Aunt</option>
              <option value="OTHER">Other</option>
            </select>
            {relationshipErrors.relationship_type && <p className="text-red-600 text-xs mt-1">{relationshipErrors.relationship_type}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_primary_contact"
                id="is_primary_contact"
                checked={relationshipForm.is_primary_contact}
                onChange={handleRelationshipFormChange}
                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <label htmlFor="is_primary_contact" className="text-sm font-semibold text-gray-700">
                Primary Contact
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_fee_responsible"
                id="is_fee_responsible"
                checked={relationshipForm.is_fee_responsible}
                onChange={handleRelationshipFormChange}
                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <label htmlFor="is_fee_responsible" className="text-sm font-semibold text-gray-700">
                Fee Responsible
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_emergency_contact"
                id="is_emergency_contact"
                checked={relationshipForm.is_emergency_contact}
                onChange={handleRelationshipFormChange}
                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <label htmlFor="is_emergency_contact" className="text-sm font-semibold text-gray-700">
                Emergency Contact
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={relationshipSubmitting}
            className={`w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 ${
              relationshipSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {relationshipSubmitting ? 'Registering...' : 'Register Relationship'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RelationshipRegistration


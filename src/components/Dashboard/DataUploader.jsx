import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'
const SCHOOL_VALIDATE_URL = 'http://localhost:8080/api/unified-setup/validate'
const SCHOOL_UPLOAD_URL = 'http://localhost:8080/api/unified-setup/upload'

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

const DataUploader = () => {
  // State for each upload type
  const [schoolFile, setSchoolFile] = useState(null)
  const [userFile, setUserFile] = useState(null)
  const [attendanceFile, setAttendanceFile] = useState(null)
  const [scheduleFile, setScheduleFile] = useState(null)
  const [questionPaperFile, setQuestionPaperFile] = useState(null)

  // Loading states
  const [uploadingSchool, setUploadingSchool] = useState(false)
  const [uploadingUser, setUploadingUser] = useState(false)
  const [uploadingAttendance, setUploadingAttendance] = useState(false)
  const [uploadingSchedule, setUploadingSchedule] = useState(false)
  const [uploadingQuestionPaper, setUploadingQuestionPaper] = useState(false)

  // Error states
  const [schoolError, setSchoolError] = useState('')
  const [userError, setUserError] = useState('')
  const [attendanceError, setAttendanceError] = useState('')
  const [scheduleError, setScheduleError] = useState('')
  const [questionPaperError, setQuestionPaperError] = useState('')

  // Validate file type
  const validateFile = (file, allowedExtensions = ['.csv', '.xlsx', '.xls']) => {
    if (!file) return false
    const fileName = file.name.toLowerCase()
    return allowedExtensions.some(ext => fileName.endsWith(ext))
  }

  const formatValidationMessage = (data) => {
    if (!data) return 'Validation completed. Proceed with upload?'
    
    const status = data.status || (data.isValid ? 'success' : 'warning')
    const message = data.message || (data.isValid ? 'File looks good.' : 'Please review validation results.')
    const successCount = data.success_count || data.success || data.valid_rows
    const failedCount = data.failed_count || data.failed || data.invalid_rows
    const totalCount = data.total_count || data.total || data.total_rows
    
    let summary = `<p><strong>Status:</strong> ${status}</p>`
    summary += `<p>${message}</p>`
    
    if (totalCount !== undefined) {
      summary += `<p><strong>Total Rows:</strong> ${totalCount}</p>`
    }
    if (successCount !== undefined) {
      summary += `<p><strong>Valid Rows:</strong> ${successCount}</p>`
    }
    if (failedCount !== undefined) {
      summary += `<p><strong>Invalid Rows:</strong> ${failedCount}</p>`
    }
    
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorList = data.errors.slice(0, 5).map((err, idx) => `<li key="${idx}">${typeof err === 'string' ? err : JSON.stringify(err)}</li>`).join('')
      summary += `<div class="text-left"><strong>Errors (showing up to 5):</strong><ul class="list-disc list-inside text-left">${errorList}</ul></div>`
    }
    
    return summary
  }

  // Handle School Data Upload
  const handleSchoolUpload = async (e) => {
    e.preventDefault()
    
    if (!schoolFile) {
      setSchoolError('Please select an Excel file')
      return
    }
    
    if (!validateFile(schoolFile)) {
      setSchoolError('Please select a valid Excel or CSV file (.csv, .xlsx, .xls)')
      return
    }
    
    setSchoolError('')
    setUploadingSchool(true)
    
    try {
      const token = localStorage.getItem('token')
      const validationFormData = new FormData()
      validationFormData.append('csvFile', schoolFile)
      
      // Step 1: Validate file
      const validationResponse = await axios.post(SCHOOL_VALIDATE_URL, validationFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
      
      const validationData = validationResponse.data
      console.log('School validation response:', validationData)
      const validationMessage = formatValidationMessage(validationData)
      const Swal = await loadSwal()
      const confirmResult = await Swal.fire({
        icon: validationData?.isValid === false ? 'warning' : 'info',
        title: 'Validation Result',
        html: validationMessage,
        showCancelButton: true,
        confirmButtonText: 'Upload Now',
        cancelButtonText: 'Cancel'
      })
      
      if (!confirmResult.isConfirmed) {
        setUploadingSchool(false)
        return
      }
      
      // Step 2: Upload file after confirmation
      const uploadFormData = new FormData()
      uploadFormData.append('csvFile', schoolFile)
      
      const uploadResponse = await axios.post(SCHOOL_UPLOAD_URL, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })
      
      const uploadData = uploadResponse.data
      console.log('School upload response:', uploadData)
      let successMessage = uploadData?.message || 'School data uploaded successfully!'
      if (uploadData) {
        const successCount = uploadData.success_count || uploadData.success || uploadData.valid_rows
        const failedCount = uploadData.failed_count || uploadData.failed || uploadData.invalid_rows
        const totalCount = uploadData.total_count || uploadData.total || uploadData.total_rows
        if (successCount !== undefined || failedCount !== undefined || totalCount !== undefined) {
          successMessage += '<br/>'
          if (totalCount !== undefined) successMessage += `Total: ${totalCount} `
          if (successCount !== undefined) successMessage += `Success: ${successCount} `
          if (failedCount !== undefined) successMessage += `Failed: ${failedCount}`
        }
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Upload Complete',
        html: successMessage,
        timer: 4000,
        showConfirmButton: true
      })
      
      setSchoolFile(null)
      const fileInput = document.getElementById('schoolFile')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('School upload error:', error.response?.data || error.message)
      const serverError = error.response?.data
      let errorMsg = serverError?.message || serverError?.error || (typeof serverError === 'string' ? serverError : null) || 'Failed to process school data. Please try again.'
      if (serverError && typeof serverError === 'object') {
        if (serverError.failed_rows) {
          errorMsg += `<br/>Failed rows: ${JSON.stringify(serverError.failed_rows).slice(0, 500)}`
        } else if (serverError.errors) {
          const errors = Array.isArray(serverError.errors) ? serverError.errors : [serverError.errors]
          errorMsg += `<br/>Errors:<ul>${errors.slice(0, 5).map((err, idx) => `<li key="${idx}">${typeof err === 'string' ? err : JSON.stringify(err)}</li>`).join('')}</ul>`
        }
      }
      setSchoolError(errorMsg)
      try {
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'error',
          title: 'Error',
          html: errorMsg,
          showConfirmButton: true
        })
      } catch (swalError) {
        alert(errorMsg)
      }
    } finally {
      setUploadingSchool(false)
    }
  }

  // Handle User Data Upload
  const handleUserUpload = async (e) => {
    e.preventDefault()
    
    if (!userFile) {
      setUserError('Please select an Excel file')
      return
    }
    
    if (!validateFile(userFile)) {
      setUserError('Please select a valid Excel or CSV file (.csv, .xlsx, .xls)')
      return
    }
    
    setUserError('')
    setUploadingUser(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', userFile)
      
      const response = await axios.post(`${API_BASE_URL}/bulk-upload/families`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Handle response with success and failed counts
      const responseData = response.data
      let successMessage = 'User data uploaded successfully!'
      
      if (responseData) {
        const successCount = responseData.success_count || responseData.success || responseData.successful || 0
        const failedCount = responseData.failed_count || responseData.failed || responseData.errors || 0
        const totalCount = responseData.total_count || responseData.total || 0
        
        if (successCount > 0 || failedCount > 0 || totalCount > 0) {
          successMessage = `Upload completed! Success: ${successCount}, Failed: ${failedCount}`
          if (totalCount > 0) {
            successMessage += `, Total: ${totalCount}`
          }
        } else if (responseData.message) {
          successMessage = responseData.message
        }
      }
      
      const Swal = await loadSwal()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        html: successMessage,
        timer: 5000,
        showConfirmButton: true
      })
      
      setUserFile(null)
      const fileInput = document.getElementById('userFile')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      const errorResponse = error.response?.data
      let errorMsg = 'Failed to upload user data. Please try again.'
      
      // Handle detailed error response
      if (errorResponse) {
        if (errorResponse.message) {
          errorMsg = errorResponse.message
        } else if (errorResponse.error) {
          errorMsg = errorResponse.error
        } else if (typeof errorResponse === 'string') {
          errorMsg = errorResponse
        }
        
        // If there are failed records, show them
        if (errorResponse.failed_count || errorResponse.failed || errorResponse.errors) {
          const failedCount = errorResponse.failed_count || errorResponse.failed || errorResponse.errors
          errorMsg += ` (Failed: ${failedCount})`
        }
      }
      
      setUserError(errorMsg)
      try {
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          html: errorMsg,
          showConfirmButton: true
        })
      } catch (swalError) {
        alert(errorMsg)
      }
    } finally {
      setUploadingUser(false)
    }
  }

  // Handle Attendance Data Upload
  const handleAttendanceUpload = async (e) => {
    e.preventDefault()
    
    if (!attendanceFile) {
      setAttendanceError('Please select an Excel file')
      return
    }
    
    if (!validateFile(attendanceFile)) {
      setAttendanceError('Please select a valid Excel or CSV file (.csv, .xlsx, .xls)')
      return
    }
    
    setAttendanceError('')
    setUploadingAttendance(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', attendanceFile)
      
      const response = await axios.post(`${API_BASE_URL}/attendance/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const Swal = await loadSwal()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data?.message || 'Attendance data uploaded successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      
      setAttendanceFile(null)
      const fileInput = document.getElementById('attendanceFile')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload attendance data. Please try again.'
      setAttendanceError(errorMsg)
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
      setUploadingAttendance(false)
    }
  }

  // Handle Schedule Data Upload
  const handleScheduleUpload = async (e) => {
    e.preventDefault()
    
    if (!scheduleFile) {
      setScheduleError('Please select an Excel file')
      return
    }
    
    if (!validateFile(scheduleFile)) {
      setScheduleError('Please select a valid Excel or CSV file (.csv, .xlsx, .xls)')
      return
    }
    
    setScheduleError('')
    setUploadingSchedule(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', scheduleFile)
      
      const response = await axios.post(`${API_BASE_URL}/upload/student_enrollments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const Swal = await loadSwal()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data?.message || 'Schedule data uploaded successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      
      setScheduleFile(null)
      const fileInput = document.getElementById('scheduleFile')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload schedule data. Please try again.'
      setScheduleError(errorMsg)
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
      setUploadingSchedule(false)
    }
  }

  // Handle Question Paper Upload
  const handleQuestionPaperUpload = async (e) => {
    e.preventDefault()
    
    if (!questionPaperFile) {
      setQuestionPaperError('Please select a file')
      return
    }
    
    // Question papers might be PDF or other formats
    const fileName = questionPaperFile.name.toLowerCase()
    const validExtensions = ['.pdf', '.doc', '.docx', '.csv', '.xlsx', '.xls']
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!hasValidExtension) {
      setQuestionPaperError('Please select a valid file (.pdf, .doc, .docx, .csv, .xlsx, .xls)')
      return
    }
    
    setQuestionPaperError('')
    setUploadingQuestionPaper(true)
    
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', questionPaperFile)
      
      const response = await axios.post(`${API_BASE_URL}/question-papers/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const Swal = await loadSwal()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data?.message || 'Question paper uploaded successfully!',
        timer: 3000,
        showConfirmButton: false
      })
      
      setQuestionPaperFile(null)
      const fileInput = document.getElementById('questionPaperFile')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to upload question paper. Please try again.'
      setQuestionPaperError(errorMsg)
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
      setUploadingQuestionPaper(false)
    }
  }

  // File upload component
  const FileUploadSection = ({ 
    id, 
    title, 
    description, 
    file, 
    setFile, 
    error, 
    uploading, 
    onSubmit,
    accept = ".csv,.xlsx,.xls"
  }) => (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2">
        <h4 className="text-base font-bold text-white">{title}</h4>
        <p className="text-xs text-slate-200 mt-0.5">{description}</p>
      </div>
      <div className="p-4">
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                <input
                  type="file"
                  id={id}
                  accept={accept}
                  onChange={(e) => {
                    const selectedFile = e.target.files[0]
                    setFile(selectedFile)
                    if (id === 'schoolFile') setSchoolError('')
                    if (id === 'userFile') setUserError('')
                    if (id === 'attendanceFile') setAttendanceError('')
                    if (id === 'scheduleFile') setScheduleError('')
                    if (id === 'questionPaperFile') setQuestionPaperError('')
                  }}
                  className="hidden"
                />
                <label htmlFor={id} className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="text-slate-700 font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      {accept === ".csv,.xlsx,.xls" ? "Excel or CSV file (.csv, .xlsx, .xls)" : "File (.pdf, .doc, .docx, .csv, .xlsx, .xls)"}
                    </p>
                    {file && (
                      <p className="text-sm text-green-600 font-semibold mt-2">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </label>
              </div>
              {error && (
                <p className="text-red-600 text-xs mt-1">{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : `Upload ${title}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3 text-white shadow-md">
        <h3 className="text-lg font-bold mb-1">Data Uploader</h3>
        <p className="text-xs text-slate-200">Upload Excel files for bulk data import (School, User, Attendance, Schedule, Question Papers)</p>
      </div>

      {/* Upload Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* School Data Upload */}
        <FileUploadSection
          id="schoolFile"
          title="School Data Upload"
          description="Upload Excel file containing school information"
          file={schoolFile}
          setFile={setSchoolFile}
          error={schoolError}
          uploading={uploadingSchool}
          onSubmit={handleSchoolUpload}
        />

        {/* User Data Upload */}
        <FileUploadSection
          id="userFile"
          title="User Data Upload"
          description="Upload Excel file containing user information (teachers, students, parents, staff)"
          file={userFile}
          setFile={setUserFile}
          error={userError}
          uploading={uploadingUser}
          onSubmit={handleUserUpload}
        />

        {/* Attendance Data Upload */}
        <FileUploadSection
          id="attendanceFile"
          title="Attendance Data Upload"
          description="Upload Excel file containing student attendance records"
          file={attendanceFile}
          setFile={setAttendanceFile}
          error={attendanceError}
          uploading={uploadingAttendance}
          onSubmit={handleAttendanceUpload}
        />

        {/* Schedule Data Upload */}
        <FileUploadSection
          id="scheduleFile"
          title="Schedule Data Upload"
          description="Upload Excel file containing class schedules and timetables"
          file={scheduleFile}
          setFile={setScheduleFile}
          error={scheduleError}
          uploading={uploadingSchedule}
          onSubmit={handleScheduleUpload}
        />

        {/* Question Paper Upload */}
        <FileUploadSection
          id="questionPaperFile"
          title="Question Paper Upload"
          description="Upload question papers (PDF, Word, or Excel format)"
          file={questionPaperFile}
          setFile={setQuestionPaperFile}
          error={questionPaperError}
          uploading={uploadingQuestionPaper}
          onSubmit={handleQuestionPaperUpload}
          accept=".pdf,.doc,.docx,.csv,.xlsx,.xls"
        />
      </div>
    </div>
  )
}

export default DataUploader


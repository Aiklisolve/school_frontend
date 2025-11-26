import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const Login = () => {
  const [step, setStep] = useState(1) // 1: credentials/mobile, 2: OTP
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: '',
    userType: 'admin'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Forget Password State
  const [showForgetPassword, setShowForgetPassword] = useState(false)
  const [forgetPasswordOption, setForgetPasswordOption] = useState(null) // 'change' or 'mobile'
  const [changePasswordStep, setChangePasswordStep] = useState(1) // 1: email/mobile, 2: OTP, 3: password form
  const [changePasswordData, setChangePasswordData] = useState({
    email: '',
    mobile: '',
    password: '', // For email users to send OTP
    otp: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    userType: 'admin'
  })
  const [changePasswordOtp, setChangePasswordOtp] = useState(null)
  const [changePasswordToken, setChangePasswordToken] = useState(null)
  const [changePasswordUserId, setChangePasswordUserId] = useState(null)
  const [changePasswordErrors, setChangePasswordErrors] = useState({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswordChangeSuccess, setShowPasswordChangeSuccess] = useState(false)
  const [viaMobileOtp, setViaMobileOtp] = useState(null)
  const [isSendingViaMobileOtp, setIsSendingViaMobileOtp] = useState(false)
  const [isVerifyingViaMobileOtp, setIsVerifyingViaMobileOtp] = useState(false)

  const { login, validateCredentials, sendOTP, finalLogin, logout, isAuthenticated, otp, setOtp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const userTypes = [
    { value: 'admin', label: 'admin' },

    { value: 'teacher', label: 'teacher' },
    { value: 'parent', label: 'parent' },
    { value: 'student', label: 'student' }
    // { value: 'staff', label: 'School Staff' },
  ]

  const validateStep1 = () => {
    const newErrors = {}

    if (formData.userType === 'parent') {
      // Parent uses mobile
      if (!formData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required'
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number'
      }
    } else {
      // Teacher, Student, Admin, Staff all use email/password
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required'
    } else if (!/^\d{4}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 4 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // For mobile field, only allow digits and limit to 10 digits
    let processedValue = value
    if (name === 'mobile') {
      // Remove all non-digit characters
      processedValue = value.replace(/\D/g, '')
      // Limit to exactly 10 digits
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10)
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleMobilePaste = (e) => {
    e.preventDefault()
    const pastedText = (e.clipboardData || window.clipboardData).getData('text')
    // Remove all non-digit characters and limit to 10 digits
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 10)
    
    setFormData(prev => ({
      ...prev,
      mobile: digitsOnly
    }))
    // Clear error if any
    if (errors.mobile) {
      setErrors(prev => ({
        ...prev,
        mobile: ''
      }))
    }
  }

  const handleUserTypeChange = (e) => {
    const newUserType = e.target.value
    setFormData(prev => ({
      ...prev,
      userType: newUserType,
      email: '',
      password: '',
      mobile: '',
      otp: ''
    }))
    setErrors({})
    setStep(1)
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep1()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      if (formData.userType === 'parent') {
        // Parent: Send OTP via mobile (prepend +91 country code)
        const mobileWithCountryCode = `+91${formData.mobile}`
        const result = await sendOTP(mobileWithCountryCode, 'parent')
        
        if (result.success) {
          // Store OTP from response - API returns OTP directly in response.data.otp
          const receivedOtp = result.data?.otp
          
          if (receivedOtp) {
            setOtp(receivedOtp)
            // Store in localStorage to persist through login process
            localStorage.setItem('otp', receivedOtp)
          }
          setShowSuccessPopup(true)
          setStep(2) // Move to OTP step
          // Hide popup after 3 seconds
          setTimeout(() => {
            setShowSuccessPopup(false)
          }, 3000)
        } else {
          setErrors({ submit: result.error })
        }
      } else {
        // Teacher, Student, Admin, Staff: Validate credentials via API
        const result = await validateCredentials(
          formData.email,
          formData.password,
          formData.userType
        )
        
        if (result.success) {
          // Store OTP from response - API returns OTP directly in response.data.otp
          const receivedOtp = result.data?.otp
          
          if (receivedOtp) {
            setOtp(receivedOtp)
            // Store in localStorage to persist through login process
            localStorage.setItem('otp', receivedOtp)
          }
          setShowSuccessPopup(true)
          setStep(2) // Move to OTP step
          // Hide popup after 3 seconds
          setTimeout(() => {
            setShowSuccessPopup(false)
          }, 3000)
        } else {
          setErrors({ submit: result.error })
        }
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep2()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const loginData = {
        login_type: formData.userType === 'teacher' || formData.userType === 'student' || formData.userType === 'admin' || formData.userType === 'staff' ? 'email_password' : 'mobile',
        role: formData.userType,
        otp: formData.otp
      }

      if (formData.userType === 'parent') {
        // Prepend +91 country code when sending to API
        loginData.mobile = `+91${formData.mobile}`
      } else {
        loginData.email = formData.email
      }

      const result = await finalLogin(loginData)
      
      if (result.success) {
        // User is now authenticated, navigate to dashboard immediately
        // Clear any form errors
        setErrors({})
        // Wait a moment for state to update, then navigate
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 50)
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Change Password Handler - Simplified: Verify credentials, get token, call API, don't login
  const handleChangePassword = async (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validate user identification
    if (changePasswordData.userType === 'parent') {
      if (!changePasswordData.mobile.trim()) {
        newErrors.mobile = 'Mobile number is required'
      } else if (!/^\d{10}$/.test(changePasswordData.mobile)) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number'
      }
    } else {
      if (!changePasswordData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changePasswordData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Validate password fields
    if (!changePasswordData.oldPassword.trim()) {
      newErrors.oldPassword = 'Existing password is required'
    }

    if (!changePasswordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    } else if (changePasswordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setChangePasswordErrors(newErrors)
      return
    }

    setIsChangingPassword(true)
    setChangePasswordErrors({})

    try {
      // First, verify credentials to get token and user_id (but don't login)
      let token = null
      let userId = null

      if (changePasswordData.userType === 'parent') {
        // For parent: Need to send OTP first, then verify OTP to get token
        const mobileWithCountryCode = `+91${changePasswordData.mobile}`
        const otpResult = await sendOTP(mobileWithCountryCode, 'parent')
        
        if (!otpResult.success) {
          setChangePasswordErrors({ submit: otpResult.error || 'Failed to send OTP. Please try again.' })
          setIsChangingPassword(false)
          return
        }

        // Get OTP from response
        const receivedOtp = otpResult.data?.otp
        if (!receivedOtp) {
          setChangePasswordErrors({ submit: 'Failed to get OTP. Please try again.' })
          setIsChangingPassword(false)
          return
        }

        // Show OTP to user (like login flow)
        setChangePasswordOtp(receivedOtp)
        
        // For parent, we need OTP verification to get token
        // Call login API directly without using finalLogin (which sets user state)
        const currentTime = new Date()
        const timeWith30Minutes = new Date(currentTime.getTime() + 30 * 60 * 1000)
        
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          step: 'final_login',
          login_type: 'mobile',
          role: 'PARENT',
          otp: receivedOtp,
          mobile: mobileWithCountryCode,
          expires_at: timeWith30Minutes.toISOString()
        })

        const responseData = loginResponse.data
        token = responseData.token || responseData.data?.token || responseData.access_token
        userId = responseData.user?.id || responseData.user?.user_id || responseData.user_id || responseData.id

        if (!token || !userId) {
          setChangePasswordErrors({ submit: 'Failed to verify identity. Please try again.' })
          setIsChangingPassword(false)
          return
        }
      } else {
        // For email-based users: Validate credentials to get OTP, then verify to get token
        const result = await validateCredentials(
          changePasswordData.email,
          changePasswordData.oldPassword,
          changePasswordData.userType
        )
        
        if (!result.success) {
          setChangePasswordErrors({ submit: result.error || 'Invalid email or existing password. Please try again.' })
          setIsChangingPassword(false)
          return
        }

        // Get OTP from response
        const receivedOtp = result.data?.otp
        if (!receivedOtp) {
          setChangePasswordErrors({ submit: 'Failed to get verification code. Please try again.' })
          setIsChangingPassword(false)
          return
        }

        // Show OTP to user (like login flow)
        setChangePasswordOtp(receivedOtp)

        // Call login API directly without using finalLogin (which sets user state)
        const currentTime = new Date()
        const timeWith30Minutes = new Date(currentTime.getTime() + 30 * 60 * 1000)
        
        // Map role to backend format
        const roleMap = {
          'teacher': 'TEACHER',
          'student': 'STUDENT',
          'admin': 'ADMIN'
        }
        const backendRole = roleMap[changePasswordData.userType] || changePasswordData.userType.toUpperCase()

        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          step: 'final_login',
          login_type: 'email_password',
          role: backendRole,
          otp: receivedOtp,
          email: changePasswordData.email,
          expires_at: timeWith30Minutes.toISOString()
        })

        const responseData = loginResponse.data
        token = responseData.token || responseData.data?.token || responseData.access_token
        userId = responseData.user?.id || responseData.user?.user_id || responseData.user_id || responseData.id

        if (!token || !userId) {
          setChangePasswordErrors({ submit: 'Failed to verify identity. Please try again.' })
          setIsChangingPassword(false)
          return
        }
      }

      // Now call the change password API
      if (!token || !userId) {
        setChangePasswordErrors({ submit: 'Failed to verify identity. Please try again.' })
        setIsChangingPassword(false)
        return
      }

      const response = await axios.patch(
        `${API_BASE_URL}/users/${userId}/change-password`,
        {
          old_password: changePasswordData.oldPassword,
          new_password: changePasswordData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data) {
        // Success - show professional success popup and close modal (don't login)
        setShowForgetPassword(false)
        setShowPasswordChangeSuccess(true)
        setForgetPasswordOption(null)
        setChangePasswordStep(1)
        setChangePasswordData({
          email: '',
          mobile: '',
          password: '',
          otp: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          userType: 'teacher'
        })
        setChangePasswordErrors({})
        setChangePasswordOtp(null)
        setChangePasswordToken(null)
        setChangePasswordUserId(null)
        
        // Auto-close success popup after 4 seconds
        setTimeout(() => {
          setShowPasswordChangeSuccess(false)
        }, 4000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to change password. Please try again.'
      setChangePasswordErrors({ submit: errorMessage })
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Via Mobile - Send OTP Handler
  const handleViaMobileSendOtp = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!changePasswordData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(changePasswordData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number'
    }

    if (Object.keys(newErrors).length > 0) {
      setChangePasswordErrors(newErrors)
      return
    }

    setIsSendingViaMobileOtp(true)
    setChangePasswordErrors({})

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/password/send-otp`,
        {
          phone: changePasswordData.mobile
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data) {
        // Extract OTP from response message
        // Response format: {status: "success", message: "OTP sent to registered mobile number : 6389756199 is 184689"}
        let receivedOtp = null
        if (response.data.message) {
          // Extract OTP from message string (format: "... is 184689")
          const otpMatch = response.data.message.match(/is\s+(\d{6})/i)
          if (otpMatch && otpMatch[1]) {
            receivedOtp = otpMatch[1]
          }
        }
        // Fallback to direct OTP field if available
        if (!receivedOtp) {
          receivedOtp = response.data.otp || response.data.data?.otp || response.data.message?.otp
        }
        if (receivedOtp) {
          setViaMobileOtp(receivedOtp)
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP. Please try again.'
      setChangePasswordErrors({ submit: errorMessage })
    } finally {
      setIsSendingViaMobileOtp(false)
    }
  }

  // Via Mobile - Verify OTP and Change Password Handler
  const handleViaMobileVerifyOtpAndChangePassword = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!changePasswordData.otp.trim()) {
      newErrors.otp = 'OTP is required'
    } else if (!/^\d{6}$/.test(changePasswordData.otp)) {
      newErrors.otp = 'OTP must be 6 digits'
    }

    if (!changePasswordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    } else if (changePasswordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
    }

    if (!changePasswordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setChangePasswordErrors(newErrors)
      return
    }

    setIsVerifyingViaMobileOtp(true)
    setChangePasswordErrors({})

    try {
      // Call API to verify OTP and change password
      const response = await axios.post(
        `${API_BASE_URL}/users/password/change-with-otp`,
        {
          phone: changePasswordData.mobile,
          otp: changePasswordData.otp,
          new_password: changePasswordData.newPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data) {
        // Success - show professional success popup and close modal
        setShowForgetPassword(false)
        setShowPasswordChangeSuccess(true)
        setForgetPasswordOption(null)
        setChangePasswordStep(1)
        setChangePasswordData({
          email: '',
          mobile: '',
          password: '',
          otp: '',
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
          userType: 'teacher'
        })
        setChangePasswordErrors({})
        setViaMobileOtp(null)
        
        // Auto-close success popup after 4 seconds
        setTimeout(() => {
          setShowPasswordChangeSuccess(false)
        }, 4000)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to verify OTP and change password. Please try again.'
      setChangePasswordErrors({ submit: errorMessage })
    } finally {
      setIsVerifyingViaMobileOtp(false)
    }
  }

  // All roles now use API with OTP flow (multi-step form)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-5 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {showSuccessPopup && (
        <div className="fixed top-2.5 right-2.5 left-2.5 z-[1000] animate-slideInRight md:right-5 md:left-auto md:top-5">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 w-full md:min-w-[300px] border border-blue-400">
            <span className="text-2xl font-bold bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">✓</span>
            <p className="m-0 text-base font-semibold">OTP sent successfully!</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-[480px] animate-slideUp md:p-8 md:px-6 relative z-10 border border-gray-200">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-4xl font-bold m-0 mb-2 md:text-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            School Portal
          </h1>
          <p className="text-gray-600 text-base m-0 font-medium">Welcome back! Please sign in to continue</p>
        </div>

        <form 
          onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit} 
          className="flex flex-col gap-6"
        >
          {/* User Type Selection */}
          <div className="flex flex-col gap-3">
            <label htmlFor="userType" className="text-gray-700 text-sm font-bold flex items-center gap-2">
              Select Your Role
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleUserTypeChange}
              className={`px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 cursor-pointer hover:border-blue-300 ${
                errors.userType ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
              }`}
            >
              {userTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label.charAt(0).toUpperCase() + type.label.slice(1)}
                </option>
              ))}
            </select>
            {errors.userType && <span className="text-red-600 text-sm font-medium -mt-1">
              {errors.userType}
            </span>}
          </div>

          {formData.userType === 'parent' ? (
            <>
              <div className="flex flex-col gap-3">
                <label htmlFor="mobile" className="text-gray-700 text-sm font-bold flex items-center gap-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">+91</div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onPaste={handleMobilePaste}
                  onKeyDown={(e) => {
                    // Allow: backspace, delete, tab, escape, enter, and arrow keys
                    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].includes(e.keyCode) ||
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true)) {
                      return
                    }
                    // Ensure that it is a number and stop the keypress if not
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault()
                    }
                    // Prevent typing if already 10 digits (unless it's a deletion key)
                    if (formData.mobile.length >= 10 && ![8, 46].includes(e.keyCode)) {
                      e.preventDefault()
                    }
                  }}
                    className={`w-full pl-14 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 ${
                      errors.mobile ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                    placeholder="10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  disabled={step === 2}
                />
                </div>
                {errors.mobile && <span className="text-red-600 text-sm font-medium -mt-1">
                  {errors.mobile}
                </span>}
              </div>
            </>
          ) : (
            <>
              {/* Teacher, Student, Admin, Staff all use email/password */}
              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-gray-700 text-sm font-bold flex items-center gap-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  disabled={step === 2}
                />
                {errors.email && <span className="text-red-600 text-sm font-medium -mt-1">
                  {errors.email}
                </span>}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="password" className="text-gray-700 text-sm font-bold flex items-center gap-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 pr-12 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={step === 2}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={step === 2}
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
                {errors.password && <span className="text-red-600 text-sm font-medium -mt-1">
                  {errors.password}
                </span>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-blue-800 font-bold text-sm m-0">OTP Sent Successfully!</p>
                    <p className="text-blue-700 text-xs m-0 mt-1">
                      Sent to {formData.userType === 'parent' ? `+91 ${formData.mobile}` : formData.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="otp" className="text-gray-700 text-sm font-bold flex items-center gap-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-bold text-center tracking-widest focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 ${
                    errors.otp ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'
                  }`}
                  placeholder="0000"
                  maxLength="4"
                  autoComplete="one-time-code"
                  autoFocus
                  style={{ letterSpacing: '0.5em' }}
                />
                {errors.otp && <span className="text-red-600 text-sm font-medium -mt-1">
                  {errors.otp}
                </span>}
              </div>

              {otp && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center">
                  <p className="text-blue-800 text-sm font-semibold m-0">
                    Your OTP: <span className="font-bold text-lg tracking-wider">{otp}</span>
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setFormData(prev => ({ ...prev, otp: '' }))
                  setErrors({})
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center gap-2 justify-center"
              >
                <span>←</span> Back to credentials
              </button>
            </>
          )}

          {errors.submit && (
            <div className="bg-red-50 text-red-800 px-4 py-3.5 rounded-xl text-sm font-medium border-2 border-red-200">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 mt-2 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{step === 1 ? 'Sending OTP...' : 'Verifying...'}</span>
              </>
            ) : (
              <>
                <span>{step === 1 ? 'Send OTP' : 'Verify & Login'}</span>
                <span className="text-lg">{step === 1 ? '➤' : '✓'}</span>
              </>
            )}
          </button>

          {/* Forget Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setShowForgetPassword(true)
                setForgetPasswordOption(null)
                setChangePasswordStep(1)
                setChangePasswordData({
                  email: '',
                  mobile: '',
                  password: '',
                  otp: '',
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  userType: formData.userType
                })
                setChangePasswordErrors({})
                setChangePasswordOtp(null)
                setChangePasswordToken(null)
                setChangePasswordUserId(null)
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors underline"
            >
              Forget Password
            </button>
          </div>
        </form>
      </div>

      {/* Forget Password Modal */}
      {showForgetPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-[480px] max-h-[90vh] overflow-y-auto animate-slideUp relative border border-gray-200">
            <button
              onClick={() => {
                setShowForgetPassword(false)
                setForgetPasswordOption(null)
                setChangePasswordStep(1)
                setChangePasswordData({
                  email: '',
                  mobile: '',
                  password: '',
                  otp: '',
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  userType: 'teacher'
                })
                setChangePasswordErrors({})
                setChangePasswordOtp(null)
                setChangePasswordToken(null)
                setChangePasswordUserId(null)
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            {!forgetPasswordOption ? (
              <div className="text-center">
                <h2 className="text-gray-900 text-3xl font-bold m-0 mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Forget Password
                </h2>
                <p className="text-gray-600 text-sm m-0 mb-8 font-medium">Choose an option to reset your password</p>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setForgetPasswordOption('change')
                      setChangePasswordStep(1)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Change Password</span>
                    <span className="text-lg">→</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setForgetPasswordOption('mobile')
                      setChangePasswordData(prev => ({ ...prev, mobile: '', otp: '' }))
                      setChangePasswordErrors({})
                      setViaMobileOtp(null)
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    <span>Via Mobile</span>
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            ) : forgetPasswordOption === 'change' ? (
              <form onSubmit={handleChangePassword} className="flex flex-col gap-6">
                <div className="text-center mb-8">
                  <h2 className="text-gray-900 text-3xl font-bold m-0 mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                    Change Password
                  </h2>
                  <p className="text-gray-600 text-sm m-0 font-medium">Enter your details to change password</p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-gray-700 text-sm font-bold">Select Your Role</label>
                  <select
                    value={changePasswordData.userType}
                    onChange={(e) => setChangePasswordData(prev => ({ ...prev, userType: e.target.value, email: '', mobile: '' }))}
                    className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 cursor-pointer hover:border-blue-300 border-gray-300"
                  >
                    {userTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label.charAt(0).toUpperCase() + type.label.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {changePasswordData.userType === 'parent' ? (
                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">+91</div>
                      <input
                        type="tel"
                        value={changePasswordData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setChangePasswordData(prev => ({ ...prev, mobile: value }))
                          if (changePasswordErrors.mobile) {
                            setChangePasswordErrors(prev => ({ ...prev, mobile: '' }))
                          }
                        }}
                        className="w-full pl-14 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        inputMode="numeric"
                      />
                    </div>
                    {changePasswordErrors.mobile && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.mobile}</span>}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">Email Address</label>
                    <input
                      type="email"
                      value={changePasswordData.email}
                      onChange={(e) => {
                        setChangePasswordData(prev => ({ ...prev, email: e.target.value }))
                        if (changePasswordErrors.email) {
                          setChangePasswordErrors(prev => ({ ...prev, email: '' }))
                        }
                      }}
                      className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                      placeholder="your.email@example.com"
                    />
                    {changePasswordErrors.email && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.email}</span>}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <label className="text-gray-700 text-sm font-bold">Existing Password</label>
                  <input
                    type="password"
                    value={changePasswordData.oldPassword}
                    onChange={(e) => {
                      setChangePasswordData(prev => ({ ...prev, oldPassword: e.target.value }))
                      if (changePasswordErrors.oldPassword) {
                        setChangePasswordErrors(prev => ({ ...prev, oldPassword: '' }))
                      }
                    }}
                    className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                    placeholder="Enter existing password"
                  />
                  {changePasswordErrors.oldPassword && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.oldPassword}</span>}
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-gray-700 text-sm font-bold">New Password</label>
                  <input
                    type="password"
                    value={changePasswordData.newPassword}
                    onChange={(e) => {
                      setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                      if (changePasswordErrors.newPassword) {
                        setChangePasswordErrors(prev => ({ ...prev, newPassword: '' }))
                      }
                    }}
                    className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                    placeholder="Enter new password"
                  />
                  {changePasswordErrors.newPassword && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.newPassword}</span>}
                </div>

                {changePasswordOtp && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center">
                    <p className="text-blue-800 text-sm font-semibold m-0">
                      Your OTP: <span className="font-bold text-lg tracking-wider">{changePasswordOtp}</span>
                    </p>
                  </div>
                )}

                {changePasswordErrors.submit && (
                  <div className="bg-red-50 text-red-800 px-4 py-3.5 rounded-xl text-sm font-medium border-2 border-red-200">
                    {changePasswordErrors.submit}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForgetPasswordOption(null)
                      setChangePasswordData(prev => ({ ...prev, oldPassword: '', newPassword: '' }))
                      setChangePasswordErrors({})
                    }}
                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:bg-gray-50"
                  >
                    Back
          </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Changing...</span>
                      </>
                    ) : (
                      <>
                        <span>Change Password</span>
                        <span className="text-lg">✓</span>
                      </>
                    )}
                  </button>
                </div>
        </form>
            ) : forgetPasswordOption === 'mobile' ? (
              !viaMobileOtp ? (
                <form onSubmit={handleViaMobileSendOtp} className="flex flex-col gap-6">
                  <div className="text-center mb-8">
                    <h2 className="text-gray-900 text-3xl font-bold m-0 mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                      Reset Password Via Mobile
                    </h2>
                    <p className="text-gray-600 text-sm m-0 font-medium">Enter your mobile number to receive OTP</p>
      </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">+91</div>
                      <input
                        type="tel"
                        value={changePasswordData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                          setChangePasswordData(prev => ({ ...prev, mobile: value }))
                          if (changePasswordErrors.mobile) {
                            setChangePasswordErrors(prev => ({ ...prev, mobile: '' }))
                          }
                        }}
                        className="w-full pl-14 pr-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        inputMode="numeric"
                        disabled={isSendingViaMobileOtp}
                      />
                    </div>
                    {changePasswordErrors.mobile && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.mobile}</span>}
                  </div>

                  {changePasswordErrors.submit && (
                    <div className="bg-red-50 text-red-800 px-4 py-3.5 rounded-xl text-sm font-medium border-2 border-red-200">
                      {changePasswordErrors.submit}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setForgetPasswordOption(null)
                        setChangePasswordData(prev => ({ ...prev, mobile: '', otp: '' }))
                        setChangePasswordErrors({})
                        setViaMobileOtp(null)
                      }}
                      className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                      disabled={isSendingViaMobileOtp}
                    >
                      {isSendingViaMobileOtp ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <span className="text-lg">➤</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleViaMobileVerifyOtpAndChangePassword} className="flex flex-col gap-6">
                  <div className="text-center mb-8">
                    <h2 className="text-gray-900 text-3xl font-bold m-0 mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                      Verify OTP & Set New Password
                    </h2>
                    <p className="text-gray-600 text-sm m-0 font-medium">Enter OTP and your new password</p>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center mb-4">
                    <p className="text-blue-800 text-sm font-semibold m-0 mb-2">
                      OTP Sent Successfully!
                    </p>
                    <p className="text-blue-700 text-xs m-0 mb-3">
                      Sent to +91 {changePasswordData.mobile}
                    </p>
                    <p className="text-blue-800 text-sm font-semibold m-0">
                      Your OTP: <span className="font-bold text-lg tracking-wider">{viaMobileOtp}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">Enter OTP</label>
                    <input
                      type="text"
                      value={changePasswordData.otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                        setChangePasswordData(prev => ({ ...prev, otp: value }))
                        if (changePasswordErrors.otp) {
                          setChangePasswordErrors(prev => ({ ...prev, otp: '' }))
                        }
                      }}
                      className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-bold text-center tracking-widest focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                      placeholder="000000"
                      maxLength="6"
                      autoFocus
                      style={{ letterSpacing: '0.5em' }}
                    />
                    {changePasswordErrors.otp && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.otp}</span>}
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">New Password</label>
                    <input
                      type="password"
                      value={changePasswordData.newPassword}
                      onChange={(e) => {
                        setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                        if (changePasswordErrors.newPassword) {
                          setChangePasswordErrors(prev => ({ ...prev, newPassword: '' }))
                        }
                      }}
                      className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                      placeholder="Enter new password"
                    />
                    {changePasswordErrors.newPassword && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.newPassword}</span>}
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-gray-700 text-sm font-bold">Confirm New Password</label>
                    <input
                      type="password"
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => {
                        setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                        if (changePasswordErrors.confirmPassword) {
                          setChangePasswordErrors(prev => ({ ...prev, confirmPassword: '' }))
                        }
                      }}
                      className="px-4 py-3.5 border-2 rounded-xl text-base transition-all duration-200 bg-white text-gray-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300 border-gray-300"
                      placeholder="Confirm new password"
                    />
                    {changePasswordErrors.confirmPassword && <span className="text-red-600 text-sm font-medium">{changePasswordErrors.confirmPassword}</span>}
                  </div>

                  {changePasswordErrors.submit && (
                    <div className="bg-red-50 text-red-800 px-4 py-3.5 rounded-xl text-sm font-medium border-2 border-red-200">
                      {changePasswordErrors.submit}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setViaMobileOtp(null)
                        setChangePasswordData(prev => ({ ...prev, otp: '', newPassword: '', confirmPassword: '' }))
                        setChangePasswordErrors({})
                      }}
                      className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                      disabled={isVerifyingViaMobileOtp}
                    >
                      {isVerifyingViaMobileOtp ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Changing Password...</span>
                        </>
                      ) : (
                        <>
                          <span>Change Password</span>
                          <span className="text-lg">✓</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )
            ) : null}
          </div>
        </div>
      )}

      {/* Password Change Success Popup */}
      {showPasswordChangeSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-5 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-[420px] animate-slideUp relative border border-gray-200">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h2 className="text-gray-900 text-2xl font-bold m-0 mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Password Changed Successfully!
              </h2>
              <p className="text-gray-600 text-base m-0 font-medium leading-relaxed">
                Your password has been updated successfully. Please login with your new password to continue.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowPasswordChangeSuccess(false)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none px-6 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>Got it</span>
              <span className="text-lg">✓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login


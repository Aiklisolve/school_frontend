import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [step, setStep] = useState(1) // 1: credentials/mobile, 2: OTP
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    otp: '',
    userType: 'teacher'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const { login, validateCredentials, sendOTP, finalLogin, isAuthenticated, otp, setOtp } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const userTypes = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'parent', label: 'Parent' },
    { value: 'student', label: 'Student' },
    { value: 'staff', label: 'School Staff' },
    { value: 'admin', label: 'ADMIN' }
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
        // Parent: Send OTP via mobile
        const result = await sendOTP(formData.mobile, 'parent')
        
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
        loginData.mobile = formData.mobile
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

  // All roles now use API with OTP flow (multi-step form)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      {showSuccessPopup && (
        <div className="fixed top-2.5 right-2.5 left-2.5 z-[1000] animate-slideInRight md:right-5 md:left-auto md:top-5">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 w-full md:min-w-[250px]">
            <span className="text-2xl font-bold bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">✓</span>
            <p className="m-0 text-base font-semibold">OTP sent successfully!</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-[450px] animate-slideUp md:p-8 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 text-3xl font-bold m-0 mb-2 md:text-2xl">School Application</h1>
          <p className="text-gray-500 text-base m-0">Sign in to your account</p>
        </div>

        <form 
          onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit} 
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="userType" className="text-gray-700 text-sm font-semibold">I am a</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleUserTypeChange}
              className={`px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
                errors.userType ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
              }`}
            >
              {userTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.userType && <span className="text-red-600 text-[13px] -mt-1">{errors.userType}</span>}
          </div>

          {formData.userType === 'parent' ? (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="mobile" className="text-gray-700 text-sm font-semibold">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.mobile ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                  placeholder="Enter your 10-digit mobile number"
                  maxLength="10"
                  disabled={step === 2}
                />
                {errors.mobile && <span className="text-red-600 text-[13px] -mt-1">{errors.mobile}</span>}
              </div>
            </>
          ) : (
            <>
              {/* Teacher, Student, Admin, Staff all use email/password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-gray-700 text-sm font-semibold">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={step === 2}
                />
                {errors.email && <span className="text-red-600 text-[13px] -mt-1">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-gray-700 text-sm font-semibold">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={step === 2}
                />
                {errors.password && <span className="text-red-600 text-[13px] -mt-1">{errors.password}</span>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="text-gray-700 text-sm font-semibold">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
                    errors.otp ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                  placeholder="Enter 4-digit OTP"
                  maxLength="4"
                  autoComplete="one-time-code"
                  autoFocus
                />
                {errors.otp && <span className="text-red-600 text-[13px] -mt-1">{errors.otp}</span>}
              </div>

              <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg text-sm border border-blue-300 text-center">
                OTP sent to {formData.userType === 'parent' ? formData.mobile : formData.email}
              </div>
              {otp && (
                <div className="mt-2">
                  <span className="text-gray-700 text-sm font-semibold">Your OTP: {otp}</span>
                </div>
              )}
            </>
          )}

          {errors.submit && (
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg text-sm border border-red-300">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none px-6 py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mt-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (step === 1 ? 'Sending OTP...' : 'Verifying...') 
              : (step === 1 ? 'Send OTP' : 'Verify & Login')
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

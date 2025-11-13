import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

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
    { value: 'admin', label: 'Admin' }
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
    <div className="login-container">
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <span className="success-icon">✓</span>
            <p>OTP sent successfully!</p>
          </div>
        </div>
      )}
      <div className="login-card">
        <div className="login-header">
          <h1>Student Application</h1>
          <p>Sign in to your account</p>
        </div>

        <form 
          onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit} 
          className="login-form"
        >
          <div className="form-group">
            <label htmlFor="userType">I am a</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleUserTypeChange}
              className={`form-control ${errors.userType ? 'error' : ''}`}
            >
              {userTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.userType && <span className="error-message">{errors.userType}</span>}
          </div>

          {formData.userType === 'parent' ? (
            <>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`form-control ${errors.mobile ? 'error' : ''}`}
                  placeholder="Enter your 10-digit mobile number"
                  maxLength="10"
                  disabled={step === 2}
                />
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>
            </>
          ) : (
            <>
              {/* Teacher, Student, Admin, Staff all use email/password */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={step === 2}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={step === 2}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className={`form-control ${errors.otp ? 'error' : ''}`}
                  placeholder="Enter 4-digit OTP"
                  maxLength="4"
                  autoComplete="one-time-code"
                  autoFocus
                />
                {errors.otp && <span className="error-message">{errors.otp}</span>}
              </div>

              <div className="info-message">
                OTP sent to {formData.userType === 'parent' ? formData.mobile : formData.email}
              </div>
              {otp && (
                <div className="otp-display-simple">
                  <span className="otp-label-simple">Your OTP: {otp}</span>
                </div>
              )}
            </>
          )}

          {errors.submit && (
            <div className="error-alert">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
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

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
  const { login, validateCredentials, sendOTP, finalLogin, isAuthenticated } = useAuth()
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
    { value: 'staff', label: 'School Staff' }
  ]

  // Check if user type uses API (teacher/parent) or mock (student/staff)
  const usesAPI = formData.userType === 'teacher' || formData.userType === 'parent'

  const validateStep1 = () => {
    const newErrors = {}

    if (usesAPI) {
      if (formData.userType === 'teacher') {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
          newErrors.password = 'Password is required'
        }
      } else if (formData.userType === 'parent') {
        if (!formData.mobile.trim()) {
          newErrors.mobile = 'Mobile number is required'
        } else if (!/^\d{10}$/.test(formData.mobile)) {
          newErrors.mobile = 'Please enter a valid 10-digit mobile number'
        }
      }
    } else {
      // Student/Staff validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleStep1Submit = async (e) => {
    e.preventDefault()
    
    if (!validateStep1()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      if (usesAPI) {
        // Teacher or Parent - use API
        if (formData.userType === 'teacher') {
          // Teacher: Validate credentials
          const result = await validateCredentials(
            formData.email,
            formData.password,
            'teacher'
          )
          
          if (result.success) {
            setStep(2) // Move to OTP step
          } else {
            setErrors({ submit: result.error })
          }
        } else if (formData.userType === 'parent') {
          // Parent: Send OTP
          const result = await sendOTP(formData.mobile, 'parent')
          
          if (result.success) {
            setStep(2) // Move to OTP step
          } else {
            setErrors({ submit: result.error })
          }
        }
      } else {
        // Student or Staff - use mock data
        const result = await login(formData.email, formData.password, formData.userType)
        
        if (result.success) {
          navigate('/dashboard')
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
        login_type: formData.userType === 'teacher' ? 'email_password' : 'mobile',
        role: formData.userType,
        otp: formData.otp
      }

      if (formData.userType === 'teacher') {
        loginData.email = formData.email
      } else {
        loginData.mobile = formData.mobile
      }

      const result = await finalLogin(loginData)
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setFormData(prev => ({ ...prev, otp: '' }))
    setErrors({})
  }

  const handleUserTypeChange = (e) => {
    const newUserType = e.target.value
    setFormData({
      email: '',
      password: '',
      mobile: '',
      otp: '',
      userType: newUserType
    })
    setStep(1)
    setErrors({})
  }

  // For student/staff, show simple form (no OTP step)
  if (!usesAPI && step === 1) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Student Application</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleStep1Submit} className="login-form">
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
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

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
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <a href="#forgot-password" className="forgot-password-link">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    )
  }

  // For teacher/parent, show multi-step form with OTP field below password/mobile
  return (
    <div className="login-container">
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

          {formData.userType === 'teacher' ? (
            <>
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
                    OTP sent to {formData.email}
                  </div>
                </>
              )}
            </>
          ) : (
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
                    OTP sent to {formData.mobile}
                  </div>
                </>
              )}
            </>
          )}

          {errors.submit && (
            <div className="error-alert">
              {errors.submit}
            </div>
          )}

          {step === 1 ? (
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : formData.userType === 'teacher' ? 'Continue' : 'Send OTP'}
            </button>
          ) : (
            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Login'}
            </button>
          )}
        </form>

        <div className="login-footer">
          <a href="#forgot-password" className="forgot-password-link">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login

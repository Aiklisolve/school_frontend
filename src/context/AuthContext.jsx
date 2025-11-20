import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// API base URL
const API_BASE_URL = 'http://localhost:3000/api'

// Format password as hash-{password} to match backend expectation
const hashPassword = (password) => {
  return `${password}`
}

// Map frontend role values to backend role values
// For admin, check if email/username contains "principal" to determine school_admin vs super_admin
const mapRoleToBackend = (frontendRole, email = '') => {
  const roleMap = {
    'teacher': 'teacher',
    'parent': 'parent',
    'student': 'student',
    'staff': 'staff',
  }
  
  // Special handling for admin: check if email/username contains "principal"
  if (frontendRole === 'admin') {
    const emailLower = email.toLowerCase()
    if (emailLower.includes('principal')) {
      return 'school_admin'
    } else {
      return 'super_admin'
    }
  }
  
  return roleMap[frontendRole] || frontendRole
}

// Static/Mock data for student, staff, and admin (not using API yet)
const MOCK_USERS = {
  student: [
    { email: 'student@school.com', password: 'student123', name: 'John Student', userType: 'student', id: '1' },
    { email: 'student1@school.com', password: '123456', name: 'Sarah Student', userType: 'student', id: '2' }
  ],
  staff: [
    { email: 'staff@school.com', password: 'staff123', name: 'Admin Staff', userType: 'staff', id: '7' },
    { email: 'staff1@school.com', password: '123456', name: 'Office Staff', userType: 'staff', id: '8' }
  ],
  admin: [
    { email: 'admin@school.com', password: 'admin123', name: 'System Admin', userType: 'admin', id: '9' },
    { email: 'admin1@school.com', password: '123456', name: 'Super Admin', userType: 'admin', id: '10' }
  ]
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [otp, setOtp] = useState(null)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedOtp = localStorage.getItem('otp')
    
    // Check if storedUser exists and is not "undefined" string
    if (storedUser && storedUser !== 'undefined' && storedToken && storedToken !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser) {
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    } else {
      // Clear invalid/undefined data
      if (storedUser === 'undefined' || storedToken === 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    
    if (storedOtp && storedOtp !== 'undefined') {
      setOtp(storedOtp)
    }
    
    setLoading(false)
  }, [])

  // Step 1: For teachers - credential validation
  const validateCredentials = async (email, password, role) => {
    try {
      // Hash the password before sending to API
      const hashedPassword = hashPassword(password)
      // Map frontend role to backend role format (pass email for admin role detection)
      const backendRole = mapRoleToBackend(role, email)
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        step: 'credential_validation',
        login_type: 'email_password',
        role: backendRole,
        email: email,
        password: hashedPassword
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Credential validation error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials. Please try again.'
      }
    }
  }

  // Step 1: For parents - send OTP
  const sendOTP = async (mobile, role) => {
    try {
      // Map frontend role to backend role format
      const backendRole = mapRoleToBackend(role)
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        step: 'send_otp',
        login_type: 'mobile',
        role: backendRole,
        mobile: mobile
      })
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send OTP. Please try again.'
      }
    }
  }

  // Step 2: Final login with OTP (for both teacher and parent)
  const finalLogin = async (loginData) => {
    try {
      const { login_type, role, email, mobile, otp } = loginData
      
      // Map frontend role to backend role format (pass email for admin role detection)
      const backendRole = mapRoleToBackend(role, email || mobile)
      
      // Calculate current time + 30 minutes
      const currentTime = new Date()
      const timeWith30Minutes = new Date(currentTime.getTime() + 30 * 60 * 1000) // Add 30 minutes in milliseconds
      
      const payload = {
        step: 'final_login',
        login_type: login_type,
        role: backendRole,
        otp: otp,
        expires_at: timeWith30Minutes.toISOString() // Current time + 30 minutes
      }

      if (login_type === 'email_password' && email) {
        payload.email = email
      } else if (login_type === 'mobile' && mobile) {
        payload.mobile = mobile
      }

      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload)
      
      // Handle different possible response structures
      const responseData = response.data
      const userData = responseData.user || responseData.data?.user || responseData
      const token = responseData.token || responseData.data?.token || responseData.access_token || responseData.jwt
      
      if (!token) {
        console.error('No token received in response:', responseData)
        return {
          success: false,
          error: 'Login successful but no token received. Please try again.'
        }
      }

      // Create user object if not provided
      const finalUserData = userData || {
        email: email || mobile,
        userType: role,
        id: responseData.user_id || responseData.id
      }
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(finalUserData))
      localStorage.setItem('token', token)
      
      // Set user in context - this will trigger isAuthenticated to be true
      setUser(finalUserData)
      
      return { success: true, user: finalUserData, token: token }
    } catch (error) {
      console.error('Final login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid OTP. Please try again.'
      }
    }
  }

  // Legacy login function for student, staff, and admin (using mock data)
  const login = async (email, password, userType) => {
    // Only use mock data for student, staff, and admin
    if (userType === 'student' || userType === 'staff' || userType === 'admin') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      try {
        const users = MOCK_USERS[userType] || []
        const foundUser = users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )

        if (!foundUser) {
          return {
            success: false,
            error: 'Invalid email or password. Please try again.'
          }
        }

        // Create mock token
        const token = `mock-token-${foundUser.id}-${Date.now()}`
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          userType: foundUser.userType
        }

        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        
        setUser(userData)
        return { success: true, user: userData }
      } catch (error) {
        console.error('Login error:', error)
        return {
          success: false,
          error: 'Login failed. Please try again.'
        }
      }
    } else {
      // For teacher and parent, use the new flow
      return { 
        success: false, 
        error: 'Please use the new login flow with credential validation and OTP' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('otp')
    setUser(null)
    setOtp(null)
  }

  const value = {
    user,
    login,
    validateCredentials,
    sendOTP,
    finalLogin,
    logout,
    loading,
    isAuthenticated: !!user,
    otp,
    setOtp
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


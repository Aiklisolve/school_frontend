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
const API_BASE_URL = 'http://localhost:5000/api'

// Format password as hash-{password} to match backend expectation
const hashPassword = (password) => {
  return `${password}`
}

// Static/Mock data for student and staff (not using API yet)
const MOCK_USERS = {
  student: [
    { email: 'student@school.com', password: 'student123', name: 'John Student', userType: 'student', id: '1' },
    { email: 'student1@school.com', password: '123456', name: 'Sarah Student', userType: 'student', id: '2' }
  ],
  staff: [
    { email: 'staff@school.com', password: 'staff123', name: 'Admin Staff', userType: 'staff', id: '7' },
    { email: 'staff1@school.com', password: '123456', name: 'Office Staff', userType: 'staff', id: '8' }
  ]
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Step 1: For teachers - credential validation
  const validateCredentials = async (email, password, role) => {
    try {
      // Hash the password before sending to API
      const hashedPassword = hashPassword(password)
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        step: 'credential_validation',
        login_type: 'email_password',
        role: role,
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
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        step: 'send_otp',
        login_type: 'mobile',
        role: role,
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
      
      const payload = {
        step: 'final_login',
        login_type: login_type,
        role: role,
        otp: otp
      }

      if (login_type === 'email_password' && email) {
        payload.email = email
      } else if (login_type === 'mobile' && mobile) {
        payload.mobile = mobile
      }

      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload)
      
      const { user: userData, token } = response.data
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
      
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      console.error('Final login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid OTP. Please try again.'
      }
    }
  }

  // Legacy login function for student and staff (using mock data)
  const login = async (email, password, userType) => {
    // Only use mock data for student and staff
    if (userType === 'student' || userType === 'staff') {
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
    setUser(null)
  }

  const value = {
    user,
    login,
    validateCredentials,
    sendOTP,
    finalLogin,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


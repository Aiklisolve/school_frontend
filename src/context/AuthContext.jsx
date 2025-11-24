import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
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
const API_BASE_URL = 'http://localhost:8080/api'

// Hash password using Web Crypto API (SHA-256)
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Map frontend role values to backend role values
// For admin, check if email/username contains "principal" to determine school_admin vs super_admin
const mapRoleToBackend = (frontendRole, email = '') => {
  const roleMap = {
    'teacher': 'TEACHER',
    'parent': 'PARENT',
    'student': 'STUDENT',
    'staff': 'STAFF',
  }
  
  // Special handling for admin: check if email/username contains "principal"
  if (frontendRole === 'admin') {
    const emailLower = email.toLowerCase()
    if (emailLower.includes('principal')) {
      return 'PRINCIPAL'
    } else {
      return 'ADMIN'
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

  // Inactivity timeout: 5 minutes = 300,000 milliseconds
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000

  // Function to logout and clear all data
  const performLogout = useCallback(async () => {
    // Get session_id before clearing localStorage
    const sessionId = localStorage.getItem('session_id') || 
                     (() => {
                       try {
                         const storedUser = localStorage.getItem('user')
                         if (storedUser && storedUser !== 'undefined') {
                           const parsedUser = JSON.parse(storedUser)
                           return parsedUser?.session_id
                         }
                       } catch (e) {
                         // Ignore parsing errors
                       }
                       return null
                     })()

    // Call backend logout API if session_id exists
    if (sessionId) {
      try {
        await axios.post(`${API_BASE_URL}/sessions/logout`, {
          session_id: sessionId
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('Backend logout successful')
      } catch (error) {
        // Even if backend logout fails, continue with local logout
        console.error('Backend logout error:', error)
        // Don't block logout if API call fails - still clear local data
      }
    }

    // Clear all local storage and state
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('otp')
    localStorage.removeItem('session_id')
    localStorage.removeItem('is_active')
    setUser(null)
    setOtp(null)
  }, [])

  // Function to validate session with backend
  const validateSession = useCallback(async (sessionId, token) => {
    try {
      if (!sessionId || !token) {
        console.log('Session validation skipped: missing session_id or token')
        return { valid: false, reason: 'missing_credentials' }
      }

      const response = await axios.post(`${API_BASE_URL}/sessions/validate`, {
        session_id: sessionId,
        token: token
      })

      // Check if response indicates valid session
      if (response.data && (response.data.valid === true || response.status === 200)) {
        return { valid: true }
      }

      return { valid: false, reason: 'invalid_session' }
    } catch (error) {
      console.error('Session validation error:', error)
      // If session is invalid or expired, backend will return error
      return { 
        valid: false, 
        reason: error.response?.status === 401 || error.response?.status === 403 
          ? 'invalid_session' 
          : 'validation_error' 
      }
    }
  }, [])

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    const storedOtp = localStorage.getItem('otp')
    const storedSessionId = localStorage.getItem('session_id')
    
    // Check if storedUser exists and is not "undefined" string
    if (storedUser && storedUser !== 'undefined' && storedToken && storedToken !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser) {
          // Validate session before setting user
          const sessionIdToValidate = storedSessionId || parsedUser.session_id
          
          if (sessionIdToValidate) {
            // Validate session with backend
            validateSession(sessionIdToValidate, storedToken).then(async (validationResult) => {
              if (validationResult.valid) {
                // Session is valid, fetch latest user details
                const userId = parsedUser.id
                if (userId) {
                  try {
                    const userDetailsResponse = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                      headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json'
                      }
                    })
                    
                    // Merge fetched user details with stored user data
                    const fetchedUserDetails = userDetailsResponse.data?.data || userDetailsResponse.data || {}
                    const completeUserData = {
                      ...parsedUser,
                      ...fetchedUserDetails,
                      // Preserve important fields
                      id: userId,
                      session_id: sessionIdToValidate,
                      email: parsedUser.email || fetchedUserDetails.email,
                      userType: parsedUser.userType || fetchedUserDetails.user_type || fetchedUserDetails.role
                    }
                    
                    // Update localStorage with complete user data
                    localStorage.setItem('user', JSON.stringify(completeUserData))
                    
                    // Set user in context with complete data
                    setUser(completeUserData)
                    console.log('User details fetched and updated on app load')
                  } catch (error) {
                    console.error('Error fetching user details on app load:', error)
                    // If fetch fails, use stored user data
                    setUser(parsedUser)
                  }
                } else {
                  // No user ID, use stored user data
                  setUser(parsedUser)
                }
                setLoading(false)
              } else {
                // Session is invalid, logout
                console.log('Session validation failed on app load:', validationResult.reason)
                await performLogout()
                setLoading(false)
              }
            }).catch(async (error) => {
              console.error('Error during session validation:', error)
              await performLogout()
              setLoading(false)
            })
          } else {
            // No session_id found, logout
            console.log('No session_id found, logging out')
            performLogout().then(() => {
              setLoading(false)
            }).catch(() => {
              setLoading(false)
            })
          }
        }
      } catch (error) {
        console.error('Error parsing stored user:', error)
        // Clear invalid data
        performLogout().then(() => {
          setLoading(false)
        }).catch(() => {
          setLoading(false)
        })
      }
    } else {
      // Clear invalid/undefined data
      if (storedUser === 'undefined' || storedToken === 'undefined') {
        performLogout().then(() => {
          setLoading(false)
        }).catch(() => {
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    }
    
    if (storedOtp && storedOtp !== 'undefined') {
      setOtp(storedOtp)
    }
  }, [validateSession, performLogout])

  // Inactivity timeout handler - redirects to login after 5 minutes of no activity
  useEffect(() => {
    // Only set up inactivity tracking if user is authenticated
    if (!user) {
      return
    }

    let inactivityTimer = null

    // Function to reset the inactivity timer
    const resetInactivityTimer = () => {
      // Clear existing timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }

      // Set new timer - if it expires, logout and redirect
      inactivityTimer = setTimeout(() => {
        console.log('Session expired due to inactivity')
        performLogout()
        // Redirect to login page
        window.location.href = '/login'
      }, INACTIVITY_TIMEOUT)
    }

    // List of events that indicate user activity
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true)
    })

    // Initialize the timer
    resetInactivityTimer()

    // Cleanup function
    return () => {
      // Clear the timer
      if (inactivityTimer) {
        clearTimeout(inactivityTimer)
      }
      // Remove event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true)
      })
    }
  }, [user, INACTIVITY_TIMEOUT])

  // Step 1: For teachers - credential validation
  const validateCredentials = async (email, password, role) => {
    try {
      // Hash the password before sending to API
      const hashedPassword = await hashPassword(password)
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
      
      // Log the full response for debugging
      console.log('Login response:', responseData)
      
      // Extract user data - handle nested structures
      let userData = responseData.user || responseData.data?.user
      // If userData is not found, but responseData has user fields directly (not status/message), use those
      if (!userData && (responseData.email || responseData.mobile || responseData.user_id) && !responseData.status) {
        userData = responseData
      }
      
      // Extract token from various possible locations
      const token = responseData.token || responseData.data?.token || responseData.access_token || responseData.jwt
      
      // Extract session_id from various possible locations
      const sessionId = responseData.session_id || responseData.sessionId || 
                       responseData.data?.session_id || responseData.data?.sessionId || 
                       responseData.dbRow?.session_id || responseData.session?.session_id
      
      // Extract is_active from various possible locations
      const isActive = responseData.is_active !== undefined ? responseData.is_active : 
                      (responseData.data?.is_active !== undefined ? responseData.data.is_active :
                      (responseData.dbRow?.is_active !== undefined ? responseData.dbRow.is_active :
                      (responseData.session?.is_active !== undefined ? responseData.session.is_active : true)))
      
      // Extract expires_at if available
      const expiresAt = responseData.expires_at || responseData.expiresAt || 
                       responseData.data?.expires_at || responseData.data?.expiresAt ||
                       responseData.session?.expires_at
      
      // Log extracted values for debugging
      console.log('Extracted values:', { sessionId, isActive, expiresAt, hasToken: !!token })
      
      if (!token) {
        console.error('No token received in response:', responseData)
        return {
          success: false,
          error: 'Login successful but no token received. Please try again.'
        }
      }

      // Create user object with all available data
      const finalUserData = {
        ...(userData || {}),
        email: userData?.email || email || mobile,
        userType: userData?.userType || userData?.user_type || userData?.role || role,
        id: userData?.id || userData?.user_id || responseData.user_id || responseData.id,
        session_id: sessionId,
        is_active: isActive,
        expires_at: expiresAt
      }
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(finalUserData))
      localStorage.setItem('token', token)
      
      // Store session_id separately if available
      if (sessionId) {
        localStorage.setItem('session_id', sessionId)
      }
      
      // Store is_active separately if available
      if (isActive !== undefined) {
        localStorage.setItem('is_active', String(isActive))
      }
      
      // Validate session after login
      if (sessionId) {
        const validationResult = await validateSession(sessionId, token)
        if (!validationResult.valid) {
          console.error('Session validation failed after login:', validationResult.reason)
          // Clear data and return error
          await performLogout()
          return {
            success: false,
            error: 'Session validation failed. Please try logging in again.'
          }
        }
        console.log('Session validated successfully after login')
      } else {
        // No session_id received, logout
        console.error('No session_id received from login response')
        await performLogout()
        return {
          success: false,
          error: 'Login failed: No session ID received. Please try again.'
        }
      }
      
      // Fetch user details from API using user ID
      const userId = finalUserData.id
      if (userId) {
        try {
          const userDetailsResponse = await axios.get(`${API_BASE_URL}/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          // Merge fetched user details with existing user data
          const fetchedUserDetails = userDetailsResponse.data?.data || userDetailsResponse.data || {}
          const completeUserData = {
            ...finalUserData,
            ...fetchedUserDetails,
            // Preserve important fields from login response
            id: userId,
            session_id: sessionId,
            is_active: isActive,
            expires_at: expiresAt,
            email: finalUserData.email || fetchedUserDetails.email,
            userType: finalUserData.userType || fetchedUserDetails.user_type || fetchedUserDetails.role
          }
          
          // Update localStorage with complete user data
          localStorage.setItem('user', JSON.stringify(completeUserData))
          
          // Set user in context with complete data
          setUser(completeUserData)
          
          console.log('User details fetched and stored successfully')
          
          return { 
            success: true, 
            user: completeUserData, 
            token: token, 
            session_id: sessionId, 
            is_active: isActive 
          }
        } catch (error) {
          console.error('Error fetching user details:', error)
          // Even if user details fetch fails, continue with login using basic user data
          // Set user in context - this will trigger isAuthenticated to be true
          setUser(finalUserData)
          
          return { 
            success: true, 
            user: finalUserData, 
            token: token, 
            session_id: sessionId, 
            is_active: isActive 
          }
        }
      } else {
        // No user ID available, use basic user data
        console.warn('No user ID found, skipping user details fetch')
        // Set user in context - this will trigger isAuthenticated to be true
        setUser(finalUserData)
        
        return { success: true, user: finalUserData, token: token, session_id: sessionId, is_active: isActive }
      }
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

  const logout = async () => {
    await performLogout()
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


import React, { createContext, useState, useContext, useEffect } from 'react'
// import axios from 'axios' // Uncomment when backend API is ready

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Static/Mock data for testing - Remove when backend API is ready
const MOCK_USERS = {
  student: [
    { email: 'student@school.com', password: 'student123', name: 'John Student', userType: 'student', id: '1' },
    { email: 'student1@school.com', password: '123456', name: 'Sarah Student', userType: 'student', id: '2' }
  ],
  parent: [
    { email: 'parent@school.com', password: 'parent123', name: 'Mike Parent', userType: 'parent', id: '3' },
    { email: 'parent1@school.com', password: '123456', name: 'Lisa Parent', userType: 'parent', id: '4' }
  ],
  teacher: [
    { email: 'teacher@school.com', password: 'teacher123', name: 'Dr. Smith Teacher', userType: 'teacher', id: '5' },
    { email: 'teacher1@school.com', password: '123456', name: 'Ms. Johnson Teacher', userType: 'teacher', id: '6' }
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

  const login = async (email, password, userType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // ============================================
    // STATIC DATA - FOR TESTING ONLY
    // Replace this entire block with actual API call when backend is ready
    // ============================================
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

    // ============================================
    // ACTUAL API CALL - Uncomment when backend is ready
    // ============================================
    /*
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        userType
      })

      const { user: userData, token } = response.data
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
      
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      }
    }
    */
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


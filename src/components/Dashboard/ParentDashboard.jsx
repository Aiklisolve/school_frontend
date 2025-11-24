import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const ParentDashboard = ({ user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('Report Cards')
  const [ptmSessions, setPtmSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [ptmBookings, setPtmBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [reportCards, setReportCards] = useState([])
  const [loadingReportCards, setLoadingReportCards] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Fetch PTM sessions when calendar tab is active
  useEffect(() => {
    if (activeTab === 'calendar') {
      // Get parent ID from user object (try id, user_id, or parent_id)
      const parentId = user?.id || user?.user_id || user?.parent_id
      if (parentId) {
        console.log('Fetching PTM sessions for parent ID:', parentId)
        fetchPTMSessions(parentId)
      } else {
        console.warn('Parent ID not found in user object:', user)
      }
    }
  }, [activeTab, user])

  // Fetch PTM bookings when meeting tab is active
  useEffect(() => {
    if (activeTab === 'meeting') {
      // Get parent ID from user object (try id, user_id, or parent_id)
      const parentId = user?.id || user?.user_id || user?.parent_id
      if (parentId) {
        console.log('Fetching PTM bookings for parent ID:', parentId)
        fetchPTMBookings(parentId)
      } else {
        console.warn('Parent ID not found in user object:', user)
      }
    }
  }, [activeTab, user])

  // Fetch report cards when Report Cards tab is active
  useEffect(() => {
    if (activeTab === 'Report Cards') {
      // Get schoolId and yearId from user object
      const schoolId = user?.school_id || user?.schoolId || user?.school?.id || 1
      const yearId = user?.year_id || user?.yearId || user?.year?.id || 1
      const term = 'TERM1' // Default to TERM1, can be made dynamic later
      
      console.log('Fetching report cards:', { schoolId, yearId, term })
      fetchReportCards(schoolId, yearId, term)
    }
  }, [activeTab, user])

  const fetchPTMSessions = async (parentId, page = 1, limit = 20) => {
    setLoadingSessions(true)
    try {
      const url = `${API_BASE_URL}/ptm/sessions/parent/${parentId}?page=${page}&limit=${limit}`
      console.log('Calling PTM API:', url)
      
      const response = await axios.get(url)
      
      console.log('PTM API Response:', response.data)
      
      // Handle different response structures
      const sessions = response.data?.data || response.data?.sessions || response.data || []
      setPtmSessions(Array.isArray(sessions) ? sessions : [])
      console.log('PTM Sessions loaded:', sessions.length)
    } catch (error) {
      console.error('Error fetching PTM sessions:', error)
      console.error('Error details:', error.response?.data || error.message)
      setPtmSessions([])
    } finally {
      setLoadingSessions(false)
    }
  }

  const fetchPTMBookings = async (parentId, page = 1, limit = 20) => {
    setLoadingBookings(true)
    try {
      const url = `${API_BASE_URL}/ptm/bookings/parent/${parentId}?page=${page}&limit=${limit}`
      console.log('Calling PTM Bookings API:', url)
      
      const response = await axios.get(url)
      
      console.log('PTM Bookings API Response:', response.data)
      
      // Handle different response structures
      let bookings = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          bookings = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookings = response.data.data
        } else if (response.data.bookings && Array.isArray(response.data.bookings)) {
          bookings = response.data.bookings
        } else if (response.data.results && Array.isArray(response.data.results)) {
          bookings = response.data.results
        }
      }
      
      setPtmBookings(Array.isArray(bookings) ? bookings : [])
      console.log('PTM Bookings loaded:', bookings.length)
    } catch (error) {
      console.error('Error fetching PTM bookings:', error)
      console.error('Error details:', error.response?.data || error.message)
      setPtmBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  const fetchReportCards = async (schoolId, yearId, term) => {
    setLoadingReportCards(true)
    try {
      const url = `${API_BASE_URL}/report-cards/uploaded-marks?schoolId=${schoolId}&yearId=${yearId}&term=${term}`
      console.log('Calling Report Cards API:', url)
      
      const response = await axios.get(url)
      
      console.log('Report Cards API Full Response:', response)
      console.log('Report Cards API Response Data:', response.data)
      console.log('Response Data Type:', typeof response.data)
      console.log('Response Data Keys:', Object.keys(response.data || {}))
      
      // Handle different response structures
      let reportCardsData = []
      if (response.data) {
        // Check for response.data.data.students (most common structure)
        if (response.data.data && response.data.data.students && Array.isArray(response.data.data.students)) {
          reportCardsData = response.data.data.students
          console.log('Found data in response.data.data.students')
        }
        // Check for response.data.students
        else if (response.data.students && Array.isArray(response.data.students)) {
          reportCardsData = response.data.students
          console.log('Found data in response.data.students')
        }
        // Check if response.data.data is an array
        else if (response.data.data && Array.isArray(response.data.data)) {
          reportCardsData = response.data.data
          console.log('Found data in response.data.data (array)')
        }
        // Check if response.data is an array
        else if (Array.isArray(response.data)) {
          reportCardsData = response.data
          console.log('Found data in response.data (array)')
        }
        // Check for other possible structures
        else if (response.data.reportCards && Array.isArray(response.data.reportCards)) {
          reportCardsData = response.data.reportCards
          console.log('Found data in response.data.reportCards')
        }
        else if (response.data.marks && Array.isArray(response.data.marks)) {
          reportCardsData = response.data.marks
          console.log('Found data in response.data.marks')
        }
        else if (response.data.results && Array.isArray(response.data.results)) {
          reportCardsData = response.data.results
          console.log('Found data in response.data.results')
        }
        // Try to find any array property
        else if (typeof response.data === 'object') {
          const arrayKey = Object.keys(response.data).find(key => Array.isArray(response.data[key]))
          if (arrayKey) {
            reportCardsData = response.data[arrayKey]
            console.log(`Found data in response.data.${arrayKey}`)
          }
        }
      }
      
      console.log('Extracted Report Cards Data:', reportCardsData)
      console.log('Report Cards Count:', reportCardsData.length)
      if (reportCardsData.length > 0) {
        console.log('First Report Card Sample:', reportCardsData[0])
      }
      
      setReportCards(Array.isArray(reportCardsData) ? reportCardsData : [])
    } catch (error) {
      console.error('Error fetching report cards:', error)
      console.error('Error response:', error.response)
      console.error('Error details:', error.response?.data || error.message)
      setReportCards([])
    } finally {
      setLoadingReportCards(false)
    }
  }

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getSessionsForDate = (date) => {
    const dateStr = formatDate(date)
    return ptmSessions.filter(session => {
      // API returns session_date, check that first
      const sessionDate = session.session_date || session.scheduled_date || session.date
      if (!sessionDate) return false
      
      // Handle different date formats - extract YYYY-MM-DD
      let sessionDateStr
      if (typeof sessionDate === 'string') {
        sessionDateStr = sessionDate.split('T')[0]
      } else if (sessionDate instanceof Date) {
        sessionDateStr = formatDate(sessionDate)
      } else {
        return false
      }
      
      return sessionDateStr === dateStr
    })
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const changeMonth = (monthIndex) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(monthIndex)
      return newDate
    })
  }

  const changeYear = (year) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setFullYear(year)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(null)
  }

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userMessage])
    setIsSending(true)

    // TODO: API integration will be added here later
    // For now, we just show the user message
    // When API is ready, uncomment and modify the following:
    /*
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: message,
        parent_id: user?.id || user?.user_id || user?.parent_id
      })
      
      const assistantMessage = {
        role: 'assistant',
        content: response.data.response || response.data.message || 'I received your message.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSending(false)
    }
    */

    // For now, just stop the loading indicator after a short delay
    setTimeout(() => {
      setIsSending(false)
    }, 500)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-8 py-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
              <span className="text-4xl">👨‍👩‍👧‍👦</span>
            </div>
            <div>
              <h1 className="m-0 text-white text-3xl font-bold">Welcome, {user?.name || user?.email}!</h1>
              <p className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold mt-2">
                PARENT
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="bg-white text-blue-600 border-none px-6 py-3 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-3xl p-8 shadow-2xl mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2">Parent Dashboard</h2>
              <p className="text-xl text-blue-100">Track your child's progress and stay connected with the school</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-5xl">📚</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex gap-2 border-b-2 border-blue-100 pb-2 mb-6 overflow-x-auto">
            {[
              { id: 'Report Cards', label: 'Report Cards', icon: '📊' },
              { id: 'chat', label: 'Chat', icon: '💬' },
              { id: 'meeting', label: 'Meetings', icon: '🤝' },
              { id: 'calendar', label: 'Calendar', icon: '📅' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'Report Cards' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Cards & Marks</h3>
                  <p className="text-gray-600">View your child's academic performance and report cards</p>
                </div>
                
                {loadingReportCards ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading report cards...</p>
                  </div>
                ) : reportCards.length > 0 ? (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium mb-1">Total Records</p>
                          <p className="text-4xl font-bold">{reportCards.length}</p>
                        </div>
                        <div className="text-5xl opacity-80">📊</div>
                      </div>
                    </div>
                    
                    {/* Report Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {reportCards.map((card, idx) => (
                        <div key={card.report_id || card.id || card.report_card_id || idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 overflow-hidden">
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-xl mb-1">
                                  {card.student_name || card.studentName || `Report Card #${idx + 1}`}
                                </h4>
                                {card.class_name && (
                                  <p className="text-sm text-gray-500">Class: {card.class_name} {card.section_name ? `- Section ${card.section_name}` : ''}</p>
                                )}
                                {card.admission_number && (
                                  <p className="text-xs text-gray-400">Admission: {card.admission_number}</p>
                                )}
                              </div>
                              {card.status && (
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                                  card.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                    card.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {card.status}
                                </span>
                              )}
                            </div>
                            
                            {/* Details */}
                            <div className="space-y-3">
                              {card.overall_percentage && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">📊</span>
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Overall Percentage</p>
                                        <p className="text-gray-900 font-bold text-2xl">{card.overall_percentage}%</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {card.subjects_count && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">📚</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Subjects</p>
                                    <p className="text-gray-900 font-semibold">{card.subjects_count} subjects</p>
                                  </div>
                                </div>
                              )}
                              
                              {card.created_at && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">📅</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Created Date</p>
                                    <p className="text-gray-900 font-semibold">
                                      {new Date(card.created_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {card.updated_at && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">🔄</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                                    <p className="text-gray-900 font-semibold">
                                      {new Date(card.updated_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Show all other fields */}
                            {Object.keys(card).filter(key => 
                              !['report_id', 'id', 'report_card_id', 'student_id', 'student_name', 'studentName', 
                                'class_name', 'section_name', 'admission_number', 'status', 'overall_percentage', 
                                'subjects_count', 'created_at', 'updated_at'].includes(key)
                            ).length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <details className="text-sm">
                                  <summary className="cursor-pointer text-gray-600 font-medium hover:text-gray-900">
                                    View More Details
                                  </summary>
                                  <div className="mt-2 space-y-1">
                                    {Object.keys(card).filter(key => 
                                      !['report_id', 'id', 'report_card_id', 'student_id', 'student_name', 'studentName', 
                                        'class_name', 'section_name', 'admission_number', 'status', 'overall_percentage', 
                                        'subjects_count', 'created_at', 'updated_at'].includes(key)
                                    ).map(key => (
                                      <div key={key} className="flex justify-between text-xs">
                                        <span className="text-gray-500 font-medium">{key}:</span>
                                        <span className="text-gray-900">{String(card[key])}</span>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <div className="text-6xl mb-4">📊</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Report Cards Found</h4>
                    <p className="text-gray-600 mb-1">No report cards or marks have been uploaded yet.</p>
                    <p className="text-sm text-gray-500">Please check back later.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md overflow-hidden">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 border-b border-blue-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                      <p className="text-xs text-blue-100">Ask me anything about your child's education</p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Start a conversation</h4>
                      <p className="text-gray-600 max-w-md">
                        Ask me questions about your child's academic performance, school events, or any other school-related queries.
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.role === 'assistant' && (
                              <span className="text-lg mt-0.5">🤖</span>
                            )}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                              <p className={`text-xs mt-2 ${
                                message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {message.role === 'user' && (
                              <span className="text-lg mt-0.5">👤</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isSending && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤖</span>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (chatInput.trim() && !isSending) {
                        handleSendMessage(chatInput.trim())
                        setChatInput('')
                      }
                    }}
                    className="flex gap-3"
                  >
                    <div className="flex-1 relative">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            if (chatInput.trim() && !isSending) {
                              handleSendMessage(chatInput.trim())
                              setChatInput('')
                            }
                          }
                        }}
                        placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="1"
                        style={{
                          minHeight: '48px',
                          maxHeight: '120px'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto'
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isSending}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md flex items-center gap-2"
                    >
                      <span>Send</span>
                      <span>➤</span>
                    </button>
                  </form>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    API integration will be added later. For now, your messages are saved locally.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'meeting' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">My Parent-Teacher Meeting Bookings</h3>
                  <p className="text-gray-600">View and manage your parent-teacher meeting bookings</p>
                </div>
                
                {loadingBookings ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your bookings...</p>
                  </div>
                ) : ptmBookings.length > 0 ? (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm font-medium mb-1">Total Bookings</p>
                          <p className="text-4xl font-bold">{ptmBookings.length}</p>
                        </div>
                        <div className="text-5xl opacity-80">📅</div>
                      </div>
                    </div>
                    
                    {/* Bookings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {ptmBookings.map((booking, idx) => (
                        <div key={booking.booking_id || booking.id || idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 overflow-hidden">
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-xl mb-1">
                                  {booking.session_name || booking.session_title || booking.title || `Booking #${idx + 1}`}
                                </h4>
                              </div>
                              {booking.status && (
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                                  (booking.status === 'CONFIRMED' || booking.status === 'confirmed') 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : (booking.status === 'PENDING' || booking.status === 'pending')
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : (booking.status === 'CANCELLED' || booking.status === 'cancelled')
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {String(booking.status).toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            {/* Details */}
                            <div className="space-y-3">
                              {(booking.session_date || booking.date || booking.booking_date) && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">📅</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-gray-900 font-semibold">
                                      {new Date(booking.session_date || booking.date || booking.booking_date).toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {(booking.start_time || booking.time) && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">⏰</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Time</p>
                                    <p className="text-gray-900 font-semibold">
                                      {booking.start_time || booking.time} {booking.end_time ? `- ${booking.end_time}` : ''}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {(booking.teacher_name || booking.teacher) && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">👨‍🏫</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Teacher</p>
                                    <p className="text-gray-900 font-semibold">{booking.teacher_name || booking.teacher}</p>
                                  </div>
                                </div>
                              )}
                              
                              {(booking.class_name || booking.class) && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">📚</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">Class</p>
                                    <p className="text-gray-900 font-semibold">{booking.class_name || booking.class}</p>
                                  </div>
                                </div>
                              )}
                              
                              {(booking.school_name || booking.school) && (
                                <div className="flex items-start">
                                  <span className="text-blue-600 mr-3 text-lg">🏫</span>
                                  <div>
                                    <p className="text-xs text-gray-500 font-medium">School</p>
                                    <p className="text-gray-900 font-semibold">{booking.school_name || booking.school}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Notes */}
                            {(booking.notes || booking.note || booking.description) && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                                <p className="text-sm text-gray-700">{booking.notes || booking.note || booking.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-xl shadow-md">
                    <div className="text-6xl mb-4">📅</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h4>
                    <p className="text-gray-600 mb-1">You don't have any parent-teacher meeting bookings yet.</p>
                    <p className="text-sm text-gray-500">Book a meeting to get started!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="p-6 bg-gray-50 rounded-md">
                <h3 className="text-lg font-semibold mb-4">Event Calendar</h3>
                
                {loadingSessions ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading sessions...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Calendar Navigation */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Previous/Next Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateMonth(-1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                          >
                            ← Previous
                          </button>
                          <button
                            onClick={() => navigateMonth(1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                          >
                            Next →
                          </button>
                        </div>

                        {/* Month and Year Selectors */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">Month:</label>
                            <select
                              value={month}
                              onChange={(e) => changeMonth(parseInt(e.target.value))}
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {monthNames.map((name, index) => (
                                <option key={index} value={index}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">Year:</label>
                            <select
                              value={year}
                              onChange={(e) => changeYear(parseInt(e.target.value))}
                              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              {yearOptions.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Today Button */}
                        <button
                          onClick={goToToday}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                        >
                          Today
                        </button>
                      </div>

                      {/* Current Month/Year Display */}
                      <div className="mt-3 text-center">
                        <h4 className="text-2xl font-bold text-gray-900">
                          {monthNames[month]} {year}
                        </h4>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      {/* Day Headers */}
                      <div className="grid grid-cols-7 bg-blue-600 text-white">
                        {dayNames.map(day => (
                          <div key={day} className="p-3 text-center font-semibold text-sm">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7">
                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                          <div key={`empty-${index}`} className="p-3 min-h-[80px] border border-gray-200 bg-gray-50"></div>
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                          const day = index + 1
                          const date = new Date(year, month, day)
                          const dateStr = formatDate(date)
                          const isToday = dateStr === formatDate(new Date())
                          const isSelected = selectedDate && formatDate(selectedDate) === dateStr
                          const daySessions = getSessionsForDate(date)
                          const hasSessions = daySessions.length > 0

                          return (
                            <div
                              key={day}
                              onClick={() => setSelectedDate(date)}
                              className={`p-2 min-h-[100px] border-2 cursor-pointer transition-all relative ${
                                hasSessions
                                  ? isToday
                                    ? 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-500 shadow-md'
                                    : isSelected
                                    ? 'bg-gradient-to-br from-blue-200 to-blue-100 border-blue-600 shadow-lg'
                                    : 'bg-gradient-to-br from-blue-50 to-white border-blue-300 hover:border-blue-400 hover:shadow-md'
                                  : isToday
                                  ? 'bg-blue-100 border-blue-500'
                                  : isSelected
                                  ? 'bg-blue-200 border-blue-600'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {/* Day Number */}
                              <div className={`text-sm font-bold mb-1 flex items-center justify-between ${
                                isToday ? 'text-blue-700' : hasSessions ? 'text-blue-800' : 'text-gray-900'
                              }`}>
                                <span>{day}</span>
                                {hasSessions && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              
                              {/* Parent-Teacher Meeting Sessions Indicator */}
                              {hasSessions && (
                                <div className="space-y-1 mt-1">
                                  <div className="text-xs font-bold text-blue-700 mb-1">
                                    {daySessions.length} Meeting{daySessions.length > 1 ? 's' : ''}
                                  </div>
                                  {daySessions.slice(0, 2).map((session, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs bg-blue-500 text-white px-1.5 py-1 rounded font-medium truncate shadow-sm"
                                      title={session.session_name || 'Parent-Teacher Meeting'}
                                    >
                                      {session.session_name || 'Meeting'}
                                    </div>
                                  ))}
                                  {daySessions.length > 2 && (
                                    <div className="text-xs text-blue-600 font-bold">
                                      +{daySessions.length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Selected Date Sessions */}
                    {selectedDate && (
                      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-300">
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-200">
                          <div className="flex items-center gap-4">
                            <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg">
                              📅
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-gray-900">
                                {selectedDate.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {getSessionsForDate(selectedDate).length > 0 
                                  ? `${getSessionsForDate(selectedDate).length} Parent-Teacher Meeting${getSessionsForDate(selectedDate).length > 1 ? 's' : ''} scheduled`
                                  : 'No parent-teacher meetings scheduled'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedDate(null)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all"
                          >
                            ×
                          </button>
                        </div>
                        
                        {getSessionsForDate(selectedDate).length > 0 ? (
                          <div className="space-y-4">
                            {getSessionsForDate(selectedDate).map((session, idx) => (
                              <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-200">
                                {/* Session Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                                  <h5 className="font-bold text-white text-xl">
                                    {session.session_name || 'Parent-Teacher Meeting'}
                                  </h5>
                                </div>
                                
                                {/* Session Details */}
                                <div className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {session.school_name && (
                                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-2xl">🏫</span>
                                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">School</p>
                                        </div>
                                        <p className="text-gray-900 font-bold text-lg">{session.school_name}</p>
                                      </div>
                                    )}
                                    
                                    {session.class_name && (
                                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-2xl">📚</span>
                                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Class</p>
                                        </div>
                                        <p className="text-gray-900 font-bold text-lg">{session.class_name}</p>
                                      </div>
                                    )}
                                    
                                    {session.year_name && (
                                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-2xl">📅</span>
                                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Academic Year</p>
                                        </div>
                                        <p className="text-gray-900 font-bold text-lg">{session.year_name}</p>
                                      </div>
                                    )}
                                    
                                    {session.start_time && session.end_time && (
                                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                        <div className="flex items-center gap-3 mb-2">
                                          <span className="text-2xl">⏰</span>
                                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Time</p>
                                        </div>
                                        <p className="text-gray-900 font-bold text-lg">{session.start_time} - {session.end_time}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📅</div>
                            <p className="text-gray-700 font-bold text-xl mb-2">No Parent-Teacher Meetings</p>
                            <p className="text-sm text-gray-500">There are no parent-teacher meetings scheduled for this date.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard


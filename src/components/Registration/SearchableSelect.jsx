import React, { useState, useRef, useEffect } from 'react'

const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  loading = false,
  name = '',
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOptions(options)
    } else {
      const filtered = options.filter(option => {
        const displayText = typeof option === 'string' 
          ? option 
          : option.label || option.text || String(option.value || option)
        return displayText.toLowerCase().includes(searchTerm.toLowerCase())
      })
      setFilteredOptions(filtered)
    }
  }, [searchTerm, options])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (option) => {
    const optionValue = typeof option === 'string' ? option : (option.value || option.id || option)
    const optionLabel = typeof option === 'string' ? option : (option.label || option.text || String(optionValue))
    
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name,
          value: optionValue
        }
      }
      onChange(syntheticEvent)
    }
    setIsOpen(false)
    setSearchTerm('')
  }

  const getDisplayValue = () => {
    if (!value) return ''
    const selectedOption = options.find(opt => {
      const optValue = typeof opt === 'string' ? opt : (opt.value || opt.id || opt)
      return String(optValue) === String(value)
    })
    if (selectedOption) {
      return typeof selectedOption === 'string' 
        ? selectedOption 
        : (selectedOption.label || selectedOption.text || String(selectedOption.value || selectedOption))
    }
    return value
  }

  const displayValue = getDisplayValue()

  return (
    <div 
      ref={dropdownRef} 
      className={`relative ${className}`}
      style={{ width: '100%', ...style }}
    >
      {/* Selected Value Display */}
      <div
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border-2 rounded-lg cursor-pointer flex items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled || loading ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:border-slate-400'} ${className}`}
        style={{ minHeight: '42px' }}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {loading ? 'Loading...' : displayValue || placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && !loading && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
          style={{ width: '100%', top: '100%' }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchTerm ? 'No results found' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : (option.value || option.id || option)
                const optionLabel = typeof option === 'string' ? option : (option.label || option.text || String(optionValue))
                const isSelected = String(optionValue) === String(value)

                return (
                  <div
                    key={index}
                    onClick={() => handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-slate-100 transition-colors ${
                      isSelected ? 'bg-slate-200 font-semibold' : ''
                    }`}
                  >
                    {optionLabel}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableSelect


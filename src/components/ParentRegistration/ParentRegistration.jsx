import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

const sampleSchools = [
  { id: 1, name: 'Bright Future School (ID: 1)' },
  { id: 2, name: 'Green Valley Academy (ID: 2)' },
  { id: 3, name: 'Sunrise Public School (ID: 3)' }
]

const initialState = {
  school_id: '',
  full_name: '',
  phone: '',
  whatsapp_number: '',
  email: '',
  occupation: '',
  annual_income_range: '',
  education_level: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: ''
}

// Helper to load SweetAlert2 from CDN if not present
const loadSwal = async () => {
  if (window.Swal) return window.Swal
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11'
    script.onload = () => resolve(window.Swal)
    script.onerror = () => reject(new Error('Failed to load SweetAlert2'))
    document.head.appendChild(script)
  })
}

export default function ParentRegistration() {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const validate = (values) => {
    const errs = {}
    if (!values.school_id) errs.school_id = 'Please select a school.'
    if (!values.full_name || values.full_name.trim().length < 3) errs.full_name = 'Please enter full name.'
    const phoneRegex = /^[6-9]\d{9}$/
    if (!values.phone || !phoneRegex.test(values.phone)) errs.phone = 'Enter a valid 10-digit phone.'
    if (!values.whatsapp_number || !phoneRegex.test(values.whatsapp_number)) errs.whatsapp_number = 'Enter a valid 10-digit WhatsApp number.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!values.email || !emailRegex.test(values.email)) errs.email = 'Enter a valid email address.'
    if (!values.occupation) errs.occupation = 'Occupation is required.'
    if (!values.education_level) errs.education_level = 'Please select education level.'
    if (!values.address_line1) errs.address_line1 = 'Address line 1 is required.'
    if (!values.city) errs.city = 'City is required.'
    if (!values.state) errs.state = 'State is required.'
    const pinRegex = /^\d{6}$/
    if (!values.pincode || !pinRegex.test(values.pincode)) errs.pincode = 'Enter a valid 6-digit pincode.'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
    setMessage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      // Build payload matching the API example exactly
      const payload = {
        school_id: Number(form.school_id),
        full_name: form.full_name,
        phone: form.phone,
        whatsapp_number: form.whatsapp_number,
        email: form.email,
        occupation: form.occupation,
        annual_income_range: form.annual_income_range,
        education_level: form.education_level,
        address_line1: form.address_line1,
        address_line2: form.address_line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode
      }

      const res = await axios.post(`${API_BASE_URL}/parents/register`, payload, {
        headers: { 'Content-Type': 'application/json' }
      })

      const successText = res.data?.message || 'Parent registered successfully.'
      // show SweetAlert2 toast (load from CDN if necessary)
      try {
        const Swal = await loadSwal()
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: successText,
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      } catch (err) {
        // fallback
        setMessage({ type: 'success', text: successText })
      }

      setForm(initialState)
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to register parent. Try again.'
      try {
        const Swal = await loadSwal()
        Swal.fire({ icon: 'error', title: 'Error', text: errMsg })
      } catch (e) {
        setMessage({ type: 'error', text: errMsg })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-white via-gray-50 to-gray-100 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Parent Registration</h2>
          <p className="text-sm text-gray-500 mt-1">Register parent details — we'll store and verify these with the school.</p>
        </div>
        <div className="px-3 py-2 bg-indigo-600 text-white rounded-md shadow">New</div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
              <select name="school_id" value={form.school_id} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100">
                <option value="">Select school</option>
                {sampleSchools.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.school_id && <p className="text-red-600 text-sm mt-1">{errors.school_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="full_name" placeholder="Rohit Sharma" value={form.full_name} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.full_name && <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input name="phone" type="tel" inputMode="numeric" placeholder="9876543210" value={form.phone} onChange={handleChange} maxLength={10} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input name="whatsapp_number" type="tel" placeholder="9876543210" value={form.whatsapp_number} onChange={handleChange} maxLength={10} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.whatsapp_number && <p className="text-red-600 text-sm mt-1">{errors.whatsapp_number}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" placeholder="rohit.parent@example.com" value={form.email} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input name="occupation" placeholder="Engineer" value={form.occupation} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.occupation && <p className="text-red-600 text-sm mt-1">{errors.occupation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income Range</label>
              <select name="annual_income_range" value={form.annual_income_range} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100">
                <option value="">Select range</option>
                <option value="5-7 LPA">5-7 LPA</option>
                <option value="3-5 LPA">3-5 LPA</option>
                <option value="1-3 LPA">1-3 LPA</option>
                <option value="<1 LPA">&lt;1 LPA</option>
                <option value=">7 LPA">&gt;7 LPA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select name="education_level" value={form.education_level} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100">
                <option value="">Select level</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Intermediate">Intermediate</option>
                <option value="High School">High School</option>
                <option value="Other">Other</option>
              </select>
              {errors.education_level && <p className="text-red-600 text-sm mt-1">{errors.education_level}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input name="address_line1" placeholder="Flat 203, Green Residency" value={form.address_line1} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.address_line1 && <p className="text-red-600 text-sm mt-1">{errors.address_line1}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input name="address_line2" placeholder="Sector 15" value={form.address_line2} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input name="city" placeholder="Pune" value={form.city} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input name="pincode" placeholder="411001" value={form.pincode} onChange={handleChange} maxLength={6} className="w-full border-gray-200 rounded p-2 focus:ring-2 focus:ring-indigo-100" />
              {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            <p className="font-semibold">API:</p>
            <p className="mt-1">POST <span className="font-mono">/api/parents/register</span></p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setForm(initialState); setErrors({}); setMessage(null) }} className="px-3 py-2 rounded-md border border-gray-200 text-gray-700 bg-white">
              Reset
            </button>

            <button type="submit" disabled={submitting} className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium shadow ${submitting ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600'}`}>
              {submitting ? 'Submitting...' : 'Register Parent'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

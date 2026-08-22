import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Compass, MapPin, User as UserIcon, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CameraCapture from '../components/common/CameraCapture'
import api from '../api/axios'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    additional_info: '',
    password: '',
    confirm_password: '',
    photo: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})
  const [locationCities, setLocationCities] = useState([])

  const countries = useMemo(() => [...new Set(locationCities.map(city => city.country).filter(Boolean))], [locationCities])
  const availableStates = []
  const availableCities = useMemo(() => locationCities.filter(city => city.country === form.country).map(city => city.name), [locationCities, form.country])

  useEffect(() => {
    api.get('/cities').then(res => setLocationCities(Array.isArray(res.data) ? res.data : [])).catch(() => setLocationCities([]))
  }, [])

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/

  const isEmailValid = useMemo(() => !form.email || emailRegex.test(form.email), [form.email])
  const isPhoneValid = useMemo(() => !form.phone || phoneRegex.test(form.phone.trim()), [form.phone])
  const isPasswordValid = useMemo(() => !form.password || form.password.length >= 8, [form.password])
  const passwordsMatch = form.password === form.confirm_password

  const update = (field) => (e) => {
    const val = e.target.value
    setForm(prev => {
      const next = { ...prev, [field]: val }
      if (field === 'country' && val !== prev.country) {
        next.state = ''
        next.city = ''
      }
      if (field === 'state' && val !== prev.state) {
        next.city = ''
      }
      return next
    })
  }

  const markTouched = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const setPhoto = (photoData) => {
    setForm(prev => ({ ...prev, photo: photoData }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreeTerms) {
      setError('Please accept the Terms and Conditions to register.')
      return
    }

    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (form.phone && form.phone.trim() !== '' && !phoneRegex.test(form.phone.trim())) {
      setError('Please enter a valid phone number (e.g. +1 555-0199 or 9876543210).')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check input values.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Dark 3D Wave Panel (Desktop Only — Matching Image 4) */}
        <div className="hidden lg:flex w-full h-[760px] rounded-3xl bg-[#18181B] bg-3d-waves relative overflow-hidden items-center justify-center p-12 text-white shadow-2xl border border-zinc-800">
          <div className="relative z-10 max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur shadow-inner">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
              Join the GlobeTrotter Community
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Create your free account to design personalized travel plans, capture user avatar photos, select dynamic locations, and collaborate with travelers worldwide.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-800 text-xs font-semibold border border-zinc-700 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> End-to-End Encrypted Registration
            </div>
          </div>
        </div>

        {/* Right Side: Form Container (Matching Image 4) */}
        <div className="w-full max-w-lg mx-auto py-6 px-2">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight mb-1">
              Join Us Today
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter your details to create your travel account.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Webcam Camera Photo Capture */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <CameraCapture photo={form.photo} setPhoto={setPhoto} />
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  required
                  className="input-field"
                  placeholder="John"
                  value={form.first_name}
                  onChange={update('first_name')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                <input
                  required
                  className="input-field"
                  placeholder="Doe"
                  value={form.last_name}
                  onChange={update('last_name')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your email *</label>
                <input
                  type="email"
                  required
                  className={`input-field ${touched.email && !isEmailValid ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                  placeholder="name@mail.com"
                  value={form.email}
                  onChange={update('email')}
                  onBlur={markTouched('email')}
                />
                {touched.email && !isEmailValid && (
                  <p className="text-[11px] text-rose-500 mt-1">Please enter a valid email format.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number</label>
                <input
                  type="tel"
                  className={`input-field ${touched.phone && !isPhoneValid ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                  placeholder="+1 555-0199 or 9876543210"
                  value={form.phone}
                  onChange={update('phone')}
                  onBlur={markTouched('phone')}
                />
                {touched.phone && !isPhoneValid && (
                  <p className="text-[11px] text-rose-500 mt-1">Invalid phone format (7-15 digits).</p>
                )}
              </div>
            </div>

            {/* Dynamic Cascading Location Selection */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" /> Location Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Country</label>
                  <input
                    list="signup-countries-list"
                    className="input-field py-2 text-xs"
                    placeholder="Type/Select Country..."
                    value={form.country}
                    onChange={update('country')}
                  />
                  <datalist id="signup-countries-list">
                    {countries.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
                  <input
                    list="signup-states-list"
                    className="input-field py-2 text-xs"
                    placeholder="Type/Select State..."
                    value={form.state}
                    onChange={update('state')}
                  />
                  <datalist id="signup-states-list">
                    {availableStates.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                  <input
                    list="signup-cities-list"
                    className="input-field py-2 text-xs"
                    placeholder="Type/Select City..."
                    value={form.city}
                    onChange={update('city')}
                  />
                  <datalist id="signup-cities-list">
                    {availableCities.map(ct => <option key={ct} value={ct} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className={`input-field pr-10 ${touched.password && !isPasswordValid ? 'border-rose-500 bg-rose-50/20' : ''}`}
                  placeholder="•••••••• (Min 8 characters)"
                  value={form.password}
                  onChange={update('password')}
                  onBlur={markTouched('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {touched.password && !isPasswordValid && (
                <p className="text-[11px] text-rose-500 mt-1">Password must be at least 8 characters.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={`input-field ${form.confirm_password && !passwordsMatch ? 'border-rose-500 bg-rose-50/20' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm_password}
                onChange={update('confirm_password')}
                autoComplete="new-password"
              />
              {form.confirm_password && <p className={`text-[11px] mt-1 ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>{passwordsMatch ? 'Passwords match.' : 'Passwords do not match.'}</p>}
            </div>

            {/* Checkbox: Terms */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="signup-terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="signup-terms" className="text-xs text-slate-600 cursor-pointer">
                I agree the{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('GlobeTrotter Travel Planner Terms and Conditions'); }} className="font-semibold text-slate-900 underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Main Action Button (Matching Image 4) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Compass className="w-4 h-4 animate-spin" /> REGISTERING...
                </>
              ) : (
                'REGISTER NOW'
              )}
            </button>

            {/* Social Buttons (Matching Image 4) */}
          </form>

          <p className="text-center text-xs text-slate-500 mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-slate-900 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Compass, MapPin, User as UserIcon, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CameraCapture from '../components/common/CameraCapture'
import { getCountries, getStates, getCities } from '../data/locationData'

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
    photo: ''
  })

  const [agreeTerms, setAgreeTerms] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  // Dynamic location options
  const countries = useMemo(() => getCountries(), [])
  const availableStates = useMemo(() => getStates(form.country), [form.country])
  const availableCities = useMemo(() => getCities(form.country, form.state), [form.country, form.state])

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[\+]?[0-9\s\-\(\)\.]{7,20}$/

  const isEmailValid = useMemo(() => !form.email || emailRegex.test(form.email), [form.email])
  const isPhoneValid = useMemo(() => !form.phone || phoneRegex.test(form.phone.trim()), [form.phone])
  const isPasswordValid = useMemo(() => !form.password || form.password.length >= 6, [form.password])

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

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                required
                className={`input-field ${touched.password && !isPasswordValid ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
                placeholder="•••••••• (Min 6 characters)"
                value={form.password}
                onChange={update('password')}
                onBlur={markTouched('password')}
              />
              {touched.password && !isPasswordValid && (
                <p className="text-[11px] text-rose-500 mt-1">Password must be at least 6 characters.</p>
              )}
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
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert('Social Google sign-in demo')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>

              <button
                type="button"
                onClick={() => alert('Social Twitter sign-in demo')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
              >
                <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>SIGN IN WITH TWITTER</span>
              </button>
            </div>
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

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Compass, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!agreeTerms) {
      setError('Please accept the Terms and Conditions to proceed.')
      return
    }

    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login('demo@globetrotter.com', 'Demo@123')
      navigate('/dashboard')
    } catch (err) {
      setError('Demo account error. Try registering a new account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Form Container (Matching Image 3) */}
        <div className="w-full max-w-md mx-auto py-6 px-4">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter your email and password to Sign In.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="name@mail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {/* Checkbox: Terms */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                I agree the{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert('GlobeTrotter Travel Planner Terms and Conditions'); }} className="font-semibold text-slate-900 underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Main Action Button (Matching Image 3) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Compass className="w-4 h-4 animate-spin" /> SIGNING IN...
                </>
              ) : (
                'SIGN IN'
              )}
            </button>

            {/* Checkbox: Newsletter & Forgot Password */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Subscribe me to newsletter</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('Demo login credentials: demo@globetrotter.com / Demo@123'); }}
                className="font-bold text-slate-900 hover:underline"
              >
                Forgot Password
              </a>
            </div>

            {/* Social Buttons (Matching Image 3) */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>SIGN IN WITH GOOGLE (DEMO)</span>
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition"
              >
                <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>SIGN IN WITH TWITTER</span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500 mt-8 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-slate-900 hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Auto-Seeded Demo: <strong className="text-slate-900">demo@globetrotter.com</strong> / <strong className="text-slate-900">Demo@123</strong></span>
          </div>
        </div>

        {/* Right Side: Dark 3D Wave Panel (Desktop Only — Matching Image 3) */}
        <div className="hidden lg:flex w-full h-[620px] rounded-3xl bg-[#18181B] bg-3d-waves relative overflow-hidden items-center justify-center p-12 text-white shadow-2xl border border-zinc-800">
          <div className="relative z-10 max-w-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur shadow-inner">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight mb-3">
              Explore the World with GlobeTrotter
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Build personalized multi-city itineraries, estimate daily trip budgets, dynamic location planning, and discover top travel activities.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Compass, Eye, EyeOff, MapPin, Plane, Globe, Mountain, UserCheck, Shield, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// Floating travel icon component
function FloatingIcon({ icon: Icon, className, delay }) {
  return (
    <div
      className={`absolute opacity-[0.07] animate-pulse ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
    >
      <Icon className="w-full h-full" />
    </div>
  )
}

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = (email, password) => async (e) => {
    e.preventDefault()
    setError('')
    setForm({ email, password })
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(`Quick login failed. Please register first.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden">

      {/* Subtle floating travel icons in background */}
      <FloatingIcon icon={Globe} className="w-32 h-32 top-10 left-10 text-slate-900" delay={0} />
      <FloatingIcon icon={Plane} className="w-24 h-24 top-20 right-20 text-slate-900 rotate-12" delay={1} />
      <FloatingIcon icon={Mountain} className="w-28 h-28 bottom-20 left-16 text-slate-900" delay={2} />
      <FloatingIcon icon={MapPin} className="w-20 h-20 bottom-32 right-32 text-slate-900" delay={0.5} />

      {/* Main Container */}
      <div className="w-full flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div
          className={`w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/60 bg-white transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >

          {/* ─── Left Panel: Dark Branding (2 cols on desktop) ─── */}
          <div className="lg:col-span-2 bg-[#18181B] bg-3d-waves relative flex flex-col items-center justify-center p-8 lg:p-12 text-white min-h-[200px] lg:min-h-[680px]">
            {/* Decorative gradient orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/[0.03] rounded-full blur-3xl" />

            <div className="relative z-10 text-center space-y-6">
              {/* Logo Mark */}
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto backdrop-blur-sm shadow-lg shadow-black/20">
                <Compass className="w-10 h-10 text-white" />
              </div>

              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight mb-2">
                  GlobeTrotter
                </h1>
                <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4" />
                <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Your intelligent travel companion. Plan multi-city trips, discover hidden gems, and explore the world.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-xs mx-auto">
                {[
                  { value: '50+', label: 'Cities' },
                  { value: '1K+', label: 'Activities' },
                  { value: '24/7', label: 'Planning' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Testimonial card */}
              <div className="hidden lg:block bg-white/[0.06] border border-white/10 rounded-2xl p-4 mt-6 backdrop-blur-sm">
                <p className="text-xs text-zinc-300 italic leading-relaxed">
                  "GlobeTrotter made planning our family trip across 5 cities effortless. The budget tracking saved us so much!"
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    SP
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white">Saumil Patel</p>
                    <p className="text-[9px] text-zinc-500">Travel Enthusiast</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right Panel: Login Form (3 cols on desktop) ─── */}
          <div className="lg:col-span-3 flex flex-col justify-center p-6 sm:p-10 lg:p-14">

            {/* Already logged in banner */}
            {user?.email && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm flex items-center justify-between">
                <span>Welcome back, <strong>{user.first_name || user.email}</strong></span>
                <Link to="/dashboard" className="btn-primary py-2 px-4 text-xs gap-1.5 no-underline">
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Welcome Back</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to access your travel dashboard.
              </p>
            </div>

            {/* Quick Test Accounts */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleQuickLogin('demo@globetrotter.com', 'Demo@123')}
                className="group flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-800">Demo User</p>
                  <p className="text-[10px] text-slate-400">Quick test access</p>
                </div>
              </button>
              <button
                type="button"
                onClick={handleQuickLogin('admin@globetrotter.com', 'Admin@123')}
                className="group flex items-center gap-3 p-3.5 bg-[#18181B] hover:bg-black border border-zinc-700 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Admin User</p>
                  <p className="text-[10px] text-zinc-500">Admin dashboard</p>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">or sign in with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-3 text-sm bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-2xl animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ email: 'demo@globetrotter.com', password: 'Demo@123' })
                    }}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field pr-12"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-[#18181B] hover:bg-black text-white text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Compass className="w-5 h-5 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Sign In */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleQuickLogin('demo@globetrotter.com', 'Demo@123')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all hover:shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={handleQuickLogin('demo@globetrotter.com', 'Demo@123')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all hover:shadow-sm"
              >
                <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>
            </div>

            {/* Register link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-slate-900 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Footer credentials hint */}
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>Demo: <strong className="text-slate-600">demo@globetrotter.com</strong> / <strong className="text-slate-600">Demo@123</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

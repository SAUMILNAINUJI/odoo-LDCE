import { Link, useLocation } from 'react'
import { Search, Bell, Settings, Menu, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ title, subtitle, onOpenMobileSidebar }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  // Generate breadcrumb path
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const currentPath = pathSegments[pathSegments.length - 1] || 'Home'
  const formattedPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1)

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pt-2">
      {/* Left: Breadcrumbs & Title (Matching Screenshots) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-0.5">
            <Link to="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{formattedPath}</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title || formattedPath}</h1>
          {subtitle && <p className="text-xs text-slate-500 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Search, Actions & Profile Link */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Search Bar (Matching Screenshot Header) */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Notifications & Settings icons */}
        <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 relative" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
        </button>

        <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50" title="Settings">
          <Settings className="w-4 h-4" />
        </button>

        {/* User Auth Link / Logout */}
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{user.first_name}</span>
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold hover:bg-black transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  )
}

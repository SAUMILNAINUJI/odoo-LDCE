import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, MapPin, Compass, Users, Heart, X, Globe2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { user } = useAuth()

  const mainLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'My Trips', path: '/trips', icon: Compass },
    { label: 'City Search', path: '/cities', icon: MapPin },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Saved Places', path: '/saved', icon: Heart },
  ]

  const SidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#18181B] text-white rounded-2xl border border-zinc-800 shadow-xl">
      <div>
        {/* Brand Logo & Mobile Close */}
        <div className="flex items-center justify-between pb-6 pt-2 px-2 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-[#18181B] flex items-center justify-center font-bold shadow-md">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold tracking-tight text-white">GlobeTrotter</h1>
              <p className="text-[10px] text-zinc-400">Material Tailwind Travel</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Links */}
        <div className="space-y-1 mb-8">
          {mainLinks.map((item) => {
            const Icon = item.icon
            const isActive = item.path === '/dashboard'
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-md font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

      </div>

      {/* User Footer Indicator */}
      {user && (
        <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden border border-zinc-700">
            {user.photo ? (
              <img src={user.photo} alt="User avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{user.first_name?.[0]}</span>
            )}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{user.first_name} {user.last_name}</p>
            <p className="text-[10px] text-zinc-400 capitalize">{user.role} Account</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed Left Floating Panel) */}
      <aside className="hidden md:block w-56 fixed left-4 top-4 bottom-4 z-40">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-72 h-full p-4 bg-transparent z-10">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

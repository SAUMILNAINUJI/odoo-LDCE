import { Link, useLocation } from 'react-router-dom'
import { Heart, LayoutDashboard, Compass, Search, Users, User } from 'lucide-react'

export default function MobileBottomNav() {
  const location = useLocation()

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Trips', path: '/trips', icon: Compass },
    { label: 'Search', path: '/cities', icon: Search },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Saved', path: '/saved', icon: Heart }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#18181B] text-white border-t border-zinc-800 md:hidden px-1 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.path === '/dashboard'
          ? location.pathname === item.path
          : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-white bg-zinc-800 font-bold scale-105'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

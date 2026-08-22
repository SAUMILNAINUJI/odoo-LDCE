import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, MapPin, Activity, LogOut, X, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { logout } = useAuth()
  const links = [
    { label: 'Overview', path: '/admin', icon: BarChart3 },
    { label: 'Users', path: '/admin?tab=users', icon: Users },
    { label: 'Destinations', path: '/admin?tab=destinations', icon: MapPin },
    { label: 'Analytics', path: '/admin?tab=analytics', icon: Activity }
  ]
  const isActive = (path) => path === '/admin'
    ? location.pathname === '/admin' && !location.search
    : location.pathname === '/admin' && location.search === path.split('?')[1] ? true : false

  const content = (
    <div className="h-full flex flex-col p-4 bg-[#18181B] text-white rounded-2xl border border-zinc-800 shadow-xl">
      <div className="flex items-center justify-between px-2 pb-6 border-b border-zinc-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-zinc-950 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></div>
          <div><p className="font-bold text-sm">GlobeTrotter</p><p className="text-[10px] text-zinc-400">Admin Panel</p></div>
        </div>
        {onClose && <button onClick={onClose} className="md:hidden p-1 text-zinc-400" aria-label="Close menu"><X className="w-5 h-5" /></button>}
      </div>
      <nav className="space-y-1">
        {links.map(({ label, path, icon: Icon }) => (
          <Link key={label} to={path} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${isActive(path) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <Icon className="w-4 h-4" /><span>{label}</span>
          </Link>
        ))}
      </nav>
      <button onClick={logout} className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-rose-950/40 hover:text-rose-300" title="Sign out">
        <LogOut className="w-4 h-4" /><span>Sign Out</span>
      </button>
    </div>
  )

  return <>
    <aside className="hidden md:block w-56 fixed left-4 top-4 bottom-4 z-40">{content}</aside>
    {isOpen && <div className="md:hidden fixed inset-0 z-50 flex"><div className="fixed inset-0 bg-black/60" onClick={onClose} /><div className="relative w-72 h-full p-4 z-10">{content}</div></div>}
  </>
}

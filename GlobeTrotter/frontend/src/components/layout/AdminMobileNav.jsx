import { Link, useLocation } from 'react-router-dom'
import { BarChart3, Users, MapPin, Activity } from 'lucide-react'

export default function AdminMobileNav() {
  const location = useLocation()
  const items = [
    { label: 'Overview', path: '/admin', icon: BarChart3 },
    { label: 'Users', path: '/admin?tab=users', icon: Users },
    { label: 'Destinations', path: '/admin?tab=destinations', icon: MapPin },
    { label: 'Analytics', path: '/admin?tab=analytics', icon: Activity }
  ]
  return <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#18181B] text-white border-t border-zinc-800 md:hidden px-2 py-2 flex justify-around">
    {items.map(({ label, path, icon: Icon }) => {
      const active = path === '/admin' ? !location.search : location.search === path.split('?')[1]
      return <Link key={label} to={path} className={`flex flex-col items-center gap-1 text-[10px] py-1 px-2 rounded-xl ${active ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}><Icon className="w-5 h-5" /><span>{label}</span></Link>
    })}
  </nav>
}

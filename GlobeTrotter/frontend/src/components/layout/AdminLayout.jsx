import { useState } from 'react'
import { Menu, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminMobileNav from './AdminMobileNav'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout({ children, title, subtitle }) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  return <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
    <AdminSidebar isOpen={open} onClose={() => setOpen(false)} />
    <div className="flex-1 w-full md:ml-60 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 md:pb-8">
      <header className="flex items-center justify-between gap-4 mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="md:hidden p-2 rounded-xl bg-white border border-slate-200" aria-label="Open admin menu"><Menu className="w-5 h-5" /></button>
          <div><p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Admin Panel</p><h1 className="text-xl font-bold text-slate-900">{title}</h1>{subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}</div>
        </div>
        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold"><User className="w-4 h-4" />{user?.first_name}</Link>
      </header>
      <main className="animate-fadeIn">{children}</main>
    </div>
    <AdminMobileNav />
  </div>
}

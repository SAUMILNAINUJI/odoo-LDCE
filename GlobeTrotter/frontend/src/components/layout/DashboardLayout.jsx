import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import MobileBottomNav from './MobileBottomNav'

export default function DashboardLayout({ children, title, subtitle }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex-1 md:pl-72 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
        <Navbar title={title} subtitle={subtitle} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
        <main className="animate-fadeIn">
          {children}
        </main>
      </div>

      {/* Handheld Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}

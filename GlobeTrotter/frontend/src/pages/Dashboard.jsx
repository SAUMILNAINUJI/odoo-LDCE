import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlaneTakeoff, Wallet, MapPin, Compass, ArrowRight, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/layout/DashboardLayout'
import TripCard from '../components/common/TripCard'
import CityCard from '../components/common/CityCard'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState({ ongoing: [], upcoming: [], completed: [] })
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [tripsRes, citiesRes] = await Promise.all([
          api.get('/trips').catch(() => ({ data: { ongoing: [], upcoming: [], completed: [] } })),
          api.get('/cities').catch(() => ({ data: [] }))
        ])
        setTrips(tripsRes.data && typeof tripsRes.data === 'object' && !Array.isArray(tripsRes.data) ? tripsRes.data : { ongoing: [], upcoming: [], completed: [] })
        setCities(Array.isArray(citiesRes.data) ? citiesRes.data.slice(0, 4) : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const ongoingTrips = Array.isArray(trips?.ongoing) ? trips.ongoing : []
  const upcomingTrips = Array.isArray(trips?.upcoming) ? trips.upcoming : []
  const completedTrips = Array.isArray(trips?.completed) ? trips.completed : []
  const allTrips = [...ongoingTrips, ...upcomingTrips, ...completedTrips]

  // Mock charts data matching Image 1
  const websiteViewData = [
    { day: 'M', view: 45 },
    { day: 'T', view: 6 },
    { day: 'W', view: 2 },
    { day: 'T', view: 0 },
    { day: 'F', view: 0 },
    { day: 'S', view: 0 },
    { day: 'S', view: 0 }
  ]

  const dailySalesData = [
    { month: 'Apr', sales: 50 },
    { month: 'May', sales: 40 },
    { month: 'Jun', sales: 300 },
    { month: 'Jul', sales: 320 },
    { month: 'Aug', sales: 500 },
    { month: 'Sep', sales: 350 },
    { month: 'Oct', sales: 200 },
    { month: 'Nov', sales: 230 },
    { month: 'Dec', sales: 500 }
  ]

  const completedTasksData = [
    { month: 'Apr', tasks: 50 },
    { month: 'May', tasks: 40 },
    { month: 'Jun', tasks: 300 },
    { month: 'Jul', tasks: 220 },
    { month: 'Aug', tasks: 500 },
    { month: 'Sep', tasks: 250 },
    { month: 'Oct', tasks: 400 },
    { month: 'Nov', tasks: 230 },
    { month: 'Dec', tasks: 500 }
  ]

  return (
    <DashboardLayout title="Home" subtitle={`Welcome back, ${user?.first_name}!`}>
      
      {/* Metric Stats Row (Problem Statement Requirements: Upcoming Trips, Popular Cities, Quick Actions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Card 1: Upcoming Trips */}
        <div className="card p-5 border border-slate-200 relative overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => navigate('/trips')}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#18181B] text-white rounded-2xl shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">Upcoming Trips</p>
              <h3 className="font-display text-2xl font-bold text-slate-900">{upcomingTrips.length || allTrips.length}</h3>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1">View Itineraries <ArrowRight className="w-3 h-3" /></span>
            <span className="text-slate-400">Active</span>
          </div>
        </div>

        {/* Card 2: Popular Destinations */}
        <div className="card p-5 border border-slate-200 relative overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => navigate('/cities')}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#18181B] text-white rounded-2xl shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">Popular Cities</p>
              <h3 className="font-display text-2xl font-bold text-slate-900">{cities.length || 8}</h3>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1">Explore Cities <ArrowRight className="w-3 h-3" /></span>
            <span className="text-slate-400">Global</span>
          </div>
        </div>

        {/* Card 3: Total Itineraries */}
        <div className="card p-5 border border-slate-200 relative overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => navigate('/trips/new')}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#18181B] text-white rounded-2xl shadow-md">
              <PlaneTakeoff className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">Plan New Trip</p>
              <h3 className="font-display text-2xl font-bold text-slate-900">+ Create</h3>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1">Multi-City Builder <ArrowRight className="w-3 h-3" /></span>
            <span className="text-slate-400">Custom</span>
          </div>
        </div>

        {/* Card 4: Trip Budget Highlights */}
        <div className="card p-5 border border-slate-200 relative overflow-hidden flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => navigate('/trips')}>
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#18181B] text-white rounded-2xl shadow-md">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500">Budget Breakdown</p>
              <h3 className="font-display text-2xl font-bold text-slate-900">Track $</h3>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1">Expense Highlights <ArrowRight className="w-3 h-3" /></span>
            <span className="text-slate-400">Budget</span>
          </div>
        </div>

      </div>

      {/* 3 Recharts Analytics Cards Row (Matching Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Chart 1: Website View (Green Bar Chart) */}
        <div className="card p-6 border border-slate-200">
          <div className="w-full h-44 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <BarChart data={websiteViewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip />
                <Bar dataKey="view" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Website View</h4>
            <p className="text-xs text-slate-500 mt-0.5">Last Campaign Performance</p>
          </div>
        </div>

        {/* Chart 2: Daily Sales (Blue Line Chart) */}
        <div className="card p-6 border border-slate-200">
          <div className="w-full h-44 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#0284C7" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Daily Sales</h4>
            <p className="text-xs text-slate-500 mt-0.5">(+15%) increase in today sales.</p>
          </div>
        </div>

        {/* Chart 3: Completed Tasks (Green Line Chart) */}
        <div className="card p-6 border border-slate-200">
          <div className="w-full h-44 min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={180}>
              <LineChart data={completedTasksData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#16A34A" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Completed Tasks</h4>
            <p className="text-xs text-slate-500 mt-0.5">just updated</p>
          </div>
        </div>

      </div>

      {/* Action Banner */}
      <div className="rounded-2xl bg-[#18181B] bg-3d-waves text-white p-6 sm:p-8 mb-8 relative overflow-hidden border border-zinc-800 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <h2 className="font-display text-xl font-bold mb-1">Plan a Custom Multi-City Journey</h2>
            <p className="text-xs text-zinc-400">Add destinations, arrange day-by-day activities, and track travel expenses.</p>
          </div>
          <button
            onClick={() => navigate('/trips/new')}
            className="bg-white text-slate-900 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-slate-100 transition shrink-0 shadow-md"
          >
            <PlaneTakeoff className="w-4 h-4 text-slate-900" /> Plan New Trip
          </button>
        </div>
      </div>

      {/* User Trips Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-slate-900">Recent Itineraries</h3>
        <button onClick={() => navigate('/trips')} className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:underline">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-xs mb-8">Loading itineraries...</p>
      ) : allTrips.length === 0 ? (
        <div className="card p-8 text-center mb-8 border border-slate-200">
          <p className="text-xs text-slate-500 mb-3">No trips planned yet.</p>
          <button onClick={() => navigate('/trips/new')} className="btn-primary">Plan your first trip</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {allTrips.slice(0, 3).map(trip => <TripCard key={trip.id} trip={trip} />)}
        </div>
      )}

      {/* Featured Cities Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-base text-slate-900">Popular Travel Destinations</h3>
        <button onClick={() => navigate('/cities')} className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:underline">
          Explore all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cities.map(city => <CityCard key={city.id} city={city} />)}
      </div>

    </DashboardLayout>
  )
}

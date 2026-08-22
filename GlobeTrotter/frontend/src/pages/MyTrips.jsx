import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import TripCard from '../components/common/TripCard'
import api from '../api/axios'

const sections = [
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' }
]

export default function MyTrips() {
  const [trips, setTrips] = useState({ ongoing: [], upcoming: [], completed: [] })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips').then(res => setTrips(res.data)).finally(() => setLoading(false))
  }, [])

  const filterTrips = (list) => list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout title="My Trips" subtitle="All your travel plans in one place">
      <div className="flex items-center gap-3 mb-6">
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your trips..." className="input-field max-w-xs"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading trips...</p>
      ) : (
        sections.map(({ key, label }) => {
          const list = filterTrips(trips[key] || [])
          return (
            <div key={key} className="mb-8">
              <h3 className="font-display font-semibold text-lg text-navy-900 mb-4">{label}</h3>
              {list.length === 0 ? (
                <p className="text-sm text-slate-400">No {label.toLowerCase()} trips.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
              )}
            </div>
          )
        })
      )}
    </DashboardLayout>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Globe2, CalendarDays } from 'lucide-react'
import api from '../api/axios'

export default function PublicItinerary() {
  const { token } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/trips/public/${token}`)
      .then(res => setTrip(res.data))
      .catch(() => setError('This itinerary is not available or is no longer public.'))
  }, [token])

  if (error) return <div className="min-h-screen flex items-center justify-center text-slate-500">{error}</div>
  if (!trip) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading itinerary...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-hero-gradient py-14 px-6 text-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 backdrop-blur">
          <Globe2 className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-bold">{trip.name}</h1>
        <p className="text-white/80 mt-2">Shared by {trip.User?.first_name} {trip.User?.last_name}</p>
        <p className="text-white/70 text-sm mt-1 flex items-center justify-center gap-1.5">
          <CalendarDays className="w-4 h-4" /> {trip.start_date} — {trip.end_date}
        </p>
      </div>

      <div className="max-w-3xl mx-auto p-6 -mt-8">
        {trip.description && <div className="card p-6 mb-6"><p className="text-slate-600 text-sm">{trip.description}</p></div>}

        {trip.Stops?.map(stop => (
          <div key={stop.id} className="card p-6 mb-6">
            <h3 className="font-display font-bold text-lg text-navy-900 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-500" /> {stop.City?.name}, {stop.City?.country}
            </h3>
            <div className="space-y-2">
              {stop.StopActivities?.map(sa => (
                <div key={sa.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{sa.Activity?.name}</p>
                    <p className="text-xs text-slate-400">Day {sa.day_number} • {sa.Activity?.category}</p>
                  </div>
                  <span className="font-display font-bold text-navy-900">${sa.cost}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs text-slate-400 mt-8">Powered by GlobeTrotter — Personalized Travel Planning</p>
      </div>
    </div>
  )
}

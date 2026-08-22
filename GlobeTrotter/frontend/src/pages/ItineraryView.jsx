import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Wallet, Share2, Copy, CheckCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

export default function ItineraryView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    api.get(`/trips/${id}`).then(res => setTrip(res.data))
  }, [id])

  const togglePublic = async () => {
    const { data } = await api.put(`/trips/${id}`, { is_public: !trip.is_public })
    setTrip({ ...trip, is_public: data.is_public })
  }

  const copyLink = () => {
    const url = `${window.location.origin}/share/${trip.share_token}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!trip) return <DashboardLayout title="Itinerary"><p className="text-slate-400 text-sm">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout title={trip.name} subtitle="Day-wise itinerary for your selected trip">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <button onClick={() => navigate(`/trips/${id}/build`)} className="btn-secondary text-sm">Edit Itinerary</button>
          <button onClick={() => navigate(`/trips/${id}/budget`)} className="btn-secondary text-sm">
            <Wallet className="w-4 h-4" /> Budget Breakdown
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={togglePublic} className="btn-secondary text-sm">
            <Share2 className="w-4 h-4" /> {trip.is_public ? 'Public' : 'Make Public'}
          </button>
          {trip.is_public && (
            <button onClick={copyLink} className="btn-primary text-sm">
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied!' : 'Copy Share Link'}
            </button>
          )}
        </div>
      </div>

      {trip.Stops?.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-500">No sections added yet.</p>
          <button onClick={() => navigate(`/trips/${id}/build`)} className="btn-primary mx-auto mt-4">Start Building</button>
        </div>
      )}

      {trip.Stops?.map((stop, idx) => {
        const byDay = {}
        stop.StopActivities?.forEach(sa => {
          const d = sa.day_number || 1
          byDay[d] = byDay[d] || []
          byDay[d].push(sa)
        })
        const days = Object.keys(byDay).sort((a, b) => a - b)

        return (
          <div key={stop.id} className="card p-6 mb-6">
            <h3 className="font-display font-bold text-lg text-navy-900 flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-500" /> {stop.City?.name}, {stop.City?.country}
            </h3>
            {days.length === 0 ? (
              <p className="text-sm text-slate-400">No activities planned for this section yet.</p>
            ) : days.map(day => (
              <div key={day} className="mb-5">
                <span className="badge bg-brand-50 text-brand-600 mb-3">Day {day}</span>
                <div className="mt-2 space-y-2">
                  {byDay[day].map(sa => (
                    <div key={sa.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-navy-900">{sa.Activity?.name}</p>
                        <p className="text-xs text-slate-400">{sa.time_slot || 'Flexible'} • {sa.Activity?.category}</p>
                      </div>
                      <span className="font-display font-bold text-navy-900">${sa.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </DashboardLayout>
  )
}

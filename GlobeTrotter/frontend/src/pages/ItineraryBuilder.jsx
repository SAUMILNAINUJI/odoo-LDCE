import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { PlusCircle, Trash2, MapPin, Search, X, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

export default function ItineraryBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [trip, setTrip] = useState(null)
  const [cities, setCities] = useState([])
  const [activityPanel, setActivityPanel] = useState(null) // stop id currently browsing activities for
  const [activities, setActivities] = useState([])
  const [newStop, setNewStop] = useState({ city_id: '', start_date: '', end_date: '', budget: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTrip = async () => {
    const { data } = await api.get(`/trips/${id}`)
    setTrip(data)
  }

  useEffect(() => {
    (async () => {
      try {
        await loadTrip()
        const { data } = await api.get('/cities')
        setCities(data)
        const cityId = params.get('city_id')
        if (cityId) setNewStop(prev => ({ ...prev, city_id: cityId, start_date: data ? '' : prev.start_date }))
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const addSection = async (e) => {
    e.preventDefault()
    setError('')
    if (!newStop.city_id || !newStop.start_date || !newStop.end_date) {
      setError('City, start date, and end date are required.')
      return
    }
    if (new Date(newStop.start_date) > new Date(newStop.end_date)) {
      setError('Stop end date must be greater than or equal to start date.')
      return
    }
    if (new Date(newStop.start_date) < new Date(trip.start_date) || new Date(newStop.end_date) > new Date(trip.end_date)) {
      setError(`Stop dates must be within the trip range (${trip.start_date} to ${trip.end_date}).`)
      return
    }
    try {
      await api.post(`/trips/${id}/stops`, { ...newStop, order_index: trip.Stops?.length || 0 })
      setNewStop({ city_id: '', start_date: '', end_date: '', budget: '' })
      loadTrip()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add section.')
    }
  }

  const removeStop = async (stopId) => {
    await api.delete(`/trips/stops/${stopId}`)
    loadTrip()
  }

  const openActivityPanel = async (stopId, cityId) => {
    setActivityPanel(stopId)
    const { data } = await api.get(`/activities?city_id=${cityId}`)
    setActivities(data)
  }

  const addActivityToStop = async (activity) => {
    await api.post(`/trips/stops/${activityPanel}/activities`, {
      activity_id: activity.id, day_number: 1, cost: activity.cost, time_slot: 'Flexible'
    })
    loadTrip()
  }

  const removeStopActivity = async (entryId) => {
    await api.delete(`/trips/stops/activities/${entryId}`)
    loadTrip()
  }

  if (loading || !trip) return <DashboardLayout title="Build Itinerary"><p className="text-slate-400 text-sm">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout title={`Build Itinerary — ${trip.name}`} subtitle="Add sections (cities), assign dates & budget, then attach activities">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {trip.Stops?.map((stop, idx) => (
            <div key={stop.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide">Section {idx + 1}</p>
                  <h3 className="font-display font-bold text-lg text-navy-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-500" /> {stop.City?.name}, {stop.City?.country}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{stop.start_date} to {stop.end_date} • Budget: ${stop.budget}</p>
                </div>
                <button onClick={() => removeStop(stop.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {stop.StopActivities?.length === 0 && <p className="text-xs text-slate-400">No activities added yet for this section.</p>}
                {stop.StopActivities?.map(sa => (
                  <div key={sa.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{sa.Activity?.name}</p>
                      <p className="text-xs text-slate-400">Day {sa.day_number} • ${sa.cost}</p>
                    </div>
                    <button onClick={() => removeStopActivity(sa.id)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => openActivityPanel(stop.id, stop.city_id)}
                className="btn-secondary text-sm w-full"
              >
                <Search className="w-4 h-4" /> Browse activities for {stop.City?.name}
              </button>

              {activityPanel === stop.id && (
                <div className="mt-4 border-t border-slate-100 pt-4 max-h-64 overflow-y-auto space-y-2">
                  {activities.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-navy-900">{a.name}</p>
                        <p className="text-xs text-slate-400">{a.category} • {a.duration_hours}h • ${a.cost}</p>
                      </div>
                      <button onClick={() => addActivityToStop(a)} className="text-brand-600 hover:text-brand-700">
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <form onSubmit={addSection} className="card p-5 border-dashed border-2 border-slate-200">
            <p className="font-display font-semibold text-navy-900 mb-3 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-brand-500" /> Add another Section
            </p>
            {error && (
              <div className="mb-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 px-3 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <select required className="input-field col-span-2" value={newStop.city_id} onChange={(e) => setNewStop({ ...newStop, city_id: e.target.value })}>
                <option value="">Select a city</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}, {c.country}</option>)}
              </select>
              <input type="date" className="input-field" value={newStop.start_date} onChange={(e) => setNewStop({ ...newStop, start_date: e.target.value })} />
              <input type="date" className="input-field" value={newStop.end_date} onChange={(e) => setNewStop({ ...newStop, end_date: e.target.value })} />
              <input type="number" placeholder="Budget for this section" className="input-field col-span-2" value={newStop.budget} onChange={(e) => setNewStop({ ...newStop, budget: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary w-full mt-3">Add Section</button>
          </form>
        </div>

        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display font-semibold text-navy-900 mb-4">Trip Summary</h3>
          <p className="text-sm text-slate-500 mb-1">{trip.Stops?.length || 0} sections added</p>
          <p className="text-sm text-slate-500 mb-4">{trip.start_date} → {trip.end_date}</p>
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-primary w-full mb-2">View Full Itinerary</button>
          <button onClick={() => navigate(`/trips/${id}/budget`)} className="btn-secondary w-full">View Budget Breakdown</button>
        </div>
      </div>
    </DashboardLayout>
  )
}

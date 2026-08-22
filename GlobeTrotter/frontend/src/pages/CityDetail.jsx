import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, TrendingUp, Wallet } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ActivityCard from '../components/common/ActivityCard'
import api from '../api/axios'

export default function CityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [city, setCity] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [cityResponse, activityResponse] = await Promise.all([
          api.get(`/cities/${id}`),
          api.get('/activities', { params: { city_id: id } })
        ])
        setCity(cityResponse.data)
        setActivities(Array.isArray(activityResponse.data) ? activityResponse.data : [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this destination.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <DashboardLayout title="Destination"><p className="text-sm text-slate-500">Loading destination...</p></DashboardLayout>
  if (error || !city) return <DashboardLayout title="Destination"><div className="card p-8 text-center text-sm text-rose-600">{error || 'Destination not found.'}</div></DashboardLayout>

  return <DashboardLayout title={city.name} subtitle={`${city.country} · destination overview`}>
    <button onClick={() => navigate('/cities')} className="btn-secondary mb-5"><ArrowLeft className="w-4 h-4" /> Back to destinations</button>
    <section className="overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-lg">
      <div className="relative aspect-[16/6] min-h-52 bg-zinc-800">
        {city.image_url && <img src={city.image_url} alt={`${city.name}, ${city.country}`} className="h-full w-full object-cover opacity-80" />}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs text-zinc-300"><MapPin className="w-4 h-4" />{city.country}</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{city.name}</h1>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
        <div><p className="text-xs text-zinc-400">Popularity</p><p className="mt-1 flex items-center gap-2 font-bold"><TrendingUp className="w-4 h-4 text-teal-400" />{city.popularity}/100</p></div>
        <div><p className="text-xs text-zinc-400">Cost index</p><p className="mt-1 flex items-center gap-2 font-bold"><Wallet className="w-4 h-4 text-amber-400" />{city.cost_index}/100</p></div>
        <div><p className="text-xs text-zinc-400">Activities</p><p className="mt-1 flex items-center gap-2 font-bold"><CalendarDays className="w-4 h-4 text-sky-400" />{activities.length} available</p></div>
      </div>
    </section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="card p-6"><h2 className="font-display text-lg font-bold text-slate-900">About {city.name}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{city.description || 'Destination information is being prepared from the application catalog.'}</p><h2 className="mt-8 font-display text-lg font-bold text-slate-900">Things to do</h2>{activities.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}</div> : <p className="mt-4 text-sm text-slate-500">No activities have been added for this destination yet.</p>}</section>
      <aside className="card h-fit p-6 lg:sticky lg:top-6"><h2 className="font-display text-lg font-bold text-slate-900">Plan this destination</h2><p className="mt-2 text-sm leading-6 text-slate-500">Start a trip with {city.name} preselected, then add dates, stops, and activities from the catalog.</p><button onClick={() => navigate(`/trips/new?city_id=${city.id}`)} className="btn-primary mt-5 w-full">Plan a trip</button></aside>
    </div>
  </DashboardLayout>
}

import { useEffect, useState } from 'react'
import { Heart, MapPin, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import api from '../api/axios'

export default function SavedPlaces() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/discovery/favorites')
      setSaved(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load saved places.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (item) => {
    await api.post('/discovery/favorites', { entity_type: item.entity_type, entity_id: item.entity_id })
    setSaved(current => current.filter(entry => entry.id !== item.id))
  }

  return <DashboardLayout title="Saved Places" subtitle="Your destinations and experiences saved from the catalog">
    {loading && <p className="text-sm text-slate-500">Loading saved places...</p>}
    {error && <div className="card p-5 text-sm text-rose-600">{error}</div>}
    {!loading && !error && saved.length === 0 && <div className="card p-10 text-center"><Heart className="mx-auto h-8 w-8 text-slate-300" /><h2 className="mt-3 font-display font-bold text-slate-900">No saved places yet</h2><p className="mt-1 text-sm text-slate-500">Explore destinations and save the ones that fit your next trip.</p><button onClick={() => navigate('/cities')} className="btn-primary mt-5">Explore destinations</button></div>}
    {!loading && saved.length > 0 && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{saved.map(entry => <article key={entry.id} className="card overflow-hidden"><div className="aspect-[16/10] bg-slate-100">{entry.item?.image_url && <img src={entry.item.image_url} alt={entry.item.name} className="h-full w-full object-cover" />}</div><div className="p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{entry.entity_type}</p><h2 className="mt-1 font-display font-bold text-slate-900">{entry.item?.name || 'Saved item'}</h2>{entry.entity_type === 'city' && <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" />{entry.item.country}</p>}<div className="mt-4 flex items-center justify-between"><button onClick={() => entry.entity_type === 'city' ? navigate(`/cities/${entry.entity_id}`) : navigate('/activities')} className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">Explore <ArrowUpRight className="h-3.5 w-3.5" /></button><button onClick={() => remove(entry)} className="text-xs font-semibold text-rose-600">Remove</button></div></div></article>)}</div>}
  </DashboardLayout>
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BedDouble, Bus, CalendarDays, Heart, MapPin, TrendingUp, Utensils, Wallet } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import ActivityCard from '../components/common/ActivityCard'
import api from '../api/axios'
import useFavorite from '../hooks/useFavorite'

export default function CityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [city, setCity] = useState(null)
  const [activities, setActivities] = useState([])
  const [points, setPoints] = useState([])
  const [reviews, setReviews] = useState([])
  const { saved, saving, toggleFavorite } = useFavorite('city', id)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [cityResponse, activityResponse, pointsResponse, reviewsResponse] = await Promise.all([
          api.get(`/cities/${id}`),
          api.get('/activities', { params: { city_id: id } }),
          api.get(`/discovery/cities/${id}/points-of-interest`),
          api.get(`/discovery/reviews/${id}`)
        ])
        setCity(cityResponse.data)
        setActivities(Array.isArray(activityResponse.data) ? activityResponse.data : [])
        setPoints(Array.isArray(pointsResponse.data) ? pointsResponse.data : [])
        setReviews(Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [])
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load this destination.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const submitReview = async (event) => {
    event.preventDefault()
    setReviewError('')
    try {
      const { data } = await api.post(`/discovery/reviews/${id}`, { entity_type: 'city', ...reviewForm })
      setReviews(current => [data, ...current])
      setReviewForm({ rating: 5, comment: '' })
    } catch (requestError) {
      setReviewError(requestError.response?.data?.message || 'Unable to submit review.')
    }
  }

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
          <div className="flex items-center justify-between gap-4"><h1 className="mt-1 font-display text-3xl font-bold">{city.name}</h1><button onClick={toggleFavorite} disabled={saving} className="rounded-full bg-white/15 p-3 hover:bg-white/25" title={saved ? 'Remove from saved places' : 'Save destination'}><Heart className={`h-5 w-5 ${saved ? 'fill-rose-400 text-rose-400' : 'text-white'}`} /></button></div>
        </div>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
        <div><p className="text-xs text-zinc-400">Popularity</p><p className="mt-1 flex items-center gap-2 font-bold"><TrendingUp className="w-4 h-4 text-teal-400" />{city.popularity}/100</p></div>
        <div><p className="text-xs text-zinc-400">Cost index</p><p className="mt-1 flex items-center gap-2 font-bold"><Wallet className="w-4 h-4 text-amber-400" />{city.cost_index}/100</p></div>
        <div><p className="text-xs text-zinc-400">Activities</p><p className="mt-1 flex items-center gap-2 font-bold"><CalendarDays className="w-4 h-4 text-sky-400" />{activities.length} available</p></div>
      </div>
    </section>
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <section className="card p-6 lg:col-span-2"><h2 className="font-display text-lg font-bold text-slate-900">Best for this trip</h2><div className="mt-4 flex flex-wrap gap-2">{city.tags?.split(',').map(tag => <span key={tag} className="badge bg-slate-100 text-slate-700">{tag}</span>)}{city.family_friendly && <span className="badge bg-emerald-50 text-emerald-700">Family friendly</span>}{city.couple_friendly && <span className="badge bg-rose-50 text-rose-700">Couple friendly</span>}{city.child_friendly && <span className="badge bg-sky-50 text-sky-700">Child friendly</span>}</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{city.family_friendly ? 'Excellent' : 'Good'} for families</div><div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{city.couple_friendly ? 'Excellent' : 'Good'} for couples</div><div className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">{city.child_friendly ? 'Excellent' : 'Good'} for children</div></div></section>
      <aside className="card p-6"><h2 className="font-display text-lg font-bold text-slate-900">Travel tip</h2><p className="mt-3 text-sm leading-6 text-slate-600">{city.travel_tip || 'Check local conditions and carry comfortable walking shoes.'}</p><p className="mt-4 text-xs text-slate-500">Recommended duration: {city.recommended_duration} days</p></aside>
    </div>
    <div className="mt-6 grid gap-5 md:grid-cols-3">
      <PoiSection title="Hotels" icon={BedDouble} tone="brand" points={points.filter(point => point.type === 'hotel')} />
      <PoiSection title="Restaurants" icon={Utensils} tone="amber" points={points.filter(point => point.type === 'restaurant')} />
      <PoiSection title="Transport" icon={Bus} tone="teal" points={points.filter(point => point.type === 'transport')} />
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="card p-6"><h2 className="font-display text-lg font-bold text-slate-900">About {city.name}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{city.description || 'Destination information is being prepared from the application catalog.'}</p><h2 className="mt-8 font-display text-lg font-bold text-slate-900">Nearby travel information</h2>{points.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{points.map(point => <div key={point.id} className="rounded-xl border border-slate-200 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{point.type}</p><h3 className="mt-1 font-semibold text-slate-900">{point.name}</h3><p className="mt-1 text-xs text-slate-500">★ {point.rating} · {point.distance_km} km · {point.price_tier || 'Information'}</p><p className="mt-2 text-xs text-slate-500">{point.description}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No nearby information has been added yet.</p>}<h2 className="mt-8 font-display text-lg font-bold text-slate-900">Things to do</h2>{activities.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2">{activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}</div> : <p className="mt-4 text-sm text-slate-500">No activities have been added for this destination yet.</p>}<h2 className="mt-8 font-display text-lg font-bold text-slate-900">Traveler reviews</h2>{reviews.length ? <div className="mt-4 space-y-3">{reviews.map(review => <div key={review.id} className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-900">{'★'.repeat(review.rating)} <span className="text-xs font-normal text-slate-500">{review.User?.first_name}</span></p><p className="mt-1 text-sm text-slate-600">{review.comment}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No reviews yet.</p>}<form onSubmit={submitReview} className="mt-4 border-t border-slate-100 pt-4"><div className="flex gap-3"><select className="input-field w-28" value={reviewForm.rating} onChange={event => setReviewForm({ ...reviewForm, rating: event.target.value })}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><input required className="input-field" placeholder="Share your experience" value={reviewForm.comment} onChange={event => setReviewForm({ ...reviewForm, comment: event.target.value })} /></div>{reviewError && <p className="mt-2 text-xs text-rose-600">{reviewError}</p>}<button className="btn-secondary mt-3" type="submit">Post review</button></form></section>
      <aside className="card h-fit p-6 lg:sticky lg:top-6"><h2 className="font-display text-lg font-bold text-slate-900">Plan this destination</h2><p className="mt-2 text-sm leading-6 text-slate-500">Start a trip with {city.name} preselected, then add dates, stops, and activities from the catalog.</p><button onClick={() => navigate(`/trips/new?city_id=${city.id}`)} className="btn-primary mt-5 w-full">Plan a trip</button></aside>
    </div>
  </DashboardLayout>
}

function PoiSection({ title, icon: Icon, tone, points }) {
  const accent = { brand: 'text-brand-600 bg-brand-50', amber: 'text-accent-amber bg-amber-50', teal: 'text-accent-teal bg-emerald-50' }[tone]
  return <section className="card p-5"><div className="flex items-center gap-2"><span className={`rounded-xl p-2 ${accent}`}><Icon className="h-5 w-5" /></span><h2 className="font-display text-base font-bold text-slate-900">{title}</h2></div>{points.length ? <div className="mt-4 space-y-3">{points.map(point => <div key={point.id} className="border-t border-slate-100 pt-3"><h3 className="font-semibold text-slate-900">{point.name}</h3><p className="mt-1 text-xs text-slate-500">★ {point.rating} · {point.distance_km} km away</p><p className="mt-1 text-sm font-bold text-slate-700">₹{Number(point.price || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">{title === 'Hotels' ? '/ night' : title === 'Restaurants' ? 'average' : 'estimated fare'}</span></p></div>)}</div> : <p className="mt-4 text-xs text-slate-500">No {title.toLowerCase()} added yet.</p>}</section>
}

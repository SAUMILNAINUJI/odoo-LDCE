import { MapPin, TrendingUp, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CityCard({ city, onAdd }) {
  const navigate = useNavigate()
  return (
    <article className="card overflow-hidden group hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
        {city.image_url ? <img src={city.image_url} alt={`${city.name}, ${city.country}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="h-full w-full bg-slate-200" />}
        <span className="badge absolute right-3 top-3 bg-white/95 text-slate-800 shadow-sm gap-1">
            <TrendingUp className="w-3 h-3" /> {city.popularity}
        </span>
        </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-slate-900 truncate">{city.name}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" /> {city.country}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-700">
          <span>★ {Number(city.rating || 0).toFixed(1)}</span>
          <span className="text-slate-400">Popularity {city.popularity}</span>
        </div>
        {city.tags && <div className="mt-2 flex flex-wrap gap-1.5">{city.tags.split(',').slice(0, 3).map(tag => <span key={tag} className="badge bg-slate-100 text-slate-600">{tag}</span>)}</div>}
        <p className="text-xs text-slate-500 mt-3 line-clamp-2 min-h-8">{city.description || 'Explore this destination and build it into your next itinerary.'}</p>
        <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-600">Cost index {city.cost_index}</span>
          {onAdd ? <button onClick={() => onAdd(city)} className="text-xs font-bold text-slate-900 hover:underline">+ Add to trip</button> : <div className="flex items-center gap-3"><button onClick={() => navigate(`/cities/${city.id}`)} className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline">Explore</button><button onClick={() => navigate(`/trips/new?city_id=${city.id}`)} className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:underline">Plan trip <ArrowUpRight className="w-3.5 h-3.5" /></button></div>}
        </div>
      </div>
    </article>
  )
}

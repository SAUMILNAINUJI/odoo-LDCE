import { MapPin, TrendingUp } from 'lucide-react'

export default function CityCard({ city, onAdd }) {
  return (
    <div className="card overflow-hidden group">
      <div
        className="h-36 bg-slate-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${city.image_url})` }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-navy-900">{city.name}</h3>
          <span className="badge bg-brand-50 text-brand-600 gap-1">
            <TrendingUp className="w-3 h-3" /> {city.popularity}
          </span>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" /> {city.country}
        </p>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{city.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-semibold text-slate-500">Cost index: {city.cost_index}</span>
          {onAdd && (
            <button onClick={() => onAdd(city)} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              + Add to Trip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
